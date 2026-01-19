import prisma from "@/lib/prisma";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Code, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function AdminAuditLogPage() {
    const logs = await prisma.adminAuditLog.findMany({
        include: { admin: true },
        orderBy: { timestamp: 'desc' },
        take: 100 // Limit for V1
    });

    return (
        <div className="space-y-8 text-neutral-100">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Audit Logs</h1>
                    <p className="text-neutral-400">Immutable record of all administrative interventions.</p>
                </div>
                <div className="w-[300px] relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                    <Input
                        placeholder="Search logs..."
                        className="pl-9 bg-neutral-900 border-neutral-800 text-neutral-100 focus:ring-blue-900"
                    />
                </div>
            </div>

            <div className="rounded-md border border-neutral-800 bg-neutral-900">
                <Table>
                    <TableHeader className="border-neutral-800">
                        <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
                            <TableHead className="text-neutral-400 w-[180px]">Timestamp</TableHead>
                            <TableHead className="text-neutral-400">Admin User</TableHead>
                            <TableHead className="text-neutral-400">Action Type</TableHead>
                            <TableHead className="text-neutral-400">Target Entity</TableHead>
                            <TableHead className="text-neutral-400">Metadata / Reason</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="border-neutral-800 hover:bg-neutral-800/50">
                                <TableCell className="font-mono text-xs text-neutral-500">
                                    {new Date(log.timestamp).toLocaleString('en-IN')}
                                </TableCell>
                                <TableCell className="font-medium text-neutral-300">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-500">
                                            {log.admin.name ? log.admin.name.charAt(0) : 'S'}
                                        </div>
                                        {log.admin.name || 'System Admin'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="border-blue-900 text-blue-400 bg-blue-950/20">
                                        {log.action}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-sm text-neutral-400">{log.targetEntity}</TableCell>
                                <TableCell className="text-xs text-neutral-500 font-mono truncate max-w-[300px]">
                                    {log.details}
                                </TableCell>
                            </TableRow>
                        ))}
                        {logs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-neutral-500">
                                    Audit log is pristine. No actions recorded.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
