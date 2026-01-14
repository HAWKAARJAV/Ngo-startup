"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, ShieldCheck, HeartHandshake, FileText, CheckCircle2, TrendingUp, Users, Zap, Building2, Award, Clock, Target, BarChart3, Sparkles, Star, MessageSquare } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">NC</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">NGO-CONNECT</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How It Works</Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Success Stories</Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/login" className="text-sm font-medium hover:text-slate-900">Sign In</Link>
            <Link href="/stories" className="text-sm font-medium hover:text-slate-900">Success Stories</Link>
            <Link href="/register">
              <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white"></div>
        <div className="container mx-auto px-6 text-center max-w-5xl relative">
          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 mb-8 border border-blue-100">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            Trusted by 50+ Corporates · 5,000+ NGOs · ₹450Cr+ Tracked
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            The Operating System for <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">CSR Impact</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            We verify NGOs, track disbursals in real-time, and measure impact automatically.
          </p>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
            Move beyond <span className="line-through text-slate-400">"Good Faith"</span> to <span className="font-bold text-green-600">"Good Governance"</span>.
            Ensure 100% MCA compliance while maximizing social impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg bg-slate-900 hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all">
                View Live Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register/ngo">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 hover:bg-slate-50">
                NGO Registration (Free)
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Setup in 10 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Free for NGOs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">₹450Cr+</div>
              <div className="text-slate-400 text-sm">CSR Funds Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">5,000+</div>
              <div className="text-slate-400 text-sm">Verified NGOs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">98%</div>
              <div className="text-slate-400 text-sm">Compliance Score</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">15min</div>
              <div className="text-slate-400 text-sm">Avg. Verification Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Platform Features</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Everything You Need for Transparent CSR</h2>
            <p className="text-xl text-slate-600">Automated compliance, smart funding, and real-time impact tracking — all in one platform.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="h-14 w-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                  <ShieldCheck size={28} />
                </div>
                <CardTitle className="text-xl">Automated Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We ping the MCA and Income Tax databases in real-time every 48 hours.
                  If an NGO loses 12A status, we flag it instantly and freeze disbursals.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>12A/80G verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>FCRA status monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Auto-alerts on violations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  <HeartHandshake size={28} />
                </div>
                <CardTitle className="text-xl">Smart Tranche System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Don't dump funds and pray. Release them in milestones tied to deliverables.
                  Funds unlock only when the Utilization Certificate is uploaded.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Milestone-based releases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Document verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Complete audit trail</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="h-14 w-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                  <FileText size={28} />
                </div>
                <CardTitle className="text-xl">Board-Ready Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Generate your Annual CSR Report (Form CSR-2) with one click.
                  Data format is 100% compatible with MCA filings.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>MCA CSR-2 compliant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Executive dashboards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Export to PDF/Excel</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                  <Sparkles size={28} />
                </div>
                <CardTitle className="text-xl">AI-Powered Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Our AI Scout analyzes your CSR mandate and finds NGOs with 99% alignment.
                  Natural language queries like "Find education NGOs in rural Bihar" work instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="h-14 w-14 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-4">
                  <TrendingUp size={28} />
                </div>
                <CardTitle className="text-xl">Impact Measurement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Track beneficiaries reached, SDG alignment, and Social ROI.
                  Automatically calculate cost-per-beneficiary and impact metrics.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="h-14 w-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                  <Award size={28} />
                </div>
                <CardTitle className="text-xl">Trust Score™ System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Proprietary scoring algorithm rates NGOs on compliance, impact history, transparency,
                  and response time. Only top-rated partners get featured.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">Simple Process</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">How NGO Connect Works</h2>
            <p className="text-xl text-slate-600">Three simple steps to transform your CSR program</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 -z-10"></div>

            <div className="relative">
              <div className="bg-blue-600 text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">1</div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">NGO Registration & Verification</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  NGOs complete our 3-step wizard. We auto-verify their 12A/80G status against government databases.
                  Approved NGOs get a "Verified" badge within 15 minutes.
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-center gap-2 justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>10-minute signup</span>
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span>Instant verification</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="bg-blue-600 text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">2</div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">AI-Powered Matching</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Corporates describe their CSR mandate. Our AI Scout finds NGOs with 95%+ match score
                  based on sector, location, impact history, and compliance.
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-center gap-2 justify-center">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span>Smart recommendations</span>
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <Target className="h-4 w-4 text-orange-600" />
                    <span>Perfect alignment</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="bg-blue-600 text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">3</div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Fund, Track & Report</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Disburse funds in smart tranches. Track utilization in real-time.
                  Generate MCA-compliant reports with one click for your board.
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-center gap-2 justify-center">
                    <BarChart3 className="h-4 w-4 text-indigo-600" />
                    <span>Real-time tracking</span>
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <FileText className="h-4 w-4 text-amber-600" />
                    <span>Automated reports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-blue-600 text-white hover:bg-blue-600">Success Stories</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Trusted by India's Leading Organizations</h2>
            <p className="text-xl text-slate-400">See what our partners say about transforming their CSR programs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">TG</div>
                  <div>
                    <div className="font-bold">Tata Group</div>
                    <div className="text-sm text-slate-400">Fortune 500 Corporate</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">
                  "NGO Connect reduced our compliance workload by 80%. What used to take our team 2 weeks
                  now happens in 10 minutes. The auto-generated CSR-2 reports are a game-changer."
                </p>
                <p className="text-sm text-slate-500 mt-4">— Ravi Kumar, Head of CSR</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center font-bold text-lg">VF</div>
                  <div>
                    <div className="font-bold">Vidya Foundation</div>
                    <div className="text-sm text-slate-400">Education NGO, Delhi</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">
                  "We struggled to get funding for 3 years. After getting verified on NGO Connect,
                  we partnered with 5 corporates in 6 months. The platform's credibility opens doors."
                </p>
                <p className="text-sm text-slate-500 mt-4">— Dr. Anjali Sharma, Founder</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center font-bold text-lg">IL</div>
                  <div>
                    <div className="font-bold">Infosys Ltd</div>
                    <div className="text-sm text-slate-400">IT Services Giant</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">
                  "The AI matching is incredibly accurate. Instead of reviewing 100+ proposals,
                  we get 5 perfect matches. Saved our team 200 hours this quarter alone."
                </p>
                <p className="text-sm text-slate-500 mt-4">— Priya Menon, CSR Manager</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Transparent Pricing</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-slate-600">No hidden fees. Cancel anytime. Money-back guarantee.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* NGO Free */}
            <Card className="border-2 border-slate-200 relative hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">NGO Starter</CardTitle>
                <CardDescription>For small NGOs</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹0</span>
                  <span className="text-slate-500">/year</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Basic profile listing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>1 active project</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Manual verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-slate-200 text-slate-900 hover:bg-slate-300">Get Started Free</Button>
              </CardContent>
            </Card>

            {/* NGO Pro */}
            <Card className="border-2 border-blue-600 relative hover:shadow-xl transition-shadow shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">NGO Pro</CardTitle>
                <CardDescription>For established NGOs</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹12,000</span>
                  <span className="text-slate-500">/year</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Priority listing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Verified Badge</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>AI matching priority</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">Start Free Trial</Button>
              </CardContent>
            </Card>

            {/* Corporate Basic */}
            <Card className="border-2 border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Corporate</CardTitle>
                <CardDescription>For mid-sized firms</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹50,000</span>
                  <span className="text-slate-500">/year</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Up to 10 NGO partnerships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>AI Scout access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Tranche management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>CSR-2 report generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Compliance alerts</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">Schedule Demo</Button>
              </CardContent>
            </Card>

            {/* Corporate Enterprise */}
            <Card className="border-2 border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription>For large corporates</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Unlimited partnerships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span><strong>White-label reports</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>24/7 priority support</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-slate-900 hover:bg-slate-800">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100">FAQ</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <details className="bg-white p-6 rounded-lg border border-slate-200 group">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between">
                How do you verify NGOs?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                We integrate with the Ministry of Corporate Affairs (MCA) and Income Tax Department databases
                to verify 12A/80G status in real-time. Our system automatically pings these databases every 48 hours
                to ensure compliance. Additionally, we manually review uploaded documents for authenticity.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-slate-200 group">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between">
                Is NGO Connect really free for NGOs?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Yes! Our Starter plan is 100% free forever for small NGOs. You can create a profile, list one project,
                and get discovered by corporates at no cost. We only charge for premium features like unlimited projects
                and priority listing (₹12,000/year).
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-slate-200 group">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between">
                What is the "Smart Tranche System"?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Instead of transferring all CSR funds upfront, you can split them into milestones (tranches).
                Each tranche is "locked" until the NGO uploads proof of completion (Utilization Certificate, photos, reports).
                Once verified, the next tranche auto-releases. This ensures accountability and reduces fund misuse.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-slate-200 group">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between">
                Can I generate MCA-compliant CSR reports?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Absolutely! Our platform auto-generates Form CSR-2 (Annual Report on CSR Activities) in the exact format
                required by MCA. All data fields—project names, amounts, locations, partners—are pre-filled from your dashboard.
                Export to PDF or Excel with one click.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-slate-200 group">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between">
                How does AI matching work?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Our AI Scout uses Google's Gemini model to analyze your CSR mandate (focus areas, budget, geography).
                It then ranks all verified NGOs based on sector alignment, location match, past impact, and compliance score.
                You can also use natural language queries like "Find healthcare NGOs in Bihar with FCRA."
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-slate-200 group">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between">
                What happens if an NGO loses its 12A/80G status?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Our system detects this within 48 hours. We immediately: (1) Send email + SMS alerts to both parties,
                (2) Freeze all pending tranche disbursals, (3) Mark the NGO profile as "Compliance Alert."
                You can then decide whether to continue the partnership or reallocate funds.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Transform Your CSR Program?</h2>
          <p className="text-xl text-blue-100 mb-10">
            Join 50+ corporates and 5,000+ NGOs using NGO Connect to create verified, measurable impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/ngo">
              <Button size="lg" className="h-14 px-8 text-lg bg-white text-blue-600 hover:bg-slate-50">
                Register Your NGO (Free)
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 border-white text-white hover:bg-white/10">
                View Corporate Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-blue-200 mt-6">No credit card required • Setup in 10 minutes • Free for NGOs</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">NC</div>
                <span className="text-xl font-bold text-white">NGO-CONNECT</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                India's first AI-powered CSR compliance platform. Connecting verified NGOs with corporate funders
                to create transparent, measurable impact.
              </p>
              <p className="text-xs text-slate-500">
                © 2026 NGO Connect. All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">CSR Guide</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Data Security</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              Made with ❤️ in India for transparent CSR
            </p>
            <div className="flex gap-6 text-sm">
              <span>🇮🇳 Proudly Indian</span>
              <span>🔒 Bank-Grade Security</span>
              <span>✓ MCA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
