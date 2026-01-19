import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * PATCH: Mark notifications as read
 * DELETE: Clear all notifications
 */

export async function PATCH(request) {
  try {
    const { notificationIds, userId, markAllRead } = await request.json();

    if (markAllRead && userId) {
      // Mark all notifications as read for this user
      const result = await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });

      return NextResponse.json({ 
        success: true, 
        updatedCount: result.count 
      });
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      const result = await prisma.notification.updateMany({
        where: { id: { in: notificationIds } },
        data: { isRead: true }
      });

      return NextResponse.json({ 
        success: true, 
        updatedCount: result.count 
      });
    }

    return NextResponse.json(
      { error: 'Invalid request parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const result = await prisma.notification.deleteMany({
      where: { userId }
    });

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.count 
    });

  } catch (error) {
    console.error('Error clearing notifications:', error);
    return NextResponse.json(
      { error: 'Failed to clear notifications' },
      { status: 500 }
    );
  }
}
