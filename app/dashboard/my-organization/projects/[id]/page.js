import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lock, Unlock, Upload, FileText, CheckCircle2, AlertTriangle, MapPin } from "lucide-react";

export default async function ProjectWorkbenchPage(props) {
    const params = await props.params;
    const { id } = params;

    // Fetch Project with Tranches
    const project = await prisma.project.findUnique({
        where: { id },
        include: { tranches: true }
    });

    if (!project) notFound();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
                    <p className="text-slate-500">Project Workbench • ID: {project.id.substring(0, 8)}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500">Total Grant</p>
                    <p className="text-2xl font-bold font-mono">₹{project.targetAmount.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid gap-6">
                <h2 className="text-xl font-bold text-slate-800">Funding Milestones (Tranches)</h2>

                {project.tranches.map((tranche, index) => {
                    const isLocked = tranche.status === 'LOCKED';
                    const isBlocked = tranche.isBlocked;
                    const canUnlock = isLocked && !isBlocked; // Logic: User can request unlock if not system blocked (or if block is just 'need evidence')

                    return (
                        <Card key={tranche.id} className={isLocked ? 'border-l-4 border-l-slate-300 bg-slate-50' : 'border-l-4 border-l-green-500 bg-white'}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left: Indicator */}
                                    <div className="flex flex-col items-center justify-center w-16 text-slate-400">
                                        {isLocked ? (
                                            <div className="bg-slate-200 p-3 rounded-full mb-2">
                                                <Lock className="h-6 w-6 text-slate-500" />
                                            </div>
                                        ) : (
                                            <div className="bg-green-100 p-3 rounded-full mb-2">
                                                <Unlock className="h-6 w-6 text-green-600" />
                                            </div>
                                        )}
                                        <span className="text-xs font-bold uppercase tracking-wide">Tranche {index + 1}</span>
                                    </div>

                                    {/* Middle: Details */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">₹{tranche.amount.toLocaleString()}</h3>
                                                <p className="text-slate-600">{tranche.unlockCondition}</p>
                                            </div>
                                            <Badge variant={isLocked ? "outline" : "default"} className={!isLocked ? "bg-green-600" : ""}>
                                                {tranche.status}
                                            </Badge>
                                        </div>

                                        {isBlocked && (
                                            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm flex items-start gap-2 border border-red-100">
                                                <AlertTriangle className="h-5 w-5 shrink-0" />
                                                <div>
                                                    <span className="font-bold">Funds Blocked:</span> Evidence Required.
                                                    <br />
                                                    Reason: {tranche.blockReason || "Proof of work pending."}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Section */}
                                        {isLocked && (
                                            <div className="bg-white border rounded-lg p-4 space-y-3">
                                                <h4 className="text-sm font-bold text-slate-700">Unlock Requirements</h4>

                                                <div className="flex items-center justify-between text-sm py-2 border-b">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <FileText className="h-4 w-4" /> Utilization Certificate (UC)
                                                    </div>
                                                    {tranche.proofDocUrl ? (
                                                        <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Uploaded</span>
                                                    ) : (
                                                        <Button size="sm" variant="outline">Generate & Upload</Button>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between text-sm py-2">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <MapPin className="h-4 w-4" /> Geo-Tagged Site Photo
                                                    </div>
                                                    {tranche.geoTag ? (
                                                        <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Verified</span>
                                                    ) : (
                                                        <Button size="sm" variant="outline">Upload Photo</Button>
                                                    )}
                                                </div>

                                                <Button className="w-full mt-2" disabled={!tranche.proofDocUrl && !tranche.geoTag}>
                                                    Request Release
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
