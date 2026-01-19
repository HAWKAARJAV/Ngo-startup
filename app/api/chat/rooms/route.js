import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET: Fetch all chat rooms for a user
 * POST: Create a new chat room between Corporate and NGO
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');

    if (!userId || !userRole) {
      return NextResponse.json(
        { error: 'userId and userRole are required' },
        { status: 400 }
      );
    }

    let rooms = [];

    if (userRole === 'CORPORATE') {
      // Get corporate ID from userId
      const corporate = await prisma.corporate.findUnique({
        where: { userId },
        select: { id: true }
      });

      if (!corporate) {
        return NextResponse.json({ rooms: [] });
      }

      // Get all chat rooms for this corporate
      rooms = await prisma.chatRoom.findMany({
        where: { corporateId: corporate.id },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { lastMessageAt: 'desc' }
      });

      // Enrich with NGO details
      const roomsWithDetails = await Promise.all(
        rooms.map(async (room) => {
          const ngo = await prisma.nGO.findUnique({
            where: { id: room.ngoId },
            include: { user: true }
          });

          return {
            ...room,
            ngo: {
              id: ngo.id,
              orgName: ngo.orgName,
              city: ngo.city,
              trustScore: ngo.trustScore
            },
            lastMessage: room.messages[0] || null,
            unreadCount: await prisma.chatMessage.count({
              where: {
                roomId: room.id,
                senderRole: 'NGO',
                isRead: false
              }
            })
          };
        })
      );

      return NextResponse.json({ rooms: roomsWithDetails });

    } else if (userRole === 'NGO') {
      // Get NGO ID from userId
      const ngo = await prisma.nGO.findUnique({
        where: { userId },
        select: { id: true }
      });

      if (!ngo) {
        return NextResponse.json({ rooms: [] });
      }

      // Get all chat rooms for this NGO
      rooms = await prisma.chatRoom.findMany({
        where: { ngoId: ngo.id },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { lastMessageAt: 'desc' }
      });

      // Enrich with Corporate details
      const roomsWithDetails = await Promise.all(
        rooms.map(async (room) => {
          const corporate = await prisma.corporate.findUnique({
            where: { id: room.corporateId },
            include: { user: true }
          });

          return {
            ...room,
            corporate: {
              id: corporate.id,
              companyName: corporate.companyName,
              industry: corporate.industry
            },
            lastMessage: room.messages[0] || null,
            unreadCount: await prisma.chatMessage.count({
              where: {
                roomId: room.id,
                senderRole: 'CORPORATE',
                isRead: false
              }
            })
          };
        })
      );

      return NextResponse.json({ rooms: roomsWithDetails });
    }

    return NextResponse.json({ rooms: [] });

  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat rooms' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { corporateId, ngoId } = await request.json();

    if (!corporateId || !ngoId) {
      return NextResponse.json(
        { error: 'corporateId and ngoId are required' },
        { status: 400 }
      );
    }

    // Check if room already exists
    let room = await prisma.chatRoom.findUnique({
      where: {
        corporateId_ngoId: {
          corporateId,
          ngoId
        }
      }
    });

    // Create new room if it doesn't exist
    if (!room) {
      room = await prisma.chatRoom.create({
        data: {
          corporateId,
          ngoId
        }
      });
    }

    return NextResponse.json({ room, created: !room });

  } catch (error) {
    console.error('Error creating chat room:', error);
    return NextResponse.json(
      { error: 'Failed to create chat room' },
      { status: 500 }
    );
  }
}
