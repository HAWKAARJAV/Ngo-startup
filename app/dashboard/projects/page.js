import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, MapPin, ArrowRight, Sparkles } from "lucide-react";
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
                    <h1 className="text-3xl font-bold text-slate-900">All Projects</h1>
                    <p className="text-slate-500">Discover and fund NGO projects. Track progress and manage fund releases.</p>
                </div>
                {/* <Button>Add New Project</Button> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => {
                    const percent = (project.raisedAmount / project.targetAmount) * 100;
                    const isNew = project.isNewForCorporate === true;

                    return (
                        <Card 
                            key={project.id} 
                            className={`hover:shadow-lg transition-all relative overflow-hidden ${
                                isNew ? 'ring-2 ring-blue-400 ring-offset-2 shadow-lg shadow-blue-100' : ''
                            }`}
                        >
                            {/* New Project Highlight Banner */}
                            {isNew && (
                                <div className="absolute top-0 right-0 z-10">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-lg flex items-center gap-1 shadow-lg animate-pulse">
                                        <Sparkles size={12} />
                                        NEW
                                    </div>
                                </div>
                            )}
                            
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2 items-center">
                                        <Badge variant={(project.raisedAmount >= project.targetAmount) ? "default" : "outline"}
                                            className={(project.raisedAmount >= project.targetAmount) ? "bg-green-600" : ""}>
                                            {(project.raisedAmount >= project.targetAmount) ? "Fully Funded" : "Active"}
                                        </Badge>
                                        {isNew && (
                                            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                                Just Added
                                            </Badge>
                                        )}
                                    </div>
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
