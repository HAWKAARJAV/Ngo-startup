"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Building2 } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation */}
            <nav className="border-b border-slate-100 bg-white">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">NC</div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">CorpoGN</span>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost">← Back to Home</Button>
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-16 max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Get in Touch</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Have questions about CorpoGN? We're here to help you transform your CSR program.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <Card className="border-slate-200 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl">Send us a message</CardTitle>
                            <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" placeholder="john@company.com" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">I am a...</Label>
                                    <Select>
                                        <SelectTrigger id="role">
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="corporate">Corporate CSR Team</SelectItem>
                                            <SelectItem value="ngo">NGO Representative</SelectItem>
                                            <SelectItem value="donor">Individual Donor</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" placeholder="How can we help?" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us more about your requirements..."
                                        className="h-32"
                                    />
                                </div>

                                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base">
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                    Email Us
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 mb-2">For general inquiries:</p>
                                <a href="mailto:hello@ngoconnect.in" className="text-blue-600 font-medium hover:underline">
                                    hello@ngoconnect.in
                                </a>
                                <p className="text-slate-600 mb-2 mt-4">For support:</p>
                                <a href="mailto:support@ngoconnect.in" className="text-blue-600 font-medium hover:underline">
                                    support@ngoconnect.in
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-green-600" />
                                    Call Us
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 mb-2">Customer Support:</p>
                                <a href="tel:+911234567890" className="text-green-600 font-medium hover:underline">
                                    +91 12345 67890
                                </a>
                                <p className="text-slate-600 text-sm mt-3">
                                    Monday - Friday: 9:00 AM - 6:00 PM IST
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-purple-600" />
                                    Office Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 leading-relaxed">
                                    CorpoGN Technologies Pvt. Ltd.<br />
                                    123, Impact Tower, Connaught Place<br />
                                    New Delhi - 110001<br />
                                    India
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-lg bg-blue-600 text-white">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Enterprise Support
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-blue-100 mb-4">
                                    Need dedicated support for your organization? Our enterprise team is ready to help.
                                </p>
                                <Button className="w-full bg-white text-blue-600 hover:bg-slate-50">
                                    Schedule a Demo Call
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg">How quickly will I get a response?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600">
                                    We aim to respond to all inquiries within 24 hours during business days.
                                    Enterprise customers receive priority support with 4-hour response times.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg">Do you offer on-site demos?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600">
                                    Yes! For corporate clients interested in our Enterprise plan, we provide
                                    personalized on-site demonstrations and implementation support.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg">Can I schedule a call with your team?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600">
                                    Absolutely! Mention your preferred time in the message above, and we'll
                                    send you a calendar invite for a video consultation.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg">Is there technical documentation available?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600">
                                    Yes, we have comprehensive guides, API documentation, and video tutorials
                                    available in our Help Center for all registered users.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
