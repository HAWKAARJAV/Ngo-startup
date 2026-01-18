"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Award, Filter } from "lucide-react";

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        categories: [],
        locations: [],
        compliance: ['12A', '80G', 'FCRA']
    });

    // Fetch NGOs on load and search change
    useEffect(() => {
        const fetchNgos = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/ngos?q=${searchTerm}`);
                const data = await res.json();
                setNgos(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
                setNgos([]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce slightly
        const timeout = setTimeout(fetchNgos, 300);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    return (
        <div className="flex gap-6 min-h-screen">
            {/* Filters Sidebar */}
            <div className="w-64 flex-shrink-0 hidden md:block space-y-8">
                <div>
                    <h3 className="font-semibold mb-4 text-slate-900">Category</h3>
                    <div className="space-y-3">
                        {["Education", "Healthcare", "Environment", "Disaster Relief", "Livelihood"].map(c => (
                            <div key={c} className="flex items-center space-x-2">
                                <Checkbox id={c} />
                                <label htmlFor={c} className="text-sm text-slate-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{c}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 text-slate-900">Location</h3>
                    <div className="space-y-3">
                        {["Delhi NCR", "Mumbai", "Bangalore", "Rural India"].map(c => (
                            <div key={c} className="flex items-center space-x-2">
                                <Checkbox id={c} />
                                <label htmlFor={c} className="text-sm text-slate-600 leading-none">{c}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 text-slate-900">Compliance</h3>
                    <div className="space-y-3">
                        {["12A Registered", "80G Certified", "FCRA Compliant"].map(c => (
                            <div key={c} className="flex items-center space-x-2">
                                <Checkbox id={c} defaultChecked />
                                <label htmlFor={c} className="text-sm text-slate-600 leading-none">{c}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search by name, cause, or city..."
                        className="pl-10 h-12 text-lg shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Results Info */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-slate-500 text-sm">Showing {ngos.length} verified results</p>
                    <SelectSort />
                </div>

                {/* Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-3 text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="text-slate-500 mt-4">Searching verified NGOs...</p>
                        </div>
                    ) : ngos.length === 0 ? (
                        <div className="col-span-3 text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <p className="text-xl font-semibold text-slate-700 mb-2">No NGOs found</p>
                            <p className="text-slate-500">Try adjusting your search or filters</p>
                        </div>
                    ) : ngos.map((ngo) => (
                        <Card key={ngo.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200">
                            <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 relative">
                                <div className={`w-full h-full flex items-center justify-center text-white text-4xl font-bold ${getHashColor(ngo.orgName)}`}>
                                    {ngo.orgName[0]}
                                </div>
                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-lg">
                                    <Award className="h-3 w-3 text-blue-600" />
                                    {ngo.ngoProfile?.trustScore || 85}%
                                </div>
                            </div>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1 mb-1">{ngo.orgName}</h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" /> {ngo.ngoProfile?.city || 'India'}
                                        </p>
                                    </div>
                                    {ngo.ngoProfile?.is12AVerified && (
                                        <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 text-xs">
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <p className="text-sm text-slate-600 line-clamp-2 mb-4 min-h-[40px]">
                                    {ngo.ngoProfile?.mission || "Dedicated to creating meaningful social impact in communities across India."}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {ngo.ngoProfile?.is12AVerified && (
                                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200 font-medium">12A</span>
                                    )}
                                    {ngo.ngoProfile?.is80GVerified && (
                                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-md border border-purple-200 font-medium">80G</span>
                                    )}
                                    {ngo.ngoProfile?.fcraStatus && (
                                        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-md border border-amber-200 font-medium">FCRA</span>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 pb-4">
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 group-hover:bg-blue-600 transition-colors">
                                    View Full Profile
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SelectSort() {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select className="text-sm border-none bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer">
                <option>Smart Match (AI)</option>
                <option>Impact Score</option>
                <option>Recently Verified</option>
            </select>
        </div>
    )
}

function getHashColor(str) {
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}
