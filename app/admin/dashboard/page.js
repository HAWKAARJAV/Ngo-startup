import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Building2,
    AlertTriangle,
    ShieldAlert,
    Wallet,
    ArrowUpRight,
    Activity
} from "lucide-react";
import Link from 'next/link';
import { Separator } from "@/components/ui/separator";

export default async function AdminDashboardPage() {
    // 1. Fetch Key Metrics
    const ngoStats = await prisma.nGO.groupBy({
        by: ['systemStatus'],
        _count: { id: true }
    });

    const totalNgos = ngoStats.reduce((acc, curr) => acc + curr._count.id, 0);
    const suspendedNgos = ngoStats.find(s => s.systemStatus === 'SUSPENDED')?._count.id || 0;
    const activeNgos = ngoStats.find(s => s.systemStatus === 'ACTIVE')?._count.id || 0;

    const corporateCount = await prisma.corporate.count();

    // Mock Financials (As schema just updated, real data might be sparse)
    const totalFunds = await prisma.tranche.aggregate({
        _sum: { amount: true }
    });

    // Recent Critical Logs (Mock for now until we seed logs)
    const recentLogs = await prisma.adminAuditLog.findMany({
        take: 5,
        orderBy: { timestamp: 'desc' },
        include: { admin: true }
    });

    return (
        <div className="space-y-8 text-neutral-100">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Cockpit</h1>
                    <p className="text-neutral-400">Real-time oversight of the NGO Connect ecosystem.</p>
                </div>
                <Badge variant="outline" className="border-green-800 text-green-500 bg-green-950/30 px-3 py-1 animate-pulse">
                    <Activity className="h-3 w-3 mr-2" /> SYSTEM OPERATIONAL
                </Badge>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* 1. NGO Health */}
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-neutral-400">Total NGOs</CardDescription>
                        <CardTitle className="text-3xl font-bold text-white">{totalNgos}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm flex gap-3 mt-1">
                            <span className="text-green-500 font-medium">{activeNgos} Active</span>
                            <span className="text-red-500 font-medium">{suspendedNgos} Suspended</span>
                        </div>
                        <Link href="/admin/ngos" className="text-xs text-blue-400 hover:text-blue-300 flex items-center mt-3">
                            View Registry <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Link>
                    </CardContent>
                </Card>

                {/* 2. Corporate Partners */}
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-neutral-400">Designated Partners</CardDescription>
                        <CardTitle className="text-3xl font-bold text-white">{corporateCount}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-neutral-500 mt-1">
                            Across 12 Industries
                        </div>
                        <Link href="/admin/corporates" className="text-xs text-blue-400 hover:text-blue-300 flex items-center mt-3">
                            Manage Partners <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Link>
                    </CardContent>
                </Card>

                {/* 3. Funds Pipeline */}
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-neutral-400">Total Pipeline Value</CardDescription>
                        <CardTitle className="text-3xl font-bold text-white">
                            ₹{((totalFunds._sum.amount || 0) / 100000).toFixed(2)} L
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm flex gap-3 mt-1 text-neutral-500">
                            Commitments across all projects
                        </div>
                        <Link href="/admin/finance" className="text-xs text-blue-400 hover:text-blue-300 flex items-center mt-3">
                            Audit Ledger <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Link>
                    </CardContent>
                </Card>

                {/* 4. Risk / Alerts */}
                <Card className="bg-red-950/10 border-red-900/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-red-400 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Active Breaches
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold text-red-500">0</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-red-400/80 mt-1">
                            Compliance violations requiring intervention.
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Second Row: Audit Stream & Map (Stub) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Audit Stream */}
                <Card className="lg:col-span-2 bg-neutral-900 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-blue-500" /> Recent Administrative Actions
                        </CardTitle>
                        <CardDescription className="text-neutral-400">Live feed of all Super Admin interventions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentLogs.length > 0 ? (
                            <div className="space-y-4">
                                {recentLogs.map((log) => (
                                    <div key={log.id} className="flex gap-4 items-start border-b border-neutral-800 pb-4 last:border-0 last:pb-0">
                                        <div className="h-8 w-8 rounded bg-neutral-800 flex items-center justify-center text-xs font-mono text-neutral-400 shrink-0">
                                            SA
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">
                                                <span className="text-blue-400">{log.action}</span> on {log.targetEntity}
                                            </div>
                                            <div className="text-xs text-neutral-500 mt-1">
                                                {new Date(log.timestamp).toLocaleString()} • {log.details}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-neutral-600 italic">
                                No administrative actions recorded in the last 24 hours.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions Panel */}
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="p-3 rounded border border-neutral-700 hover:bg-neutral-800 cursor-pointer transition-colors">
                            <div className="font-medium text-white">New NGO Review</div>
                            <div className="text-xs text-neutral-500">Start verification for pending applications</div>
                        </div>
                        <div className="p-3 rounded border border-neutral-700 hover:bg-neutral-800 cursor-pointer transition-colors">
                            <div className="font-medium text-white">Generate Weekly Report</div>
                            <div className="text-xs text-neutral-500">Export PDF summary for board</div>
                        </div>
                        <div className="p-3 rounded border border-red-900/50 hover:bg-red-900/20 cursor-pointer transition-colors">
                            <div className="font-medium text-red-400">Emergency Stop</div>
                            <div className="text-xs text-red-500/70">Pause all fund disbursals immediately</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
