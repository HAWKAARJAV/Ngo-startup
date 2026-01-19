"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { getRequiredInputsForDocuments, INPUT_CATEGORIES } from "@/lib/csr-input-fields";
import { CSR_DOCUMENTS_CATALOG } from "@/lib/csr-documents-catalog";

export default function InputsPanel({ selectedDocumentIds = [] }) {
    if (selectedDocumentIds.length === 0) {
        return (
            <Card className="sticky top-6">
                <CardHeader>
                    <CardTitle className="text-lg">Information Required</CardTitle>
                    <CardDescription>Select documents to see required inputs</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-slate-500 text-sm">
                        <Info className="mx-auto mb-2 text-slate-300" size={32} />
                        <p>No documents selected</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const requiredInputs = getRequiredInputsForDocuments(selectedDocumentIds);
    const selectedDocs = CSR_DOCUMENTS_CATALOG.filter(d => selectedDocumentIds.includes(d.id));

    const groupedInputs = INPUT_CATEGORIES.map(category => ({
        ...category,
        fields: requiredInputs.filter(input => input.category === category.key)
    })).filter(group => group.fields.length > 0);

    return (
        <Card className="sticky top-6">
            <CardHeader>
                <CardTitle className="text-lg">Information Required From You</CardTitle>
                <CardDescription>
                    To generate {selectedDocumentIds.length} selected document{selectedDocumentIds.length > 1 ? 's' : ''}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert className="bg-amber-50 border-amber-200">
                    <Info size={16} className="text-amber-600" />
                    <AlertDescription className="text-xs text-amber-800">
                        Fill in the required information below to enable document generation
                    </AlertDescription>
                </Alert>

                <div className="space-y-4">
                    {groupedInputs.map(group => (
                        <div key={group.key} className="space-y-2">
                            <h4 className="font-semibold text-sm text-slate-900">{group.label}</h4>
                            <div className="space-y-2">
                                {group.fields.map(field => (
                                    <div key={field.id} className="text-xs py-2 px-3 bg-slate-50 rounded border border-slate-200">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-slate-700">{field.label}</span>
                                            {field.required && (
                                                <span className="text-red-500 text-xs">*Required</span>
                                            )}
                                        </div>
                                        <div className="text-slate-500">
                                            Used by: {field.usedByDocuments.filter(id => selectedDocumentIds.includes(id)).length} selected doc{field.usedByDocuments.filter(id => selectedDocumentIds.includes(id)).length > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                    <Info size={16} className="text-blue-600" />
                    <AlertDescription className="text-xs text-blue-800">
                        <strong>Note:</strong> This information will be reused across multiple documents where applicable.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}
