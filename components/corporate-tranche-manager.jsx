"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
    Lock, Unlock, CheckCircle, XCircle, AlertTriangle, 
    Eye, Download, Clock, ArrowRight, FileCheck, Image
} from "lucide-react";

const statusConfig = {
    LOCKED: { 
        color: 'bg-slate-100 text-slate-700 border-slate-200', 
        icon: Lock,
        label: 'Locked'
    },
    PENDING: { 
        color: 'bg-amber-100 text-amber-700 border-amber-200', 
        icon: Clock,
        label: 'Pending Review'
    },
    RELEASED: { 
        color: 'bg-green-100 text-green-700 border-green-200', 
        icon: Unlock,
        label: 'Released'
    },
    DISBURSED: { 
        color: 'bg-blue-100 text-blue-700 border-blue-200', 
        icon: CheckCircle,
        label: 'Disbursed'
    }
};

export default function CorporateTrancheManager({ tranches, projectId, projectTitle, ngoName }) {
    const [selectedTranche, setSelectedTranche] = useState(null);
    const [actionType, setActionType] = useState(null); // 'approve' | 'reject'
    const [remarks, setRemarks] = useState('');
    const [processing, setProcessing] = useState(false);
    const { toast } = useToast();

    const totalAmount = tranches.reduce((sum, t) => sum + t.amount, 0);
    const releasedAmount = tranches.filter(t => t.status === 'RELEASED' || t.status === 'DISBURSED').reduce((sum, t) => sum + t.amount, 0);
    const pendingRequests = tranches.filter(t => t.releaseRequested && t.status !== 'RELEASED');

    const handleAction = async (action) => {
        if (!selectedTranche) return;
        setProcessing(true);

        try {
            const res = await fetch('/api/tranches', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trancheId: selectedTranche.id,
                    action: action === 'approve' ? 'APPROVE' : 'REJECT',
                    remarks
                })
            });

            const data = await res.json();

            if (data.success) {
                toast({
                    title: action === 'approve' ? "Tranche Approved! ✅" : "Request Rejected",
                    description: action === 'approve' 
                        ? `₹${selectedTranche.amount.toLocaleString()} has been released to ${ngoName}`
                        : `The release request has been rejected. NGO has been notified.`,
                });
                // Refresh page to show updated data
                window.location.reload();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to process request. Please try again."
            });
        } finally {
            setProcessing(false);
            setSelectedTranche(null);
            setActionType(null);
            setRemarks('');
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Milestone-Based Tranches
                            {pendingRequests.length > 0 && (
                                <Badge className="bg-amber-500 text-white animate-pulse">
                                    {pendingRequests.length} Pending
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Review and approve fund releases based on milestone completion
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500">Total Released</p>
                        <p className="text-2xl font-bold text-green-600">
                            ₹{(releasedAmount / 100000).toFixed(1)}L
                            <span className="text-sm font-normal text-slate-400"> / {(totalAmount / 100000).toFixed(1)}L</span>
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {tranches.map((tranche, index) => {
                    const config = statusConfig[tranche.status] || statusConfig.LOCKED;
                    const StatusIcon = config.icon;
                    const isPending = tranche.releaseRequested && tranche.status !== 'RELEASED';
                    const isBlocked = tranche.isBlocked;

                    return (
                        <div 
                            key={tranche.id}
                            className={`relative border rounded-xl p-5 transition-all duration-300 ${
                                isPending 
                                    ? 'border-amber-300 bg-amber-50/50 shadow-md ring-2 ring-amber-200' 
                                    : isBlocked 
                                        ? 'border-red-200 bg-red-50/30'
                                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            {/* Tranche Number Badge */}
                            <div className={`absolute -left-3 top-6 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
                                tranche.status === 'RELEASED' || tranche.status === 'DISBURSED'
                                    ? 'bg-green-500 text-white'
                                    : isPending
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-slate-200 text-slate-600'
                            }`}>
                                {index + 1}
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-4 ml-4">
                                {/* Main Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-slate-900">{tranche.unlockCondition}</h3>
                                        <Badge className={config.color}>
                                            <StatusIcon className="h-3 w-3 mr-1" />
                                            {config.label}
                                        </Badge>
                                        {isBlocked && (
                                            <Badge className="bg-red-100 text-red-700 border-red-200">
                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                Blocked
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <p className="text-2xl font-bold text-slate-900">
                                        ₹{tranche.amount.toLocaleString()}
                                    </p>

                                    {isBlocked && tranche.blockReason && (
                                        <p className="text-sm text-red-600 mt-2">
                                            ⚠️ Block Reason: {tranche.blockReason}
                                        </p>
                                    )}
                                </div>

                                {/* Evidence/Docs */}
                                <div className="flex items-center gap-2">
                                    {tranche.proofDocUrl && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={tranche.proofDocUrl} target="_blank" rel="noopener noreferrer">
                                                <FileCheck className="h-4 w-4 mr-1" />
                                                View UC
                                            </a>
                                        </Button>
                                    )}
                                    {tranche.geoTag && (
                                        <Button variant="outline" size="sm">
                                            <Image className="h-4 w-4 mr-1" />
                                            Photo Evidence
                                        </Button>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    {isPending ? (
                                        <>
                                            <Button 
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => {
                                                    setSelectedTranche(tranche);
                                                    setActionType('approve');
                                                }}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button 
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={() => {
                                                    setSelectedTranche(tranche);
                                                    setActionType('reject');
                                                }}
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Reject
                                            </Button>
                                        </>
                                    ) : tranche.status === 'RELEASED' || tranche.status === 'DISBURSED' ? (
                                        <Button variant="ghost" size="sm" disabled>
                                            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                            Completed
                                        </Button>
                                    ) : (
                                        <Badge variant="outline" className="text-slate-500">
                                            Awaiting NGO Request
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Progress indicator connecting tranches */}
                            {index < tranches.length - 1 && (
                                <div className="absolute -bottom-4 left-1 h-4 w-0.5 bg-slate-200" />
                            )}
                        </div>
                    );
                })}
            </CardContent>

            {/* Approval/Rejection Dialog */}
            <Dialog open={!!selectedTranche && !!actionType} onOpenChange={() => {
                setSelectedTranche(null);
                setActionType(null);
                setRemarks('');
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {actionType === 'approve' ? (
                                <>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    Approve Tranche Release
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    Reject Release Request
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === 'approve' 
                                ? `This will release ₹${selectedTranche?.amount?.toLocaleString()} to ${ngoName} for "${selectedTranche?.unlockCondition}"`
                                : 'Please provide a reason for rejection. The NGO will be notified.'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Summary */}
                        <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Project</span>
                                <span className="font-medium">{projectTitle}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Milestone</span>
                                <span className="font-medium">{selectedTranche?.unlockCondition}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Amount</span>
                                <span className="font-bold text-lg">₹{selectedTranche?.amount?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Evidence Preview */}
                        {selectedTranche?.proofDocUrl && (
                            <div className="border rounded-lg p-3">
                                <p className="text-sm font-medium mb-2">Submitted Evidence:</p>
                                <a 
                                    href={selectedTranche.proofDocUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                >
                                    <FileCheck className="h-4 w-4" />
                                    View Utilization Certificate
                                </a>
                            </div>
                        )}

                        {/* Remarks */}
                        <div>
                            <Label htmlFor="remarks">
                                {actionType === 'approve' ? 'Notes (Optional)' : 'Rejection Reason (Required)'}
                            </Label>
                            <Textarea 
                                id="remarks"
                                placeholder={actionType === 'approve' 
                                    ? "Add any notes for audit trail..." 
                                    : "Please explain why this request is being rejected..."
                                }
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setSelectedTranche(null);
                            setActionType(null);
                            setRemarks('');
                        }}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => handleAction(actionType)}
                            disabled={processing || (actionType === 'reject' && !remarks.trim())}
                            className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {processing ? 'Processing...' : actionType === 'approve' ? 'Confirm Release' : 'Confirm Rejection'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
