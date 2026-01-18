import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, Unlock, MapPin, ArrowRight, AlertTriangle } from "lucide-react";

const getMockUserId = async () => {
    const ngo = await prisma.nGO.findFirst({
        include: { user: true }
    });
    return ngo?.userId;
};

export default async function MyProjectsPage() {
    const userId = await getMockUserId();
    if (!userId) return <div>User not found</div>;

    const ngo = await prisma.nGO.findUnique({
        where: { userId },
        include: {
            projects: {
                include: { tranches: true }
            }
        }
    });

    if (!ngo) return <div>NGO Profile not found</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Project Execution</h1>
                    <p className="text-slate-500">Track milestones, upload evidence, and unlock funds.</p>
                </div>
                <Button>Create New Project</Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {ngo.projects.map((project) => {
                    const totalTranches = project.tranches.length;
                    const releasedTranches = project.tranches.filter(t => t.status === 'RELEASED').length;
                    const blockedTranches = project.tranches.filter(t => t.isBlocked && t.status === 'LOCKED').length;

                    return (
                        <Card key={project.id} className="relative overflow-hidden border-slate-200">
                            {/* Status Sidebar Strip */}
                            <div className={`absolute top-0 bottom-0 left-0 w-2 ${project.status === 'ACTIVE' ? 'bg-blue-500' : 'bg-slate-300'}`} />

                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    {/* Main Info */}
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h2 className="text-xl font-bold text-slate-900">{project.title}</h2>
                                            <Badge variant={project.status === 'ACTIVE' ? 'primary' : 'secondary'}>{project.status}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                                            <MapPin className="h-4 w-4" /> {project.location} • {project.sector}
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm font-medium">
                                                <span>Completion ({project.raisedAmount / project.targetAmount * 100}%)</span>
                                                <span>₹{project.raisedAmount.toLocaleString()} / ₹{project.targetAmount.toLocaleString()}</span>
                                            </div>
                                            <Progress value={(project.raisedAmount / project.targetAmount) * 100} className="h-2" />
                                        </div>
                                    </div>

                                    {/* Tranche Stats Box */}
                                    <div className="bg-slate-50 border-l border-slate-200 p-6 w-full md:w-64 flex flex-col justify-center space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600">Milestones</span>
                                            <span className="font-bold">{releasedTranches} / {totalTranches}</span>
                                        </div>

                                        {blockedTranches > 0 && (
                                            <div className="bg-red-100 text-red-800 text-xs px-3 py-2 rounded-md flex items-center gap-2">
                                                <Lock className="h-3 w-3" /> {blockedTranches} Tranche(s) Blocked
                                            </div>
                                        )}

                                        <Link href={`/dashboard/my-organization/projects/${project.id}`}>
                                            <Button size="sm" className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50">
                                                Manage Tranches <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {ngo.projects.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-xl">
                        <h3 className="text-lg font-medium text-slate-900">No Projects Found</h3>
                        <p className="text-slate-500 mb-4">Start your first project to receive funding.</p>
                        <Button>Create Project</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
