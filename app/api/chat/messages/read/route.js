import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * PATCH: Mark messages as read
 */

export async function PATCH(request) {
  try {
    const { roomId, userId } = await request.json();

    if (!roomId || !userId) {
      return NextResponse.json(
        { error: 'roomId and userId are required' },
        { status: 400 }
      );
    }

    // Mark all messages in the room not sent by this user as read
    const result = await prisma.chatMessage.updateMany({
      where: {
        roomId,
        senderId: { not: userId },
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      updatedCount: result.count 
    });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}
