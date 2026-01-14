"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Shield, Lock, Eye, Database, Bell } from "lucide-react";

export default function PrivacyPage() {
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

            <div className="container mx-auto px-6 py-16 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full mb-4">
                        <Shield className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
                    <p className="text-lg text-slate-600">Last updated: January 14, 2026</p>
                </div>

                <div className="prose prose-slate max-w-none">
                    <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
                        <p className="text-slate-700 leading-relaxed mb-0">
                            At NGO Connect, we take your privacy seriously. This policy outlines how we collect, use, 
                            and protect your personal information when you use our platform.
                        </p>
                    </Card>

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="h-6 w-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-slate-900 m-0">Information We Collect</h2>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">1.1 Information You Provide</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong>Account Information:</strong> Name, email address, phone number, organization details</li>
                            <li><strong>NGO Documentation:</strong> 12A/80G certificates, registration documents, compliance proofs</li>
                            <li><strong>Financial Data:</strong> Budget information, CSR allocations, transaction records</li>
                            <li><strong>Project Details:</strong> Descriptions, beneficiary data, impact metrics</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">1.2 Automatically Collected Information</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
                            <li><strong>Device Information:</strong> Browser type, IP address, operating system</li>
                            <li><strong>Cookies:</strong> Session tokens, preferences, analytics data</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Eye className="h-6 w-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-slate-900 m-0">How We Use Your Information</h2>
                        </div>
                        
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong>Platform Operations:</strong> To provide, maintain, and improve NGO Connect services</li>
                            <li><strong>Verification:</strong> To validate NGO compliance status with government databases</li>
                            <li><strong>Matching:</strong> To use AI algorithms for connecting NGOs with relevant corporate funders</li>
                            <li><strong>Communication:</strong> To send important updates, compliance alerts, and support messages</li>
                            <li><strong>Analytics:</strong> To understand usage patterns and enhance user experience</li>
                            <li><strong>Security:</strong> To detect and prevent fraud, unauthorized access, and violations</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="h-6 w-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-slate-900 m-0">Data Security</h2>
                        </div>
                        
                        <p className="text-slate-600 mb-4">
                            We implement industry-standard security measures to protect your data:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong>Encryption:</strong> All data is encrypted in transit (SSL/TLS) and at rest (AES-256)</li>
                            <li><strong>Access Controls:</strong> Role-based permissions ensure only authorized personnel can access sensitive data</li>
                            <li><strong>Regular Audits:</strong> Third-party security audits conducted quarterly</li>
                            <li><strong>Compliance:</strong> We adhere to ISO 27001 standards and Indian data protection laws</li>
                            <li><strong>Backup:</strong> Automated daily backups with 30-day retention</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Sharing & Disclosure</h2>
                        
                        <p className="text-slate-600 mb-4">
                            We do <strong>NOT</strong> sell your personal data to third parties. We may share information only in these cases:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong>With Your Consent:</strong> When you explicitly authorize data sharing (e.g., sharing NGO profile with corporates)</li>
                            <li><strong>Service Providers:</strong> With trusted vendors (payment processors, cloud hosting) under strict NDAs</li>
                            <li><strong>Legal Obligations:</strong> When required by law, court orders, or regulatory authorities</li>
                            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale (with prior notice)</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
                        
                        <p className="text-slate-600 mb-4">Under Indian data protection laws, you have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong>Access:</strong> Request a copy of your personal data we hold</li>
                            <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                            <li><strong>Portability:</strong> Export your data in machine-readable format</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications (compliance alerts cannot be disabled)</li>
                        </ul>
                        
                        <p className="text-slate-600 mt-4">
                            To exercise these rights, contact us at <a href="mailto:privacy@ngoconnect.in" className="text-blue-600 hover:underline">privacy@ngoconnect.in</a>
                        </p>
                    </section>

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Bell className="h-6 w-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-slate-900 m-0">Cookies & Tracking</h2>
                        </div>
                        
                        <p className="text-slate-600 mb-4">We use cookies for:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong>Essential Cookies:</strong> Required for login, security, and basic functionality</li>
                            <li><strong>Analytics Cookies:</strong> To understand user behavior (Google Analytics)</li>
                            <li><strong>Preference Cookies:</strong> To remember your settings and choices</li>
                        </ul>
                        
                        <p className="text-slate-600 mt-4">
                            You can disable non-essential cookies in your browser settings, but this may limit platform functionality.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Retention</h2>
                        
                        <p className="text-slate-600">
                            We retain your data for as long as your account is active or as needed to provide services. 
                            After account deletion, we may retain certain information for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 mt-3">
                            <li>Legal compliance (e.g., financial records for 7 years as per Indian law)</li>
                            <li>Dispute resolution and fraud prevention</li>
                            <li>Aggregated, anonymized analytics</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
                        
                        <p className="text-slate-600">
                            NGO Connect is not intended for users under 18 years of age. We do not knowingly collect 
                            personal information from children. If you believe a child has provided us with data, 
                            please contact us immediately.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
                        
                        <p className="text-slate-600">
                            We may update this Privacy Policy periodically. Significant changes will be communicated via:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 mt-3">
                            <li>Email notification to registered users</li>
                            <li>Prominent notice on the platform</li>
                            <li>Updated "Last Modified" date at the top of this page</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
                        
                        <p className="text-slate-600 mb-4">
                            For privacy-related questions or concerns:
                        </p>
                        <Card className="p-6 bg-slate-50">
                            <p className="text-slate-700 mb-2"><strong>Data Protection Officer:</strong> privacy@ngoconnect.in</p>
                            <p className="text-slate-700 mb-2"><strong>Address:</strong> NGO Connect Technologies Pvt. Ltd., 123 Impact Tower, Connaught Place, New Delhi - 110001</p>
                            <p className="text-slate-700"><strong>Phone:</strong> +91 12345 67890</p>
                        </Card>
                    </section>
                </div>
            </div>
        </div>
    );
}
