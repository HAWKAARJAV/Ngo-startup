"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { FileText, AlertCircle, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
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
                    <div className="inline-flex items-center justify-center h-16 w-16 bg-slate-100 rounded-full mb-4">
                        <FileText className="h-8 w-8 text-slate-900" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Terms of Service</h1>
                    <p className="text-lg text-slate-600">Last updated: January 14, 2026</p>
                </div>

                <div className="prose prose-slate max-w-none">
                    <Card className="p-6 mb-8 bg-amber-50 border-amber-200">
                        <p className="text-slate-700 leading-relaxed mb-0">
                            <strong>Important:</strong> By accessing or using NGO Connect, you agree to be bound by these Terms of Service. 
                            Please read them carefully before using our platform.
                        </p>
                    </Card>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                        
                        <p className="text-slate-600">
                            These Terms of Service ("Terms") constitute a legally binding agreement between you and 
                            NGO Connect Technologies Pvt. Ltd. ("NGO Connect", "we", "us", or "our") regarding your use 
                            of the NGO Connect platform and services.
                        </p>
                        
                        <p className="text-slate-600 mt-4">
                            If you are using NGO Connect on behalf of an organization, you represent and warrant that you 
                            have the authority to bind that organization to these Terms.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Eligibility</h2>
                        
                        <p className="text-slate-600 mb-4">To use NGO Connect, you must:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Be at least 18 years of age</li>
                            <li>Have the legal capacity to enter into binding contracts</li>
                            <li>Not be prohibited from using the platform under Indian laws or any other applicable jurisdiction</li>
                            <li>For NGOs: Be a registered non-profit organization under Indian law (Trust/Society/Section 8 Company)</li>
                            <li>For Corporates: Have a valid CSR mandate as per Section 135 of the Companies Act, 2013</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Account Registration & Security</h2>
                        
                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">3.1 Account Creation</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>You must provide accurate, complete, and current information during registration</li>
                            <li>You are responsible for maintaining the confidentiality of your login credentials</li>
                            <li>One account per organization; multiple accounts may be suspended</li>
                            <li>We reserve the right to refuse registration or terminate accounts at our discretion</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">3.2 Account Security</h3>
                        <p className="text-slate-600">
                            You are solely responsible for all activities under your account. Immediately notify us of any 
                            unauthorized access at <a href="mailto:security@ngoconnect.in" className="text-blue-600 hover:underline">security@ngoconnect.in</a>.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. User Responsibilities</h2>
                        
                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">4.1 For NGOs</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Upload only authentic, non-forged compliance documents (12A, 80G, FCRA, etc.)</li>
                            <li>Keep compliance certifications up-to-date; notify us within 48 hours of any status changes</li>
                            <li>Provide accurate project descriptions and impact metrics</li>
                            <li>Upload Utilization Certificates and proof of work within agreed timelines</li>
                            <li>Use funds received through the platform only for stated project purposes</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">4.2 For Corporates</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Conduct due diligence before partnering with NGOs (we facilitate, not guarantee)</li>
                            <li>Disburse funds as per agreed tranche schedules</li>
                            <li>Review and approve Utilization Certificates in a timely manner</li>
                            <li>Comply with Section 135 of the Companies Act, 2013, and related CSR rules</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Verification & Compliance</h2>
                        
                        <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-slate-700 text-sm mb-0">
                                    <strong>Important:</strong> NGO Connect performs automated verification checks against government databases. 
                                    However, we do not guarantee the accuracy or completeness of third-party data.
                                </p>
                            </div>
                        </Card>

                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Our verification system pings MCA/Income Tax databases every 48 hours</li>
                            <li>If an NGO's compliance status changes (e.g., 12A revoked), we freeze transactions and alert both parties</li>
                            <li>Manual document reviews may take 2-5 business days</li>
                            <li>We reserve the right to reject verification requests or suspend accounts for fraudulent documents</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Fees & Payments</h2>
                        
                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">6.1 Subscription Plans</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Pricing is listed on our website and subject to change with 30 days' notice</li>
                            <li>Fees are non-refundable except as required by law</li>
                            <li>Annual subscriptions auto-renew unless canceled 7 days before renewal date</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">6.2 Transaction Fees</h3>
                        <p className="text-slate-600">
                            For disbursals above ₹10 lakhs, a transaction fee of 0.5% applies. 
                            This covers payment processing, compliance checks, and platform maintenance.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Intellectual Property</h2>
                        
                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">7.1 Platform Ownership</h3>
                        <p className="text-slate-600 mb-4">
                            All content, features, and functionality of NGO Connect (including but not limited to software, design, 
                            text, graphics, logos) are owned by NGO Connect Technologies Pvt. Ltd. and protected by intellectual property laws.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">7.2 Your Content</h3>
                        <p className="text-slate-600">
                            You retain ownership of content you upload (project descriptions, documents, photos). However, you grant us a 
                            worldwide, royalty-free license to display, process, and distribute this content as necessary to provide the services.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Prohibited Conduct</h2>
                        
                        <p className="text-slate-600 mb-4">You agree NOT to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Upload false, misleading, or fraudulent information</li>
                            <li>Use the platform for money laundering or illegal fund transfers</li>
                            <li>Scrape, copy, or reverse-engineer the platform</li>
                            <li>Interfere with security features or attempt unauthorized access</li>
                            <li>Harass, defame, or threaten other users</li>
                            <li>Use automated bots or scripts without written permission</li>
                            <li>Resell or redistribute platform access</li>
                        </ul>

                        <p className="text-slate-600 mt-4">
                            <strong>Violation of these terms may result in immediate account suspension and legal action.</strong>
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Disclaimers & Limitations</h2>
                        
                        <Card className="p-4 mb-4 bg-slate-100 border-slate-300">
                            <p className="text-slate-700 text-sm mb-0">
                                <strong>Important Legal Notice:</strong> NGO Connect is a technology platform that facilitates connections. 
                                We are NOT a party to any funding agreements between NGOs and Corporates.
                            </p>
                        </Card>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">9.1 No Guarantees</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>We do not guarantee NGO credibility beyond automated compliance checks</li>
                            <li>We are not liable for fund misuse by NGOs</li>
                            <li>Platform uptime is targeted at 99.5% but not guaranteed</li>
                            <li>AI matching results are probabilistic, not deterministic</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">9.2 Liability Cap</h3>
                        <p className="text-slate-600">
                            Our total liability for any claims arising from your use of NGO Connect shall not exceed the fees you 
                            paid to us in the 12 months preceding the claim.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Indemnification</h2>
                        
                        <p className="text-slate-600">
                            You agree to indemnify and hold harmless NGO Connect, its officers, directors, and employees from any claims, 
                            damages, or expenses (including legal fees) arising from:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 mt-3">
                            <li>Your violation of these Terms</li>
                            <li>Your violation of any third-party rights</li>
                            <li>Fraudulent or misleading information you provide</li>
                            <li>Misuse of funds transferred through the platform</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Termination</h2>
                        
                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">11.1 By You</h3>
                        <p className="text-slate-600">
                            You may close your account at any time from Settings. Subscription fees for the current period are non-refundable.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">11.2 By Us</h3>
                        <p className="text-slate-600 mb-4">
                            We may suspend or terminate your account immediately if:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>You violate these Terms</li>
                            <li>We suspect fraudulent activity</li>
                            <li>Required by law or regulatory authorities</li>
                            <li>Your NGO loses compliance certifications and fails to rectify within 30 days</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Dispute Resolution</h2>
                        
                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">12.1 Governing Law</h3>
                        <p className="text-slate-600">
                            These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive 
                            jurisdiction of courts in New Delhi, India.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">12.2 Arbitration</h3>
                        <p className="text-slate-600">
                            For claims below ₹10 lakhs, disputes shall be resolved through binding arbitration under the 
                            Arbitration and Conciliation Act, 1996. The arbitration shall be conducted in English in New Delhi.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Changes to Terms</h2>
                        
                        <p className="text-slate-600">
                            We may modify these Terms at any time. Material changes will be notified via:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 mt-3">
                            <li>Email to your registered address (30 days advance notice)</li>
                            <li>In-app notification banner</li>
                            <li>Updated "Last Modified" date at the top of this page</li>
                        </ul>
                        
                        <p className="text-slate-600 mt-4">
                            Continued use of the platform after changes constitutes acceptance of the updated Terms.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Miscellaneous</h2>
                        
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions continue in full force</li>
                            <li><strong>Waiver:</strong> Our failure to enforce any right does not waive that right</li>
                            <li><strong>Assignment:</strong> You may not transfer your account; we may assign these Terms to successors</li>
                            <li><strong>Entire Agreement:</strong> These Terms constitute the complete agreement between parties</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Contact Information</h2>
                        
                        <Card className="p-6 bg-slate-50">
                            <p className="text-slate-700 mb-2">
                                For questions about these Terms, contact us at:
                            </p>
                            <p className="text-slate-700 mb-2"><strong>Email:</strong> legal@ngoconnect.in</p>
                            <p className="text-slate-700 mb-2">
                                <strong>Address:</strong> NGO Connect Technologies Pvt. Ltd.<br />
                                123 Impact Tower, Connaught Place, New Delhi - 110001, India
                            </p>
                            <p className="text-slate-700"><strong>Phone:</strong> +91 12345 67890</p>
                        </Card>
                    </section>

                    <Card className="p-6 bg-green-50 border-green-200">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-slate-700 font-semibold mb-2">
                                    By clicking "I Accept" or using NGO Connect, you acknowledge that you have read, 
                                    understood, and agree to be bound by these Terms of Service.
                                </p>
                                <p className="text-slate-600 text-sm mb-0">
                                    Last Review Date: January 14, 2026
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
