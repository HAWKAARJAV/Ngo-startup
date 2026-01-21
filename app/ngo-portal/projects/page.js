import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, Unlock, MapPin, ArrowRight, AlertTriangle, Target, TrendingUp, Calendar } from "lucide-react";

// Get actual logged-in user ID from session cookie
const getSessionUserId = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (token) {
        try {
            const session = JSON.parse(token);
            return session.id;
        } catch (e) {
            console.error('Error parsing session token:', e);
        }
    }
    return null;
};

export default async function MyProjectsPage() {
    const userId = await getSessionUserId();
    if (!userId) return <div>User not found. Please log in.</div>;

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 -m-6 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                            Project Execution
                        </h1>
                        <p className="text-slate-600 flex items-center gap-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            Track milestones, upload evidence, and unlock funds.
                        </p>
                    </div>
                    <Link href="/ngo-portal/projects/new">
                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:scale-105">
                            Create New Project
                        </Button>
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Total Projects</p>
                                <p className="text-2xl font-bold text-slate-900">{ngo.projects.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Unlock className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Active</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {ngo.projects.filter(p => p.status === 'ACTIVE').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Needs Attention</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {ngo.projects.reduce((acc, p) => acc + p.tranches.filter(t => t.isBlocked).length, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {ngo.projects.map((project, index) => {
                        const totalTranches = project.tranches.length;
                        const releasedTranches = project.tranches.filter(t => t.status === 'RELEASED').length;
                        const blockedTranches = project.tranches.filter(t => t.isBlocked && t.status === 'LOCKED').length;
                        const completionPercentage = (project.raisedAmount / project.targetAmount) * 100;

                        return (
                            <Card 
                                key={project.id} 
                                className="group relative overflow-hidden border-slate-200 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                            >
                                {/* Gradient Accent Bar */}
                                <div className={`absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b ${
                                    project.status === 'ACTIVE' 
                                        ? 'from-blue-400 via-blue-600 to-blue-800' 
                                        : 'from-slate-300 via-slate-400 to-slate-500'
                                } group-hover:w-2 transition-all duration-300`} />

                                {/* Subtle Background Pattern */}
                                <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-500 to-purple-500" />

                                <CardContent className="p-0 relative">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Main Info */}
                                        <div className="p-6 flex-1">
                                            <div className="flex justify-between items-start mb-3">
                                                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
                                                    {project.title}
                                                </h2>
                                                <Badge 
                                                    variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}
                                                    className={`${
                                                        project.status === 'ACTIVE' 
                                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm' 
                                                            : ''
                                                    } transition-all duration-300`}
                                                >
                                                    {project.status}
                                                </Badge>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-slate-600 text-sm mb-6">
                                                <MapPin className="h-4 w-4 text-blue-500" /> 
                                                <span className="font-medium">{project.location}</span>
                                                <span className="text-slate-400">•</span>
                                                <span className="text-slate-500">{project.sector}</span>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600 font-medium flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                                        Project Progress
                                                    </span>
                                                    <span className="font-bold text-blue-700">
                                                        {completionPercentage.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <Progress 
                                                    value={completionPercentage} 
                                                    className="h-2.5 bg-slate-100 shadow-inner"
                                                />
                                                <div className="flex justify-between text-xs text-slate-500">
                                                    <span>₹{project.raisedAmount.toLocaleString()}</span>
                                                    <span>₹{project.targetAmount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tranche Stats Box */}
                                        <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 border-l border-slate-200 p-6 w-full md:w-72 flex flex-col justify-center space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 font-medium flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-blue-600" />
                                                    Milestones
                                                </span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold text-blue-700">{releasedTranches}</span>
                                                    <span className="text-slate-500">/ {totalTranches}</span>
                                                </div>
                                            </div>

                                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${(releasedTranches / totalTranches) * 100}%` }}
                                                />
                                            </div>

                                            {blockedTranches > 0 && (
                                                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-800 text-xs px-3 py-2.5 rounded-lg flex items-center gap-2 shadow-sm animate-pulse">
                                                    <Lock className="h-3.5 w-3.5" /> 
                                                    <span className="font-semibold">{blockedTranches} Tranche(s) Blocked</span>
                                                </div>
                                            )}

                                            <Link href={`/ngo-portal/projects/${project.id}`}>
                                                <Button 
                                                    size="sm" 
                                                    className="w-full bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white shadow-sm hover:shadow-lg transition-all duration-300 group/btn"
                                                >
                                                    Manage Tranches 
                                                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {ngo.projects.length === 0 && (
                        <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
                            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Target className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Projects Found</h3>
                            <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                Start your first project to receive funding and make an impact.
                            </p>
                            <Link href="/ngo-portal/projects/new">
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                    Create Your First Project
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
