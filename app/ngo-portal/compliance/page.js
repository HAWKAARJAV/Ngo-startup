import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileCheck, AlertTriangle, Clock, History } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock User ID retrieval
const getMockUserId = async () => {
    const ngo = await prisma.nGO.findFirst({
        include: { user: true }
    });
    return ngo?.userId;
};

export default async function ComplianceOpsPage() {
    const userId = await getMockUserId();
    if (!userId) return <div>User not found</div>;

    const ngo = await prisma.nGO.findUnique({
        where: { userId },
        include: { documents: true }
    });

    if (!ngo) return <div>NGO Profile not found</div>;

    const docTypes = [
        { key: '12A', label: '12A Registration Certificate', validity: ngo.validity12A, verified: ngo.is12AVerified },
        { key: '80G', label: '80G Tax Exemption Certificate', validity: ngo.validity80G, verified: ngo.is80GVerified },
        { key: 'CSR1', label: 'MCA CSR-1 Form', validity: ngo.validityCSR1, verified: false }, // Logic pending for CSR1 verification field
        { key: 'FCRA', label: 'FCRA Renewal', validity: ngo.fcraRenewalDate, verified: ngo.fcraStatus },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Compliance Vault</h1>
                    <p className="text-slate-500">Manage your regulatory documents. Keep them fresh to unlock funding.</p>
                </div>
                <Button variant="outline" className="flex gap-2">
                    <History className="h-4 w-4" /> View Audit Logs
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {docTypes.map((doc) => {
                    const isExpired = doc.validity && new Date(doc.validity) < new Date();
                    const isMissing = !doc.validity;

                    return (
                        <Card key={doc.key} className={`border-l-4 shadow-sm ${doc.verified ? 'border-l-green-500' : 'border-l-amber-500'}`}>
                            <CardHeader className="bg-slate-50/50 pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-800">{doc.label}</CardTitle>
                                        <CardDescription className="text-xs font-mono text-slate-500 mt-1">DOC-ID: {doc.key}-{ngo.id.substring(0, 6)}</CardDescription>
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
                                        <AlertTriangle className="h-4 w-4" /> Expired on {new Date(doc.validity).toLocaleDateString()}.
                                    </div>
                                ) : (
                                    <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md flex gap-2 items-center">
                                        <FileCheck className="h-4 w-4" /> Valid until {new Date(doc.validity).toLocaleDateString()}.
                                    </div>
                                )}

                                <Separator />

                                {/* Action Area */}
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-slate-500">
                                        Last updated: {ngo.documents.find(d => d.docType === doc.key)?.status || 'Never'}
                                    </div>
                                    <Button size="sm" variant={isMissing || isExpired ? "default" : "secondary"}>
                                        <Upload className="h-4 w-4 mr-2" />
                                        {isMissing ? 'Upload New' : 'Renew'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Upload History Table Stub */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recent Compliance Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-slate-500 text-sm italic">
                        No recent upload activity recorded.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
