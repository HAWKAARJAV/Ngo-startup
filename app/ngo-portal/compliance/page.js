import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";

// Prevent static prerendering - requires database at runtime
export const dynamic = 'force-dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileCheck, AlertTriangle, Clock, History, Bell, Building2, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import DocumentRequestUploader from "@/components/compliance/document-request-uploader";
import ComplianceDocCards from "@/components/compliance/compliance-doc-cards";

// Get actual logged-in user ID from session cookie
const getSessionUserId = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (token) {
        try {
            const session = JSON.parse(token);
            return session.id;
        } catch (e) {
            console.error('Error parsing session token:', e);
        }
    }
    return null;
};

export default async function ComplianceOpsPage() {
    const userId = await getSessionUserId();
    if (!userId) return <div>User not found. Please log in.</div>;

    const ngo = await prisma.nGO.findUnique({
        where: { userId },
        include: { documents: true }
    });

    if (!ngo) return <div>NGO Profile not found</div>;

    // Fetch document requests for this NGO
    const documentRequests = await prisma.documentRequest.findMany({
        where: { ngoId: ngo.id },
        orderBy: { requestedAt: 'desc' }
    });

    // Enrich with corporate names
    const enrichedRequests = await Promise.all(
        documentRequests.map(async (req) => {
            const corporate = await prisma.corporate.findUnique({
                where: { id: req.corporateId },
                select: { companyName: true }
            });
            return { ...req, corporateName: corporate?.companyName || 'Unknown' };
        })
    );

    const pendingRequests = enrichedRequests.filter(r => r.status === 'PENDING');

    // Serialize dates for client component
    const serializedRequests = enrichedRequests.map(req => ({
        ...req,
        requestedAt: req.requestedAt?.toISOString?.() || req.requestedAt,
        uploadedAt: req.uploadedAt?.toISOString?.() || req.uploadedAt,
    }));

    // Serialize documents for client component
    const serializedDocuments = ngo.documents.map(doc => ({
        ...doc,
        uploadedAt: doc.uploadedAt?.toISOString?.() || doc.uploadedAt,
    }));

    const docTypes = [
        { key: '12A', label: '12A Registration Certificate', validity: ngo.validity12A, verified: ngo.is12AVerified },
        { key: '80G', label: '80G Tax Exemption Certificate', validity: ngo.validity80G, verified: ngo.is80GVerified },
        { key: 'CSR1', label: 'MCA CSR-1 Form', validity: ngo.validityCSR1, verified: false }, // Logic pending for CSR1 verification field
        { key: 'FCRA', label: 'FCRA Renewal', validity: ngo.fcraRenewalDate, verified: ngo.fcraStatus },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Compliance Vault</h1>
                    <p className="text-slate-500">Manage your regulatory documents. Keep them fresh to unlock funding.</p>
                </div>
                <Button variant="outline" className="flex gap-2">
                    <History className="h-4 w-4" /> View Audit Logs
                </Button>
            </div>

            {/* Document Requests from Corporates - Interactive Uploader */}
            <DocumentRequestUploader requests={serializedRequests} ngoId={ngo.id} />

            {/* Compliance Document Cards with Functional Upload */}
            <ComplianceDocCards 
                docTypes={docTypes} 
                ngoId={ngo.id} 
                documents={serializedDocuments} 
            />

            {/* Upload History Table Stub */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recent Compliance Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-slate-500 text-sm italic">
                        No recent upload activity recorded.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
