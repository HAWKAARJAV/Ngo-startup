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
import { CheckCircle2, ChevronRight, UploadCloud, ArrowLeft, Loader2, Building, FileText, IndianRupee } from "lucide-react";
import Link from "next/link";

const STEPS = [
    { id: 1, title: "Basic Information", description: "Identity & Contact Details" },
    { id: 2, title: "Address & Legal", description: "Location & Registration Type" },
    { id: 3, title: "Documentation", description: "Verify your authenticity" },
    { id: 4, title: "CSR & FCRA", description: "Funding Compliance" },
    { id: 5, title: "Impact Profile", description: "Mission & Beneficiaries" },
];

export default function NGORegistrationWizard() {
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    // Mock upload state
    const [uploadedFiles, setUploadedFiles] = useState({});

    const [formData, setFormData] = useState({
        // Section 1
        orgName: "",
        email: "",
        contactPerson: "",
        designation: "",
        mobile: "",
        website: "",
        ngoType: "TRUST", // TRUST, SOCIETY, SECTION_8

        // Section 2
        registrationNo: "",
        address: "",
        city: "",
        state: "",
        pincode: "",

        // Section 3 (Docs - URLs mocked)

        // Section 4
        pan: "",
        darpanId: "",
        csr1Number: "",
        fcraStatus: false,

        // Section 5
        mission: "",
        sector: "",
        budget: "",
    });

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleFileUpload = (field) => {
        // Simulate upload delay
        setTimeout(() => {
            setUploadedFiles(prev => ({ ...prev, [field]: true }));
        }, 800);
    };

    const handleNext = async () => {
        if (step < 5) {
            const nextStep = step + 1;
            setStep(nextStep);
            setProgress((nextStep / 5) * 100);
            window.scrollTo(0, 0);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    role: 'NGO'
                })
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
    };

    const renderFileUpload = (label, fieldId, required = true) => (
        <div className="border rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div>
                <div className="font-medium flex items-center gap-2">
                    {label} {required && <span className="text-red-500">*</span>}
                    {uploadedFiles[fieldId] && <CheckCircle2 className="text-green-600 h-4 w-4" />}
                </div>
                <div className="text-xs text-slate-500">PDF, JPG or PNG (Max 5MB)</div>
            </div>
            <Button
                variant={uploadedFiles[fieldId] ? "outline" : "default"}
                size="sm"
                className={uploadedFiles[fieldId] ? "border-green-500 text-green-700 bg-green-50" : ""}
                onClick={() => handleFileUpload(fieldId)}
            >
                {uploadedFiles[fieldId] ? "Uploaded" : <><UploadCloud className="mr-2 h-4 w-4" /> Upload</>}
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-10">
            {/* Header */}
            <div className="w-full max-w-3xl mb-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">NC</div>
                    <div>
                        <div className="font-bold text-slate-900">NGO Connect</div>
                        <div className="text-xs text-slate-500">Official Registration Portal</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600">Step {step} of 5</div>
                    <div className="text-xs text-slate-400">{STEPS[step - 1].title}</div>
                </div>
            </div>

            <Card className="w-full max-w-3xl border-slate-200 shadow-xl">
                <CardHeader className="bg-slate-50/50 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl mb-2">{STEPS[step - 1].title}</CardTitle>
                            <CardDescription className="text-base">{STEPS[step - 1].description}</CardDescription>
                        </div>
                        <Building className="text-slate-200 h-12 w-12" />
                    </div>
                    <Progress value={progress} className="mt-6 h-2" />
                </CardHeader>

                <CardContent className="space-y-6 pt-8 px-8 min-h-[400px]">

                    {/* SECTION 1: BASIC INFO */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label>NGO Name <span className="text-red-500">*</span></Label>
                                <Input value={formData.orgName} onChange={(e) => handleChange("orgName", e.target.value)} placeholder="Name as per registration certificate" />
                            </div>
                            <div className="space-y-2">
                                <Label>Official Email <span className="text-red-500">*</span></Label>
                                <Input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="contact@ngo.org" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Contact Person Name <span className="text-red-500">*</span></Label>
                                    <Input value={formData.contactPerson} onChange={(e) => handleChange("contactPerson", e.target.value)} placeholder="e.g. Rahul Sharma" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Designation</Label>
                                    <Input value={formData.designation} onChange={(e) => handleChange("designation", e.target.value)} placeholder="e.g. Secretary / Director" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Mobile Number <span className="text-red-500">*</span></Label>
                                    <Input value={formData.mobile} onChange={(e) => handleChange("mobile", e.target.value)} placeholder="+91 98765 43210" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Website URL</Label>
                                    <Input value={formData.website} onChange={(e) => handleChange("website", e.target.value)} placeholder="https://www.ngo.org" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: ADDRESS & LEGAL TYPE */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4 mb-6">
                                <Label className="text-base">What type of NGO are you? <span className="text-red-500">*</span></Label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['TRUST', 'SOCIETY', 'SECTION_8'].map((type) => (
                                        <div
                                            key={type}
                                            onClick={() => handleChange("ngoType", type)}
                                            className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${formData.ngoType === type ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-blue-200'}`}
                                        >
                                            <div className="font-bold">{type.replace('_', ' ')}</div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                {type === 'TRUST' ? 'Registered Trust Deed' : type === 'SOCIETY' ? 'Societies Reg. Act' : 'Companies Act, 2013'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Registration Number <span className="text-red-500">*</span></Label>
                                <Input value={formData.registrationNo} onChange={(e) => handleChange("registrationNo", e.target.value)} placeholder="Enter Registration / Incorporation No." />
                            </div>

                            <div className="space-y-2">
                                <Label>Registered Address</Label>
                                <Textarea value={formData.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="Full address as per bylaws" />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>City <span className="text-red-500">*</span></Label>
                                    <Input value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>State <span className="text-red-500">*</span></Label>
                                    <Input value={formData.state} onChange={(e) => handleChange("state", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Pincode</Label>
                                    <Input value={formData.pincode} onChange={(e) => handleChange("pincode", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION 3: DOCUMENTATION */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3 text-sm text-amber-800">
                                <FileText className="shrink-0" />
                                <p>Please upload clear copies. These documents are mandatory for verification and listing on the platform.</p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-slate-700 border-b pb-2">Mandatory Documents</h3>
                                {formData.ngoType === 'TRUST' && renderFileUpload("Trust Registration Certificate", "legal_cert")}
                                {formData.ngoType === 'TRUST' && renderFileUpload("Trust Deed", "legal_deed")}

                                {formData.ngoType === 'SOCIETY' && renderFileUpload("Society Registration Certificate", "legal_cert")}
                                {formData.ngoType === 'SOCIETY' && renderFileUpload("MOA & Bye-laws", "legal_moa")}

                                {formData.ngoType === 'SECTION_8' && renderFileUpload("Certificate of Incorporation (CIN)", "legal_cert")}
                                {formData.ngoType === 'SECTION_8' && renderFileUpload("MOA / AOA", "legal_moa")}

                                {renderFileUpload("PAN Card of NGO", "pan_card")}
                                {renderFileUpload("12A Certificate", "12a_cert")}
                                {renderFileUpload("80G Certificate", "80g_cert", false)}
                                {renderFileUpload("Audited Financials (Last 3 Years)", "financials")}
                                {renderFileUpload("Cancelled Cheque", "bank_proof")}
                            </div>

                            <div className="space-y-3 pt-4">
                                <h3 className="font-semibold text-slate-700 border-b pb-2">Governing Body</h3>
                                {renderFileUpload(formData.ngoType === 'SECTION_8' ? "List of Directors (DIN)" : "List of Trustees / Office Bearers", "trustee_list")}
                            </div>
                        </div>
                    )}

                    {/* SECTION 4: CSR & FCRA */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>NGO Darpan ID <span className="text-red-500">*</span></Label>
                                    <Input value={formData.darpanId} onChange={(e) => handleChange("darpanId", e.target.value)} placeholder="e.g. DL/2020/0254887" />
                                    <p className="text-xs text-slate-500">Required for government grants</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>CSR-1 Number <span className="text-red-500">*</span></Label>
                                    <Input value={formData.csr1Number} onChange={(e) => handleChange("csr1Number", e.target.value)} placeholder="e.g. CSR00012345" />
                                    <p className="text-xs text-slate-500">Mandatory for receiving CSR funds from companies</p>
                                </div>

                                {renderFileUpload("CSR-1 Certificate", "csr1_doc")}

                                <div className="pt-4 border-t">
                                    <div className="flex items-center justify-between mb-4">
                                        <Label className="text-base">Do you have FCRA Registration?</Label>
                                        <div className="flex bg-slate-100 p-1 rounded-lg">
                                            <button
                                                onClick={() => handleChange("fcraStatus", true)}
                                                className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${formData.fcraStatus ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                                            >Yes</button>
                                            <button
                                                onClick={() => handleChange("fcraStatus", false)}
                                                className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${!formData.fcraStatus ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                                            >No</button>
                                        </div>
                                    </div>
                                    {formData.fcraStatus && (
                                        renderFileUpload("FCRA Certificate", "fcra_doc")
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION 5: IMPACT */}
                    {step === 5 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label>Mission Statement <span className="text-red-500">*</span></Label>
                                <Textarea
                                    className="h-32"
                                    value={formData.mission}
                                    onChange={(e) => handleChange("mission", e.target.value)}
                                    placeholder="Describe your organization's core purpose and goals..."
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
                                            <SelectItem value="Rural Development">Rural Development</SelectItem>
                                            <SelectItem value="Women Empowerment">Women Empowerment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Annual Budget (INR)</Label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input
                                            type="number"
                                            className="pl-9"
                                            value={formData.budget}
                                            onChange={(e) => handleChange("budget", e.target.value)}
                                            placeholder="50,00,000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </CardContent>

                <CardFooter className="flex justify-between border-t p-6 bg-slate-50/50">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            if (step > 1) {
                                setStep(step - 1);
                                setProgress(((step - 1) / 5) * 100);
                            }
                        }}
                        disabled={step === 1 || isLoading}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        className="bg-slate-900 hover:bg-black min-w-[140px]"
                        onClick={handleNext}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                            </>
                        ) : (
                            step === 5 ? "Submit Application" : <>{step === 5 ? "Finish" : "Save & Continue"} <ChevronRight className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
