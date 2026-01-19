"use client";

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { 
  Send, 
  MessageCircle, 
  Phone, 
  Video, 
  MoreVertical, 
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import socketManager from '@/lib/socket';

// Format time consistently to avoid hydration mismatch
const formatTime = (dateStr) => {
  if (typeof window === 'undefined') return '';
  try {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
};

export default function ChatInterface({ 
  roomId, 
  currentUserId, 
  currentUserRole, 
  currentUserName,
  recipientName,
  recipientRole,
  onRequestDocument 
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?roomId=${roomId}`);
        const data = await response.json();
        
        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (roomId) {
      loadMessages();
    }
  }, [roomId]);

  // Socket event listeners
  useEffect(() => {
    if (!roomId) return;

    // Join the room
    socketManager.joinRoom(roomId, currentUserId);

    // Listen for new messages (only add if not from self - self messages added locally)
    const handleNewMessage = (messageData) => {
      // Skip if this is our own message (already added locally)
      if (messageData.senderId === currentUserId) {
        return;
      }

      // Check if message already exists (by content and timestamp proximity)
      setMessages(prev => {
        const exists = prev.some(m => 
          m.id === messageData.id || 
          (m.message === messageData.message && m.senderId === messageData.senderId)
        );
        if (exists) return prev;
        return [...prev, messageData];
      });
      
      scrollToBottom();

      // Mark as read
      setTimeout(() => {
        socketManager.markAsRead(roomId, [messageData.id]);
      }, 1000);
    };

    // Listen for typing indicator
    const handleTyping = ({ userName }) => {
      setIsTyping(true);
    };

    const handleStopTyping = () => {
      setIsTyping(false);
    };

    socketManager.on('new_message', handleNewMessage);
    socketManager.on('user_typing', handleTyping);
    socketManager.on('user_stopped_typing', handleStopTyping);

    // Cleanup
    return () => {
      socketManager.off('new_message', handleNewMessage);
      socketManager.off('user_typing', handleTyping);
      socketManager.off('user_stopped_typing', handleStopTyping);
      socketManager.leaveRoom(roomId);
    };
  }, [roomId, currentUserId]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle typing indicator
  const handleTyping = () => {
    socketManager.sendTyping(roomId, currentUserName);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socketManager.stopTyping(roomId);
    }, 2000);
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    const messageText = newMessage.trim();
    setIsSending(true);
    setNewMessage(''); // Clear immediately for better UX

    try {
      // Save to database first and get the message ID
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          senderId: currentUserId,
          senderRole: currentUserRole,
          senderName: currentUserName,
          message: messageText
        })
      });

      const savedMessage = await response.json();

      // Add message to local state immediately
      if (savedMessage.message) {
        setMessages(prev => [...prev, savedMessage.message]);
      }

      // Send via Socket.IO for real-time broadcast to others
      socketManager.sendMessage(
        roomId,
        messageText,
        currentUserId,
        currentUserName,
        currentUserRole
      );

      socketManager.stopTyping(roomId);
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-slate-50">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-blue-600 text-white flex items-center justify-center font-bold">
            {recipientName?.[0] || 'U'}
          </Avatar>
          <div>
            <h3 className="font-bold text-slate-900">{recipientName}</h3>
            <p className="text-xs text-slate-500">{recipientRole}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUserRole === 'CORPORATE' && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRequestDocument}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Request Doc
            </Button>
          )}
          <Button size="sm" variant="ghost">
            <Phone className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Video className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwnMessage = msg.senderId === currentUserId;
              const showSystemMessage = msg.messageType === 'SYSTEM';

              if (showSystemMessage) {
                return (
                  <div key={msg.id || index} className="flex justify-center">
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs flex items-center gap-2">
                      <AlertCircle className="h-3 w-3" />
                      {msg.message}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id || index}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isOwnMessage
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    {!isOwnMessage && (
                      <p className="text-xs font-semibold mb-1 opacity-70">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-blue-100' : 'text-slate-500'
                      }`}
                      suppressHydrationWarning
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>{recipientName} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-slate-50">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isSending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
