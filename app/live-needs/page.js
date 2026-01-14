import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Target } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function LiveNeedsPage() {
    // Fetch all active projects
    const projects = await prisma.project.findMany({
        where: { status: "ACTIVE" },
        include: { ngo: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Live Funding Needs</h1>
                        <p className="text-slate-500">Real-time feed of verify NGO projects needing support.</p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => {
                        const percent = (project.raisedAmount / project.targetAmount) * 100;
                        const gap = project.targetAmount - project.raisedAmount;

                        return (
                            <Card key={project.id} className="hover:shadow-lg transition-all">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="mb-2">{project.sector}</Badge>
                                        <span className="text-xs font-bold text-slate-400">ID: {project.id.slice(0, 6)}</span>
                                    </div>
                                    <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                                    <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                                        <MapPin size={14} /> {project.location}
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">{project.description}</p>

                                    <div className="space-y-2 mt-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Raised: ₹{(project.raisedAmount / 1000).toFixed(0)}k</span>
                                            <span className="font-bold text-slate-900">Goal: ₹{(project.targetAmount / 1000).toFixed(0)}k</span>
                                        </div>
                                        <Progress value={percent} className="h-2" />
                                        <div className="flex justify-between items-center text-xs pt-1">
                                            <span className="text-red-500 font-medium">Gap: ₹{gap.toLocaleString()}</span>
                                            <span className="text-slate-400">{percent.toFixed(0)}% Funded</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-4 border-t bg-slate-50/50">
                                    <div className="flex justify-between items-center w-full">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                                                {project.ngo.orgName.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="text-xs">
                                                <div className="font-medium text-slate-900 truncate max-w-[100px]">{project.ngo.orgName}</div>
                                                <div className="text-slate-400">Verified NGO</div>
                                            </div>
                                        </div>
                                        <Button size="sm" className="bg-slate-900 text-white">
                                            Fund Now
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
