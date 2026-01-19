'use client';

import { Accordion } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, Download, Info } from "lucide-react";
import DocCategory from "./doc-category";
import { Button } from "@/components/ui/button";

const ALL_CATEGORIES = [
    {
        key: 'A',
        title: 'Project Proposal & Planning',
        docs: [
            'Project Proposal (Objectives, Activities, Timelines)',
            'Target Geography & Beneficiary Profile',
            'CSR Activity mapped to Schedule VII',
            'Item-wise Project Budget & Utilization Plan'
        ]
    },
    {
        key: 'B',
        title: 'Financial Reporting & Utilization',
        docs: [
            'Utilization Certificate (UC)',
            'Project-wise Expenditure Statement',
            'Bank Transaction Summary for CSR funds',
            'Auditor’s Confirmation'
        ]
    },
    {
        key: 'C',
        title: 'Periodic Progress Reporting',
        docs: [
            'Quarterly / Milestone-based Progress Reports',
            'Activity-wise Output Report',
            'Photographs / Geo-tagged Evidence',
            'Beneficiary Reach & Demographic Data'
        ]
    },
    {
        key: 'D',
        title: 'Impact & Outcome Reporting',
        docs: [
            'Impact Assessment Report',
            'Baseline vs Endline Outcome Metrics',
            'Social Impact KPIs',
            'Third-party Evaluator Details'
        ]
    },
    {
        key: 'E',
        title: 'Project Completion & Closure',
        docs: [
            'Final Project Completion Report',
            'CSR Funds Approved vs Utilized Summary',
            'Asset Creation Details',
            'Sustainability / Post-project Continuation Plan'
        ]
    },
    {
        key: 'F',
        title: 'Compliance Declarations',
        docs: [
            'Declaration of use of funds',
            'Declaration of no employee benefit',
            'Declaration of non-political & non-religious usage'
        ]
    },
    {
        key: 'G',
        title: 'Custom Document Requests',
        docs: [
            'Request Additional Document (Not Listed Above)'
        ]
    }
];

export default function ComplianceDashboard({ projectId, projectDocs = [], isCorporate = false, isNgo = false }) {
    // Calculate Progress
    const totalRequired = ALL_CATEGORIES.reduce((acc, cat) => acc + cat.docs.length, 0);
    const approvedCount = projectDocs.filter(d => d.status === 'APPROVED').length;
    const submittedCount = projectDocs.filter(d => ['SUBMITTED', 'VERIFIED', 'APPROVED'].includes(d.status)).length;

    // We can use approved for strict progress, or submitted for "work done"
    const progressPerc = Math.round((submittedCount / totalRequired) * 100);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <ShieldCheck className="text-blue-600" />
                            CSR Project Compliance Dashboard
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm">
                            Manage and track all mandatory CSR documents for legal and internal compliance.
                        </p>
                    </div>
                    {isCorporate && (
                        <Button variant="outline" className="gap-2 hidden sm:flex">
                            <Download size={16} /> Audit Pack
                        </Button>
                    )}
                </div>

                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-slate-600">Compliance Completeness</span>
                        <span className="text-blue-700">{progressPerc}%</span>
                    </div>
                    <Progress value={progressPerc} className="h-3 bg-slate-100" />
                </div>

                <Alert className="bg-blue-50/50 border-blue-100 text-blue-900">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle>Compliance Note</AlertTitle>
                    <AlertDescription className="text-xs text-blue-800">
                        All submitted documents may be used for statutory filings, CSR-2 reporting, audits, and corporate disclosures under the Companies Act, 2013.
                    </AlertDescription>
                </Alert>
            </div>

            <Accordion type="multiple" defaultValue={['A']} className="w-full">
                {ALL_CATEGORIES.map((cat) => (
                    <DocCategory
                        key={cat.key}
                        categoryKey={cat.key}
                        title={cat.title}
                        documents={cat.docs}
                        projectDocs={projectDocs}
                        projectId={projectId}
                        isCorporate={isCorporate}
                        isNgo={isNgo}
                    />
                ))}
            </Accordion>
        </div>
    );
}
