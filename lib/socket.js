/**
 * Socket.IO Client Manager
 * Handles WebSocket connections for real-time features
 */

import { io } from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.pendingListeners = []; // Queue for listeners added before connection
  }

  /**
   * Initialize socket connection
   */
  connect(userId, userRole, userName) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    // Connect to Socket.IO server
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      path: '/socket.io/',
      transports: ['polling', 'websocket'], // Polling first, then upgrade to websocket
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 20000
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;

      // Register user
      this.socket.emit('register', { userId, userRole, userName });

      // Apply any pending listeners
      this.pendingListeners.forEach(({ event, callback }) => {
        this.socket.on(event, callback);
        if (!this.listeners.has(event)) {
          this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
      });
      this.pendingListeners = [];
    });

    this.socket.on('registered', (data) => {
      console.log('🟢 User registered on server:', data);
    });

    this.socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });

    return this.socket;
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  /**
   * Join a chat room
   */
  joinRoom(roomId, userId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('join_room', { roomId, userId });
  }

  /**
   * Leave a chat room
   */
  leaveRoom(roomId) {
    if (!this.socket) return;
    this.socket.emit('leave_room', { roomId });
  }

  /**
   * Send a chat message
   */
  sendMessage(roomId, message, senderId, senderName, senderRole) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('send_message', {
      roomId,
      message,
      senderId,
      senderName,
      senderRole
    });
  }

  /**
   * Request document from NGO
   */
  requestDocument(data) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('request_document', data);
  }

  /**
   * Notify document upload
   */
  notifyDocumentUpload(data) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('document_uploaded', data);
  }

  /**
   * Request tranche release
   */
  requestTrancheRelease(data) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('tranche_release_request', data);
  }

  /**
   * Send typing indicator
   */
  sendTyping(roomId, userName) {
    if (!this.socket) return;
    this.socket.emit('typing', { roomId, userName });
  }

  /**
   * Stop typing indicator
   */
  stopTyping(roomId) {
    if (!this.socket) return;
    this.socket.emit('stop_typing', { roomId });
  }

  /**
   * Mark messages as read
   */
  markAsRead(roomId, messageIds) {
    if (!this.socket) return;
    this.socket.emit('mark_read', { roomId, messageIds });
  }

  /**
   * Subscribe to events
   */
  on(event, callback) {
    // If socket not ready, queue the listener
    if (!this.socket) {
      this.pendingListeners.push({ event, callback });
      return;
    }

    this.socket.on(event, callback);
    
    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Unsubscribe from events
   */
  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);

    // Remove from listeners map
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id
    };
  }
}

// Create singleton instance
const socketManager = new SocketManager();

export default socketManager;
