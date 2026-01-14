"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronRight, UploadCloud } from "lucide-react";
import Link from "next/link";

const STEPS = [
    { id: 1, title: "Basic Identity", description: "Who are you?" },
    { id: 2, title: "Compliance Check", description: "The boring (but important) stuff" },
    { id: 3, title: "Impact Profile", description: "Sell your mission" },
];

export default function NGORegistrationWizard() {
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(33);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        orgName: "",
        registrationNo: "",
        email: "",
        city: "",
        state: "",
        mission: "",
        sector: "",
        budget: "",
        beneficiaries: ""
    });

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleNext = async () => {
        if (step < 3) {
            setStep(step + 1);
            setProgress(((step + 1) / 3) * 100);
        } else {
            // Final Submission
            setIsLoading(true);
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await res.json();

                if (data.success) {
                    alert("Application Submitted Successfully! Redirecting...");
                    window.location.href = "/dashboard";
                } else {
                    alert("Error: " + data.error);
                }
            } catch (error) {
                console.error(error);
                alert("Something went wrong. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            {/* Header */}
            <div className="w-full max-w-2xl mb-8 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">TC</div>
                    <span className="font-bold text-slate-900">NGO-CONNECT</span>
                </div>
                <div className="text-sm text-slate-500">Step {step} of 3</div>
            </div>

            <Card className="w-full max-w-2xl border-slate-200 shadow-xl">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-2xl">
                            {STEPS[step - 1].title}
                        </CardTitle>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                            Draft Saved
                        </Badge>
                    </div>
                    <CardDescription className="text-base">
                        {STEPS[step - 1].description}
                    </CardDescription>
                    <Progress value={progress} className="mt-4 h-2" />
                </CardHeader>

                <CardContent className="space-y-6 pt-6">

                    {/* STEP 1: BASICS */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Organization Name</Label>
                                    <Input
                                        value={formData.orgName}
                                        onChange={(e) => handleChange("orgName", e.target.value)}
                                        placeholder="e.g. Vidya Foundation"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Registration Number</Label>
                                    <Input
                                        value={formData.registrationNo}
                                        onChange={(e) => handleChange("registrationNo", e.target.value)}
                                        placeholder="Trust / Society No."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Official Email</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    placeholder="contact@ngo.org"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Select onValueChange={(val) => handleChange("city", val)}>
                                        <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="New Delhi">New Delhi</SelectItem>
                                            <SelectItem value="Mumbai">Mumbai</SelectItem>
                                            <SelectItem value="Bangalore">Bangalore</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>State</Label>
                                    <Input
                                        value={formData.state}
                                        onChange={(e) => handleChange("state", e.target.value)}
                                        placeholder="Delhi"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: COMPLIANCE */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex gap-3">
                                <div className="mt-0.5"><CheckCircle2 size={16} /></div>
                                <p>We check these against the Income Tax Department database automatically. Don't upload fake PDFs.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="border rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div>
                                        <div className="font-medium">12A Registration</div>
                                        <div className="text-xs text-slate-500">Proof of tax exemption status</div>
                                    </div>
                                    <Button variant="outline" size="sm" className="group-hover:border-blue-500 group-hover:text-blue-600">
                                        <UploadCloud className="mr-2 h-4 w-4" /> Upload PDF
                                    </Button>
                                </div>

                                <div className="border rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div>
                                        <div className="font-medium">80G Certificate</div>
                                        <div className="text-xs text-slate-500">Allows donors to claim tax benefits</div>
                                    </div>
                                    <Button variant="outline" size="sm" className="group-hover:border-blue-500 group-hover:text-blue-600">
                                        <UploadCloud className="mr-2 h-4 w-4" /> Upload PDF
                                    </Button>
                                </div>

                                <div className="border rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div>
                                        <div className="font-medium">CSR-1 Form</div>
                                        <div className="text-xs text-slate-500">Mandatory for corporate funding</div>
                                    </div>
                                    <Button variant="outline" size="sm" className="group-hover:border-blue-500 group-hover:text-blue-600">
                                        <UploadCloud className="mr-2 h-4 w-4" /> Upload PDF
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: IMPACT */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-2">
                                <Label>Mission Statement</Label>
                                <Textarea
                                    value={formData.mission}
                                    onChange={(e) => handleChange("mission", e.target.value)}
                                    placeholder="What is your 'Why'? Keep it under 200 words."
                                    className="h-24"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Primary Sector</Label>
                                    <Select onValueChange={(val) => handleChange("sector", val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Sector" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Education">Education</SelectItem>
                                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                                            <SelectItem value="Environment">Environment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Annual Budget (₹)</Label>
                                    <Input
                                        type="number"
                                        value={formData.budget}
                                        onChange={(e) => handleChange("budget", e.target.value)}
                                        placeholder="50,00,000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Target Beneficiaries (Count)</Label>
                                <Input
                                    type="number"
                                    value={formData.beneficiaries}
                                    onChange={(e) => handleChange("beneficiaries", e.target.value)}
                                    placeholder="e.g. 1000"
                                />
                                <p className="text-xs text-slate-500">This calculates your 'SROI' (Social Return on Investment).</p>
                            </div>
                        </div>
                    )}

                </CardContent>

                <CardFooter className="flex justify-between border-t p-6">
                    <Button
                        variant="ghost"
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1}
                    >
                        Back
                    </Button>
                    <Button
                        className="w-32 bg-slate-900 hover:bg-slate-800"
                        onClick={handleNext}
                        disabled={isLoading}
                    >
                        {isLoading ? "Submitting..." : (step === 3 ? "Complete" : "Next Step")}
                        {!isLoading && step !== 3 && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                </CardFooter>
            </Card>

            <div className="mt-8 text-center text-sm text-slate-500">
                Already registered? <Link href="/login" className="text-blue-600 hover:underline">Log in here</Link>
            </div>
        </div>
    );
}
