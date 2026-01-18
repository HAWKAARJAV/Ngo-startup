"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

    // Mock data for "Approached NGOs" - using Real IDs for clickability
    const approachedNgos = [
        { id: "659a9121-74e4-4ba6-af6d-2da612956f7e", name: "Smile Foundation", projects: 12, location: "New Delhi", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=200&fit=crop" },
        { id: "51abf346-dc65-40f3-b9cf-ab540fbc1862", name: "Women Self Help Groups", projects: 8, location: "Delhi", image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=200&fit=crop" },
        { id: "5f3f842d-2c48-4092-8184-439a71bd91b2", name: "Guru Daani Foundation", projects: 15, location: "New Delhi", image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=200&fit=crop" },
        { id: "66615eeb-951f-4532-a2a7-f67e0c0fbd92", name: "Ganga Social Foundation", projects: 6, location: "Delhi", image: "https://images.unsplash.com/photo-1542810634-71277d95dc24?w=400&h=200&fit=crop" },
        { id: "59c445a5-63e9-4efc-8839-e4d19fc12e2e", name: "Mother of Life Trust", projects: 9, location: "Delhi", image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=400&h=200&fit=crop" },
    ];

    return (
        <div className="min-h-screen space-y-12">

            {/* Part 1: NGOs Approached You */}
            <section>
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-slate-900">NGO requests</h2>
                    <p className="text-slate-500">Organizations interested in partnering with you</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {approachedNgos.map(ngo => (
                        <Link key={ngo.id} href={`/dashboard/ngo/${ngo.id}`} className="block h-full">
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200 h-full cursor-pointer group">
                                <div className="h-32 w-full relative bg-slate-100">
                                    {/* Use a real img tag for the requested image representation */}
                                    <img
                                        src={ngo.image}
                                        alt={ngo.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-md text-slate-900 truncate mb-1">{ngo.name}</h3>
                                    <div className="space-y-1">
                                        <div className="flex items-center text-xs text-slate-500">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {ngo.location}
                                        </div>
                                        <div className="flex items-center text-xs text-slate-500">
                                            <span className="font-semibold text-blue-600 mr-1">{ngo.projects}</span> Active Projects
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            <div className="w-full h-px bg-slate-200" />

            {/* Part 2: Find NGO (Existing Features) */}
            <section className="flex gap-6 items-start">

                {/* Filters Sidebar */}
                <div className="w-64 flex-shrink-0 hidden md:block space-y-8 sticky top-4">
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
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Find NGOs</h2>
                            <p className="text-slate-500 mt-1">Search 5000+ verified non-profits</p>
                        </div>
                        <SelectSort />
                    </div>

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
                                    <Link href={`/dashboard/ngo/${ngo.id}`} className="w-full">
                                        <Button className="w-full bg-slate-900 hover:bg-slate-800 group-hover:bg-blue-600 transition-colors">
                                            View Full Profile
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div >
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
