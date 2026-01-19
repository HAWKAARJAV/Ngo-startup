import prisma from '@/lib/prisma';
import NGOChatPage from '@/components/ngo-chat-page';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Get the currently logged-in NGO user from cookie
const getLoggedInNGOUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  
  if (!token) {
    return { ngo: null, user: null };
  }
  
  try {
    const sessionData = JSON.parse(token.value);
    
    // Get the user from DB
    const user = await prisma.user.findUnique({
      where: { id: sessionData.id }
    });
    
    if (!user || user.role !== 'NGO') {
      return { ngo: null, user: null };
    }
    
    // Get the NGO profile for this user
    const ngo = await prisma.nGO.findUnique({
      where: { userId: user.id },
      include: { user: true }
    });
    
    return { ngo, user };
  } catch (e) {
    console.error('Error parsing session:', e);
    return { ngo: null, user: null };
  }
};

// Get all chat rooms for this NGO
const getChatRooms = async (ngoId) => {
  const rooms = await prisma.chatRoom.findMany({
    where: { ngoId },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { lastMessageAt: 'desc' }
  });

  // Add Corporate details to each room
  const roomsWithCorporate = await Promise.all(
    rooms.map(async (room) => {
      const corporate = await prisma.corporate.findUnique({
        where: { id: room.corporateId },
        include: { user: true }
      });
      return { ...room, corporate };
    })
  );

  return roomsWithCorporate;
};

// Get document requests for this NGO
const getDocumentRequests = async (ngoId) => {
  return await prisma.documentRequest.findMany({
    where: { 
      ngoId,
      status: { in: ['PENDING', 'UPLOADED'] }
    },
    orderBy: { requestedAt: 'desc' }
  });
};

export default async function ChatPage({ searchParams }) {
  const params = await searchParams;
  const selectedRoomId = params?.room;

  const { ngo, user } = await getLoggedInNGOUser();

  if (!ngo || !user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">NGO profile not found</p>
      </div>
    );
  }

  const chatRooms = await getChatRooms(ngo.id);
  const documentRequests = await getDocumentRequests(ngo.id);

  // Get selected room messages
  let selectedRoomMessages = [];
  let selectedCorporate = null;
  
  if (selectedRoomId) {
    selectedRoomMessages = await prisma.chatMessage.findMany({
      where: { roomId: selectedRoomId },
      orderBy: { createdAt: 'asc' }
    });

    const selectedRoom = chatRooms.find(r => r.id === selectedRoomId);
    selectedCorporate = selectedRoom?.corporate;
  }

  return (
    <NGOChatPage 
      ngo={JSON.parse(JSON.stringify(ngo))} 
      user={JSON.parse(JSON.stringify(user))}
      chatRooms={JSON.parse(JSON.stringify(chatRooms))}
      documentRequests={JSON.parse(JSON.stringify(documentRequests))}
      selectedRoomId={selectedRoomId}
      initialMessages={JSON.parse(JSON.stringify(selectedRoomMessages))}
      selectedCorporate={selectedCorporate ? JSON.parse(JSON.stringify(selectedCorporate)) : null}
    />
  );
}
