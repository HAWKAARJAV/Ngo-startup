"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileCheck, AlertTriangle, Clock, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ComplianceDocUploader from "./compliance-doc-uploader";

export default function ComplianceDocCards({ docTypes, ngoId, documents }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {docTypes.map((doc) => {
                const isExpired = doc.validity && new Date(doc.validity) < new Date();
                const isMissing = !doc.validity;
                const uploadedDoc = documents.find(d => d.docType === doc.key);

                return (
                    <Card key={doc.key} className={`border-l-4 shadow-sm ${doc.verified ? 'border-l-green-500' : 'border-l-amber-500'}`}>
                        <CardHeader className="bg-slate-50/50 pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg font-bold text-slate-800">{doc.label}</CardTitle>
                                    <CardDescription className="text-xs font-mono text-slate-500 mt-1">
                                        DOC-ID: {doc.key}-{ngoId.substring(0, 6)}
                                    </CardDescription>
                                </div>
                                {doc.verified ? (
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 gap-1">
                                        <FileCheck className="h-3 w-3" /> Verified
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 gap-1">
                                        <Clock className="h-3 w-3" /> Pending
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">

                            {/* Status Banner */}
                            {isMissing ? (
                                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md flex gap-2 items-center">
                                    <AlertTriangle className="h-4 w-4" /> Document Missing. Upload immediately.
                                </div>
                            ) : isExpired ? (
                                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md flex gap-2 items-center">
                                    <AlertTriangle className="h-4 w-4" /> Expired on {new Date(doc.validity).toLocaleDateString('en-IN')}.
                                </div>
                            ) : (
                                <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md flex gap-2 items-center">
                                    <FileCheck className="h-4 w-4" /> Valid until {new Date(doc.validity).toLocaleDateString('en-IN')}.
                                </div>
                            )}

                            <Separator />

                            {/* Action Area */}
                            <div className="flex justify-between items-center">
                                <div className="text-xs text-slate-500">
                                    Last updated: {uploadedDoc?.uploadedAt 
                                        ? new Date(uploadedDoc.uploadedAt).toLocaleDateString('en-IN') 
                                        : 'Never'}
                                </div>
                                <div className="flex gap-2">
                                    {uploadedDoc?.url && (
                                        <Button size="sm" variant="outline" asChild>
                                            <a href={uploadedDoc.url} target="_blank" rel="noopener noreferrer">
                                                <Eye className="h-4 w-4 mr-2" />
                                                View
                                            </a>
                                        </Button>
                                    )}
                                    <ComplianceDocUploader
                                        ngoId={ngoId}
                                        docType={doc.key}
                                        docLabel={doc.label}
                                        variant={isMissing || isExpired ? "default" : "secondary"}
                                        buttonText={isMissing ? 'Upload New' : 'Renew'}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
