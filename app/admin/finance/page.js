import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Prevent static prerendering - requires database at runtime
export const dynamic = 'force-dynamic';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Wallet, Lock, Unlock, AlertOctagon } from "lucide-react";

export default async function AdminFinancePage() {
    const tranches = await prisma.tranche.findMany({
        include: { project: { include: { ngo: true } } },
        orderBy: { id: 'desc' }
    });

    const totalCommitted = tranches.reduce((sum, t) => sum + t.amount, 0);
    const totalReleased = tranches.filter(t => t.status === 'RELEASED').reduce((sum, t) => sum + t.amount, 0);
    const totalLocked = totalCommitted - totalReleased;

    return (
        <div className="space-y-8 text-neutral-100">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fund Control</h1>
                    <p className="text-neutral-400">Master Ledger & Escrow Management.</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-neutral-400">Total Committed Funds</CardDescription>
                        <CardTitle className="text-3xl font-bold text-white">₹{(totalCommitted / 100000).toFixed(2)} L</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-neutral-400">Released to NGOs</CardDescription>
                        <CardTitle className="text-3xl font-bold text-green-500">₹{(totalReleased / 100000).toFixed(2)} L</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-neutral-400">Currently in Escrow (Locked)</CardDescription>
                        <CardTitle className="text-3xl font-bold text-amber-500">₹{(totalLocked / 100000).toFixed(2)} L</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Ledger Table */}
            <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-white">Transaction Ledger</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="border-neutral-800">
                            <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
                                <TableHead className="text-neutral-400">Project / NGO</TableHead>
                                <TableHead className="text-neutral-400">Amount</TableHead>
                                <TableHead className="text-neutral-400">Tranche Condition</TableHead>
                                <TableHead className="text-neutral-400">Status</TableHead>
                                <TableHead className="text-neutral-400">Block Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tranches.map((t) => (
                                <TableRow key={t.id} className="border-neutral-800 hover:bg-neutral-800/50">
                                    <TableCell className="font-medium text-neutral-200">
                                        <div className="flex flex-col">
                                            <span>{t.project.title}</span>
                                            <span className="text-xs text-neutral-500">{t.project.ngo.orgName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>₹{t.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-sm text-neutral-400">{t.unlockCondition}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={t.status === 'RELEASED' ? 'border-green-800 text-green-500 bg-green-950/30' : 'border-neutral-700 text-neutral-400 bg-neutral-900'}>
                                            {t.status === 'RELEASED' ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                                            {t.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {t.isBlocked && t.status === 'LOCKED' ? (
                                            <div className="flex items-center gap-1 text-red-400 text-xs">
                                                <AlertOctagon className="h-3 w-3" />
                                                BLOCKED: {t.blockReason || 'Manual Admin Block'}
                                            </div>
                                        ) : (
                                            <span className="text-neutral-600">-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
