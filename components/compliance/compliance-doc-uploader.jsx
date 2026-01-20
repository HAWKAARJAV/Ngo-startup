"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Upload, Loader2, FileCheck } from "lucide-react";

export default function ComplianceDocUploader({ ngoId, docType, docLabel, onUploadSuccess, variant = "default", buttonText }) {
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e) => {
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

        setUploading(true);

        try {
            // Upload the file to storage
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('ngoId', ngoId);
            formData.append('docType', docType);

            const uploadRes = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) {
                const uploadError = await uploadRes.json();
                throw new Error(uploadError.error || 'Failed to upload file');
            }

            const { fileUrl } = await uploadRes.json();

            // Update NGO compliance document record
            const updateRes = await fetch('/api/ngos/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ngoId,
                    docType,
                    fileUrl,
                    status: 'PENDING_VERIFICATION'
                })
            });

            if (!updateRes.ok) {
                console.warn('Failed to update document record, but file was uploaded');
            }

            toast({
                title: "Success! ✅",
                description: `${docLabel} uploaded successfully. It will be verified soon.`,
            });

            setOpen(false);
            setSelectedFile(null);
            
            // Callback for parent component
            if (onUploadSuccess) {
                onUploadSuccess(docType, fileUrl);
            }

            // Refresh page to show updated status
            window.location.reload();

        } catch (error) {
            console.error('Upload error:', error);
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: error.message || "An unexpected error occurred",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant={variant}>
                    <Upload className="h-4 w-4 mr-2" />
                    {buttonText || 'Upload'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload {docLabel}</DialogTitle>
                    <DialogDescription>
                        Upload your {docLabel} for compliance verification.
                        Supported formats: PDF, JPG, PNG (max 5MB)
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor={`file-${docType}`}>Select Document</Label>
                        <Input
                            id={`file-${docType}`}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                        />
                        {selectedFile && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <FileCheck className="h-3 w-3" />
                                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleUpload}
                        disabled={uploading || !selectedFile}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Document
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
