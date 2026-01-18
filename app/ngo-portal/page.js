import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, AlertTriangle, AlertCircle, ArrowRight, Wallet, Calendar, FileText } from "lucide-react";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

// Mock User ID retrieval - In real app, get from session
const getMockUserId = async () => {
    const ngo = await prisma.nGO.findFirst({
        include: { user: true }
    });
    return ngo?.userId;
};

export default async function CommandCenterPage() {
    // 1. Fetch Data
    const userId = await getMockUserId();

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

    ngo.projects.forEach(p => {
        p.tranches.forEach(t => {
            // Logic: Is Locked AND (Marked Blocked explicitly OR Release Requested but Locked)
            if (t.status === 'LOCKED' && (t.isBlocked || t.releaseRequested)) {
                fundingAtRisk += t.amount;
                blockedTranchesCount++;
            }
        });
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

    return (
        <div className="space-y-8">
            {/* 1. Header & Welcome */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Command Center</h1>
                    <p className="text-slate-500">Overview for {ngo.orgName}</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border shadow-sm">
                    <span className="text-sm font-medium text-slate-500">Last System Check:</span>
                    <span className="text-sm font-bold text-slate-900">
                        {ngo.lastComplianceCheck ? new Date(ngo.lastComplianceCheck).toLocaleDateString() : 'Never'}
                    </span>
                </div>
            </div>

            {/* 2. Top Widgets Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* TRUST SCORE WIDGET */}
                <Card className="border-l-4 border-l-blue-600 shadow-md">
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
                            <Link href="/dashboard/my-organization/trust-score" className="text-xs text-blue-600 hover:underline flex items-center mt-2">
                                View Breakdown &rarr;
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* FUNDING AT RISK WIDGET */}
                <Card className={`border-l-4 shadow-md ${fundingAtRisk > 0 ? 'border-l-red-500 bg-red-50/10' : 'border-l-green-500'}`}>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-slate-600">
                            <AlertTriangle className="h-4 w-4 text-amber-500" /> Funding at Risk
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold text-slate-900">
                            ₹{(fundingAtRisk / 100000).toFixed(2)} Lakhs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500 mb-3">
                            Currently blocked across <span className="font-bold text-slate-900">{blockedTranchesCount} tranches</span> due to missing evidence or reviews.
                        </p>
                        {fundingAtRisk > 0 && (
                            <Link href="/dashboard/my-organization/projects">
                                <Button size="sm" variant="destructive" className="w-full">
                                    Unblock Funds
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>

                {/* COMPLIANCE FRESHNESS WIDGET */}
                <Card className="border-l-4 border-l-amber-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription>Compliance Freshness</CardDescription>
                        <CardTitle className="text-2xl font-bold text-slate-800">
                            {isFresh ? 'All Systems Go' : 'Action Required'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">12A Cert</span>
                            {status12A === 'VALID' && <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Valid</Badge>}
                            {status12A === 'EXPIRING_SOON' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Expiring</Badge>}
                            {(status12A === 'EXPIRED' || status12A === 'MISSING') && <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Upload</Badge>}
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">80G Cert</span>
                            {status80G === 'VALID' && <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Valid</Badge>}
                            {status80G === 'EXPIRING_SOON' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Expiring</Badge>}
                            {(status80G === 'EXPIRED' || status80G === 'MISSING') && <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Upload</Badge>}
                        </div>
                        <Link href="/dashboard/my-organization/compliance" className="text-xs text-blue-600 hover:underline flex items-center justify-end">
                            Manage Docs &rarr;
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Action Ticker / Deadlines */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="text-blue-600 h-5 w-5" /> Upcoming Deadlines
                </h2>

                <div className="grid gap-4">
                    {/* Mock Deadline 1 */}
                    <Alert className="border-l-4 border-l-amber-500 bg-white shadow-sm">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        <div className="ml-2">
                            <AlertTitle className="text-slate-900 font-semibold">Q4 Utilization Certificate Due</AlertTitle>
                            <AlertDescription className="text-slate-600 flex justify-between w-full items-center mt-1">
                                <span>Project: "Safe Water for Bundelkhand" - Tranche #2</span>
                                <Button variant="outline" size="sm" className="ml-4">Submit Now</Button>
                            </AlertDescription>
                        </div>
                    </Alert>

                    {/* Mock Deadline 2 */}
                    <Alert className="border-l-4 border-l-blue-500 bg-white shadow-sm">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div className="ml-2">
                            <AlertTitle className="text-slate-900 font-semibold">FCRA Annual Return Filing</AlertTitle>
                            <AlertDescription className="text-slate-600 mt-1">
                                Due in 14 days. Please ensure your FC-4 form is ready.
                            </AlertDescription>
                        </div>
                    </Alert>
                </div>
            </section>
        </div>
    );
}
