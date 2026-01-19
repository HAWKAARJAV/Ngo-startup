"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChatInterface from '@/components/chat-interface';
import NotificationCenter from '@/components/notification-center';
import socketManager from '@/lib/socket';
import { MessageCircle, Search, Loader2, Building2, FileText } from 'lucide-react';

export default function NGOChatPage({ ngo, user }) {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [documentRequests, setDocumentRequests] = useState([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    socketManager.connect(user.id, 'NGO', ngo.orgName);

    return () => {
      socketManager.disconnect();
    };
  }, [user.id, ngo.orgName]);

  // Load chat rooms
  useEffect(() => {
    const loadChatRooms = async () => {
      try {
        const response = await fetch(`/api/chat/rooms?userId=${user.id}&userRole=NGO`);
        const data = await response.json();
        
        if (data.rooms) {
          setChatRooms(data.rooms);
          
          // Auto-select first room if available
          if (data.rooms.length > 0 && !selectedRoom) {
            setSelectedRoom(data.rooms[0]);
          }
        }
      } catch (error) {
        console.error('Error loading chat rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatRooms();
  }, [user.id]);

  // Load document requests
  useEffect(() => {
    const loadDocumentRequests = async () => {
      try {
        const response = await fetch(`/api/documents/requests?ngoId=${ngo.id}&status=PENDING`);
        const data = await response.json();
        
        if (data.requests) {
          setDocumentRequests(data.requests);
        }
      } catch (error) {
        console.error('Error loading document requests:', error);
      }
    };

    loadDocumentRequests();
  }, [ngo.id]);

  // Listen for document requests
  useEffect(() => {
    const handleDocumentRequest = (data) => {
      setDocumentRequests(prev => [data, ...prev]);
      
      // Show notification
      alert(`New document requested: ${data.docName}`);
    };

    socketManager.on('document_requested', handleDocumentRequest);

    return () => {
      socketManager.off('document_requested', handleDocumentRequest);
    };
  }, []);

  // Handle document upload
  const handleDocumentUpload = async () => {
    if (!uploadFile || !selectedRequest) return;

    try {
      // Upload file to Supabase (reuse existing tranche upload logic)
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('requestId', selectedRequest.id);

      // Update request status
      await fetch('/api/documents/requests/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          status: 'UPLOADED',
          fileUrl: 'uploaded_file_url' // Would come from actual upload
        })
      });

      // Notify corporate via socket
      socketManager.notifyDocumentUpload({
        corporateId: selectedRequest.corporateId,
        ngoId: ngo.id,
        documentType: selectedRequest.requestType,
        fileName: uploadFile.name,
        fileUrl: 'uploaded_file_url',
        ngoName: ngo.orgName
      });

      // Update local state
      setDocumentRequests(prev =>
        prev.filter(req => req.id !== selectedRequest.id)
      );

      setShowUploadDialog(false);
      setSelectedRequest(null);
      setUploadFile(null);

      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document');
    }
  };

  const filteredRooms = chatRooms.filter(room =>
    room.corporate?.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 -m-6 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Corporate Communication</h1>
            <p className="text-slate-600">Chat with potential funders and respond to requests</p>
          </div>
          <NotificationCenter userId={user.id} userRole="NGO" />
        </div>

        {/* Document Requests Alert */}
        {documentRequests.length > 0 && (
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-orange-900">
                    {documentRequests.length} Pending Document Request{documentRequests.length > 1 ? 's' : ''}
                  </h3>
                  <p className="text-sm text-orange-700 mt-1">
                    Corporates are waiting for your documents. Upload them to build trust.
                  </p>
                  <div className="mt-3 space-y-2">
                    {documentRequests.slice(0, 3).map(req => (
                      <div key={req.id} className="flex items-center justify-between bg-white/60 rounded-lg p-2">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{req.docName}</p>
                          <p className="text-xs text-slate-600">From: {req.corporate?.companyName}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(req);
                            setShowUploadDialog(true);
                          }}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Upload
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Main Chat Interface */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Chat List */}
          <Card className="col-span-4 p-4 h-[600px] flex flex-col">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search corporates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No conversations yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Corporates will reach out when interested
                  </p>
                </div>
              ) : (
                filteredRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedRoom?.id === room.id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 truncate">
                          {room.corporate.companyName}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                          {room.lastMessage?.message || 'No messages yet'}
                        </p>
                      </div>
                      {room.unreadCount > 0 && (
                        <div className="h-5 w-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {room.unreadCount}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>

          {/* Main Chat Area */}
          <div className="col-span-8">
            {selectedRoom ? (
              <ChatInterface
                roomId={selectedRoom.id}
                currentUserId={user.id}
                currentUserRole="NGO"
                currentUserName={ngo.orgName}
                recipientName={selectedRoom.corporate.companyName}
                recipientRole="Corporate"
              />
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Choose a corporate from the list to start chatting
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Document Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Requested Document</DialogTitle>
            <DialogDescription>
              {selectedRequest?.docName} - Requested by {selectedRequest?.corporate?.companyName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Document File</Label>
              <Input
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="mt-2"
              />
            </div>

            {selectedRequest?.description && (
              <div>
                <Label>Request Details</Label>
                <p className="text-sm text-slate-600 mt-1">{selectedRequest.description}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadDialog(false);
                  setSelectedRequest(null);
                  setUploadFile(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDocumentUpload}
                disabled={!uploadFile}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Upload Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
