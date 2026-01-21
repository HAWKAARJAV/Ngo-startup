"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Building2, 
    Search, 
    IndianRupee, 
    Target, 
    TrendingUp, 
    Filter, 
    Briefcase,
    Gift,
    Calendar,
    ArrowUpRight,
    Loader2,
    Users,
    Sparkles
} from "lucide-react";

export default function CorporateDiscoveryPage() {
    const [corporates, setCorporates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ industries: [], mandateAreas: [] });
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [selectedMandateArea, setSelectedMandateArea] = useState("");

    useEffect(() => {
        fetchCorporates();
    }, [selectedIndustry, selectedMandateArea]);

    const fetchCorporates = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedIndustry && selectedIndustry !== "all") params.append('industry', selectedIndustry);
            if (selectedMandateArea && selectedMandateArea !== "all") params.append('mandateArea', selectedMandateArea);
            if (searchQuery) params.append('search', searchQuery);

            const res = await fetch(`/api/corporates?${params.toString()}`);
            const data = await res.json();
            
            setCorporates(data.corporates || []);
            setFilters(data.filters || { industries: [], mandateAreas: [] });
        } catch (error) {
            console.error('Error fetching corporates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCorporates();
    };

    const formatCurrency = (amount) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(1)} Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)} L`;
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(1)} K`;
        }
        return `₹${amount}`;
    };

    const getIndustryColor = (industry) => {
        const colors = {
            'Technology': 'bg-blue-100 text-blue-700 border-blue-200',
            'Finance': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Manufacturing': 'bg-amber-100 text-amber-700 border-amber-200',
            'Healthcare': 'bg-rose-100 text-rose-700 border-rose-200',
            'Retail': 'bg-purple-100 text-purple-700 border-purple-200',
            'Energy': 'bg-orange-100 text-orange-700 border-orange-200',
            'FMCG': 'bg-teal-100 text-teal-700 border-teal-200',
        };
        return colors[industry] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    // Calculate summary stats
    const totalCSRBudget = corporates.reduce((sum, c) => sum + c.csrBudget, 0);
    const totalDonated = corporates.reduce((sum, c) => sum + c.stats.totalDonated, 0);
    const totalOpportunities = corporates.reduce((sum, c) => sum + c.stats.activeOpportunities, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="h-7 w-7 text-blue-600" />
                        Corporate Funders Directory
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Discover corporate partners and their CSR focus areas
                    </p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Total Corporates</p>
                                <p className="text-2xl font-bold text-blue-900">{corporates.length}</p>
                            </div>
                            <Building2 className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Combined CSR Budget</p>
                                <p className="text-2xl font-bold text-emerald-900">{formatCurrency(totalCSRBudget)}</p>
                            </div>
                            <IndianRupee className="h-8 w-8 text-emerald-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Total Donated</p>
                                <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalDonated)}</p>
                            </div>
                            <Gift className="h-8 w-8 text-purple-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Open Opportunities</p>
                                <p className="text-2xl font-bold text-amber-900">{totalOpportunities}</p>
                            </div>
                            <Sparkles className="h-8 w-8 text-amber-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-4">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by company name, industry, or focus area..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        
                        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <Briefcase className="h-4 w-4 mr-2 text-slate-400" />
                                <SelectValue placeholder="Industry" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Industries</SelectItem>
                                {filters.industries.map(ind => (
                                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedMandateArea} onValueChange={setSelectedMandateArea}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <Target className="h-4 w-4 mr-2 text-slate-400" />
                                <SelectValue placeholder="Focus Area" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Focus Areas</SelectItem>
                                {filters.mandateAreas.map(area => (
                                    <SelectItem key={area} value={area}>{area}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            <Filter className="h-4 w-4 mr-2" />
                            Apply Filters
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Corporate List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-slate-600">Loading corporates...</span>
                </div>
            ) : corporates.length === 0 ? (
                <Card className="py-12">
                    <CardContent className="text-center">
                        <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700">No corporates found</h3>
                        <p className="text-slate-500 mt-1">Try adjusting your filters or search query</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {corporates.map(corp => (
                        <Card key={corp.id} className="hover:shadow-lg transition-shadow border-slate-200 overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                            {corp.companyName.charAt(0)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{corp.companyName}</CardTitle>
                                            <Badge variant="outline" className={`mt-1 ${getIndustryColor(corp.industry)}`}>
                                                {corp.industry}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                                {/* CSR Budget */}
                                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <IndianRupee className="h-4 w-4 text-emerald-600" />
                                        <span className="text-sm text-emerald-700">CSR Budget</span>
                                    </div>
                                    <span className="font-bold text-emerald-800">{formatCurrency(corp.csrBudget)}</span>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-2 bg-slate-50 rounded-lg text-center">
                                        <p className="text-lg font-bold text-slate-800">{formatCurrency(corp.stats.totalDonated)}</p>
                                        <p className="text-xs text-slate-500">Total Donated</p>
                                    </div>
                                    <div className="p-2 bg-slate-50 rounded-lg text-center">
                                        <p className="text-lg font-bold text-slate-800">{corp.stats.donationCount}</p>
                                        <p className="text-xs text-slate-500">Projects Funded</p>
                                    </div>
                                </div>

                                {/* Focus Areas */}
                                <div>
                                    <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                                        <Target className="h-3 w-3" />
                                        CSR Focus Areas
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {corp.mandateAreas.slice(0, 4).map((area, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                                                {area}
                                            </Badge>
                                        ))}
                                        {corp.mandateAreas.length > 4 && (
                                            <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                                                +{corp.mandateAreas.length - 4} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Active Opportunities */}
                                {corp.stats.activeOpportunities > 0 && (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="h-4 w-4 text-amber-600" />
                                                <span className="text-sm font-medium text-amber-800">
                                                    {corp.stats.activeOpportunities} Open Grant{corp.stats.activeOpportunities > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <Badge className="bg-amber-500 text-white">
                                                {formatCurrency(corp.stats.totalOpportunityBudget)}
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="pt-0">
                                <Button variant="outline" className="w-full" asChild>
                                    <a href={`/ngo-portal/chat?corporate=${corp.id}`}>
                                        <Users className="h-4 w-4 mr-2" />
                                        Connect with Corporate
                                        <ArrowUpRight className="h-4 w-4 ml-auto" />
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
