/**
 * Socket.IO Server for Real-Time Communication
 * CorpoGN Platform
 * 
 * Handles:
 * - Corporate ↔ NGO Real-time Chat
 * - Document Request Notifications
 * - Tranche Status Updates
 * - Live Notifications
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();


app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      // Handle health check directly to avoid double response
      if (req.url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'ok', 
          // These may not be defined yet, so check
          activeConnections: typeof io !== 'undefined' ? io.sockets.sockets.size : 0,
          activeUsers: typeof activeUsers !== 'undefined' ? activeUsers.size : 0,
          activeRooms: typeof roomMembers !== 'undefined' ? roomMembers.size : 0
        }));
        return;
      }
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.PRODUCTION_URL 
        : 'http://localhost:3000',
      methods: ['GET', 'POST']
    },
    path: '/socket.io/'
  });

  // Store active users: { userId: socketId }
  const activeUsers = new Map();
  
  // Store room memberships: { roomId: Set of socketIds }
  const roomMembers = new Map();

  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    // User authentication and registration
    socket.on('register', ({ userId, userRole, userName }) => {
      if (!userId || !userRole) {
        socket.emit('error', { message: 'Invalid registration data' });
        return;
      }

      activeUsers.set(userId, {
        socketId: socket.id,
        role: userRole,
        name: userName,
        connectedAt: new Date()
      });

      socket.userId = userId;
      socket.userRole = userRole;
      socket.userName = userName;

      console.log(`🟢 User registered: ${userName} (${userRole}) - ${userId}`);
      
      socket.emit('registered', { 
        success: true, 
        message: 'Connected to real-time server',
        userId 
      });

      // Broadcast online status to relevant users
      io.emit('user_status', { 
        userId, 
        status: 'online', 
        role: userRole,
        name: userName 
      });
    });

    // Join a chat room
    socket.on('join_room', ({ roomId, userId }) => {
      socket.join(roomId);
      
      if (!roomMembers.has(roomId)) {
        roomMembers.set(roomId, new Set());
      }
      roomMembers.get(roomId).add(socket.id);

      console.log(`📥 User ${userId} joined room: ${roomId}`);
      
      socket.emit('room_joined', { roomId, success: true });
      
      // Notify other room members
      socket.to(roomId).emit('user_joined_room', { 
        userId, 
        userName: socket.userName,
        userRole: socket.userRole 
      });
    });

    // Leave a chat room
    socket.on('leave_room', ({ roomId }) => {
      socket.leave(roomId);
      
      if (roomMembers.has(roomId)) {
        roomMembers.get(roomId).delete(socket.id);
      }

      console.log(`📤 User ${socket.userId} left room: ${roomId}`);
    });

    // Send chat message
    socket.on('send_message', async ({ roomId, message, senderId, senderName, senderRole }) => {
      if (!roomId || !message || !senderId) {
        socket.emit('error', { message: 'Invalid message data' });
        return;
      }

      const messageData = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        roomId,
        senderId,
        senderName: senderName || socket.userName,
        senderRole: senderRole || socket.userRole,
        message,
        messageType: 'TEXT',
        createdAt: new Date().toISOString(),
        isRead: false
      };

      // Broadcast to all users in the room (including sender for confirmation)
      io.to(roomId).emit('new_message', messageData);

      // Send notification to recipient if they're not in the room
      const recipientRole = senderRole === 'CORPORATE' ? 'NGO' : 'CORPORATE';
      const notification = {
        type: 'CHAT',
        title: `New message from ${senderName}`,
        message: message.substring(0, 100),
        link: `/dashboard/chat?room=${roomId}`,
        senderId,
        senderName,
        roomId
      };

      // Broadcast notification to recipient
      socket.to(roomId).emit('notification', notification);

      console.log(`💬 Message in room ${roomId}: ${senderName} (${senderRole})`);
    });

    // Document request from Corporate to NGO
    socket.on('request_document', async ({ 
      corporateId, 
      ngoId, 
      projectId, 
      requestType, 
      docName, 
      description,
      corporateName 
    }) => {
      if (!ngoId || !requestType || !docName) {
        socket.emit('error', { message: 'Invalid document request data' });
        return;
      }

      const requestData = {
        id: `req_${Date.now()}`,
        corporateId,
        ngoId,
        projectId,
        requestType,
        docName,
        description,
        status: 'PENDING',
        requestedAt: new Date().toISOString()
      };

      // Send real-time notification to NGO
      const ngoUser = Array.from(activeUsers.entries()).find(
        ([uid, data]) => data.role === 'NGO'
      );

      if (ngoUser) {
        const ngoSocketId = ngoUser[1].socketId;
        io.to(ngoSocketId).emit('document_requested', {
          ...requestData,
          notification: {
            type: 'DOCUMENT_REQUEST',
            title: 'New Document Request',
            message: `${corporateName} requested: ${docName}`,
            priority: 'HIGH'
          }
        });

        console.log(`📄 Document requested: ${docName} from NGO ${ngoId}`);
      }

      // Confirm to corporate
      socket.emit('request_sent', { success: true, requestData });
    });

    // Document uploaded notification from NGO to Corporate
    socket.on('document_uploaded', async ({ 
      corporateId, 
      ngoId, 
      documentType, 
      fileName, 
      fileUrl,
      ngoName 
    }) => {
      if (!corporateId || !documentType) {
        socket.emit('error', { message: 'Invalid document upload notification' });
        return;
      }

      // Send real-time notification to Corporate
      const corporateUser = Array.from(activeUsers.entries()).find(
        ([uid, data]) => data.role === 'CORPORATE'
      );

      if (corporateUser) {
        const corpSocketId = corporateUser[1].socketId;
        io.to(corpSocketId).emit('document_uploaded_notification', {
          ngoId,
          ngoName,
          documentType,
          fileName,
          fileUrl,
          uploadedAt: new Date().toISOString(),
          notification: {
            type: 'DOCUMENT_UPLOADED',
            title: 'Document Uploaded',
            message: `${ngoName} uploaded: ${fileName}`,
            link: `/dashboard/ngo/${ngoId}`
          }
        });

        console.log(`✅ Document uploaded notification sent to Corporate: ${fileName}`);
      }

      socket.emit('upload_notification_sent', { success: true });
    });

    // Tranche release request from NGO
    socket.on('tranche_release_request', async ({ 
      corporateId, 
      projectId, 
      trancheId, 
      amount,
      ngoName,
      projectTitle 
    }) => {
      if (!corporateId || !trancheId) {
        socket.emit('error', { message: 'Invalid tranche release request' });
        return;
      }

      // Send real-time notification to Corporate
      const corporateUser = Array.from(activeUsers.entries()).find(
        ([uid, data]) => data.role === 'CORPORATE'
      );

      if (corporateUser) {
        const corpSocketId = corporateUser[1].socketId;
        io.to(corpSocketId).emit('tranche_release_requested', {
          projectId,
          trancheId,
          amount,
          ngoName,
          projectTitle,
          requestedAt: new Date().toISOString(),
          notification: {
            type: 'TRANCHE_REQUEST',
            title: 'Tranche Release Request',
            message: `${ngoName} requested ₹${amount.toLocaleString()} release for "${projectTitle}"`,
            link: `/dashboard/projects/${projectId}`,
            priority: 'HIGH'
          }
        });

        console.log(`💰 Tranche release requested: ₹${amount} for project ${projectId}`);
      }

      socket.emit('release_request_sent', { success: true });
    });

    // Typing indicator
    socket.on('typing', ({ roomId, userName }) => {
      socket.to(roomId).emit('user_typing', { userName });
    });

    socket.on('stop_typing', ({ roomId }) => {
      socket.to(roomId).emit('user_stopped_typing');
    });

    // Mark messages as read
    socket.on('mark_read', ({ roomId, messageIds }) => {
      socket.to(roomId).emit('messages_read', { messageIds });
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      if (socket.userId) {
        activeUsers.delete(socket.userId);
        
        // Broadcast offline status
        io.emit('user_status', { 
          userId: socket.userId, 
          status: 'offline',
          role: socket.userRole,
          name: socket.userName
        });

        console.log(`🔴 User disconnected: ${socket.userName} (${socket.userRole})`);
      } else {
        console.log('❌ Client disconnected:', socket.id);
      }

      // Clean up room memberships
      roomMembers.forEach((members, roomId) => {
        if (members.has(socket.id)) {
          members.delete(socket.id);
          if (members.size === 0) {
            roomMembers.delete(roomId);
          }
        }
      });
    });

    // Error handler
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });


  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`
╔══════════════════════════════════════════════════════════╗
║  🚀 CorpoGN Real-Time Server                         ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  📡 Socket.IO Server: Running                            ║
║  🌐 Next.js App: http://${hostname}:${port}            ║
║  🔌 WebSocket Path: /socket.io/                          ║
║  📊 Environment: ${dev ? 'Development' : 'Production'}                        ║
╚══════════════════════════════════════════════════════════╝
      `);
    });
});
