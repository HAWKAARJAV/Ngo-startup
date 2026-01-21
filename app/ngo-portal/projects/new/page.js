'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Target, MapPin, IndianRupee, FileText, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SECTORS = [
    "Education",
    "Healthcare",
    "Environment",
    "Rural Development",
    "Women Empowerment",
    "Child Welfare",
    "Skill Development",
    "Sanitation",
    "Livelihood",
    "Disaster Relief",
    "Other"
];

const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh"
];

export default function NewProjectPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetAmount: '',
        location: '',
        state: '',
        sector: '',
        duration: '12', // months
    });

    const [tranches, setTranches] = useState([
        { condition: 'Project Kickoff & Initial Setup', percentage: 30 },
        { condition: 'Mid-Term Assessment & Progress Report', percentage: 40 },
        { condition: 'Final Delivery & Impact Report', percentage: 30 },
    ]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTrancheChange = (index, field, value) => {
        setTranches(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: field === 'percentage' ? Number(value) : value };
            return updated;
        });
    };

    const addTranche = () => {
        if (tranches.length < 5) {
            setTranches(prev => [...prev, { condition: '', percentage: 0 }]);
        }
    };

    const removeTranche = (index) => {
        if (tranches.length > 1) {
            setTranches(prev => prev.filter((_, i) => i !== index));
        }
    };

    const totalPercentage = tranches.reduce((sum, t) => sum + t.percentage, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.title || !formData.description || !formData.targetAmount || !formData.location || !formData.sector) {
            toast({
                title: "Missing Fields",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        if (totalPercentage !== 100) {
            toast({
                title: "Invalid Tranches",
                description: "Tranche percentages must add up to 100%.",
                variant: "destructive"
            });
            return;
        }

        const emptyTranche = tranches.find(t => !t.condition.trim());
        if (emptyTranche) {
            toast({
                title: "Missing Tranche Condition",
                description: "Please provide conditions for all tranches.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/projects/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    targetAmount: parseFloat(formData.targetAmount),
                    location: `${formData.location}, ${formData.state}`,
                    sector: formData.sector,
                    duration: parseInt(formData.duration),
                    tranches: tranches.map(t => ({
                        condition: t.condition,
                        percentage: t.percentage
                    }))
                })
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Project Created! 🎉",
                    description: "Your project has been submitted successfully.",
                });
                router.push('/ngo-portal/projects');
            } else {
                throw new Error(data.error || 'Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to create project. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 -m-6 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/ngo-portal/projects">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                            Create New Project
                        </h1>
                        <p className="text-slate-600">Submit a new project proposal for corporate funding</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Details */}
                    <Card className="border-slate-200 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-blue-600" />
                                Project Details
                            </CardTitle>
                            <CardDescription>
                                Basic information about your project
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Project Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Rural Education Initiative for 500 Children"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Project Description *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your project objectives, target beneficiaries, expected outcomes, and implementation plan..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="min-h-[120px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sector">Sector *</Label>
                                    <Select value={formData.sector} onValueChange={(v) => handleInputChange('sector', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select sector" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SECTORS.map(s => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration">Project Duration</Label>
                                    <Select value={formData.duration} onValueChange={(v) => handleInputChange('duration', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="6">6 Months</SelectItem>
                                            <SelectItem value="12">12 Months</SelectItem>
                                            <SelectItem value="18">18 Months</SelectItem>
                                            <SelectItem value="24">24 Months</SelectItem>
                                            <SelectItem value="36">36 Months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location & Budget */}
                    <Card className="border-slate-200 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-green-600" />
                                Location & Budget
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">City/District *</Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g., Jaipur"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State *</Label>
                                    <Select value={formData.state} onValueChange={(v) => handleInputChange('state', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATES.map(s => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="targetAmount">Target Budget (₹) *</Label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="targetAmount"
                                        type="number"
                                        placeholder="e.g., 5000000"
                                        value={formData.targetAmount}
                                        onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                                        className="pl-10 text-lg font-semibold"
                                    />
                                </div>
                                {formData.targetAmount && (
                                    <p className="text-sm text-slate-500">
                                        ₹{Number(formData.targetAmount).toLocaleString('en-IN')} 
                                        {formData.targetAmount >= 100000 && (
                                            <span className="text-blue-600 ml-1">
                                                (₹{(formData.targetAmount / 100000).toFixed(2)} Lakhs)
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Milestone Tranches */}
                    <Card className="border-slate-200 shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-purple-600" />
                                        Milestone Tranches
                                    </CardTitle>
                                    <CardDescription>
                                        Define milestones for fund release. Funds will be released upon verification.
                                    </CardDescription>
                                </div>
                                <Badge 
                                    variant={totalPercentage === 100 ? "default" : "destructive"}
                                    className={totalPercentage === 100 ? "bg-green-600" : ""}
                                >
                                    {totalPercentage}% / 100%
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {tranches.map((tranche, index) => (
                                <div 
                                    key={index} 
                                    className="flex gap-4 items-start p-4 bg-slate-50 rounded-lg border border-slate-200"
                                >
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <Input
                                            placeholder="Milestone condition (e.g., Project Kickoff & Initial Setup)"
                                            value={tranche.condition}
                                            onChange={(e) => handleTrancheChange(index, 'condition', e.target.value)}
                                        />
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                className="w-24"
                                                value={tranche.percentage}
                                                onChange={(e) => handleTrancheChange(index, 'percentage', e.target.value)}
                                            />
                                            <span className="text-slate-500">%</span>
                                            {formData.targetAmount && (
                                                <span className="text-sm text-slate-500 ml-2">
                                                    = ₹{((formData.targetAmount * tranche.percentage) / 100).toLocaleString('en-IN')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {tranches.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => removeTranche(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}

                            {tranches.length < 5 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full border-dashed"
                                    onClick={addTranche}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Milestone
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex gap-4 justify-end">
                        <Link href="/ngo-portal/projects">
                            <Button type="button" variant="outline" size="lg">
                                Cancel
                            </Button>
                        </Link>
                        <Button 
                            type="submit" 
                            size="lg"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Create Project
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
