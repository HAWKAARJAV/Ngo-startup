import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ProjectsListPage() {
    // Mock user context: Corporate
    const projects = await prisma.project.findMany({
        where: { status: 'ACTIVE' }, // In real app, filter by corporateId match in donations
        include: { ngo: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
                    <p className="text-slate-500">Track progress and manage fund releases.</p>
                </div>
                {/* <Button>Add New Project</Button> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => {
                    const percent = (project.raisedAmount / project.targetAmount) * 100;

                    return (
                        <Card key={project.id} className="hover:shadow-md transition-all">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant={(project.raisedAmount >= project.targetAmount) ? "default" : "outline"}
                                        className={(project.raisedAmount >= project.targetAmount) ? "bg-green-600" : ""}>
                                        {(project.raisedAmount >= project.targetAmount) ? "Fully Funded" : "Active"}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs bg-slate-100">{project.sector}</Badge>
                                </div>
                                <CardTitle className="leading-tight text-lg">
                                    <Link href={`/dashboard/projects/${project.id}`} className="hover:underline hover:text-blue-600">
                                        {project.title}
                                    </Link>
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                                    <Building2 size={12} /> {project.ngo.orgName}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Disbursed</span>
                                        <span className="font-bold">₹{(project.raisedAmount / 1000).toFixed(0)}k <span className="text-slate-400 font-normal">/ {(project.targetAmount / 1000).toFixed(0)}k</span></span>
                                    </div>
                                    <Progress value={percent} className="h-2" />

                                    <div className="pt-4 flex justify-between items-center">
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <MapPin size={12} /> {project.location}
                                        </div>
                                        <Link href={`/dashboard/projects/${project.id}`}>
                                            <Button size="sm" variant="outline" className="h-8 text-xs">
                                                Manage Tranches <ArrowRight size={12} className="ml-1" />
                                            </Button>
                                        </Link>
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
