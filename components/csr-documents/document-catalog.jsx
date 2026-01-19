"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DOCUMENT_CATEGORIES, getDocumentsByCategory } from "@/lib/csr-documents-catalog";
import { Shield, FileCheck, DollarSign, TrendingUp, Globe } from "lucide-react";
import DocumentCard from "./document-card";

const iconMap = {
    Shield,
    FileCheck,
    DollarSign,
    TrendingUp,
    Globe
};

export default function DocumentCatalog({
    userTier = 'free',
    selectedDocuments = [],
    onDocumentSelect,
    onDocumentGenerate
}) {
    return (
        <Accordion type="multiple" defaultValue={['regulatory', 'governance']} className="space-y-4">
            {DOCUMENT_CATEGORIES.map((category) => {
                const Icon = iconMap[category.icon];
                const documents = getDocumentsByCategory(category.key);

                return (
                    <AccordionItem
                        key={category.key}
                        value={category.key}
                        className="border rounded-lg px-4 bg-white shadow-sm"
                    >
                        <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Icon size={20} className="text-blue-600" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-slate-900">{category.label}</div>
                                    <div className="text-xs text-slate-500 font-normal">{documents.length} documents available</div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pt-2 pb-4">
                            {documents.map((doc) => (
                                <DocumentCard
                                    key={doc.id}
                                    document={doc}
                                    userTier={userTier}
                                    selected={selectedDocuments.includes(doc.id)}
                                    onSelect={() => onDocumentSelect(doc.id)}
                                    onGenerate={onDocumentGenerate}
                                />
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}
