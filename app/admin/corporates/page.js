import prisma from "@/lib/prisma";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Ban, CheckCircle } from "lucide-react";

export default async function AdminCorporateRegistryPage() {
    const corporates = await prisma.corporate.findMany({
        include: { user: true }
    });

    return (
        <div className="space-y-8 text-neutral-100">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Donor Registry</h1>
                    <p className="text-neutral-400">Manage Corporate partners and funding pipelines.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Invite Corporate</Button>
            </div>

            <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-white">Partners ({corporates.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="border-neutral-800">
                            <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
                                <TableHead className="text-neutral-400">Company Name</TableHead>
                                <TableHead className="text-neutral-400">Industry</TableHead>
                                <TableHead className="text-neutral-400">CSR Budget</TableHead>
                                <TableHead className="text-neutral-400">System Status</TableHead>
                                <TableHead className="text-right text-neutral-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {corporates.map((corp) => (
                                <TableRow key={corp.id} className="border-neutral-800 hover:bg-neutral-800/50">
                                    <TableCell className="font-medium text-neutral-200">
                                        <div className="flex flex-col">
                                            <span>{corp.companyName}</span>
                                            <span className="text-xs text-neutral-500">{corp.user?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{corp.industry}</TableCell>
                                    <TableCell>₹{(corp.csrBudget / 10000000).toFixed(2)} Cr</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={corp.systemStatus === 'ACTIVE' ? 'border-green-800 text-green-500 bg-green-950/30' : 'border-red-800 text-red-500 bg-red-950/30'}>
                                            {corp.systemStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="ghost" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                                            Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {corporates.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-neutral-500">
                                        No Corporate Partners found.
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
