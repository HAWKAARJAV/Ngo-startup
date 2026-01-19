"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Upload, FileText, Image as ImageIcon, File, CheckCircle, Info, HelpCircle, Plus, Trash2 } from "lucide-react";
import { DOCUMENT_INPUT_SCHEMAS, getDocumentStatus } from "@/lib/csr-document-input-schemas";

export default function DocumentInputModal({
    open,
    onClose,
    document
}) {
    const [formData, setFormData] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [repeatableFields, setRepeatableFields] = useState({});

    const schema = document ? DOCUMENT_INPUT_SCHEMAS[document.id] : null;

    useEffect(() => {
        if (schema) {
            // Auto-calculate fields
            const newValues = { ...formData };
            let hasChanges = false;

            schema.fields.forEach(field => {
                if (field.autoCalculate && field.formula) {
                    const calculatedValue = field.formula(formData);
                    if (newValues[field.id] !== calculatedValue) {
                        newValues[field.id] = calculatedValue;
                        hasChanges = true;
                    }
                }
            });

            if (hasChanges) {
                setFormData(newValues);
            }
        }
    }, [formData, schema]);

    const handleInputChange = (fieldId, value) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleFileUpload = (fieldId, event, multiple = false) => {
        const files = multiple ? Array.from(event.target.files) : [event.target.files?.[0]];
        if (files.length > 0) {
            setUploadedFiles(prev => ({ ...prev, [fieldId]: files }));
            setFormData(prev => ({ ...prev, [fieldId]: files.map(f => f.name).join(', ') }));
        }
    };

    const addRepeatableField = (fieldId) => {
        setRepeatableFields(prev => ({
            ...prev,
            [fieldId]: [...(prev[fieldId] || []), {}]
        }));
    };

    const removeRepeatableField = (fieldId, index) => {
        setRepeatableFields(prev => ({
            ...prev,
            [fieldId]: prev[fieldId].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = () => {
        const status = getDocumentStatus(document.id, formData);
        if (status === 'ready') {
            console.log('Form Data:', formData);
            console.log('Uploaded Files:', uploadedFiles);
            alert(`Document generated successfully! (Mock)\n\nDocument: ${schema.documentName}`);
            onClose();
        } else {
            alert('Please fill all required fields before generating the document.');
        }
    };

    const renderField = (field) => {
        // Check conditional display
        if (field.conditional && !field.conditional(formData)) {
            return null;
        }

        const value = formData[field.id] || '';
        const isRequired = field.required;

        return (
            <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        {field.label}
                        {isRequired && <span className="text-red-500 text-xs">*</span>}
                        {field.tooltip && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle size={14} className="text-slate-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="text-xs">{field.tooltip}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </span>
                    {!isRequired && (
                        <Badge variant="outline" className="text-xs bg-slate-100">Optional</Badge>
                    )}
                </Label>

                {/* Text Input */}
                {field.type === 'text' && (
                    <Input
                        id={field.id}
                        type="text"
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={isRequired}
                        pattern={field.pattern}
                        readOnly={field.readOnly}
                        className={field.readOnly ? 'bg-slate-100' : ''}
                    />
                )}

                {/* Number Input */}
                {field.type === 'number' && (
                    <Input
                        id={field.id}
                        type="number"
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value) || 0)}
                        required={isRequired}
                        min={field.min}
                        max={field.max}
                        readOnly={field.readOnly}
                        className={field.readOnly ? 'bg-green-50 font-semibold' : ''}
                    />
                )}

                {/* Textarea */}
                {field.type === 'textarea' && (
                    <Textarea
                        id={field.id}
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={isRequired}
                        rows={field.rows || 3}
                        maxLength={field.maxLength}
                    />
                )}

                {/* Select Dropdown */}
                {field.type === 'select' && (
                    <Select value={value} onValueChange={(val) => handleInputChange(field.id, val)}>
                        <SelectTrigger>
                            <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {/* Radio Group */}
                {field.type === 'radio' && (
                    <RadioGroup value={value} onValueChange={(val) => handleInputChange(field.id, val)}>
                        <div className="flex gap-4">
                            {field.options?.map(option => (
                                <div key={option} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                                    <Label htmlFor={`${field.id}-${option}`} className="cursor-pointer">{option}</Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                )}

                {/* Checkbox Group */}
                {field.type === 'checkbox-group' && (
                    <div className="space-y-2">
                        {field.options?.map(option => (
                            <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${field.id}-${option}`}
                                    checked={value?.includes(option)}
                                    onCheckedChange={(checked) => {
                                        const currentValues = value || [];
                                        const newValues = checked
                                            ? [...currentValues, option]
                                            : currentValues.filter(v => v !== option);
                                        handleInputChange(field.id, newValues);
                                    }}
                                />
                                <Label htmlFor={`${field.id}-${option}`} className="cursor-pointer">{option}</Label>
                            </div>
                        ))}
                    </div>
                )}

                {/* Date Input */}
                {field.type === 'date' && (
                    <Input
                        id={field.id}
                        type="date"
                        value={value}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={isRequired}
                    />
                )}

                {/* URL Input */}
                {field.type === 'url' && (
                    <Input
                        id={field.id}
                        type="url"
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={isRequired}
                    />
                )}

                {/* File Upload */}
                {(field.type === 'file' || field.type === 'file-multiple') && (
                    <div className="space-y-2">
                        <Input
                            id={field.id}
                            type="file"
                            accept={field.accept}
                            onChange={(e) => handleFileUpload(field.id, e, field.type === 'file-multiple')}
                            multiple={field.type === 'file-multiple'}
                            className="hidden"
                        />
                        <Label
                            htmlFor={field.id}
                            className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        >
                            <Upload size={20} className="text-slate-400" />
                            <div className="text-center">
                                <p className="text-sm font-medium text-slate-700">
                                    {uploadedFiles[field.id] ? (
                                        <span className="flex items-center gap-2 text-green-600">
                                            <CheckCircle size={16} />
                                            {uploadedFiles[field.id].length} file(s) uploaded
                                        </span>
                                    ) : (
                                        'Click to upload or drag and drop'
                                    )}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {field.accept || 'All files'} • Max 10MB
                                </p>
                            </div>
                        </Label>
                        {uploadedFiles[field.id] && (
                            <div className="space-y-1">
                                {uploadedFiles[field.id].map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 bg-green-50 px-3 py-2 rounded border border-green-200">
                                        <FileText size={14} />
                                        <span>{file.name}</span>
                                        <span className="text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Repeatable Fields */}
                {field.type === 'repeatable' && (
                    <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                        {(repeatableFields[field.id] || [{}]).map((item, index) => (
                            <div key={index} className="p-3 bg-white rounded border space-y-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-medium text-slate-600">Entry {index + 1}</span>
                                    {index > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeRepeatableField(field.id, index)}
                                            className="h-6"
                                        >
                                            <Trash2 size={12} />
                                        </Button>
                                    )}
                                </div>
                                {field.subFields?.map(subField => (
                                    <div key={subField.id} className="space-y-1">
                                        <Label className="text-xs">{subField.label}</Label>
                                        <Input
                                            type={subField.type}
                                            placeholder={subField.placeholder}
                                            required={subField.required}
                                            pattern={subField.pattern}
                                            className="h-8"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addRepeatableField(field.id)}
                            className="w-full gap-2"
                        >
                            <Plus size={14} /> Add Another
                        </Button>
                    </div>
                )}

                {field.validation && (
                    <p className="text-xs text-amber-600">{field.validation}</p>
                )}
            </div>
        );
    };

    if (!schema) {
        return null;
    }

    const documentStatus = getDocumentStatus(document.id, formData);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>{schema.documentName}</span>
                        <Badge variant="outline" className={documentStatus === 'ready' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}>
                            {documentStatus === 'ready' ? 'Ready to Generate' : 'Needs Inputs'}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the required information to generate this CSR document
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Alert className="bg-blue-50 border-blue-200">
                        <Info size={16} className="text-blue-600" />
                        <AlertDescription className="text-xs text-blue-800">
                            <strong>Auto-save enabled.</strong> Your inputs are saved and will be reused across documents.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-6">
                        {schema.fields.map(renderField)}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={documentStatus !== 'ready'}
                    >
                        {documentStatus === 'ready' ? 'Generate Document' : 'Fill Required Fields'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
