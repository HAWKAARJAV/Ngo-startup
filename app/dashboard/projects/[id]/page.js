import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SmartTrancheList from "@/components/smart-tranche-list";
import ComplianceDashboard from "@/components/compliance/compliance-dashboard";
import { ArrowLeft, Building2, MapPin, Wallet } from "lucide-react";
import Link from "next/link";
import { getProjectComplianceDocs } from "@/app/actions/compliance-actions";

export const dynamic = 'force-dynamic';

export default async function ProjectDetailsPage({ params }) {
    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            ngo: true,
            tranches: {
                orderBy: { status: 'asc' } // Hacky order
            }
        }
    });

    if (!project) notFound();

    // Fetch Compliance Docs
    const complianceRes = await getProjectComplianceDocs(id);
    const complianceDocs = complianceRes.success ? complianceRes.data : [];

    // Mocking the "Corporate View" since we are the funder
    const isCorporate = true;
    const isNgo = true; // Enabled both for demo purposes so user can test both flows

    const percentFunded = (project.raisedAmount / project.targetAmount) * 100;

    return (
        <div className="space-y-6">
            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Project Context */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline">{project.sector}</Badge>
                                        <Badge className={project.status === 'ACTIVE' ? "bg-green-100 text-green-700" : "bg-slate-100"}>
                                            {project.status}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <Building2 size={14} /> {project.ngo.orgName}
                                        <span className="text-slate-300">|</span>
                                        <MapPin size={14} /> {project.location}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500 mb-1">Project Aim</h3>
                                    <p className="text-slate-900 font-medium">To provide sustainable livelihood training to 500 women in rural India.</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500 mb-1">Target Audience</h3>
                                    <p className="text-slate-900 font-medium">Women aged 18-35 in BPL households.</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500 mb-1">Fund Needed</h3>
                                    <p className="text-slate-900 font-medium">₹{(project.targetAmount).toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500 mb-1">Expected Impact</h3>
                                    <p className="text-slate-900 font-medium">50% increase in household income within 6 months.</p>
                                </div>
                            </div>

                            <h3 className="font-semibold mb-2">About the Project</h3>
                            <p className="text-slate-600 mb-6">{project.description}</p>

                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-600">Fund Utilization</span>
                                    <span className="font-bold text-slate-900">{percentFunded.toFixed(0)}%</span>
                                </div>
                                <Progress value={percentFunded} className="h-3" />
                                <div className="flex justify-between text-xs text-slate-500 mt-2">
                                    <span>Disbursed: ₹{(project.raisedAmount / 1000).toFixed(0)}k</span>
                                    <span>Total Budget: ₹{(project.targetAmount / 1000).toFixed(0)}k</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* NEW: Compliance Dashboard */}
                    <div id="compliance-section">
                        <ComplianceDashboard
                            projectId={id}
                            projectDocs={complianceDocs}
                            isCorporate={isCorporate}
                            isNgo={isNgo}
                        />
                    </div>


                </div>

                {/* Right: NGO Context */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Implementation Partner</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                                    {project.ngo.orgName.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-semibold">{project.ngo.orgName}</div>
                                    <div className="text-xs text-slate-500">Joined 2024</div>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/dashboard/ngo/${project.ngoId}`}>View Full Profile</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
