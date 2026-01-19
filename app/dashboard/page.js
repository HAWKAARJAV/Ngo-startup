import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Wallet, Users as UsersIcon, ArrowRight, Search, Bell, Clock, FileText } from "lucide-react";
import prisma from "@/lib/prisma";
import NeedsAttentionCard from "@/components/dashboard/needs-attention-card";
import ImpactMap from "@/components/dashboard/impact-map";
import ImpactReportGenerator from "@/components/dashboard/impact-report-generator";
import EcosystemFeed from "@/components/dashboard/ecosystem-feed";
import ActionInbox from "@/components/action-inbox";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // 1. Fetch Corporate Data (Simulating logged-in user 'csr@techgiant.com')
    const corporate = await prisma.corporate.findFirst({
        where: { user: { email: 'csr@techgiant.com' } },
        include: { user: true }
    });

    // 2. Fetch Stats
    const totalNgos = await prisma.nGO.count();
    const verifiedNgos = await prisma.nGO.count({ where: { is12AVerified: true, is80GVerified: true } });
    const activeProjectsCount = await prisma.project.count({ where: { status: 'ACTIVE' } });
    
    // Pending tranche requests
    const pendingTrancheRequests = await prisma.tranche.count({
        where: { 
            releaseRequested: true,
            status: { notIn: ['RELEASED', 'DISBURSED'] },
            isBlocked: false
        }
    });

    // Pending document uploads
    const pendingDocUploads = await prisma.documentRequest.count({
        where: { status: 'PENDING' }
    });

    // 3. Fetch "Needs Attention" Projects (Mocking logic: all active projects for now)
    const activeProjects = await prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { ngo: true }
    });

    // Fetch recent notifications for this user
    const userId = corporate?.userId;

    // Calculations
    const budget = corporate?.csrBudget || 0;
    // Calculate actual utilized from released tranches
    const releasedTranches = await prisma.tranche.aggregate({
        where: { status: { in: ['RELEASED', 'DISBURSED'] } },
        _sum: { amount: true }
    });
    const utilized = releasedTranches._sum.amount || 0;
    const utilizedPercentage = budget > 0 ? Math.round((utilized / budget) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Welcome Banner with Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl">
                <div>
                    <h1 className="text-2xl font-bold">Welcome back, {corporate?.user?.name || 'Corporate Admin'}</h1>
                    <p className="text-blue-100 mt-1">
                        {pendingTrancheRequests > 0 
                            ? `You have ${pendingTrancheRequests} tranche request${pendingTrancheRequests > 1 ? 's' : ''} pending approval`
                            : 'All caught up! No pending actions today.'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50" asChild>
                        <Link href="/dashboard/discover">
                            <Search className="h-4 w-4 mr-2" />
                            Discover NGOs
                        </Link>
                    </Button>
                    <Button variant="ghost" className="text-white border border-white/30 hover:bg-white/10" asChild>
                        <Link href="/dashboard/reports">
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Report
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CSR Budget Utilized</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{(utilized / 10000000).toFixed(1)} Cr <span className="text-sm text-muted-foreground font-normal">/ ₹{(budget / 10000000).toFixed(1)} Cr</span></div>
                        <Progress value={utilizedPercentage} className="mt-2 h-2" />
                        <p className="text-xs text-muted-foreground mt-2">{utilizedPercentage}% of annual mandate disbursed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeProjectsCount}</div>
                        <p className="text-xs text-muted-foreground mt-2">{totalNgos} NGO partners</p>
                    </CardContent>
                </Card>

                <Card className={pendingTrancheRequests > 0 ? 'border-amber-300 bg-amber-50' : ''}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <Clock className={`h-4 w-4 ${pendingTrancheRequests > 0 ? 'text-amber-600' : 'text-muted-foreground'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${pendingTrancheRequests > 0 ? 'text-amber-700' : ''}`}>{pendingTrancheRequests}</div>
                        <p className="text-xs text-muted-foreground mt-2">Tranche release requests</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Compliance Health</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">98%</div>
                        <p className="text-xs text-muted-foreground mt-2">{verifiedNgos}/{totalNgos} partners verified</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Action Inbox + Projects */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Action Inbox */}
                    {userId && (
                        <ActionInbox 
                            userId={userId} 
                            userRole="CORPORATE"
                            maxItems={5}
                        />
                    )}

                    {/* Needs Attention Projects */}
                    <NeedsAttentionCard initialProjects={activeProjects} />
                </div>

                {/* Right: Map, Feed & AI */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Live Ecosystem Feed */}
                    <EcosystemFeed />

                    {/* Live Impact Map */}
                    <ImpactMap />

                    <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                AI Scout <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">BETA</Badge>
                            </CardTitle>
                            <CardDescription className="text-blue-100">
                                Based on your CSR mandate, we found these new matches.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium">Clean Yamuna Project</h4>
                                    <span className="text-xs font-bold text-green-300">96% Match</span>
                                </div>
                                <p className="text-xs text-blue-100 mb-3">Matches your focus on 'Water Conservation' and 'Delhi NCR'. Verified 80G.</p>
                                <Button size="sm" className="w-full bg-white text-blue-700 hover:bg-blue-50" asChild>
                                    <Link href="/dashboard/discover">View Profile</Link>
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button variant="link" className="text-blue-100 hover:text-white p-0" asChild>
                                <Link href="/dashboard/discover">
                                    See all AI recommendations <ArrowRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}


