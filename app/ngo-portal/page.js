import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Prevent static prerendering - requires database at runtime
export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, AlertTriangle, AlertCircle, ArrowRight, Wallet, Calendar, FileText, MessageCircle, TrendingUp, DollarSign, Upload, Building2 } from "lucide-react";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import ActionInbox from "@/components/action-inbox";
import { cookies } from "next/headers";

// Get actual logged-in user ID from session cookie
const getSessionUserId = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (token) {
        try {
            const session = JSON.parse(token);
            return session.id;
        } catch (e) {
            console.error('Error parsing session token:', e);
        }
    }
    return null;
};

export default async function CommandCenterPage() {
    // 1. Fetch Data - Get actual logged-in user's NGO
    const userId = await getSessionUserId();

    if (!userId) {
        return <div className="p-10">No NGO accounts found. Please seed the database.</div>;
    }

    const ngo = await prisma.nGO.findUnique({
        where: { userId },
        include: {
            projects: {
                include: { tranches: true }
            },
            documents: true
        }
    });

    if (!ngo) return <div>NGO Profile not found.</div>;

    // 2. Compute Metrics
    // A. Funding At Risk (Blocked Tranches)
    let fundingAtRisk = 0;
    let blockedTranchesCount = 0;
    let totalGranted = 0;
    let totalReleased = 0;
    let pendingApproval = 0;

    ngo.projects.forEach(p => {
        p.tranches.forEach(t => {
            totalGranted += t.amount;
            
            // Logic: Is Locked AND (Marked Blocked explicitly OR Release Requested but Locked)
            if (t.status === 'LOCKED' && (t.isBlocked || t.releaseRequested)) {
                fundingAtRisk += t.amount;
                blockedTranchesCount++;
            }
            
            if (t.status === 'RELEASED' || t.status === 'DISBURSED') {
                totalReleased += t.amount;
            }
            
            if (t.releaseRequested && t.status !== 'RELEASED' && t.status !== 'DISBURSED' && !t.isBlocked) {
                pendingApproval += t.amount;
            }
        });
    });

    // Count pending document requests
    const pendingDocRequests = await prisma.documentRequest.count({
        where: { ngoId: ngo.id, status: 'PENDING' }
    });

    // Count unread messages
    const chatRooms = await prisma.chatRoom.findMany({
        where: { ngoId: ngo.id },
        include: { messages: { where: { senderRole: 'CORPORATE' }, orderBy: { createdAt: 'desc' }, take: 5 } }
    });

    // B. Compliance Freshness Logic
    const today = new Date();
    const expiryThreshold = 60 * 24 * 60 * 60 * 1000; // 60 days

    const checkExpiry = (date) => {
        if (!date) return 'MISSING';
        const validUnil = new Date(date);
        const diff = validUnil - today;
        if (diff < 0) return 'EXPIRED';
        if (diff < expiryThreshold) return 'EXPIRING_SOON';
        return 'VALID';
    };

    const status12A = checkExpiry(ngo.validity12A);
    const status80G = checkExpiry(ngo.validity80G);
    const statusFCRA = checkExpiry(ngo.fcraRenewalDate); // Using existing field for now

    const isFresh = status12A === 'VALID' && status80G === 'VALID';
    const urgentTasks = (pendingDocRequests > 0 ? 1 : 0) + (blockedTranchesCount > 0 ? 1 : 0) + (!isFresh ? 1 : 0);

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-xl">
                <div>
                    <h1 className="text-2xl font-bold">Welcome back, {ngo.orgName}</h1>
                    <p className="text-emerald-100 mt-1">
                        {urgentTasks > 0 
                            ? `You have ${urgentTasks} urgent task${urgentTasks > 1 ? 's' : ''} requiring attention`
                            : 'All caught up! Your compliance is in good standing.'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50" asChild>
                        <Link href="/ngo-portal/projects">
                            <FileText className="h-4 w-4 mr-2" />
                            View Projects
                        </Link>
                    </Button>
                    <Button variant="ghost" className="text-white border border-white/30 hover:bg-white/10" asChild>
                        <Link href="/ngo-portal/chat">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Messages
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Total Granted</p>
                                <p className="text-2xl font-bold text-emerald-900">₹{(totalGranted / 100000).toFixed(1)}L</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-emerald-400" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Released</p>
                                <p className="text-2xl font-bold text-green-900">₹{(totalReleased / 100000).toFixed(1)}L</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card className={`bg-gradient-to-br ${pendingApproval > 0 ? 'from-amber-50 to-amber-100/50 border-amber-200' : 'from-slate-50 to-slate-100/50 border-slate-200'}`}>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Pending Approval</p>
                                <p className={`text-2xl font-bold ${pendingApproval > 0 ? 'text-amber-900' : 'text-slate-900'}`}>₹{(pendingApproval / 100000).toFixed(1)}L</p>
                            </div>
                            <Wallet className={`h-8 w-8 ${pendingApproval > 0 ? 'text-amber-400' : 'text-slate-300'}`} />
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Trust Score</p>
                                <p className="text-2xl font-bold text-blue-900">{ngo.trustScore}</p>
                            </div>
                            <ShieldCheck className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Action Inbox + Projects */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Action Inbox */}
                    <ActionInbox 
                        userId={userId} 
                        userRole="NGO"
                        maxItems={5}
                    />

                    {/* Funding At Risk Alert */}
                    {fundingAtRisk > 0 && (
                        <Alert className="border-l-4 border-l-red-500 bg-red-50">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <AlertTitle className="text-red-800 font-semibold">Funding at Risk: ₹{(fundingAtRisk / 100000).toFixed(2)} Lakhs</AlertTitle>
                            <AlertDescription className="text-red-700 flex justify-between items-center mt-1">
                                <span>Currently blocked across {blockedTranchesCount} tranches due to missing evidence or reviews.</span>
                                <Button size="sm" variant="destructive" asChild>
                                    <Link href="/ngo-portal/projects">Unblock Funds</Link>
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Upcoming Deadlines */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                Upcoming Deadlines
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start justify-between">
                                <div className="flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-slate-900">Q4 Utilization Certificate Due</p>
                                        <p className="text-sm text-slate-600">Project: "Safe Water for Bundelkhand" - Tranche #2</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline">Submit</Button>
                            </div>
                            
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start justify-between">
                                <div className="flex gap-3">
                                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-slate-900">FCRA Annual Return Filing</p>
                                        <p className="text-sm text-slate-600">Due in 14 days. Please ensure your FC-4 form is ready.</p>
                                    </div>
                                </div>
                                <Badge variant="outline">14 days</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Trust Score, Compliance, Quick Actions */}
                <div className="space-y-6">
                    {/* Trust Score Card */}
                    <Card className="border-l-4 border-l-blue-600">
                        <CardHeader className="pb-2">
                            <CardDescription>Current Trust Score</CardDescription>
                            <CardTitle className="text-4xl font-extrabold text-blue-700 flex items-center gap-2">
                                {ngo.trustScore}
                                <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">/ 900</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Risk Level</span>
                                    <span className="font-semibold text-green-600">Low Risk</span>
                                </div>
                                <Progress value={(ngo.trustScore / 900) * 100} className="h-2 bg-slate-100" />
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Link href="/ngo-portal/trust-score" className="text-sm text-blue-600 hover:underline flex items-center">
                                View Breakdown <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Compliance Freshness Card */}
                    <Card className={`border-l-4 ${isFresh ? 'border-l-green-500' : 'border-l-amber-500'}`}>
                        <CardHeader className="pb-2">
                            <CardDescription>Compliance Freshness</CardDescription>
                            <CardTitle className="text-xl font-bold text-slate-800">
                                {isFresh ? 'All Systems Go ✓' : 'Action Required'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">12A Certificate</span>
                                {status12A === 'VALID' && <Badge className="bg-green-100 text-green-700">Valid</Badge>}
                                {status12A === 'EXPIRING_SOON' && <Badge className="bg-amber-100 text-amber-700">Expiring</Badge>}
                                {(status12A === 'EXPIRED' || status12A === 'MISSING') && <Badge className="bg-red-100 text-red-700">Upload</Badge>}
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">80G Certificate</span>
                                {status80G === 'VALID' && <Badge className="bg-green-100 text-green-700">Valid</Badge>}
                                {status80G === 'EXPIRING_SOON' && <Badge className="bg-amber-100 text-amber-700">Expiring</Badge>}
                                {(status80G === 'EXPIRED' || status80G === 'MISSING') && <Badge className="bg-red-100 text-red-700">Upload</Badge>}
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">FCRA Status</span>
                                {statusFCRA === 'VALID' && <Badge className="bg-green-100 text-green-700">Active</Badge>}
                                {statusFCRA === 'EXPIRING_SOON' && <Badge className="bg-amber-100 text-amber-700">Renew Soon</Badge>}
                                {(statusFCRA === 'EXPIRED' || statusFCRA === 'MISSING') && <Badge className="bg-slate-100 text-slate-600">N/A</Badge>}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/ngo-portal/compliance">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Manage Documents
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/ngo-portal/corporates">
                                    <Building2 className="h-4 w-4 mr-2" />
                                    Discover Corporate Funders
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/ngo-portal/projects">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Request Tranche Release
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/ngo-portal/compliance">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Documents
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/ngo-portal/chat">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Contact Funder
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
