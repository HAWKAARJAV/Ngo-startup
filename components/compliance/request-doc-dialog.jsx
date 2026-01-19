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
import { Bell, CheckCircle2, FileWarning } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RequestDocDialog({
    categories = [],
    fixedMode = false,
    defaultCategory = "",
    defaultDoc = "",
    categoryTitle = "",
    trigger
}) {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
    const [selectedDoc, setSelectedDoc] = useState(defaultDoc);
    const [message, setMessage] = useState("");
    const [isSent, setIsSent] = useState(false);

    const handleSend = () => {
        // Here we would typically call a server action to send the notification
        setIsSent(true);
        setTimeout(() => {
            setOpen(false);
            setIsSent(false); // Reset for next time
            if (!fixedMode) {
                setSelectedCategory("");
                setSelectedDoc("");
            }
            setMessage("");
        }, 2000);
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

                        <Alert className="bg-amber-50 border-amber-100 text-amber-800">
                            <FileWarning className="h-4 w-4 text-amber-600" />
                            <AlertTitle className="text-xs font-bold uppercase">Important</AlertTitle>
                            <AlertDescription className="text-xs">
                                Repeated requests for the same document might affect the NGO's compliance score.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                {!isSent && (
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleSend}
                            disabled={!selectedCategory || !selectedDoc || ((selectedDoc === 'Request Additional Document (Not Listed Above)' || defaultDoc === 'Request Additional Document (Not Listed Above)') && !message.trim())}
                            className="bg-amber-600 hover:bg-amber-700"
                        >
                            Send Request
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
