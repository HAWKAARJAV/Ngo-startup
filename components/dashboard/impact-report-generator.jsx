'use client'

import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Download, Printer } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ImpactReportGenerator() {
    const reportRef = useRef();

    const handleDownloadPdf = async () => {
        const element = reportRef.current;

        // Temporarily make it visible/styled for capture if needed, or capturing a hidden ref might require it to be rendered off-screen but visible to the DOM.
        // For simplicity in this stack, we will assume the modal is open or use a hidden clone.
        // Better yet: Just window.print() with specific print styles is easier and more robust, but user asked for "Generate/Download".
        // Let's use html2canvas + jsPDF for a proper "Download" experience.

        const canvas = await html2canvas(element, { scale: 2 });
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('CSR_Impact_Report_2025.pdf');
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Download size={16} /> Download 2025 Report
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-end mb-4">
                    <Button onClick={handleDownloadPdf} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Printer className="mr-2 h-4 w-4" /> Save as PDF
                    </Button>
                </div>

                {/* The Report Template */}
                <div ref={reportRef} className="bg-white p-12 shadow-sm border text-slate-900 min-h-[1000px] w-full mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
                    {/* Header */}
                    <div className="flex justify-between items-end border-b-4 border-blue-600 pb-6 mb-10">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900">Annual CSR Impact Report</h1>
                            <p className="text-slate-500 mt-2">Fiscal Year 2025-2026</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-slate-700">Tech Giant CSR</h2>
                            <p className="text-sm text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="mb-10">
                        <h3 className="text-lg font-bold uppercase tracking-wider text-blue-600 mb-4">Executive Summary</h3>
                        <p className="text-slate-700 leading-relaxed">
                            This year, we have successfully deployed <span className="font-bold">₹5.0 Cr</span> across <span className="font-bold">3 critical sectors</span>: Education, Healthcare, and Environment.
                            Our partnerships with 7 verified NGOs have positively impacted over <span className="font-bold">12,000 beneficiaries</span>.
                        </p>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-3 gap-6 mb-12">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-1">₹3.2 Cr</div>
                            <div className="text-xs font-semibold text-slate-400 uppercase">Funds Utilized</div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-1">7</div>
                            <div className="text-xs font-semibold text-slate-400 uppercase">Active Partners</div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-1">98.5%</div>
                            <div className="text-xs font-semibold text-slate-400 uppercase">Compliance Rate</div>
                        </div>
                    </div>

                    {/* Impact Highlights */}
                    <div className="mb-10">
                        <h3 className="text-lg font-bold uppercase tracking-wider text-blue-600 mb-6">Impact Highlights</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-24 font-bold text-slate-400">Q1 2025</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Launch of Digital Literacy Labs</h4>
                                    <p className="text-sm text-slate-600">Partnered with Pratham to set up 50 computer labs in rural Maharashtra.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-24 font-bold text-slate-400">Q2 2025</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Flood Relief Drive</h4>
                                    <p className="text-sm text-slate-600">Disbursed emergency funds to Goonj within 48 hours of Assam floods.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-24 font-bold text-slate-400">Q3 2025</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Mid-Day Meal Expansion</h4>
                                    <p className="text-sm text-slate-600">Supported Akshaya Patra in adding 5,000 new children to the nutrition program.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-20 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
                        <p>Ngo Connect Platform • Verified Impact Data • 2025</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
