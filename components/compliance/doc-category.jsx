'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import DocRow from "./doc-row";

export default function DocCategory({ categoryKey, title, documents, projectDocs, projectId, isCorporate, isNgo, corporateId, ngoId, documentRequests = [] }) {
    // Determine status summary for this category
    const relevantDocs = projectDocs.filter(d => d.category === categoryKey);
    const totalDocs = documents.length;
    const completedDocs = relevantDocs.filter(d => d.status === 'APPROVED').length;

    // Check if any errors/rejections
    const hasRejections = relevantDocs.some(d => d.status === 'REJECTED');

    return (
        <AccordionItem value={categoryKey} className="border bg-white rounded-lg px-4 mb-4 shadow-sm">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                        <div className="font-semibold text-lg text-slate-800">{categoryKey}. {title}</div>
                        <div className="text-xs text-slate-500 font-normal mt-1">
                            {completedDocs}/{totalDocs} Documents Approved
                        </div>
                    </div>
                    <div>
                        {hasRejections ? (
                            <Badge variant="destructive">Action Required</Badge>
                        ) : completedDocs === totalDocs ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Complete</Badge>
                        ) : (
                            <Badge variant="outline" className="text-slate-500">In Progress</Badge>
                        )}
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-3">
                {documents.map((docName, idx) => {
                    const docData = relevantDocs.find(d => d.docName === docName);
                    // Find any document request for this document
                    const docRequest = documentRequests.find(r => r.docName === docName);
                    return (
                        <DocRow
                            key={idx}
                            projectId={projectId}
                            category={categoryKey}
                            categoryTitle={title}
                            docName={docName}
                            docData={docData}
                            isCorporate={isCorporate}
                            isNgo={isNgo}
                            corporateId={corporateId}
                            ngoId={ngoId}
                            documentRequest={docRequest}
                        />
                    );
                })}
            </AccordionContent>
        </AccordionItem>
    );
}
