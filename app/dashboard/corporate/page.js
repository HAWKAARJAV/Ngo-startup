import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Save } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function CorporateProfilePage() {
    // Mock user fetching
    const userEmail = 'csr@techgiant.com';
    const corporate = await prisma.corporate.findFirst({
        where: { user: { email: userEmail } }
    }) || {
        companyName: "TechGiant Industries",
        industry: "Technology",
        csrBudget: 50000000,
        mandateAreas: "Education, Skilling, Environment"
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                    <Building2 size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Corporate Profile</h1>
                    <p className="text-slate-500">Manage your organization's CSR details and mandate.</p>
                </div>
            </div>

            <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="details">Company Details</TabsTrigger>
                    <TabsTrigger value="team">Team & Roles</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization Information</CardTitle>
                            <CardDescription>
                                Used to auto-fill grant contracts and verify statutory compliance.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input defaultValue={corporate.companyName} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Industry Sector</Label>
                                    <Input defaultValue={corporate.industry} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Annual CSR Budget (INR)</Label>
                                    <Input defaultValue={corporate.csrBudget} type="number" />
                                </div>
                                <div className="space-y-2">
                                    <Label>CIN Number</Label>
                                    <Input defaultValue="L17110MH1973PLC019786" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>CSR Mandate Areas</Label>
                                <Textarea defaultValue={corporate.mandateAreas} className="h-24" />
                                <p className="text-xs text-slate-500">
                                    Separate key focus areas with commas. AI Scout uses this to find matches.
                                </p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button className="bg-slate-900">
                                    <Save size={16} className="mr-2" /> Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="team">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Management</CardTitle>
                            <CardDescription>
                                Invite colleagues to manage tranches and verify reports.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                                <p>Team management features coming soon.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
