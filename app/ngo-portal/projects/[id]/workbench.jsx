"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
    Lock, Unlock, Upload, FileText, CheckCircle2, AlertTriangle, MapPin, X, Loader2,
    ArrowLeft, Wallet, TrendingUp, Clock, MessageCircle, Shield
} from "lucide-react";
import { uploadTrancheDocument, requestTrancheRelease } from "@/app/actions/tranche-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import socketManager from "@/lib/socket";

export default function ProjectWorkbench({ project }) {
    const router = useRouter();
    const { toast } = useToast();
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [currentTrancheId, setCurrentTrancheId] = useState(null);
    const [uploadType, setUploadType] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);

    // Calculate stats
    const totalAmount = project.tranches.reduce((sum, t) => sum + t.amount, 0);
    const releasedAmount = project.tranches.filter(t => t.status === 'RELEASED' || t.status === 'DISBURSED').reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = project.tranches.filter(t => t.releaseRequested && t.status === 'LOCKED').reduce((sum, t) => sum + t.amount, 0);
    const blockedCount = project.tranches.filter(t => t.isBlocked).length;
    const progressPercent = (releasedAmount / totalAmount) * 100;

    // Listen for real-time updates
    useEffect(() => {
        const handleTrancheApproved = (data) => {
            if (data.projectId === project.id) {
                toast({
                    title: "🎉 Tranche Approved!",
                    description: `₹${data.amount?.toLocaleString()} has been released. Refreshing...`,
                });
                setTimeout(() => router.refresh(), 1500);
            }
        };

        const handleTrancheRejected = (data) => {
            if (data.projectId === project.id) {
                toast({
                    variant: "destructive",
                    title: "Tranche Request Rejected",
                    description: data.reason || "Please check requirements and resubmit.",
                });
                setTimeout(() => router.refresh(), 1500);
            }
        };

        socketManager.on('tranche_approved', handleTrancheApproved);
        socketManager.on('tranche_rejected', handleTrancheRejected);

        return () => {
            socketManager.off('tranche_approved', handleTrancheApproved);
            socketManager.off('tranche_rejected', handleTrancheRejected);
        };
    }, [project.id, router, toast]);

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
                toast({
                    variant: "destructive",
                    title: "Upload Failed",
                    description: result.error
                });
            } else {
                toast({
                    title: "✅ Document Uploaded",
                    description: result.message
                });
                setSelectedFile(null);
                setUploadDialogOpen(false);
                router.refresh();
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: "An unexpected error occurred"
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleRequestRelease = async (trancheId) => {
        setIsRequesting(true);
        
        try {
            const result = await requestTrancheRelease(trancheId);
            
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Request Failed",
                    description: result.error
                });
            } else {
                toast({
                    title: "🚀 Release Requested",
                    description: "Your request has been submitted. Awaiting corporate approval."
                });
                router.refresh();
            }
        } catch (error) {
            console.error("Request release error:", error);
            toast({
                variant: "destructive",
                title: "Request Failed",
                description: "An unexpected error occurred"
            });
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <Link href="/ngo-portal/projects" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
                <ArrowLeft size={16} /> Back to Projects
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
                    <p className="text-slate-500 mt-1">{project.location} • {project.sector}</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/ngo-portal/chat`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat with Corporate
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Total Grant</p>
                                <p className="text-2xl font-bold text-blue-900">₹{(totalAmount / 100000).toFixed(1)}L</p>
                            </div>
                            <Wallet className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Released</p>
                                <p className="text-2xl font-bold text-green-900">₹{(releasedAmount / 100000).toFixed(1)}L</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className={`bg-gradient-to-br ${pendingAmount > 0 ? 'from-amber-50 to-amber-100/50 border-amber-200' : 'from-slate-50 to-slate-100/50 border-slate-200'}`}>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">Pending Approval</p>
                                <p className={`text-2xl font-bold ${pendingAmount > 0 ? 'text-amber-900' : 'text-slate-900'}`}>
                                    ₹{(pendingAmount / 100000).toFixed(1)}L
                                </p>
                            </div>
                            <Clock className={`h-8 w-8 ${pendingAmount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-300'}`} />
                        </div>
                    </CardContent>
                </Card>
                <Card className={`bg-gradient-to-br ${blockedCount > 0 ? 'from-red-50 to-red-100/50 border-red-200' : 'from-slate-50 to-slate-100/50 border-slate-200'}`}>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">Blocked</p>
                                <p className={`text-2xl font-bold ${blockedCount > 0 ? 'text-red-900' : 'text-slate-900'}`}>
                                    {blockedCount} Tranche{blockedCount !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <AlertTriangle className={`h-8 w-8 ${blockedCount > 0 ? 'text-red-400' : 'text-slate-300'}`} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Bar */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-600">Fund Utilization Progress</span>
                        <span className="font-bold text-slate-900">{progressPercent.toFixed(0)}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-3" />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>Released: ₹{releasedAmount.toLocaleString()}</span>
                        <span>Total: ₹{totalAmount.toLocaleString()}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Tranches */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Funding Milestones
                </h2>

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
