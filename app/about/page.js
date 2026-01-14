"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Target, Heart, TrendingUp, Users, Lightbulb, Award, Zap, Shield } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b border-slate-100 bg-white sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">NC</div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">NGO-CONNECT</span>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost">← Back to Home</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">About Us</Badge>
                    <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                        Reimagining CSR for <span className="text-blue-600">Digital India</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        NGO Connect is India's first AI-powered platform that brings transparency, accountability, 
                        and measurable impact to Corporate Social Responsibility programs.
                    </p>
                </div>
            </section>

            {/* The Problem */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">The Problem We're Solving</h2>
                        <p className="text-xl text-slate-600">Corporate India spends ₹30,000+ Crores on CSR annually, yet...</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-red-200 bg-red-50">
                            <CardHeader>
                                <div className="text-4xl font-bold text-red-600 mb-2">60%</div>
                                <CardTitle className="text-slate-900">Compliance Gaps</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600">
                                    Of NGOs lack proper 12A/80G documentation, creating legal risks for corporates.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-amber-200 bg-amber-50">
                            <CardHeader>
                                <div className="text-4xl font-bold text-amber-600 mb-2">2-3 Weeks</div>
                                <CardTitle className="text-slate-900">Manual Verification</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600">
                                    Time wasted on manual checks that should be automated in 2026.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-orange-200 bg-orange-50">
                            <CardHeader>
                                <div className="text-4xl font-bold text-orange-600 mb-2">Zero</div>
                                <CardTitle className="text-slate-900">Impact Visibility</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600">
                                    Post-disbursal fund tracking. Corporates have no idea how their money is used.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Our Solution */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Solution: The NGO Connect Platform</h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            A single platform that automates compliance, enables milestone-based funding, 
                            and generates board-ready reports — all while ensuring 100% MCA compliance.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                    <Zap size={24} />
                                </div>
                                <CardTitle className="text-xl">Real-Time Verification</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 leading-relaxed">
                                    Our system pings the MCA and Income Tax databases every 48 hours. 
                                    If an NGO's 12A/80G status changes, we alert both parties instantly and freeze disbursals.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-green-200 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                                    <Shield size={24} />
                                </div>
                                <CardTitle className="text-xl">Smart Tranche System</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 leading-relaxed">
                                    Instead of lump-sum transfers, release funds in milestones tied to deliverables. 
                                    Each tranche unlocks only when proof of work is uploaded and verified.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                                    <Lightbulb size={24} />
                                </div>
                                <CardTitle className="text-xl">AI-Powered Matching</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 leading-relaxed">
                                    Our AI Scout analyzes CSR mandates and finds NGOs with 99% alignment. 
                                    Natural language queries like "Find education NGOs in rural Maharashtra" work instantly.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-amber-200 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                                    <Award size={24} />
                                </div>
                                <CardTitle className="text-xl">MCA-Compliant Reporting</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 leading-relaxed">
                                    Generate Form CSR-2 (Annual CSR Report) with one click. 
                                    All data fields are pre-filled and 100% compatible with MCA filings.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Target className="h-10 w-10 text-blue-400" />
                                <h2 className="text-3xl font-bold">Our Mission</h2>
                            </div>
                            <p className="text-lg text-slate-300 leading-relaxed">
                                To democratize CSR funding by creating a transparent, technology-driven marketplace 
                                where every rupee is tracked, every NGO is verified, and every impact is measured. 
                                We believe that good intentions deserve good governance.
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Heart className="h-10 w-10 text-red-400" />
                                <h2 className="text-3xl font-bold">Our Vision</h2>
                            </div>
                            <p className="text-lg text-slate-300 leading-relaxed">
                                To become the default operating system for CSR in India by 2030, powering 
                                ₹50,000+ Crores in verified impact and connecting 100,000+ NGOs with corporates 
                                through AI-driven precision matching.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Now */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Now?</h2>
                        <p className="text-xl text-slate-600">The perfect storm for CSR transformation</p>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-slate-200">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-2">Regulatory Push</h3>
                                        <p className="text-slate-600">
                                            Section 135 of the Companies Act (2013) mandates 2% CSR spending for eligible companies. 
                                            Compliance reporting is now stricter than ever, with penalties for non-compliance.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-2">Digital Infrastructure</h3>
                                        <p className="text-slate-600">
                                            MCA/Income Tax databases are now API-accessible. AI models like Google Gemini 
                                            enable semantic matching at scale. The technology stack is finally ready.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-2">Market Demand</h3>
                                        <p className="text-slate-600">
                                            CSR teams at India Inc are overwhelmed. They need a system that reduces manual work, 
                                            ensures compliance, and proves impact to stakeholders — NGO Connect delivers all three.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        <Card className="text-center border-slate-200">
                            <CardContent className="pt-6">
                                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                                    <Shield size={28} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2">Transparency</h3>
                                <p className="text-sm text-slate-600">
                                    Every transaction is traceable. Every metric is verifiable. No black boxes.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-slate-200">
                            <CardContent className="pt-6">
                                <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                                    <Heart size={28} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2">Impact First</h3>
                                <p className="text-sm text-slate-600">
                                    Technology is a means, not the end. We measure success by social impact created.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-slate-200">
                            <CardContent className="pt-6">
                                <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-4">
                                    <Lightbulb size={28} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2">Innovation</h3>
                                <p className="text-sm text-slate-600">
                                    We leverage cutting-edge AI and automation to solve decades-old problems.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-slate-200">
                            <CardContent className="pt-6">
                                <div className="h-14 w-14 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-4">
                                    <Award size={28} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2">Integrity</h3>
                                <p className="text-sm text-slate-600">
                                    We hold ourselves to the same compliance standards we expect from NGOs.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <h2 className="text-4xl font-bold mb-6">Join the CSR Revolution</h2>
                    <p className="text-xl text-blue-100 mb-10">
                        Whether you're a corporate looking to maximize impact or an NGO seeking verified funding, 
                        NGO Connect is built for you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register/ngo">
                            <Button size="lg" className="h-14 px-8 text-lg bg-white text-blue-600 hover:bg-slate-50">
                                Register Your NGO (Free)
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 border-white text-white hover:bg-white/10">
                                Schedule a Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
