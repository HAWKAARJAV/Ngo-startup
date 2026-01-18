import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Eye, ShieldAlert, CheckCircle2, Ban } from "lucide-react";

export default async function AdminNgoRegistryPage() {
    const ngos = await prisma.nGO.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'text-green-500 bg-green-950/30 border-green-900';
            case 'SUSPENDED': return 'text-red-500 bg-red-950/30 border-red-900';
            case 'BLACKLISTED': return 'text-neutral-300 bg-neutral-800 border-neutral-700'; // Grey/Black
            default: return 'text-amber-500 bg-amber-950/30 border-amber-900'; // Under Review / Pending
        }
    };

    return (
        <div className="space-y-8 text-neutral-100">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">NGO Registry</h1>
                    <p className="text-neutral-400">Master database of all registered entities.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">Export CSV</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Legacy NGO</Button>
                </div>
            </div>

            <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-white">Entities ({ngos.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="border-neutral-800">
                            <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
                                <TableHead className="text-neutral-400">Organization Name</TableHead>
                                <TableHead className="text-neutral-400">Type</TableHead>
                                <TableHead className="text-neutral-400">Location</TableHead>
                                <TableHead className="text-neutral-400">Trust Score</TableHead>
                                <TableHead className="text-neutral-400">System Status</TableHead>
                                <TableHead className="text-right text-neutral-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ngos.map((ngo) => (
                                <TableRow key={ngo.id} className="border-neutral-800 hover:bg-neutral-800/50">
                                    <TableCell className="font-medium text-neutral-200">
                                        <div className="flex flex-col">
                                            <span>{ngo.orgName}</span>
                                            <span className="text-xs text-neutral-500">{ngo.user?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{ngo.ngoType}</TableCell>
                                    <TableCell>{ngo.city}, {ngo.state}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold ${ngo.trustScore > 700 ? 'text-green-500' : ngo.trustScore > 400 ? 'text-amber-500' : 'text-red-500'}`}>
                                                {ngo.trustScore}
                                            </span>
                                            {/* Flag icon if score is low */}
                                            {ngo.trustScore < 400 && <ShieldAlert className="h-3 w-3 text-red-500" />}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(ngo.systemStatus)}>
                                            {ngo.systemStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/ngos/${ngo.id}`}>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {ngos.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-neutral-500">
                                        No NGOs found in the registry.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
