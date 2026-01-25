import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Prevent static prerendering - requires database at runtime
export const dynamic = 'force-dynamic';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Ban, CheckCircle, Shield, FileText, History, Gavel } from "lucide-react";

export default async function AdminNgoDetailPage(props) {
    const params = await props.params;
    const { id } = params;

    const ngo = await prisma.nGO.findUnique({
        where: { id },
        include: {
            user: true,
            documents: true,
            projects: true
        }
    });

    if (!ngo) notFound();

    return (
        <div className="space-y-8 text-neutral-100">
            {/* Header / Identity Action Bar */}
            <div className="flex justify-between items-start bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                <div className="flex gap-6">
                    <div className="h-20 w-20 rounded-full bg-blue-900/50 flex items-center justify-center text-2xl font-bold text-blue-400 border border-blue-800">
                        {ngo.orgName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{ngo.orgName}</h1>
                            <Badge variant="outline" className="border-neutral-600">ID: {ngo.id.substring(0, 8)}</Badge>
                        </div>
                        <p className="text-neutral-400 mt-1 flex items-center gap-2">
                            {ngo.city}, {ngo.state} • Reg No: {ngo.registrationNo || 'N/A'}
                        </p>
                        <div className="flex gap-2 mt-3">
                            <Badge variant="outline" className={ngo.systemStatus === 'ACTIVE' ? 'border-green-800 text-green-500 bg-green-950/30' : 'border-red-800 text-red-500 bg-red-950/30'}>
                                {ngo.systemStatus}
                            </Badge>
                            <Badge variant="outline" className="border-blue-800 text-blue-500 bg-blue-950/30">
                                Trust Score: {ngo.trustScore}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {ngo.systemStatus === 'ACTIVE' ? (
                        <Button variant="destructive" className="bg-red-900/80 hover:bg-red-900 text-red-100 border border-red-800">
                            <Ban className="h-4 w-4 mr-2" /> Suspend Entity
                        </Button>
                    ) : (
                        <Button className="bg-green-700 hover:bg-green-800 text-white">
                            <CheckCircle className="h-4 w-4 mr-2" /> Reactivate Entity
                        </Button>
                    )}
                    <Button variant="outline" className="border-neutral-700 hover:bg-neutral-800 text-neutral-300">
                        <History className="h-4 w-4 mr-2" /> View Audit Logs
                    </Button>
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="compliance" className="space-y-6">
                <TabsList className="bg-neutral-900 border border-neutral-800 text-neutral-400">
                    <TabsTrigger value="compliance">Compliance & Docs</TabsTrigger>
                    <TabsTrigger value="risk">Risk & Trust Score</TabsTrigger>
                    <TabsTrigger value="financials">Financials & Funds</TabsTrigger>
                </TabsList>

                {/* COMPLIANCE TAB */}
                <TabsContent value="compliance" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-neutral-900 border-neutral-800">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Document Vault</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {ngo.documents.length > 0 ? (
                                    ngo.documents.map(doc => (
                                        <div key={doc.id} className="flex justify-between items-center p-3 border border-neutral-800 rounded bg-neutral-950/50">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <div className="font-medium text-neutral-200">{doc.docType}</div>
                                                    <div className="text-xs text-neutral-500">Last updated: {doc.status}</div>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-950/20">
                                                Invalidate
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-neutral-500 text-sm italic">No documents uploaded.</div>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="bg-neutral-900 border-neutral-800">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Regulatory Expiry</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm items-center border-b border-neutral-800 pb-3">
                                    <span className="text-neutral-400">12A Certificate</span>
                                    <span className="font-mono text-neutral-200">{ngo.validity12A ? new Date(ngo.validity12A).toLocaleDateString('en-IN') : 'MISSING'}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center border-b border-neutral-800 pb-3">
                                    <span className="text-neutral-400">80G Certificate</span>
                                    <span className="font-mono text-neutral-200">{ngo.validity80G ? new Date(ngo.validity80G).toLocaleDateString('en-IN') : 'MISSING'}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-neutral-400">FCRA Renewal</span>
                                    <span className="font-mono text-neutral-200">{ngo.fcraRenewalDate ? new Date(ngo.fcraRenewalDate).toLocaleDateString('en-IN') : 'MISSING'}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* RISK TAB */}
                <TabsContent value="risk" className="space-y-6">
                    <Card className="bg-neutral-900 border-neutral-800">
                        <CardHeader>
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <Gavel className="h-5 w-5 text-amber-500" /> Administrative Override
                            </CardTitle>
                            <CardDescription className="text-neutral-400">
                                Manually adjust the Trust Score. This action will be logged in the immutable audit trail.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-4">
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium text-neutral-300">New Score (0-900)</label>
                                    <input
                                        type="number"
                                        className="flex h-10 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:border-blue-500 focus:outline-none"
                                        placeholder="Enter value..."
                                    />
                                </div>
                                <div className="space-y-2 flex-[2]">
                                    <label className="text-sm font-medium text-neutral-300">Reason for Override (Mandatory)</label>
                                    <input
                                        type="text"
                                        className="flex h-10 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:border-blue-500 focus:outline-none"
                                        placeholder="e.g., Pending legal case found in public records..."
                                    />
                                </div>
                                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                                    Apply Override
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
