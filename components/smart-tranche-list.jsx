"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, CheckCircle, Upload, Eye, Sparkles } from "lucide-react";
import { requestFundRelease, approveTrancheRelease } from "@/app/actions/escrow-actions";
import { useToast } from "@/components/ui/use-toast"; // Assuming shadcn toast exists or simplified

export default function SmartTrancheList({ tranches, isCorporate = false }) {
    const [loading, setLoading] = useState(null);

    const handleRequest = async (id) => {
        setLoading(id);
        // Mocking Payload
        const mockProof = "https://azure-storage.com/proof/uc-2025.pdf";
        const mockGeo = "28.6139° N, 77.2090° E";

        await requestFundRelease(id, mockProof, mockGeo);
        setLoading(null);
    };

    const handleApprove = async (id) => {
        setLoading(id);
        await approveTrancheRelease(id);
        setLoading(null);
    };

    return (
        <div className="space-y-4">
            {tranches.map((t, idx) => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${t.status === 'DISBURSED' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {t.status === 'DISBURSED' ? <CheckCircle size={20} /> : <Lock size={20} />}
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">Tranche #{idx + 1}: {t.unlockCondition}</h4>
                            <p className="text-xs text-slate-500">Amount: ₹{(t.amount / 1000).toFixed(0)}k</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        {t.status === 'DISBURSED' && <Badge className="bg-green-600">Disbursed</Badge>}
                        {t.status === 'LOCKED' && !t.releaseRequested && <Badge variant="outline">Locked</Badge>}
                        {t.status === 'LOCKED' && t.releaseRequested && <Badge className="bg-amber-500">Review Pending</Badge>}

                        {/* Actions */}
                        {/* 1. NGO View: If Locked & Not Requested, Show Request Button */}
                        {!isCorporate && t.status === 'LOCKED' && !t.releaseRequested && (
                            <Button size="sm" variant="outline" onClick={() => handleRequest(t.id)} disabled={loading === t.id}>
                                <Upload size={14} className="mr-2" /> Upload UC
                            </Button>
                        )}

                        {/* 2. Corporate View: If Release Requested, Show Approve Button */}
                        {isCorporate && t.releaseRequested && t.status === 'LOCKED' && (
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-blue-600">
                                    <Eye size={14} className="mr-1" /> View Proof
                                </Button>
                                <Button size="sm" variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                                    <Sparkles size={14} className="mr-1" /> Analyze
                                </Button>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(t.id)} disabled={loading === t.id}>
                                    Approve Release
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
