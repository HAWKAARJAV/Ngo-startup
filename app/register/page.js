"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, HeartHandshake, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-900">Join the Impact Network</h1>
                <p className="text-slate-500 mt-2">Choose your role to get started.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                {/* Corporate Card */}
                <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                    <CardHeader className="text-center pb-2">
                        <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Briefcase size={32} />
                        </div>
                        <CardTitle className="text-xl">I am a Funder / Corporate</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-slate-500 text-sm px-8">
                        <p>
                            Manage your CSR mandate, discover verified NGOs, and track fund utilization with board-ready reports.
                        </p>
                    </CardContent>
                    <CardFooter className="justify-center pb-8">
                        <Button className="bg-slate-900 hover:bg-black group-hover:px-8 transition-all">
                            Create Corporate Account <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>

                {/* NGO Card */}
                <Link href="/register/ngo">
                    <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden h-full">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-600"></div>
                        <CardHeader className="text-center pb-2">
                            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <HeartHandshake size={32} />
                            </div>
                            <CardTitle className="text-xl">I am an NGO / Non-Profit</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-slate-500 text-sm px-8">
                            <p>
                                Get verified (12A/80G), showcase your impact, and access funding from top corporate partners.
                            </p>
                        </CardContent>
                        <CardFooter className="justify-center pb-8">
                            <Button variant="outline" className="border-slate-300 group-hover:border-green-600 group-hover:text-green-700 transition-all">
                                Start Verification <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                </Link>
            </div>

            <div className="mt-8 text-sm text-slate-500">
                Already have an account? <Link href="/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
            </div>
        </div>
    );
}
