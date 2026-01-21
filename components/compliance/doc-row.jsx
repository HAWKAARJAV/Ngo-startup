'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock, Eye, FileText, Upload, AlertCircle, XCircle, BellRing, Calendar } from "lucide-react";
import { useState, useRef } from "react";
import { uploadComplianceDocWithFile, verifyComplianceDoc } from "@/app/actions/compliance-actions";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import RequestDocDialog from "./request-doc-dialog";

export default function DocRow({ projectId, category, categoryTitle, docName, docData, isCorporate, isNgo, corporateId, ngoId, documentRequest }) {
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [remarks, setRemarks] = useState(docData?.remarks || "");
    const [openUpload, setOpenUpload] = useState(false);
    const [openVerify, setOpenVerify] = useState(false);
    const fileInputRef = useRef(null);

    const { toast } = useToast();

    // Determine the effective status
    // Priority: docData status > documentRequest status > PENDING
    let status = docData?.status || 'PENDING';
    
    // If document request exists and document hasn't been submitted yet
    if (documentRequest && status === 'PENDING') {
        if (documentRequest.status === 'UPLOADED') {
            status = 'UPLOADED'; // NGO has uploaded via request
        } else if (documentRequest.status === 'PENDING') {
            status = 'REQUESTED'; // Corporate has requested
        } else if (documentRequest.status === 'VERIFIED') {
            status = 'VERIFIED';
        } else if (documentRequest.status === 'REJECTED') {
            status = 'REJECTED';
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (2MB max)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "File size must be less than 2MB",
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

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a file to upload",
            });
            return;
        }

        setIsUploading(true);
        console.log("Uploading document:", { projectId, category, docName, fileName: selectedFile.name });
        
        try {
            const formData = new FormData();
            formData.append('projectId', projectId);
            formData.append('category', category);
            formData.append('docName', docName);
            formData.append('file', selectedFile);

            const res = await uploadComplianceDocWithFile(formData);
            console.log("Upload response:", res);
            setIsUploading(false);
            
            if (res.success) {
                toast({
                    title: "Success",
                    description: "Document uploaded successfully",
                });
                setOpenUpload(false);
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: res.error || "Failed to upload document",
                });
            }
        } catch (error) {
            console.error("Upload error:", error);
            setIsUploading(false);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred",
            });
        }
    };

    const handleVerify = async (newStatus) => {
        setIsVerifying(true);
        const res = await verifyComplianceDoc(docData.id, newStatus, "corporate-user-id", remarks);
        setIsVerifying(false);
        if (res.success) {
            toast({
                title: "Updated",
                description: `Document marked as ${newStatus}`,
            });
            setOpenVerify(false);
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update status",
            });
        }
    };

    const getStatusBadge = (s) => {
        switch (s) {
            case 'REQUESTED': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 pb-1">Requested</Badge>;
            case 'UPLOADED': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 pb-1">Uploaded</Badge>;
            case 'SUBMITTED': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 pb-1">Submitted</Badge>;
            case 'VERIFIED': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 pb-1">Verified</Badge>;
            case 'APPROVED': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 pb-1">Approved</Badge>;
            case 'REJECTED': return <Badge variant="destructive" className="pb-1">Rejected</Badge>;
            default: return <Badge variant="outline" className="text-slate-500 pb-1">Pending</Badge>;
        }
    };

    const getStatusIcon = (s) => {
        switch (s) {
            case 'APPROVED': return <CheckCircle2 className="text-green-500 h-5 w-5" />;
            case 'VERIFIED': return <CheckCircle2 className="text-purple-500 h-5 w-5" />;
            case 'REJECTED': return <XCircle className="text-red-500 h-5 w-5" />;
            case 'SUBMITTED': 
            case 'UPLOADED': return <Clock className="text-blue-500 h-5 w-5" />;
            case 'REQUESTED': return <BellRing className="text-amber-500 h-5 w-5" />;
            default: return <AlertCircle className="text-slate-300 h-5 w-5" />;
        }
    };

    return (
        <div className={`flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-all ${status === 'REQUESTED' ? 'border-amber-200 bg-amber-50/30' : status === 'UPLOADED' ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100'}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${status === 'REQUESTED' ? 'bg-amber-100' : status === 'UPLOADED' ? 'bg-blue-100' : 'bg-slate-50'}`}>
                    <FileText className={`h-5 w-5 ${status === 'REQUESTED' ? 'text-amber-500' : status === 'UPLOADED' ? 'text-blue-500' : 'text-slate-400'}`} />
                </div>
                <div>
                    <h4 className="font-medium text-slate-900 text-sm md:text-base">{docName}</h4>
                    {docData?.lastUpdated && (
                        <p className="text-xs text-slate-500">Updated: {new Date(docData.lastUpdated).toISOString().split('T')[0]}</p>
                    )}
                    {/* Show deadline when requested */}
                    {status === 'REQUESTED' && documentRequest?.deadline && (
                        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Deadline: {new Date(documentRequest.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    )}
                    {/* Show requester info */}
                    {status === 'REQUESTED' && documentRequest?.corporateName && (
                        <p className="text-xs text-slate-500">Requested by: {documentRequest.corporateName}</p>
                    )}
                    {docData?.remarks && (
                        <p className="text-xs text-red-500 mt-1">Note: {docData.remarks}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {getStatusBadge(status)}

                <div className="flex items-center gap-2">
                    {/* Corporate Request Action - only show if not already requested or uploaded */}
                    {isCorporate && (status === 'PENDING' || status === 'REJECTED') && (
                        <RequestDocDialog
                            fixedMode={true}
                            defaultCategory={category}
                            defaultDoc={docName}
                            categoryTitle={categoryTitle}
                            corporateId={corporateId}
                            ngoId={ngoId}
                            projectId={projectId}
                            trigger={
                                <Button size="sm" variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 h-8 px-2">
                                    <BellRing className="h-4 w-4" />
                                    <span className="hidden sm:inline">Request</span>
                                </Button>
                            }
                            onSuccess={() => {
                                toast({
                                    title: "Request Sent",
                                    description: "NGO has been notified to upload this document",
                                });
                                // Refresh page to update status
                                window.location.reload();
                            }}
                        />
                    )}

                    {/* View Document - show when uploaded or submitted */}
                    {(status === 'UPLOADED' && documentRequest?.fileUrl) && (
                        <Button variant="outline" size="sm" className="gap-1" asChild>
                            <a href={documentRequest.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4" /> View
                            </a>
                        </Button>
                    )}

                    {/* View/Action Buttons for compliance docs */}
                    {status !== 'PENDING' && status !== 'REQUESTED' && docData?.url && (
                        <Button variant="ghost" size="icon" asChild>
                            <a href={docData.url} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4 text-slate-500" />
                            </a>
                        </Button>
                    )}

                    {/* NGO Upload Action - show for pending, requested, or rejected */}
                    {isNgo && (status === 'PENDING' || status === 'REQUESTED' || status === 'REJECTED') && (
                        <Dialog open={openUpload} onOpenChange={setOpenUpload}>
                            <DialogTrigger asChild>
                                <Button variant={status === 'REQUESTED' ? 'default' : 'outline'} size="sm" className={`gap-2 ${status === 'REQUESTED' ? 'bg-amber-600 hover:bg-amber-700' : ''}`}>
                                    <Upload className="h-4 w-4" /> Upload
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Upload Document</DialogTitle>
                                    <DialogDescription>
                                        Upload <b>{docName}</b> for this project.
                                        {status === 'REQUESTED' && documentRequest?.deadline && (
                                            <span className="block mt-2 text-amber-600">
                                                Deadline: {new Date(documentRequest.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        )}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="file">Select File (PDF or Image, max 2MB)</Label>
                                        <Input
                                            id="file"
                                            type="file"
                                            ref={fileInputRef}
                                            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                                            onChange={handleFileChange}
                                            className="cursor-pointer"
                                        />
                                        {selectedFile && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                                        {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Submit
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}

                    {/* Corporate Verify Action */}
                    {isCorporate && (status === 'SUBMITTED' || status === 'VERIFIED' || status === 'UPLOADED') && (
                        <Dialog open={openVerify} onOpenChange={setOpenVerify}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                                    Verify
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Verify Document</DialogTitle>
                                    <DialogDescription>Action on <b>{docName}</b></DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <Label>Remarks (Optional)</Label>
                                    <Textarea
                                        placeholder="Add comments if rejected..."
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                    />
                                </div>
                                <DialogFooter className="gap-2 sm:justify-between">
                                    <Button variant="destructive" onClick={() => handleVerify('REJECTED')} disabled={isVerifying}>
                                        Reject
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => handleVerify('VERIFIED')} disabled={isVerifying}>
                                            Mark Verified
                                        </Button>
                                        <Button onClick={() => handleVerify('APPROVED')} disabled={isVerifying} className="bg-green-600 hover:bg-green-700">
                                            Approve
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
        </div>
    );
}
