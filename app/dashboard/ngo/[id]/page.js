import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, MapPin, Globe, Mail, Phone, ShieldCheck, FileText, CheckCircle2, AlertCircle, Tag, User, Calendar, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TrustScoreBreakdown from "@/components/trust-score-breakdown";

export const dynamic = 'force-dynamic';

export default async function NGOProfilePage(props) {
    const params = await props.params;
    const { id } = params;

    const ngo = await prisma.nGO.findUnique({
        where: { id },
        include: {
            user: true,
            projects: true,
            documents: true
        }
    });

    if (!ngo) {
        notFound();
    }

    const initials = ngo.orgName.substring(0, 2).toUpperCase();
    const isVerified = ngo.is12AVerified && ngo.is80GVerified;

    // Derived/Mock Data for UI Requirements
    const targetAudience = ["Children", "Women", "Economically Weaker Sections"];
    const recentProjects = ngo.projects; // Keeping all as recent/active
    const upcomingProjects = []; // Mock empty for now

    return (
        <div className="space-y-6">
            <Link href="/dashboard/search" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-4">
                &larr; Back to Search
            </Link>

            {/* Header Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <Avatar className="h-24 w-24 rounded-xl border-4 border-slate-50">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${ngo.orgName}&background=0D8ABC&color=fff&size=128`} />
                        <AvatarFallback className="rounded-xl text-xl bg-slate-100">{initials}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                                    {ngo.orgName}
                                    {isVerified && <CheckCircle2 className="text-blue-500 h-6 w-6" />}
                                </h1>
                                <p className="text-slate-600 mt-2 text-lg leading-relaxed">
                                    {ngo.mission || "Mission statement not provided."}
                                </p>
                            </div>
                            <Button className="bg-slate-900 border-none">Donate Now</Button>
                        </div>

                        {/* TAGS SECTION: Location, Aim, Target Audience */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <Badge variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {ngo.city}, {ngo.state}
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1">
                                <Building2 className="h-3 w-3" /> {ngo.ngoType || 'TRUST'}
                            </Badge>
                            {/* Mocking Sector as Aim based on first project or NGO type */}
                            <Badge variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1">
                                <Tag className="h-3 w-3" /> {ngo.projects[0]?.sector || "Social Welfare"}
                            </Badge>

                            {targetAudience.map(aud => (
                                <Badge key={aud} variant="outline" className="px-3 py-1 text-sm border-slate-300 text-slate-600 flex items-center gap-1">
                                    <User className="h-3 w-3" /> {aud}
                                </Badge>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            {/* Main Content Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN: PROJECTS */}
                <div className="lg:col-span-2 space-y-8">

                    {/* RECENT PROJECTS */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" /> Recent Projects
                        </h2>
                        <div className="space-y-4">
                            {recentProjects.length > 0 ? (
                                recentProjects.map(project => (
                                    <Card key={project.id} className="overflow-hidden border-slate-200">
                                        <CardHeader className="bg-slate-50/50 pb-3">
                                            <div className="flex justify-between">
                                                <CardTitle className="text-lg text-slate-900">{project.title}</CardTitle>
                                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">{project.sector}</Badge>
                                            </div>
                                            <CardDescription className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {project.location}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <p className="text-slate-600 mb-6">{project.description}</p>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm font-medium text-slate-700">
                                                    <span>Raised: ₹{(project.raisedAmount / 100000).toFixed(2)} L</span>
                                                    <span>Goal: ₹{(project.targetAmount / 100000).toFixed(2)} L</span>
                                                </div>
                                                <Progress value={(project.raisedAmount / project.targetAmount) * 100} className="h-2" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-500 border rounded-lg bg-slate-50">
                                    No recently active projects.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* UPCOMING PROJECTS */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-600" /> Upcoming Projects
                        </h2>
                        {upcomingProjects.length > 0 ? (
                            <div className="space-y-4">
                                {/* Map upcoming projects here */}
                            </div>
                        ) : (
                            <Card className="border-dashed border-slate-300 bg-slate-50 shadow-none">
                                <CardContent className="flex flex-col items-center justify-center py-8 text-slate-500">
                                    <Calendar className="h-8 w-8 mb-2 opacity-20" />
                                    <p>No upcoming projects scheduled at the moment.</p>
                                </CardContent>
                            </Card>
                        )}
                    </section>

                </div>

                {/* RIGHT COLUMN: CONTACT & LEGAL */}
                <div className="space-y-6">
                    {/* CONTACT CARD */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50 border-b border-slate-100">
                            <CardTitle className="text-lg text-slate-800">Contact Details</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5 text-sm">
                            <div className="flex gap-3">
                                <Globe className="text-blue-600 h-5 w-5 shrink-0" />
                                <div>
                                    <div className="font-medium text-slate-900">Website</div>
                                    <a href={ngo.website || "#"} target="_blank" className="text-blue-600 hover:underline break-all">
                                        {ngo.website || "Not Available"}
                                    </a>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Mail className="text-blue-600 h-5 w-5 shrink-0" />
                                <div>
                                    <div className="font-medium text-slate-900">Email Address</div>
                                    <a href={`mailto:${ngo.user?.email}`} className="text-slate-600 hover:text-slate-900">
                                        {ngo.user?.email || "Email hidden"}
                                    </a>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Phone className="text-blue-600 h-5 w-5 shrink-0" />
                                <div>
                                    <div className="font-medium text-slate-900">Phone Number</div>
                                    <span className="text-slate-600">{ngo.mobile || "Not Provided"}</span>
                                </div>
                            </div>

                            {ngo.address && (
                                <div className="flex gap-3">
                                    <MapPin className="text-blue-600 h-5 w-5 shrink-0" />
                                    <div>
                                        <div className="font-medium text-slate-900">Registered Office</div>
                                        <span className="text-slate-600 block mt-1">
                                            {ngo.address}, {ngo.city}<br />
                                            {ngo.state} - {ngo.pincode}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {ngo.contactPerson && (
                                <div className="bg-blue-50 rounded-lg p-4 mt-2 border border-blue-100">
                                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Point of Contact</div>
                                    <div className="font-bold text-slate-900 text-lg">{ngo.contactPerson}</div>
                                    <div className="text-slate-600 text-sm">{ngo.designation}</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* STATS & LEGAL (Condensed) */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50 border-b border-slate-100">
                            <CardTitle className="text-lg text-slate-800">Trust & Compliance</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <TrustScoreBreakdown
                                score={ngo.trustScore}
                                breakdownJson={ngo.trustBreakdown}
                                expenseRatio={ngo.expenseRatio}
                            />

                            <div className="pt-4 border-t border-slate-100">
                                <div className="grid grid-cols-2 gap-2 text-center">
                                    <div className="bg-slate-50 p-2 rounded">
                                        <div className="text-xs text-slate-500">12A Verified</div>
                                        <div className="font-medium text-slate-900">{ngo.is12AVerified ? "Yes" : "No"}</div>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded">
                                        <div className="text-xs text-slate-500">80G Certified</div>
                                        <div className="font-medium text-slate-900">{ngo.is80GVerified ? "Yes" : "No"}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>

            {/* Floating Contact Bar */}
            <div className="fixed bottom-6 right-6 z-50">
                <Link href={`/dashboard/chat?ngoId=${id}`}>
                    <Button className="h-14 px-8 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold flex items-center gap-3 transition-all hover:scale-105 animate-in fade-in slide-in-from-bottom-10">
                        <MessageCircle className="h-6 w-6" />
                        Chat with {ngo.orgName}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
