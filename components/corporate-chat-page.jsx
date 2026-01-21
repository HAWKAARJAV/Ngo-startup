"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChatInterface from '@/components/chat-interface';
import NotificationCenter from '@/components/notification-center';
import socketManager from '@/lib/socket';
import { MessageCircle, Search, Loader2, Building2, FileText, Plus, Send, Eye, CheckCircle2, Clock, AlertCircle, FileCheck } from 'lucide-react';

export default function CorporateChatPage({ corporate, user, ngos }) {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [documentRequests, setDocumentRequests] = useState([]);
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);

  // Document request form
  const [requestForm, setRequestForm] = useState({
    requestType: 'COMPLIANCE_DOC',
    docName: '',
    description: '',
    priority: 'MEDIUM'
  });

  // Initialize socket connection
  useEffect(() => {
    socketManager.connect(user.id, 'CORPORATE', corporate.companyName);

    return () => {
      socketManager.disconnect();
    };
  }, [user.id, corporate.companyName]);

  // Load document requests for this corporate
  useEffect(() => {
    const loadDocumentRequests = async () => {
      try {
        const response = await fetch(`/api/documents/requests?corporateId=${corporate.id}`);
        const data = await response.json();
        if (data.requests) {
          setDocumentRequests(data.requests);
        }
      } catch (error) {
        console.error('Error loading document requests:', error);
      }
    };

    loadDocumentRequests();
    // Poll every 30 seconds for updates
    const interval = setInterval(loadDocumentRequests, 30000);
    return () => clearInterval(interval);
  }, [corporate.id]);

  // Load chat rooms
  useEffect(() => {
    const loadChatRooms = async () => {
      try {
        const response = await fetch(`/api/chat/rooms?userId=${user.id}&userRole=CORPORATE`);
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

  // Listen for document uploads
  useEffect(() => {
    const handleDocumentUploaded = async (data) => {
      // Refresh document requests to show new uploads
      try {
        const response = await fetch(`/api/documents/requests?corporateId=${corporate.id}`);
        const result = await response.json();
        if (result.requests) {
          setDocumentRequests(result.requests);
        }
      } catch (error) {
        console.error('Error refreshing document requests:', error);
      }
      alert(`📄 ${data.ngoName} uploaded: ${data.fileName}`);
    };

    socketManager.on('document_uploaded_notification', handleDocumentUploaded);

    return () => {
      socketManager.off('document_uploaded_notification', handleDocumentUploaded);
    };
  }, [corporate.id]);

  // Start new chat with NGO
  const handleStartChat = async (ngo) => {
    try {
      const response = await fetch('/api/chat/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          corporateId: corporate.id,
          ngoId: ngo.id
        })
      });

      const data = await response.json();

      if (data.room) {
        // Add NGO details to room
        const roomWithDetails = {
          ...data.room,
          ngo: {
            id: ngo.id,
            orgName: ngo.orgName,
            city: ngo.city,
            trustScore: ngo.trustScore
          },
          lastMessage: null,
          unreadCount: 0
        };

        setChatRooms(prev => [roomWithDetails, ...prev]);
        setSelectedRoom(roomWithDetails);
        setShowNewChatDialog(false);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat');
    }
  };

  // Verify uploaded document
  const handleVerifyDocument = async (requestId) => {
    try {
      const response = await fetch('/api/documents/requests/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          status: 'VERIFIED'
        })
      });

      if (response.ok) {
        // Update local state
        setDocumentRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: 'VERIFIED' } : req
        ));
        alert('✅ Document verified successfully! NGO has been notified.');
      }
    } catch (error) {
      console.error('Error verifying document:', error);
      alert('Failed to verify document');
    }
  };

  // Reject uploaded document
  const handleRejectDocument = async (requestId) => {
    const remarks = prompt('Please provide a reason for rejection (required for NGO to correct):');
    if (!remarks) return;

    try {
      const response = await fetch('/api/documents/requests/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          status: 'REJECTED',
          remarks
        })
      });

      if (response.ok) {
        // Update local state
        setDocumentRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: 'REJECTED', remarks } : req
        ));
        alert('⚠️ Document rejected. NGO has been notified to re-upload.');
      }
    } catch (error) {
      console.error('Error rejecting document:', error);
      alert('Failed to reject document');
    }
  };

  // Request document from NGO
  const handleRequestDocument = async () => {
    if (!selectedRoom || !requestForm.docName) {
      alert('Please fill all required fields');
      return;
    }

    try {
      // Create document request via API
      const response = await fetch('/api/documents/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          corporateId: corporate.id,
          ngoId: selectedRoom.ngo.id,
          requestType: requestForm.requestType,
          docName: requestForm.docName,
          description: requestForm.description,
          priority: requestForm.priority
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to create request');
      }

      if (data.request) {
        // Send real-time notification via socket
        socketManager.requestDocument({
          corporateId: corporate.id,
          ngoId: selectedRoom.ngo.id,
          requestType: requestForm.requestType,
          docName: requestForm.docName,
          description: requestForm.description,
          corporateName: corporate.companyName
        });

        // Send system message in chat
        socketManager.sendMessage(
          selectedRoom.id,
          `📄 Requested document: ${requestForm.docName}`,
          user.id,
          corporate.companyName,
          'CORPORATE'
        );

        // Reset form
        setRequestForm({
          requestType: 'COMPLIANCE_DOC',
          docName: '',
          description: '',
          priority: 'MEDIUM'
        });

        setShowRequestDialog(false);
        alert('Document request sent successfully!');
      }
    } catch (error) {
      console.error('Error requesting document:', error);
      alert('Failed to create document request: ' + error.message);
    }
  };

  const filteredRooms = chatRooms.filter(room =>
    room.ngo?.orgName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableNGOs = ngos.filter(ngo => 
    !chatRooms.some(room => room.ngo?.id === ngo.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 -m-6 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">NGO Communication Hub</h1>
            <p className="text-slate-600">Connect with NGOs, request documents, and track partnerships</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowDocumentsDialog(true)}
              variant={documentRequests.filter(r => r.status === 'UPLOADED').length > 0 ? "default" : "outline"}
              className={`gap-2 relative ${documentRequests.filter(r => r.status === 'UPLOADED').length > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white animate-pulse' : ''}`}
            >
              <FileText className="h-4 w-4" />
              {documentRequests.filter(r => r.status === 'UPLOADED').length > 0 
                ? `${documentRequests.filter(r => r.status === 'UPLOADED').length} New Upload${documentRequests.filter(r => r.status === 'UPLOADED').length > 1 ? 's' : ''} - Review Now`
                : 'Document Requests'
              }
              {documentRequests.filter(r => r.status === 'UPLOADED').length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full animate-bounce">
                  {documentRequests.filter(r => r.status === 'UPLOADED').length}
                </Badge>
              )}
            </Button>
            <Button
              onClick={() => setShowNewChatDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Conversation
            </Button>
            <NotificationCenter userId={user.id} userRole="CORPORATE" />
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Chat List */}
          <Card className="col-span-4 p-4 h-[600px] flex flex-col">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search NGOs..."
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
                  <Button
                    size="sm"
                    onClick={() => setShowNewChatDialog(true)}
                    className="mt-3"
                  >
                    Start chatting with NGOs
                  </Button>
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
                      <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {room.ngo?.orgName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 truncate">
                            {room.ngo?.orgName}
                          </h4>
                          {room.ngo?.trustScore && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                              {room.ngo.trustScore}
                            </span>
                          )}
                        </div>
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
                currentUserRole="CORPORATE"
                currentUserName={corporate.companyName}
                recipientName={selectedRoom.ngo.orgName}
                recipientRole="NGO"
                onRequestDocument={() => setShowRequestDialog(true)}
              />
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Choose an NGO from the list to start chatting
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Start New Conversation</DialogTitle>
            <DialogDescription>
              Select an NGO to start chatting and building a partnership
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {availableNGOs.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                You're already connected with all NGOs in the system
              </p>
            ) : (
              availableNGOs.map(ngo => (
                <button
                  key={ngo.id}
                  onClick={() => handleStartChat(ngo)}
                  className="w-full text-left p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">{ngo.orgName}</h4>
                      <p className="text-sm text-slate-600">{ngo.city}, {ngo.state}</p>
                      <p className="text-xs text-slate-500 mt-1">{ngo.mission?.substring(0, 100)}...</p>
                    </div>
                    {ngo.trustScore && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{ngo.trustScore}</div>
                        <div className="text-xs text-slate-500">Trust Score</div>
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Document from {selectedRoom?.ngo?.orgName}</DialogTitle>
            <DialogDescription>
              Specify which document you need for compliance verification
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Document Type</Label>
              <Select
                value={requestForm.requestType}
                onValueChange={(value) => setRequestForm(prev => ({ ...prev, requestType: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMPLIANCE_DOC">Compliance Document</SelectItem>
                  <SelectItem value="UTILIZATION_CERTIFICATE">Utilization Certificate</SelectItem>
                  <SelectItem value="IMPACT_REPORT">Impact Report</SelectItem>
                  <SelectItem value="TRANCHE_EVIDENCE">Tranche Evidence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Document Name *</Label>
              <Input
                placeholder="e.g., 12A Certificate, 80G Certificate"
                value={requestForm.docName}
                onChange={(e) => setRequestForm(prev => ({ ...prev, docName: e.target.value }))}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Additional Details (Optional)</Label>
              <Textarea
                placeholder="Specify any particular requirements or deadline..."
                value={requestForm.description}
                onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-2"
                rows={3}
              />
            </div>

            <div>
              <Label>Priority</Label>
              <Select
                value={requestForm.priority}
                onValueChange={(value) => setRequestForm(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowRequestDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRequestDocument}
                disabled={!requestForm.docName}
                className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Send className="h-4 w-4" />
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Uploaded Documents Dialog */}
      <Dialog open={showDocumentsDialog} onOpenChange={setShowDocumentsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Requests & Uploads</DialogTitle>
            <DialogDescription>
              Track your document requests and view uploaded files from NGOs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {documentRequests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No document requests yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Request documents from NGOs through the chat interface
                </p>
              </div>
            ) : (
              <>
                {/* Uploaded Documents Section */}
                {documentRequests.filter(r => r.status === 'UPLOADED' || r.status === 'VERIFIED').length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      Uploaded Documents ({documentRequests.filter(r => r.status === 'UPLOADED' || r.status === 'VERIFIED').length})
                    </h3>
                    <div className="space-y-2">
                      {documentRequests.filter(r => r.status === 'UPLOADED' || r.status === 'VERIFIED').map(req => (
                        <div key={req.id} className={`border rounded-lg p-4 ${
                          req.status === 'VERIFIED' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                        }`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-medium text-slate-900">{req.docName}</span>
                                <Badge className={`text-xs ${req.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-blue-500 text-white animate-pulse'}`}>
                                  {req.status === 'VERIFIED' ? (
                                    <><CheckCircle2 className="h-3 w-3 mr-1" /> Verified</>
                                  ) : (
                                    <><FileCheck className="h-3 w-3 mr-1" /> New Upload - Review Required</>
                                  )}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-600">From: <strong>{req.ngo?.orgName}</strong></p>
                              {req.uploadedAt && (
                                <p className="text-xs text-slate-400 mt-1">
                                  Uploaded: {new Date(req.uploadedAt).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                  })}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              {req.fileUrl && (
                                <Button size="sm" variant="outline" asChild className="gap-2">
                                  <a href={req.fileUrl} target="_blank" rel="noopener noreferrer">
                                    <Eye className="h-4 w-4" />
                                    View
                                  </a>
                                </Button>
                              )}
                              {req.status === 'UPLOADED' && (
                                <div className="flex gap-1">
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 text-xs px-2"
                                    onClick={() => handleVerifyDocument(req.id)}
                                  >
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Verify
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    className="text-xs px-2"
                                    onClick={() => handleRejectDocument(req.id)}
                                  >
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Requests Section */}
                {documentRequests.filter(r => r.status === 'PENDING').length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pending Requests ({documentRequests.filter(r => r.status === 'PENDING').length})
                    </h3>
                    <div className="space-y-2">
                      {documentRequests.filter(r => r.status === 'PENDING').map(req => (
                        <div key={req.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900">{req.docName}</span>
                            <Badge className="bg-amber-100 text-amber-700 text-xs">
                              <Clock className="h-3 w-3 mr-1" /> Pending
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${
                              req.priority === 'HIGH' ? 'border-red-300 text-red-600' :
                              req.priority === 'MEDIUM' ? 'border-amber-300 text-amber-600' :
                              'border-slate-300 text-slate-600'
                            }`}>
                              {req.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600">Requested from: {req.ngo?.orgName}</p>
                          {req.description && (
                            <p className="text-xs text-slate-500 mt-1 italic">"{req.description}"</p>
                          )}
                          <p className="text-xs text-slate-400 mt-2">
                            Requested: {new Date(req.requestedAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejected Requests Section */}
                {documentRequests.filter(r => r.status === 'REJECTED').length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Rejected ({documentRequests.filter(r => r.status === 'REJECTED').length})
                    </h3>
                    <div className="space-y-2">
                      {documentRequests.filter(r => r.status === 'REJECTED').map(req => (
                        <div key={req.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900">{req.docName}</span>
                            <Badge className="bg-red-100 text-red-700 text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" /> Rejected
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600">From: {req.ngo?.orgName}</p>
                          {req.remarks && (
                            <p className="text-xs text-red-600 mt-1">Reason: {req.remarks}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
