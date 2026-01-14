"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CorporateRegistrationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        role: "CORPORATE",
        companyName: "",
        industry: "",
        email: "",
        csrBudget: "",
        mandateAreas: ""
    });

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                // In a real app, maybe redirect to email verification or dashboard
                router.push('/dashboard');
            } else {
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg border-slate-200 shadow-xl">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                            <Building2 size={20} />
                        </div>
                        <CardTitle className="text-2xl">Corporate Registration</CardTitle>
                    </div>
                    <CardDescription>
                        Create an account to manage your CSR mandate and find verified partners.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                id="companyName"
                                placeholder="Tech Giant India Pvt Ltd"
                                required
                                value={formData.companyName}
                                onChange={(e) => handleChange("companyName", e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Select onValueChange={(val) => handleChange("industry", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Technology">Technology</SelectItem>
                                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                        <SelectItem value="Finance">Finance</SelectItem>
                                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                                        <SelectItem value="Retail">Retail</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Official Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="csr@company.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="csrBudget">Annual CSR Budget (INR)</Label>
                            <Input
                                id="csrBudget"
                                type="number"
                                placeholder="e.g. 50000000"
                                required
                                value={formData.csrBudget}
                                onChange={(e) => handleChange("csrBudget", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mandateAreas">Focus Areas (Mandate)</Label>
                            <Input
                                id="mandateAreas"
                                placeholder="Education, Environment, Healthcare..."
                                required
                                value={formData.mandateAreas}
                                onChange={(e) => handleChange("mandateAreas", e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 border-t px-6 py-4">
                        <Button className="w-full bg-slate-900 hover:bg-black" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                        <div className="text-center text-sm text-slate-500">
                            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
