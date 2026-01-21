import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isValidUUID, sanitizeString } from '@/lib/security';

/**
 * GET: Fetch notifications for a user
 * POST: Create a new notification
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Cap at 100

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Validate UUID
    if (!isValidUUID(userId)) {
      return NextResponse.json(
        { error: 'Invalid userId format' },
        { status: 400 }
      );
    }

    const whereClause = { userId };
    if (unreadOnly) {
      whereClause.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false }
    });

    return NextResponse.json({ 
      notifications, 
      unreadCount 
    });

  } catch (error) {
    console.error('[Notifications API] Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { 
      userId, 
      userRole, 
      type, 
      title, 
      message, 
      link, 
      metadata 
    } = await request.json();

    // ===== INPUT VALIDATION =====
    if (!userId || !userRole || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, userRole, type, title, message' },
        { status: 400 }
      );
    }

    // Validate UUID
    if (!isValidUUID(userId)) {
      return NextResponse.json(
        { error: 'Invalid userId format' },
        { status: 400 }
      );
    }

    // Whitelist allowed roles
    const allowedRoles = ['CORPORATE', 'NGO', 'ADMIN'];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { error: 'Invalid userRole' },
        { status: 400 }
      );
    }

    // Whitelist allowed notification types
    const allowedTypes = [
      'CHAT', 'DOCUMENT_REQUEST', 'DOCUMENT_UPLOADED', 
      'TRANCHE_REQUEST', 'TRANCHE_APPROVED', 'TRANCHE_REJECTED', 'TRANCHE_BLOCKED',
      'PROJECT_CREATED', 'PROJECT_UPDATED', 'COMPLIANCE_ALERT', 'SYSTEM'
    ];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid notification type' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeString(title, 200);
    const sanitizedMessage = sanitizeString(message, 1000);
    const sanitizedLink = link ? sanitizeString(link, 500) : null;

    // Verify user exists
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        userRole,
        type,
        title: sanitizedTitle,
        message: sanitizedMessage,
        link: sanitizedLink,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });

    return NextResponse.json({ notification });

  } catch (error) {
    console.error('[Notifications API] Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
