import prisma from '@/lib/prisma';
import CorporateChatPage from '@/components/corporate-chat-page';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Get the currently logged-in Corporate user from cookie
const getLoggedInCorporateUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  
  if (!token) {
    return { corporate: null, user: null };
  }
  
  try {
    const sessionData = JSON.parse(token.value);
    
    // Get the user from DB
    const user = await prisma.user.findUnique({
      where: { id: sessionData.id }
    });
    
    if (!user || user.role !== 'CORPORATE') {
      return { corporate: null, user: null };
    }
    
    // Get the Corporate profile for this user
    const corporate = await prisma.corporate.findUnique({
      where: { userId: user.id },
      include: { user: true }
    });
    
    return { corporate, user };
  } catch (e) {
    console.error('Error parsing session:', e);
    return { corporate: null, user: null };
  }
};

// Get all chat rooms for corporate
const getChatRooms = async (corporateId) => {
  const rooms = await prisma.chatRoom.findMany({
    where: { corporateId },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { lastMessageAt: 'desc' }
  });

  // Add NGO details to each room
  const roomsWithNgo = await Promise.all(
    rooms.map(async (room) => {
      const ngo = await prisma.nGO.findUnique({
        where: { id: room.ngoId },
        include: { 
          user: true,
          projects: {
            take: 3,
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      return { ...room, ngo };
    })
  );

  return roomsWithNgo;
};

// Get all active NGOs
const getAllNGOs = async () => {
  return await prisma.nGO.findMany({
    select: {
      id: true,
      orgName: true,
      city: true,
      state: true,
      mission: true,
      trustScore: true,
      userId: true
    },
    where: {
      systemStatus: 'ACTIVE'
    },
    take: 50
  });
};

export default async function ChatPage({ searchParams }) {
  const params = await searchParams;
  const selectedRoomId = params?.room;

  const { corporate, user } = await getLoggedInCorporateUser();
  
  if (!corporate || !user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Corporate profile not found</p>
      </div>
    );
  }

  const chatRooms = await getChatRooms(corporate.id);
  const ngos = await getAllNGOs();

  // Get selected room messages
  let selectedRoomMessages = [];
  let selectedNgo = null;
  
  if (selectedRoomId) {
    selectedRoomMessages = await prisma.chatMessage.findMany({
      where: { roomId: selectedRoomId },
      orderBy: { createdAt: 'asc' }
    });

    const selectedRoom = chatRooms.find(r => r.id === selectedRoomId);
    selectedNgo = selectedRoom?.ngo;
  }

  return (
    <CorporateChatPage 
      corporate={JSON.parse(JSON.stringify(corporate))} 
      user={JSON.parse(JSON.stringify(user))}
      ngos={JSON.parse(JSON.stringify(ngos))}
      chatRooms={JSON.parse(JSON.stringify(chatRooms))}
      selectedRoomId={selectedRoomId}
      initialMessages={JSON.parse(JSON.stringify(selectedRoomMessages))}
      selectedNgo={selectedNgo ? JSON.parse(JSON.stringify(selectedNgo)) : null}
    />
  );
}
