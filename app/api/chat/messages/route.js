import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isValidUUID, sanitizeString } from '@/lib/security';

/**
 * GET: Fetch messages for a specific chat room
 * POST: Send a new message (also handled via Socket.IO)
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200); // Cap at 200
    const before = searchParams.get('before'); // For pagination

    if (!roomId) {
      return NextResponse.json(
        { error: 'roomId is required' },
        { status: 400 }
      );
    }

    // Validate UUID
    if (!isValidUUID(roomId)) {
      return NextResponse.json(
        { error: 'Invalid roomId format' },
        { status: 400 }
      );
    }

    // Verify room exists
    const roomExists = await prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!roomExists) {
      return NextResponse.json(
        { error: 'Chat room not found' },
        { status: 404 }
      );
    }

    const whereClause = { roomId };
    if (before) {
      const beforeDate = new Date(before);
      if (isNaN(beforeDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid before date format' },
          { status: 400 }
        );
      }
      whereClause.createdAt = { lt: beforeDate };
    }

    const messages = await prisma.chatMessage.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Reverse to get chronological order
    const chronologicalMessages = messages.reverse();

    return NextResponse.json({ 
      messages: chronologicalMessages,
      hasMore: messages.length === limit 
    });

  } catch (error) {
    console.error('[Chat API] Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { 
      roomId, 
      senderId, 
      senderRole, 
      senderName, 
      message, 
      messageType = 'TEXT',
      metadata 
    } = await request.json();

    // ===== INPUT VALIDATION =====
    if (!roomId || !senderId || !senderRole || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: roomId, senderId, senderRole, message' },
        { status: 400 }
      );
    }

    // Validate UUID
    if (!isValidUUID(roomId)) {
      return NextResponse.json(
        { error: 'Invalid roomId format' },
        { status: 400 }
      );
    }

    // Whitelist allowed sender roles
    const allowedRoles = ['CORPORATE', 'NGO', 'SYSTEM', 'ADMIN'];
    if (!allowedRoles.includes(senderRole)) {
      return NextResponse.json(
        { error: 'Invalid senderRole' },
        { status: 400 }
      );
    }

    // Whitelist allowed message types
    const allowedTypes = ['TEXT', 'SYSTEM', 'DOCUMENT_REQUEST', 'DOCUMENT_UPLOAD', 'IMAGE', 'FILE'];
    const validMessageType = allowedTypes.includes(messageType) ? messageType : 'TEXT';

    // Verify room exists
    const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json(
        { error: 'Chat room not found' },
        { status: 404 }
      );
    }

    // Sanitize message content (prevent XSS, limit length)
    const sanitizedMessage = sanitizeString(message, 5000);
    const sanitizedSenderName = sanitizeString(senderName || 'Unknown', 100);

    // Create message in database
    const newMessage = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId: sanitizeString(senderId, 100),
        senderRole,
        senderName: sanitizedSenderName,
        message: sanitizedMessage,
        messageType: validMessageType,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });

    // Update room's lastMessageAt
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { lastMessageAt: new Date() }
    });

    return NextResponse.json({ message: newMessage });

  } catch (error) {
    console.error('[Chat API] Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
