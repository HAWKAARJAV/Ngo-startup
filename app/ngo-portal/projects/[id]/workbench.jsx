"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Unlock, Upload, FileText, CheckCircle2, AlertTriangle, MapPin, X, Loader2 } from "lucide-react";
import { uploadTrancheDocument, requestTrancheRelease } from "@/app/actions/tranche-actions";
import { useRouter } from "next/navigation";

export default function ProjectWorkbench({ project }) {
    const router = useRouter();
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [currentTrancheId, setCurrentTrancheId] = useState(null);
    const [uploadType, setUploadType] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);

    const handleUploadClick = (trancheId, type) => {
        setCurrentTrancheId(trancheId);
        setUploadType(type);
        setUploadDialogOpen(true);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUploadSubmit = async () => {
        if (!selectedFile || !currentTrancheId) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("trancheId", currentTrancheId);
            formData.append("documentType", uploadType);
            formData.append("file", selectedFile);

            const result = await uploadTrancheDocument(formData);

            if (result.error) {
                alert("Error: " + result.error);
            } else {
                alert(result.message);
                setSelectedFile(null);
                setUploadDialogOpen(false);
                router.refresh(); // Refresh to show updated data
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload document");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRequestRelease = async (trancheId) => {
        setIsRequesting(true);
        
        try {
            const result = await requestTrancheRelease(trancheId);
            
            if (result.error) {
                alert("Error: " + result.error);
            } else {
                alert(result.message);
                router.refresh();
            }
        } catch (error) {
            console.error("Request release error:", error);
            alert("Failed to submit release request");
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
                    <p className="text-slate-500">Project Workbench • ID: {project.id.substring(0, 8)}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500">Total Grant</p>
                    <p className="text-2xl font-bold font-mono">₹{project.targetAmount.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid gap-6">
                <h2 className="text-xl font-bold text-slate-800">Funding Milestones (Tranches)</h2>

                {project.tranches.map((tranche, index) => {
                    const isLocked = tranche.status === 'LOCKED';
                    const isBlocked = tranche.isBlocked;

                    return (
                        <Card key={tranche.id} className={isLocked ? 'border-l-4 border-l-slate-300 bg-slate-50' : 'border-l-4 border-l-green-500 bg-white'}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left: Indicator */}
                                    <div className="flex flex-col items-center justify-center w-16 text-slate-400">
                                        {isLocked ? (
                                            <div className="bg-slate-200 p-3 rounded-full mb-2">
                                                <Lock className="h-6 w-6 text-slate-500" />
                                            </div>
                                        ) : (
                                            <div className="bg-green-100 p-3 rounded-full mb-2">
                                                <Unlock className="h-6 w-6 text-green-600" />
                                            </div>
                                        )}
                                        <span className="text-xs font-bold uppercase tracking-wide">Tranche {index + 1}</span>
                                    </div>

                                    {/* Middle: Details */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">₹{tranche.amount.toLocaleString()}</h3>
                                                <p className="text-slate-600">{tranche.unlockCondition}</p>
                                            </div>
                                            <Badge variant={isLocked ? "outline" : "default"} className={!isLocked ? "bg-green-600" : ""}>
                                                {tranche.status}
                                            </Badge>
                                        </div>

                                        {isBlocked && (
                                            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm flex items-start gap-2 border border-red-100">
                                                <AlertTriangle className="h-5 w-5 shrink-0" />
                                                <div>
                                                    <span className="font-bold">Funds Blocked:</span> Evidence Required.
                                                    <br />
                                                    Reason: {tranche.blockReason || "Proof of work pending."}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Section */}
                                        {isLocked && (
                                            <div className="bg-white border rounded-lg p-4 space-y-3">
                                                <h4 className="text-sm font-bold text-slate-700">Unlock Requirements</h4>

                                                <div className="flex items-center justify-between text-sm py-2 border-b">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <FileText className="h-4 w-4" /> Utilization Certificate
                                                    </div>
                                                    {tranche.proofDocUrl ? (
                                                        <span className="text-green-600 flex items-center gap-1">
                                                            <CheckCircle2 className="h-4 w-4" /> Uploaded
                                                        </span>
                                                    ) : (
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => handleUploadClick(tranche.id, 'UC')}
                                                        >
                                                            <Upload className="h-3 w-3 mr-1" /> Upload UC
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between text-sm py-2">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <MapPin className="h-4 w-4" /> Geo-Tagged Site Photo
                                                    </div>
                                                    {tranche.geoTag ? (
                                                        <span className="text-green-600 flex items-center gap-1">
                                                            <CheckCircle2 className="h-4 w-4" /> Verified
                                                        </span>
                                                    ) : (
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => handleUploadClick(tranche.id, 'PHOTO')}
                                                        >
                                                            <Upload className="h-3 w-3 mr-1" /> Upload Photo
                                                        </Button>
                                                    )}
                                                </div>

                                                <Button 
                                                    className="w-full mt-2" 
                                                    disabled={!tranche.proofDocUrl || !tranche.geoTag || tranche.releaseRequested || isRequesting}
                                                    onClick={() => handleRequestRelease(tranche.id)}
                                                >
                                                    {isRequesting ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Submitting...
                                                        </>
                                                    ) : tranche.releaseRequested ? (
                                                        <>
                                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                                            Release Requested
                                                        </>
                                                    ) : (
                                                        "Request Release"
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Upload Dialog */}
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {uploadType === 'UC' ? 'Upload Utilization Certificate' : 'Upload Geo-tagged Photo'}
                        </DialogTitle>
                        <DialogDescription>
                            {uploadType === 'UC' 
                                ? 'Upload the UC document showing proof of fund utilization for this milestone.'
                                : 'Upload a geo-tagged photo from the project site as evidence of work completion.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="file">
                                {uploadType === 'UC' ? 'Document (PDF)' : 'Photo (JPG, PNG)'}
                            </Label>
                            <Input
                                id="file"
                                type="file"
                                accept={uploadType === 'UC' ? '.pdf' : 'image/*'}
                                onChange={handleFileSelect}
                                className="cursor-pointer"
                            />
                        </div>

                        {selectedFile && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-blue-900">{selectedFile.name}</span>
                                    <span className="text-blue-600">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                                </div>
                                <button
                                    onClick={() => setSelectedFile(null)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
                            <p className="font-semibold mb-1">📌 Important:</p>
                            <ul className="list-disc list-inside space-y-1">
                                {uploadType === 'UC' ? (
                                    <>
                                        <li>UC must be signed by authorized signatory</li>
                                        <li>Include all expense details and receipts</li>
                                        <li>Maximum file size: 5MB</li>
                                    </>
                                ) : (
                                    <>
                                        <li>Photo must have GPS location metadata</li>
                                        <li>Clear view of project work/beneficiaries</li>
                                        <li>Maximum file size: 10MB</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setUploadDialogOpen(false);
                                setSelectedFile(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={!selectedFile || isUploading}
                            onClick={handleUploadSubmit}
                        >
                            {isUploading ? (
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
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
