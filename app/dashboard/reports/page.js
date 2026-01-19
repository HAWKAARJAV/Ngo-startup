"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, CheckCircle, Clock, Archive, Shield, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DocumentCatalog from "@/components/csr-documents/document-catalog";
import InputsPanel from "@/components/csr-documents/inputs-panel";
import DocumentInputModal from "@/components/csr-documents/document-input-modal";

export default function ReportsPage() {
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [inputModalOpen, setInputModalOpen] = useState(false);
    const [currentDocument, setCurrentDocument] = useState(null);
    const userTier = 'pro'; // Mock - would come from user session

    const handleDocumentSelect = (docId) => {
        setSelectedDocuments(prev =>
            prev.includes(docId)
                ? prev.filter(id => id !== docId)
                : [...prev, docId]
        );
    };

    const handleDocumentGenerate = (document) => {
        setCurrentDocument(document);
        setInputModalOpen(true);
    };

    // Mock audit readiness score
    const auditReadinessScore = 92;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">CSR Compliance & Document Generation Hub</h1>
                    <p className="text-slate-500 mt-1">Audit-ready, MCA-compliant, and Schedule VII mapped CSR documentation</p>
                </div>
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
                    {userTier.toUpperCase()} Plan
                </Badge>
            </div>

            {/* Legal Disclaimer */}
            <Alert className="bg-amber-50 border-amber-200">
                <Shield className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-900 font-semibold">Important Legal Notice</AlertTitle>
                <AlertDescription className="text-xs text-amber-800">
                    All documents generated are drafts for reference only. Final CSR filings must be reviewed by qualified professionals and filed by authorized company representatives. This platform does not constitute legal or financial advice.
                </AlertDescription>
            </Alert>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-blue-50 border-blue-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-blue-700 font-medium">Total Disbursed (FY25)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900">₹2.4 Cr</div>
                        <p className="text-xs text-blue-600 mt-1">Across 8 Projects</p>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-green-700 font-medium">Utilization Certificates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900">92%</div>
                        <p className="text-xs text-green-600 mt-1">Submitted on time</p>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-amber-700 font-medium">Pending Audits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-900">1</div>
                        <p className="text-xs text-amber-600 mt-1">Deepalaya (Q2 Report)</p>
                    </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-purple-700 font-medium">Audit Readiness</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-900">{auditReadinessScore}%</div>
                        <p className="text-xs text-purple-600 mt-1">Compliance Score</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content: Document Catalog + Inputs Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Generate CSR Documents</h2>
                        <DocumentCatalog
                            userTier={userTier}
                            selectedDocuments={selectedDocuments}
                            onDocumentSelect={handleDocumentSelect}
                            onDocumentGenerate={handleDocumentGenerate}
                        />
                    </div>
                </div>

                <div>
                    <InputsPanel selectedDocumentIds={selectedDocuments} />
                </div>
            </div>

            {/* Schedule VII Mapping */}
            <Card>
                <CardHeader>
                    <CardTitle>Schedule VII Mapping</CardTitle>
                    <CardDescription>Expenditure breakdown by statutory categories (Companies Act, 2013)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span>(i) Eradicating hunger, poverty and malnutrition</span>
                            <span className="font-mono font-bold">₹12,00,000</span>
                        </div>
                        <Progress value={20} className="h-2" />

                        <div className="flex items-center justify-between text-sm pt-2">
                            <span>(ii) Promoting education and vocational skills</span>
                            <span className="font-mono font-bold">₹85,00,000</span>
                        </div>
                        <Progress value={65} className="h-2" />

                        <div className="flex items-center justify-between text-sm pt-2">
                            <span>(iv) Ensuring environmental sustainability</span>
                            <span className="font-mono font-bold">₹18,00,000</span>
                        </div>
                        <Progress value={30} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Document Input Modal */}
            <DocumentInputModal
                open={inputModalOpen}
                onClose={() => {
                    setInputModalOpen(false);
                    setCurrentDocument(null);
                }}
                document={currentDocument}
                selectedDocumentIds={selectedDocuments}
            />
        </div>
    );
}
