import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Wallet, Users as UsersIcon } from "lucide-react";
import prisma from "@/lib/prisma";
import NeedsAttentionCard from "@/components/dashboard/needs-attention-card";
import ImpactMap from "@/components/dashboard/impact-map";
import ImpactReportGenerator from "@/components/dashboard/impact-report-generator";

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

    // 3. Fetch "Needs Attention" Projects (Mocking logic: all active projects for now)
    const activeProjects = await prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { ngo: true }
    });

    // Calculations
    const budget = corporate?.csrBudget || 0;
    // Mock utilized amount for demo
    const utilized = 24000000; // 2.4 Cr
    const utilizedPercentage = Math.round((utilized / budget) * 100) || 0;

    return (
        <div className="space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalNgos} <span className="text-sm text-muted-foreground font-normal">NGOs</span></div>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">{verifiedNgos} Verified</Badge>
                            <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-50">{totalNgos - verifiedNgos} Pending</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Compliance Health</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">98% <span className="text-sm text-muted-foreground font-normal">Score</span></div>
                        <p className="text-xs text-muted-foreground mt-2">1 critical update required by Vidya Trust</p>
                    </CardContent>
                </Card>
            </div>

            {/* Dashboard Actions Row */}
            <div className="flex justify-end">
                <ImpactReportGenerator />
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Funding Tranches */}
                <div className="lg:col-span-2 space-y-6">
                    <NeedsAttentionCard initialProjects={activeProjects} />
                </div>

                {/* Right: Map & AI */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Live Impact Map */}
                    <ImpactMap />

                    <Card className="bg-primary text-primary-foreground border-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                AI Scout <Badge className="bg-background/20 hover:bg-background/30 text-white border-0">BETA</Badge>
                            </CardTitle>
                            <CardDescription className="text-primary-foreground/80">
                                Based on your CSR mandate, we found these new matches.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-background/10 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium">Clean Yamuna Project</h4>
                                    <span className="text-xs font-bold text-green-300">96% Match</span>
                                </div>
                                <p className="text-xs text-primary-foreground/70 mb-3">Matches your focus on 'Water Conservation' and 'Delhi NCR'. Verified 80G.</p>
                                <Button size="sm" className="w-full bg-background text-primary hover:bg-background/90">View Profile</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


