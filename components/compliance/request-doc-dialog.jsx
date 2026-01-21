"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Bell, CheckCircle2, FileWarning, Loader2, Calendar } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RequestDocDialog({
    categories = [],
    fixedMode = false,
    defaultCategory = "",
    defaultDoc = "",
    categoryTitle = "",
    trigger,
    corporateId,
    ngoId,
    projectId = null,
    onSuccess
}) {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
    const [selectedDoc, setSelectedDoc] = useState(defaultDoc);
    const [message, setMessage] = useState("");
    const [deadline, setDeadline] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get minimum date (today) for deadline picker
    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 1); // At least 1 day from now
        return today.toISOString().split('T')[0];
    };

    // Get default deadline (7 days from now)
    const getDefaultDeadline = () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0];
    };

    const handleSend = async () => {
        console.log('handleSend called with props:', { corporateId, ngoId, projectId, fixedMode, defaultCategory, defaultDoc });
        
        if (!corporateId || !ngoId) {
            setError(`Missing corporate or NGO information. corporateId: ${corporateId}, ngoId: ${ngoId}`);
            return;
        }

        const docName = fixedMode ? defaultDoc : selectedDoc;
        const requestType = fixedMode ? (defaultCategory || 'COMPLIANCE_DOC') : (selectedCategory || 'COMPLIANCE_DOC');

        console.log('Computed values:', { docName, requestType });

        if (!docName) {
            setError("Please select a document");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log('Sending document request:', { corporateId, ngoId, projectId, requestType, docName, description: message, priority: 'HIGH', deadline: deadline || null });
            
            const res = await fetch('/api/documents/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    corporateId,
                    ngoId,
                    projectId,
                    requestType,
                    docName,
                    description: message,
                    priority: 'HIGH',
                    deadline: deadline || null
                })
            });

            const data = await res.json();
            console.log('API Response:', res.status, data);

            if (!res.ok) {
                throw new Error(data.error || data.details || 'Failed to send request');
            }

            setIsSent(true);
            if (onSuccess) onSuccess(data);
            
            setTimeout(() => {
                setOpen(false);
                setIsSent(false);
                if (!fixedMode) {
                    setSelectedCategory("");
                    setSelectedDoc("");
                }
                setMessage("");
                setDeadline("");
            }, 2000);
        } catch (err) {
            console.error('Error sending document request:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const currentCategory = categories.find(c => c.key === selectedCategory);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (
                    <Button variant="default" className="bg-amber-600 hover:bg-amber-700 gap-2">
                        <Bell size={16} /> Request Document
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{fixedMode ? `Request: ${defaultDoc}` : "Request Missing Document"}</DialogTitle>
                    <DialogDescription>
                        {fixedMode
                            ? `Notify the NGO to submit this document for: ${categoryTitle}`
                            : "Select a document to request from the NGO. They will be notified immediately."
                        }
                    </DialogDescription>
                </DialogHeader>

                {isSent ? (
                    <div className="py-8 text-center text-green-600 space-y-2 animate-in fade-in zoom-in">
                        <CheckCircle2 className="h-16 w-16 mx-auto" />
                        <h3 className="font-bold text-lg">Request Sent!</h3>
                        <p className="text-slate-500 text-sm">The NGO has been notified to submit the document.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 py-4">
                        {!fixedMode && (
                            <>
                                <div className="space-y-2">
                                    <Label>Document Category</Label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.key} value={cat.key}>
                                                    {cat.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedCategory && currentCategory && (
                                    <div className="space-y-2">
                                        <Label>Document Type</Label>
                                        <Select value={selectedDoc} onValueChange={setSelectedDoc}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Document" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currentCategory.docs.map((doc) => (
                                                    <SelectItem key={doc} value={doc}>
                                                        {doc}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="space-y-2">
                            <Label>{selectedDoc === 'Request Additional Document (Not Listed Above)' || defaultDoc === 'Request Additional Document (Not Listed Above)' ? 'Document Description (Required)' : 'Additional Note (Optional)'}</Label>
                            <Textarea
                                placeholder={selectedDoc === 'Request Additional Document (Not Listed Above)' || defaultDoc === 'Request Additional Document (Not Listed Above)' ? "Describe the custom document you need (e.g., 'Photographs of beneficiary training session', 'Invoice for equipment purchased')..." : "E.g., Please ensure the audit period matches Q3..."}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required={selectedDoc === 'Request Additional Document (Not Listed Above)' || defaultDoc === 'Request Additional Document (Not Listed Above)'}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Submission Deadline
                            </Label>
                            <Input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                min={getMinDate()}
                                placeholder="Select deadline"
                                className="w-full"
                            />
                            <p className="text-xs text-slate-500">
                                NGO will receive a warning notification if the document is not submitted by this deadline.
                            </p>
                        </div>

                        <Alert className="bg-amber-50 border-amber-100 text-amber-800">
                            <FileWarning className="h-4 w-4 text-amber-600" />
                            <AlertTitle className="text-xs font-bold uppercase">Important</AlertTitle>
                            <AlertDescription className="text-xs">
                                Repeated requests for the same document might affect the NGO's compliance score.
                            </AlertDescription>
                        </Alert>

                        {error && (
                            <Alert className="bg-red-50 border-red-200 text-red-800">
                                <AlertTitle className="text-xs font-bold">Error</AlertTitle>
                                <AlertDescription className="text-xs">{error}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}

                {!isSent && (
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleSend}
                            disabled={isLoading || (!fixedMode && (!selectedCategory || !selectedDoc)) || ((selectedDoc === 'Request Additional Document (Not Listed Above)' || defaultDoc === 'Request Additional Document (Not Listed Above)') && !message.trim())}
                            className="bg-amber-600 hover:bg-amber-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Request'
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
