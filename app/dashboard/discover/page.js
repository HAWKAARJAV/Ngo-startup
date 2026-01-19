"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
    Search, MapPin, Award, Filter, Star, Heart, MessageCircle, 
    Building2, CheckCircle, XCircle, Sparkles, TrendingUp, Shield
} from "lucide-react";
import Link from "next/link";

export default function DiscoverNGOsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shortlistedNgos, setShortlistedNgos] = useState(new Set());
    const [selectedNgo, setSelectedNgo] = useState(null);
    const [showProjectDialog, setShowProjectDialog] = useState(false);
    const [aiSearching, setAiSearching] = useState(false);
    const [filters, setFilters] = useState({
        sectors: [],
        locations: [],
        minTrustScore: 70,
        compliance: { has12A: true, has80G: true, hasFCRA: false }
    });
    const { toast } = useToast();

    // Fetch NGOs
    useEffect(() => {
        const fetchNgos = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (searchTerm) params.append('q', searchTerm);
                if (filters.minTrustScore) params.append('minScore', filters.minTrustScore);
                
                const res = await fetch(`/api/ngos?${params.toString()}`);
                const data = await res.json();
                setNgos(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
                setNgos([]);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchNgos, 300);
        return () => clearTimeout(timeout);
    }, [searchTerm, filters]);

    // AI-powered NGO recommendation
    const runAIMatch = async () => {
        setAiSearching(true);
        try {
            const res = await fetch('/api/ai/scout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: "Find NGOs matching Education and Healthcare focus areas in Delhi NCR with high trust scores",
                    filters: filters
                })
            });
            const data = await res.json();
            if (data.recommendations) {
                toast({
                    title: "AI Recommendations Ready",
                    description: `Found ${data.recommendations.length} NGOs matching your CSR mandate.`,
                });
            }
        } catch (error) {
            console.error('AI Scout error:', error);
        } finally {
            setAiSearching(false);
        }
    };

    // Shortlist NGO
    const toggleShortlist = (ngoId) => {
        setShortlistedNgos(prev => {
            const newSet = new Set(prev);
            if (newSet.has(ngoId)) {
                newSet.delete(ngoId);
                toast({ title: "Removed from shortlist" });
            } else {
                newSet.add(ngoId);
                toast({ title: "Added to shortlist", description: "You can now create a project with this NGO." });
            }
            return newSet;
        });
    };

    // Select NGO for project creation
    const selectForProject = (ngo) => {
        setSelectedNgo(ngo);
        setShowProjectDialog(true);
    };

    const getTrustScoreColor = (score) => {
        if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
        if (score >= 75) return "text-blue-600 bg-blue-50 border-blue-200";
        if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Discover NGOs</h1>
                    <p className="text-slate-500 mt-1">Find verified implementation partners for your CSR projects</p>
                </div>
                <div className="flex gap-3">
                    {shortlistedNgos.size > 0 && (
                        <Button variant="outline" className="gap-2">
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            Shortlisted ({shortlistedNgos.size})
                        </Button>
                    )}
                    <Button onClick={runAIMatch} disabled={aiSearching} className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600">
                        <Sparkles className="h-4 w-4" />
                        {aiSearching ? "AI Analyzing..." : "AI Match"}
                    </Button>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-xl border p-4 shadow-sm">
                <div className="flex gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search by name, cause, city, or description..."
                            className="pl-10 h-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-2 items-center">
                        <Label className="text-sm text-slate-600">Min Trust Score:</Label>
                        <select 
                            className="border rounded-lg px-3 py-2 text-sm"
                            value={filters.minTrustScore}
                            onChange={(e) => setFilters({...filters, minTrustScore: Number(e.target.value)})}
                        >
                            <option value={50}>50+</option>
                            <option value={70}>70+</option>
                            <option value={80}>80+</option>
                            <option value={90}>90+</option>
                        </select>
                    </div>

                    <div className="flex gap-3 items-center border-l pl-4">
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                id="has12A" 
                                checked={filters.compliance.has12A}
                                onCheckedChange={(v) => setFilters({...filters, compliance: {...filters.compliance, has12A: v}})}
                            />
                            <Label htmlFor="has12A" className="text-sm">12A</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                id="has80G" 
                                checked={filters.compliance.has80G}
                                onCheckedChange={(v) => setFilters({...filters, compliance: {...filters.compliance, has80G: v}})}
                            />
                            <Label htmlFor="has80G" className="text-sm">80G</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                id="hasFCRA"
                                checked={filters.compliance.hasFCRA}
                                onCheckedChange={(v) => setFilters({...filters, compliance: {...filters.compliance, hasFCRA: v}})}
                            />
                            <Label htmlFor="hasFCRA" className="text-sm">FCRA</Label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center">
                <p className="text-slate-500 text-sm">
                    Showing {ngos.length} verified NGOs
                    {searchTerm && ` matching "${searchTerm}"`}
                </p>
                <select className="text-sm border rounded-lg px-3 py-1.5">
                    <option>Sort: Trust Score (High to Low)</option>
                    <option>Sort: Recently Verified</option>
                    <option>Sort: Active Projects</option>
                </select>
            </div>

            {/* NGO Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                        <p className="text-slate-500 mt-4">Searching verified NGOs...</p>
                    </div>
                ) : ngos.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                        <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-xl font-semibold text-slate-700 mb-2">No NGOs found</p>
                        <p className="text-slate-500">Try adjusting your search or filters</p>
                    </div>
                ) : ngos.map((ngo) => {
                    const profile = ngo.ngoProfile || ngo;
                    const isShortlisted = shortlistedNgos.has(ngo.id);
                    const trustScore = profile.trustScore || 85;

                    return (
                        <Card key={ngo.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 group">
                            {/* Header with Score */}
                            <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-900 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,white,transparent)]" />
                                <div className="absolute top-3 left-3">
                                    <div className="flex gap-1.5">
                                        {profile.is12AVerified && (
                                            <span className="bg-green-500/90 text-white text-xs px-2 py-0.5 rounded font-medium">12A</span>
                                        )}
                                        {profile.is80GVerified && (
                                            <span className="bg-purple-500/90 text-white text-xs px-2 py-0.5 rounded font-medium">80G</span>
                                        )}
                                        {profile.fcraStatus && (
                                            <span className="bg-amber-500/90 text-white text-xs px-2 py-0.5 rounded font-medium">FCRA</span>
                                        )}
                                    </div>
                                </div>
                                <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-sm font-bold border ${getTrustScoreColor(trustScore)}`}>
                                    <div className="flex items-center gap-1.5">
                                        <Shield className="h-3.5 w-3.5" />
                                        {trustScore}
                                    </div>
                                </div>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className={`absolute bottom-3 right-3 h-8 w-8 rounded-full ${isShortlisted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                    onClick={() => toggleShortlist(ngo.id)}
                                >
                                    <Heart className={`h-4 w-4 ${isShortlisted ? 'fill-current' : ''}`} />
                                </Button>
                                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center font-bold text-slate-700 shadow-lg">
                                        {(profile.orgName || ngo.orgName || 'N')[0]}
                                    </div>
                                </div>
                            </div>

                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
                                            {profile.orgName || ngo.orgName}
                                        </h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                                            <MapPin className="h-3.5 w-3.5" /> 
                                            {profile.city || 'Delhi'}, {profile.state || 'India'}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pb-4">
                                <p className="text-sm text-slate-600 line-clamp-2 mb-4 min-h-[40px]">
                                    {profile.mission || "Dedicated to creating meaningful social impact through sustainable programs."}
                                </p>
                                
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                                        {profile.projects?.length || 3} Projects
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Building2 className="h-3.5 w-3.5 text-blue-600" />
                                        {profile.registrationNo || 'Verified'}
                                    </span>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-0 pb-4 flex gap-2">
                                <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    asChild
                                >
                                    <Link href={`/dashboard/ngo/${ngo.id}`}>View Profile</Link>
                                </Button>
                                <Button 
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    onClick={() => selectForProject(ngo)}
                                >
                                    Select for Project
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* Project Creation Dialog */}
            <ProjectCreationDialog 
                isOpen={showProjectDialog}
                onClose={() => setShowProjectDialog(false)}
                selectedNgo={selectedNgo}
            />
        </div>
    );
}

function ProjectCreationDialog({ isOpen, onClose, selectedNgo }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetAmount: '',
        location: '',
        sector: 'Education',
        tranches: [
            { amount: '', condition: 'Project Kickoff', percentage: 30 },
            { amount: '', condition: 'Mid-Term Milestone', percentage: 40 },
            { amount: '', condition: 'Final Delivery', percentage: 30 }
        ]
    });
    const [creating, setCreating] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    ngoId: selectedNgo?.ngoProfile?.id || selectedNgo?.id,
                    targetAmount: parseFloat(formData.targetAmount)
                })
            });

            if (res.ok) {
                toast({
                    title: "Project Created!",
                    description: "The NGO has been notified. You can now manage tranches.",
                });
                onClose();
            } else {
                throw new Error('Failed to create project');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create project. Please try again."
            });
        } finally {
            setCreating(false);
        }
    };

    // Auto-calculate tranche amounts
    useEffect(() => {
        if (formData.targetAmount) {
            const total = parseFloat(formData.targetAmount);
            setFormData(prev => ({
                ...prev,
                tranches: prev.tranches.map(t => ({
                    ...t,
                    amount: Math.round(total * t.percentage / 100)
                }))
            }));
        }
    }, [formData.targetAmount]);

    const profile = selectedNgo?.ngoProfile || selectedNgo;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-700">
                            {(profile?.orgName || 'N')[0]}
                        </div>
                        Create Project with {profile?.orgName}
                    </DialogTitle>
                    <DialogDescription>
                        Allocate CSR funds and define milestone-based tranches for transparent fund release.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Details */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Project Title</Label>
                            <Input 
                                id="title"
                                placeholder="e.g., Digital Literacy for Rural Youth"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Project Description</Label>
                            <Textarea 
                                id="description"
                                placeholder="Describe the project objectives, target beneficiaries, and expected outcomes..."
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="sector">Sector</Label>
                                <select 
                                    id="sector"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.sector}
                                    onChange={(e) => setFormData({...formData, sector: e.target.value})}
                                >
                                    <option>Education</option>
                                    <option>Healthcare</option>
                                    <option>Environment</option>
                                    <option>Livelihood</option>
                                    <option>Disaster Relief</option>
                                    <option>Women Empowerment</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="location">Implementation Location</Label>
                                <Input 
                                    id="location"
                                    placeholder="e.g., Gurgaon, Haryana"
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="targetAmount">Total Budget Allocation (₹)</Label>
                            <Input 
                                id="targetAmount"
                                type="number"
                                placeholder="e.g., 5000000"
                                value={formData.targetAmount}
                                onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                                required
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                This will be split into milestone-based tranches
                            </p>
                        </div>
                    </div>

                    {/* Tranche Configuration */}
                    <div className="border-t pt-4">
                        <Label className="text-base font-semibold">Tranche Configuration</Label>
                        <p className="text-sm text-slate-500 mb-4">
                            Funds will be released upon milestone verification
                        </p>

                        <div className="space-y-3">
                            {formData.tranches.map((tranche, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                                    <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <Input 
                                            placeholder="Unlock condition"
                                            value={tranche.condition}
                                            onChange={(e) => {
                                                const newTranches = [...formData.tranches];
                                                newTranches[index].condition = e.target.value;
                                                setFormData({...formData, tranches: newTranches});
                                            }}
                                            className="mb-1"
                                        />
                                    </div>
                                    <div className="w-24 text-right">
                                        <span className="text-sm font-medium">{tranche.percentage}%</span>
                                        <p className="text-xs text-slate-500">
                                            ₹{(tranche.amount || 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={creating} className="bg-blue-600">
                            {creating ? "Creating..." : "Create Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
