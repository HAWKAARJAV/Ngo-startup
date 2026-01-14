import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, MapPin, Globe, Mail, Phone, ShieldCheck, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const dynamic = 'force-dynamic';

export default async function NGOProfilePage({ params }) {
    const { id } = params;

    const ngo = await prisma.nGO.findUnique({
        where: { id },
        include: {
            user: true,
            projects: true,
            documents: true
        }
    });

    if (!ngo) {
        notFound();
    }

    const initials = ngo.orgName.substring(0, 2).toUpperCase();
    const isVerified = ngo.is12AVerified && ngo.is80GVerified;

    return (
        <div className="space-y-6">
            <Link href="/dashboard/search" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-4">
                &larr; Back to Search
            </Link>

            {/* Header Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <Avatar className="h-24 w-24 rounded-xl border-4 border-slate-50">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${ngo.orgName}&background=0D8ABC&color=fff&size=128`} />
                        <AvatarFallback className="rounded-xl text-xl bg-slate-100">{initials}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                                    {ngo.orgName}
                                    {isVerified && <CheckCircle2 className="text-blue-500 h-6 w-6" />}
                                </h1>
                                <div className="flex items-center gap-4 text-slate-500 mt-1">
                                    <span className="flex items-center gap-1"><MapPin size={16} /> {ngo.city}, {ngo.state}</span>
                                    {ngo.website && <span className="flex items-center gap-1"><Globe size={16} /> {ngo.website}</span>}
                                    <span className="flex items-center gap-1"><Building2 size={16} /> {ngo.ngoType || 'TRUST'}</span>
                                </div>
                            </div>
                            <Button className="bg-slate-900 border-none">Donate Now</Button>
                        </div>

                        <p className="text-slate-600 max-w-3xl pt-2">
                            {ngo.mission || "Mission statement not provided."}
                        </p>

                        <div className="flex gap-2 pt-2">
                            {ngo.is12AVerified && <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">12A Registered</Badge>}
                            {ngo.is80GVerified && <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">80G Certified</Badge>}
                            {ngo.fcraStatus && <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">FCRA Compliant</Badge>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN: ABOUT & PROJECTS */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Trust Score</CardTitle></CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold flex items-baseline gap-1">
                                    {ngo.trustScore}/100
                                </div>
                                <Progress value={ngo.trustScore} className="h-2 mt-2" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Active Projects</CardTitle></CardHeader>
                            <CardContent><div className="text-2xl font-bold">{ngo.projects.length}</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Years Active</CardTitle></CardHeader>
                            <CardContent><div className="text-2xl font-bold">12+</div></CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="projects">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="projects">Active Projects</TabsTrigger>
                            <TabsTrigger value="impact">Impact Reports</TabsTrigger>
                        </TabsList>

                        <TabsContent value="projects" className="space-y-4 pt-4">
                            {ngo.projects.length > 0 ? (
                                ngo.projects.map(project => (
                                    <Card key={project.id}>
                                        <CardHeader>
                                            <div className="flex justify-between">
                                                <CardTitle className="text-lg">{project.title}</CardTitle>
                                                <Badge>{project.sector}</Badge>
                                            </div>
                                            <CardDescription>{project.location}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-slate-600 mb-4">{project.description}</p>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Raised: ₹{(project.raisedAmount / 100000).toFixed(2)} L</span>
                                                    <span>Goal: ₹{(project.targetAmount / 100000).toFixed(2)} L</span>
                                                </div>
                                                <Progress value={(project.raisedAmount / project.targetAmount) * 100} />
                                            </div>
                                        </CardContent>
                                        <CardDescription className="px-6 pb-4 flex justify-end">
                                            <Button variant="outline" size="sm">View Tranches</Button>
                                        </CardDescription>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-500 border rounded-lg bg-slate-50">
                                    No active projects listed yet.
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="impact">
                            <div className="text-center py-10 text-slate-500 border rounded-lg bg-slate-50">
                                Impact reports will be available once projects are completed.
                            </div>
                        </TabsContent>
                    </Tabs>

                </div>

                {/* RIGHT COLUMN: CONTACT & LEGAL */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <Mail className="text-slate-400 h-4 w-4" />
                                <span className="truncate">{ngo.user?.email || "Email hidden"}</span>
                            </div>
                            {ngo.mobile && (
                                <div className="flex items-center gap-3">
                                    <Phone className="text-slate-400 h-4 w-4" />
                                    <span>{ngo.mobile}</span>
                                </div>
                            )}
                            {ngo.address && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-slate-400 h-4 w-4 mt-1" />
                                    <span>{ngo.address}<br />{ngo.city}, {ngo.state} - {ngo.pincode}</span>
                                </div>
                            )}
                            {ngo.contactPerson && (
                                <div className="border-t pt-3 mt-2">
                                    <div className="text-xs text-slate-500">Contact Person</div>
                                    <div className="font-medium">{ngo.contactPerson}</div>
                                    <div className="text-xs text-slate-500">{ngo.designation}</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Legal & Compliance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center text-sm border-b pb-2">
                                <span className="text-slate-500">Reg. No.</span>
                                <span className="font-medium">{ngo.registrationNo || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b pb-2">
                                <span className="text-slate-500">PAN</span>
                                <span className="font-medium font-mono">{ngo.pan || "Protected"}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b pb-2">
                                <span className="text-slate-500">Darpan ID</span>
                                <span className="font-medium">{ngo.darpanId || "Pending"}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">CSR-1</span>
                                <span className="font-medium">{ngo.csr1Number || "Pending"}</span>
                            </div>

                            <div className="pt-4">
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Documents</h4>
                                <div className="space-y-2">
                                    {ngo.documents.length > 0 ? (
                                        ngo.documents.map(doc => (
                                            <div key={doc.id} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded">
                                                <span className="truncate max-w-[150px]">{doc.docType}</span>
                                                <Badge variant={doc.status === 'VERIFIED' ? 'default' : 'secondary'} className="text-[10px] px-1 h-5">
                                                    {doc.status}
                                                </Badge>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-slate-400 italic">No public documents available.</div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
