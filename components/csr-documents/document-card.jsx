"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileText, Lock, CheckCircle, AlertCircle, Info, Shield, Award } from "lucide-react";
import { useState } from "react";

export default function DocumentCard({
    document,
    userTier = 'free',
    selected = false,
    onSelect,
    onGenerate
}) {
    const isLocked = getTierLevel(userTier) < getTierLevel(document.requiredTier);
    const [status, setStatus] = useState(getDocumentStatus(document));

    function getTierLevel(tier) {
        const levels = { free: 0, pro: 1, enterprise: 2 };
        return levels[tier] || 0;
    }

    function getDocumentStatus(doc) {
        // In a real app, this would check actual data
        // For now, return mock status based on document
        if (doc.id === 'csr-committee-charter' || doc.id === 'uc-tracker' || doc.id === 'website-disclosure') {
            return 'ready';
        }
        return 'needs-inputs';
    }

    function getStatusBadge() {
        if (isLocked) {
            return (
                <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-300 gap-1">
                    <Lock size={12} /> Locked
                </Badge>
            );
        }

        switch (status) {
            case 'ready':
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                        <CheckCircle size={12} /> Ready
                    </Badge>
                );
            case 'needs-inputs':
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
                        <AlertCircle size={12} /> Needs Inputs
                    </Badge>
                );
            case 'generated':
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
                        <FileText size={12} /> Generated
                    </Badge>
                );
            default:
                return null;
        }
    }

    return (
        <Card
            className={`transition-all ${selected ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-sm'
                } ${isLocked ? 'opacity-75' : ''}`}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1">
                        {!isLocked && (
                            <Checkbox
                                checked={selected}
                                onCheckedChange={onSelect}
                                className="mt-1"
                            />
                        )}
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-sm font-semibold leading-tight">
                                    {document.name}
                                </CardTitle>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info size={14} className="text-slate-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p className="text-xs">{document.legalRelevance}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <CardDescription className="text-xs line-clamp-2">
                                {document.description}
                            </CardDescription>
                        </div>
                    </div>
                    {getStatusBadge()}
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-xs text-slate-500">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                            {document.type}
                        </span>
                        {document.mcaReady && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="px-2 py-0.5 bg-blue-50 rounded text-blue-700 font-medium flex items-center gap-1">
                                            <Shield size={10} /> MCA
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">MCA-Ready Format</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {document.auditorReady && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="px-2 py-0.5 bg-purple-50 rounded text-purple-700 font-medium flex items-center gap-1">
                                            <Award size={10} /> Auditor
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">Auditor-Ready</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>

                    {isLocked ? (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                            <Lock size={12} /> Upgrade Plan
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={() => onGenerate(document)}
                            variant={status === 'ready' ? 'default' : 'outline'}
                            className="h-7 text-xs"
                        >
                            {status === 'ready' ? 'Generate' : 'Add Inputs'}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
