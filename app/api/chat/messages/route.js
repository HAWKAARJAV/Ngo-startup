import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET: Fetch messages for a specific chat room
 * POST: Send a new message (also handled via Socket.IO)
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before'); // For pagination

    if (!roomId) {
      return NextResponse.json(
        { error: 'roomId is required' },
        { status: 400 }
      );
    }

    const whereClause = { roomId };
    if (before) {
      whereClause.createdAt = { lt: new Date(before) };
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
    console.error('Error fetching messages:', error);
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

    if (!roomId || !senderId || !senderRole || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create message in database
    const newMessage = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        senderRole,
        senderName,
        message,
        messageType,
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
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
