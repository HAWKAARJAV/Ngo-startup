"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">CSR Ledger & Reports</h1>
                    <p className="text-slate-500">Audit-ready documentation and Schedule VII mapping.</p>
                </div>
                <Button className="bg-slate-900 gap-2">
                    <Download size={16} /> Download All (Q3 FY25)
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-blue-50 border-blue-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-blue-700 font-medium">Total Disbursed (FY25)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900">₹2.4 Cr</div>
                        <p className="text-xs text-blue-600 mt-1">Across 8 Projects</p>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-green-700 font-medium">Utilization Certificates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900">92%</div>
                        <p className="text-xs text-green-600 mt-1">Submitted on time</p>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-amber-700 font-medium">Pending Audits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-900">1</div>
                        <p className="text-xs text-amber-600 mt-1">Deepalaya (Q2 Report)</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Generated Audit Packs</CardTitle>
                    <CardDescription>One-click downloads for your finance team and external auditors.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Report Name</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <FileText className="text-slate-400" size={16} /> CSR Annual Filing (Form CSR-2)
                                </TableCell>
                                <TableCell>FY 2024-25</TableCell>
                                <TableCell>Regulatory</TableCell>
                                <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ready</Badge></TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-8"><Download size={14} /></Button></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <FileText className="text-slate-400" size={16} /> Impact Assessment Report
                                </TableCell>
                                <TableCell>Q3 FY25</TableCell>
                                <TableCell>Internal</TableCell>
                                <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ready</Badge></TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-8"><Download size={14} /></Button></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <FileText className="text-slate-400" size={16} /> Utilization Certificates (Batch)
                                </TableCell>
                                <TableCell>Nov 2025</TableCell>
                                <TableCell>Financial</TableCell>
                                <TableCell><Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Processing</Badge></TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-8" disabled><Clock size={14} /></Button></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Schedule VII Mapping</CardTitle>
                    <CardDescription>Expenditure breakdown by statutory categories (Companies Act, 2013).</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span>(i) Eradicating hunger, poverty and malnutrition</span>
                            <span className="font-mono font-bold">₹12,00,000</span>
                        </div>
                        <Progress value={20} className="h-2" />

                        <div className="flex items-center justify-between text-sm pt-2">
                            <span>(ii) Promoting education and vocational skills</span>
                            <span className="font-mono font-bold">₹85,00,000</span>
                        </div>
                        <Progress value={65} className="h-2" />

                        <div className="flex items-center justify-between text-sm pt-2">
                            <span>(iv) Ensuring environmental sustainability</span>
                            <span className="font-mono font-bold">₹18,00,000</span>
                        </div>
                        <Progress value={30} className="h-2" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
