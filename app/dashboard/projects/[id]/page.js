import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ComplianceDashboard from "@/components/compliance/compliance-dashboard";
import CorporateTrancheManager from "@/components/corporate-tranche-manager";
import AuditTrail from "@/components/audit-trail";
import { ArrowLeft, Building2, MapPin, MessageCircle, FileText, Shield, TrendingUp, Wallet, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { getProjectComplianceDocs } from "@/app/actions/compliance-actions";

export const dynamic = 'force-dynamic';

// Get actual logged-in user's corporate profile
const getSessionCorporate = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (token) {
        try {
            const session = JSON.parse(token);
            const corporate = await prisma.corporate.findUnique({
                where: { userId: session.id }
            });
            return corporate;
        } catch (e) {
            console.error('Error parsing session token:', e);
        }
    }
    return null;
};

export default async function ProjectDetailsPage({ params }) {
    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            ngo: {
                include: { user: true }
            },
            tranches: {
                orderBy: { status: 'asc' }
            },
            donations: true
        }
    });

    if (!project) notFound();

    // Fetch Compliance Docs
    const complianceRes = await getProjectComplianceDocs(id);
    const complianceDocs = complianceRes.success ? complianceRes.data : [];

    // Get logged-in corporate user
    const corporate = await getSessionCorporate();
    
    // Get chat room if exists
    const chatRoom = corporate ? await prisma.chatRoom.findFirst({
        where: {
            corporateId: corporate.id,
            ngoId: project.ngoId
        }
    }) : null;

    // Corporate view
    const isCorporate = true;
    const isNgo = false; // Corporate users should not see NGO upload controls

    const percentFunded = (project.raisedAmount / project.targetAmount) * 100;
    const pendingRequests = project.tranches.filter(t => t.releaseRequested && t.status !== 'RELEASED').length;
    const blockedTranches = project.tranches.filter(t => t.isBlocked).length;
    const releasedAmount = project.tranches.filter(t => t.status === 'RELEASED' || t.status === 'DISBURSED').reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <div className="flex justify-between items-center">
                <Link href="/dashboard/projects" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
                    <ArrowLeft size={16} /> Back to Projects
                </Link>
                <div className="flex gap-2">
                    {chatRoom && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/chat?room=${chatRoom.id}`}>
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Chat with NGO
                            </Link>
                        </Button>
                    )}
                    <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Alert for Pending Actions */}
            {pendingRequests > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <div>
                        <p className="font-semibold text-amber-800">Action Required</p>
                        <p className="text-sm text-amber-700">
                            {pendingRequests} tranche release request(s) pending your approval
                        </p>
                    </div>
                    <Button size="sm" className="ml-auto bg-amber-600 hover:bg-amber-700">
                        Review Now
                    </Button>
                </div>
            )}

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Total Budget</p>
                                <p className="text-2xl font-bold text-blue-900">₹{(project.targetAmount / 100000).toFixed(1)}L</p>
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
                <Card className={`bg-gradient-to-br ${pendingRequests > 0 ? 'from-amber-50 to-amber-100/50 border-amber-200' : 'from-slate-50 to-slate-100/50 border-slate-200'}`}>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">Pending Requests</p>
                                <p className={`text-2xl font-bold ${pendingRequests > 0 ? 'text-amber-900' : 'text-slate-900'}`}>{pendingRequests}</p>
                            </div>
                            <AlertTriangle className={`h-8 w-8 ${pendingRequests > 0 ? 'text-amber-400' : 'text-slate-300'}`} />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Trust Score</p>
                                <p className="text-2xl font-bold text-purple-900">{project.ngo.trustScore || 85}</p>
                            </div>
                            <Shield className="h-8 w-8 text-purple-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Project & Tranches */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Project Overview Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline">{project.sector}</Badge>
                                        <Badge className={project.status === 'ACTIVE' ? "bg-green-100 text-green-700" : "bg-slate-100"}>
                                            {project.status}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <Building2 size={14} /> {project.ngo.orgName}
                                        <span className="text-slate-300">|</span>
                                        <MapPin size={14} /> {project.location}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 mb-6">{project.description}</p>

                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-600">Fund Utilization</span>
                                    <span className="font-bold text-slate-900">{percentFunded.toFixed(0)}%</span>
                                </div>
                                <Progress value={percentFunded} className="h-3" />
                                <div className="flex justify-between text-xs text-slate-500 mt-2">
                                    <span>Released: ₹{(releasedAmount).toLocaleString()}</span>
                                    <span>Total: ₹{(project.targetAmount).toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tranche Management - Corporate View */}
                    <CorporateTrancheManager 
                        tranches={project.tranches}
                        projectId={id}
                        projectTitle={project.title}
                        ngoName={project.ngo.orgName}
                    />

                    {/* Compliance Dashboard */}
                    <div id="compliance-section">
                        <ComplianceDashboard
                            projectId={id}
                            projectDocs={complianceDocs}
                            isCorporate={isCorporate}
                            isNgo={isNgo}
                            corporateId={corporate?.id}
                            ngoId={project.ngoId}
                        />
                    </div>
                </div>

                {/* Right: NGO Context & Actions */}
                <div className="space-y-6">
                    {/* NGO Partner Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Implementation Partner</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
                                    {project.ngo.orgName.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-semibold">{project.ngo.orgName}</div>
                                    <div className="text-xs text-slate-500">{project.ngo.city}, {project.ngo.state}</div>
                                </div>
                            </div>

                            {/* Compliance Status */}
                            <div className="space-y-2 pt-2 border-t">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">12A Status</span>
                                    {project.ngo.is12AVerified ? (
                                        <Badge className="bg-green-100 text-green-700">Verified</Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-700">Pending</Badge>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">80G Status</span>
                                    {project.ngo.is80GVerified ? (
                                        <Badge className="bg-green-100 text-green-700">Verified</Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-700">Pending</Badge>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">FCRA Status</span>
                                    {project.ngo.fcraStatus ? (
                                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                                    ) : (
                                        <Badge className="bg-slate-100 text-slate-600">N/A</Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" className="flex-1" asChild>
                                    <Link href={`/dashboard/ngo/${project.ngoId}`}>View Profile</Link>
                                </Button>
                                {chatRoom && (
                                    <Button className="flex-1" asChild>
                                        <Link href={`/dashboard/chat?room=${chatRoom.id}`}>
                                            <MessageCircle className="h-4 w-4 mr-2" />
                                            Chat
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href={`/dashboard/documents?project=${id}`}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Request Documents
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Shield className="h-4 w-4 mr-2" />
                                Run Compliance Check
                            </Button>
                            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Flag Issue
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Audit Trail - Real Data */}
                    <AuditTrail 
                        projectId={id} 
                        ngoId={project.ngoId}
                        maxHeight="350px"
                    />
                </div>
            </div>
        </div>
    );
}
