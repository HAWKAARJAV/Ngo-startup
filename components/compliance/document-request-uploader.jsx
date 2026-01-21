"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Building2, Loader2, FileCheck, Eye, CheckCircle2, Clock, AlertCircle, AlertTriangle, CalendarClock } from "lucide-react";

export default function DocumentRequestUploader({ requests, ngoId }) {
    const [uploading, setUploading] = useState({});
    const [selectedFiles, setSelectedFiles] = useState({});
    const [openDialogs, setOpenDialogs] = useState({});
    const fileInputRefs = useRef({});
    const { toast } = useToast();

    const handleFileChange = (requestId, e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "File size must be less than 5MB",
            });
            e.target.value = null;
            return;
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Only PDF and image files are allowed",
            });
            e.target.value = null;
            return;
        }

        setSelectedFiles(prev => ({ ...prev, [requestId]: file }));
    };

    const handleUpload = async (request) => {
        const file = selectedFiles[request.id];
        if (!file) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a file to upload",
            });
            return;
        }

        setUploading(prev => ({ ...prev, [request.id]: true }));

        try {
            // First, upload the file to storage
            const formData = new FormData();
            formData.append('file', file);
            formData.append('ngoId', ngoId);
            formData.append('docType', request.docName);
            formData.append('requestId', request.id);

            // Upload to Supabase storage via API
            const uploadRes = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) {
                const uploadError = await uploadRes.json();
                throw new Error(uploadError.error || 'Failed to upload file');
            }

            const { fileUrl } = await uploadRes.json();

            // Now update the document request with the file URL
            const updateRes = await fetch('/api/documents/requests/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId: request.id,
                    status: 'UPLOADED',
                    fileUrl
                })
            });

            if (!updateRes.ok) {
                throw new Error('Failed to update request status');
            }

            toast({
                title: "Success! ✅",
                description: `Document uploaded successfully. ${request.corporateName} has been notified.`,
            });

            // Close dialog and refresh page
            setOpenDialogs(prev => ({ ...prev, [request.id]: false }));
            setSelectedFiles(prev => ({ ...prev, [request.id]: null }));
            
            // Refresh the page to show updated status
            window.location.reload();

        } catch (error) {
            console.error('Upload error:', error);
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: error.message || "An unexpected error occurred",
            });
        } finally {
            setUploading(prev => ({ ...prev, [request.id]: false }));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <Badge className="bg-amber-100 text-amber-700"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
            case 'UPLOADED':
                return <Badge className="bg-blue-100 text-blue-700"><FileCheck className="h-3 w-3 mr-1" /> Uploaded</Badge>;
            case 'VERIFIED':
                return <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="h-3 w-3 mr-1" /> Verified</Badge>;
            case 'REJECTED':
                return <Badge className="bg-red-100 text-red-700"><AlertCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Helper function to check deadline status
    const getDeadlineInfo = (deadline) => {
        if (!deadline) return null;
        
        const deadlineDate = new Date(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        deadlineDate.setHours(0, 0, 0, 0);
        
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const formattedDate = new Date(deadline).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        if (diffDays < 0) {
            return {
                text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`,
                date: formattedDate,
                status: 'overdue',
                className: 'bg-red-100 text-red-700 border-red-200'
            };
        } else if (diffDays === 0) {
            return {
                text: 'Due Today!',
                date: formattedDate,
                status: 'today',
                className: 'bg-orange-100 text-orange-700 border-orange-200'
            };
        } else if (diffDays <= 3) {
            return {
                text: `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`,
                date: formattedDate,
                status: 'urgent',
                className: 'bg-amber-100 text-amber-700 border-amber-200'
            };
        } else {
            return {
                text: `Due in ${diffDays} days`,
                date: formattedDate,
                status: 'normal',
                className: 'bg-blue-50 text-blue-700 border-blue-200'
            };
        }
    };

    if (!requests || requests.length === 0) {
        return null;
    }

    const pendingRequests = requests.filter(r => r.status === 'PENDING' || r.status === 'REJECTED');
    const completedRequests = requests.filter(r => r.status === 'UPLOADED' || r.status === 'VERIFIED');

    return (
        <div className="space-y-6">
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
                <Card className="border-amber-200 bg-amber-50/30">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                                <CardTitle className="text-lg text-amber-900">
                                    Pending Document Requests
                                </CardTitle>
                                <Badge className="bg-amber-500 text-white">{pendingRequests.length}</Badge>
                            </div>
                        </div>
                        <CardDescription className="text-amber-700">
                            Corporate partners have requested these documents. Upload them to maintain your compliance standing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingRequests.map((req) => (
                            <div 
                                key={req.id} 
                                className={`bg-white border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                    req.deadline && getDeadlineInfo(req.deadline)?.status === 'overdue' 
                                        ? 'border-red-300 bg-red-50/30' 
                                        : 'border-amber-200'
                                }`}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <Building2 className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-semibold text-blue-700">{req.corporateName}</span>
                                        <Badge variant="outline" className={`text-xs ${
                                            req.priority === 'HIGH' ? 'border-red-300 text-red-600' : 
                                            req.priority === 'MEDIUM' ? 'border-amber-300 text-amber-600' : 
                                            'border-slate-300 text-slate-600'
                                        }`}>
                                            {req.priority} Priority
                                        </Badge>
                                        {getStatusBadge(req.status)}
                                    </div>
                                    <h4 className="font-medium text-slate-900">{req.docName}</h4>
                                    {req.description && (
                                        <p className="text-sm text-slate-600 mt-1 bg-slate-50 p-2 rounded border-l-2 border-blue-400">
                                            "{req.description}"
                                        </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-4 mt-2">
                                        <p className="text-xs text-slate-400">
                                            Requested: {new Date(req.requestedAt).toLocaleDateString('en-IN', { 
                                                day: 'numeric', 
                                                month: 'short', 
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        {req.deadline && (
                                            <div className={`text-xs px-2 py-1 rounded-md border flex items-center gap-1 ${getDeadlineInfo(req.deadline)?.className}`}>
                                                {getDeadlineInfo(req.deadline)?.status === 'overdue' ? (
                                                    <AlertTriangle className="h-3 w-3" />
                                                ) : (
                                                    <CalendarClock className="h-3 w-3" />
                                                )}
                                                <span className="font-medium">{getDeadlineInfo(req.deadline)?.text}</span>
                                                <span className="opacity-75">({getDeadlineInfo(req.deadline)?.date})</span>
                                            </div>
                                        )}
                                    </div>
                                    {req.remarks && (
                                        <p className="text-xs text-red-600 mt-1">
                                            ⚠️ Feedback: {req.remarks}
                                        </p>
                                    )}
                                    {req.deadline && getDeadlineInfo(req.deadline)?.status === 'overdue' && (
                                        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md">
                                            <p className="text-xs text-red-800 flex items-center gap-1">
                                                <AlertTriangle className="h-3 w-3" />
                                                <strong>Warning:</strong> This document is overdue. Please upload immediately to avoid compliance issues.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Dialog 
                                        open={openDialogs[req.id]} 
                                        onOpenChange={(open) => setOpenDialogs(prev => ({ ...prev, [req.id]: open }))}
                                    >
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload Now
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Upload Document</DialogTitle>
                                                <DialogDescription>
                                                    Upload <strong>{req.docName}</strong> as requested by <strong>{req.corporateName}</strong>
                                                </DialogDescription>
                                            </DialogHeader>
                                            
                                            <div className="space-y-4 py-4">
                                                {req.description && (
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                        <p className="text-sm text-blue-800">
                                                            <strong>Corporate's Note:</strong> {req.description}
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                <div className="space-y-2">
                                                    <Label htmlFor={`file-${req.id}`}>Select File (PDF or Image, max 5MB)</Label>
                                                    <Input
                                                        id={`file-${req.id}`}
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                                                        onChange={(e) => handleFileChange(req.id, e)}
                                                        className="cursor-pointer"
                                                    />
                                                    {selectedFiles[req.id] && (
                                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                                            <FileCheck className="h-3 w-3" />
                                                            Selected: {selectedFiles[req.id].name} ({(selectedFiles[req.id].size / 1024).toFixed(1)} KB)
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <DialogFooter>
                                                <Button 
                                                    variant="outline" 
                                                    onClick={() => setOpenDialogs(prev => ({ ...prev, [req.id]: false }))}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button 
                                                    onClick={() => handleUpload(req)}
                                                    disabled={uploading[req.id] || !selectedFiles[req.id]}
                                                    className="bg-amber-600 hover:bg-amber-700"
                                                >
                                                    {uploading[req.id] ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Upload & Notify Corporate
                                                        </>
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Completed Requests */}
            {completedRequests.length > 0 && (
                <Card className="border-green-200 bg-green-50/30">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <CardTitle className="text-lg text-green-900">
                                Uploaded Documents
                            </CardTitle>
                            <Badge className="bg-green-500 text-white">{completedRequests.length}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {completedRequests.map((req) => (
                            <div 
                                key={req.id} 
                                className="bg-white border border-green-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Building2 className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-semibold text-blue-700">{req.corporateName}</span>
                                        {getStatusBadge(req.status)}
                                    </div>
                                    <h4 className="font-medium text-slate-900">{req.docName}</h4>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Uploaded: {req.uploadedAt ? new Date(req.uploadedAt).toLocaleDateString('en-IN', { 
                                            day: 'numeric', 
                                            month: 'short', 
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {req.fileUrl && (
                                        <Button size="sm" variant="outline" asChild>
                                            <a href={req.fileUrl} target="_blank" rel="noopener noreferrer">
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Document
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
