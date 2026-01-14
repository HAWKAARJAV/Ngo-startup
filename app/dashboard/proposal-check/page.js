"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { analyzeProposal } from "@/app/actions/ai-proposal";

export default function ProposalCheckPage() {
    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = async () => {
        if (!draft) return;
        setLoading(true);
        const response = await analyzeProposal(draft);
        setResult(response);
        setLoading(false);
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="text-purple-600" /> AI Proposal Reviewer
                    </h1>
                    <p className="text-slate-500">
                        Get instant feedback on your grant proposal before submitting.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Draft Proposal</CardTitle>
                        <CardDescription>
                            Paste your project description, objectives, and impact goals.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="e.g. Project 'Shiksha' aims to provide vocational training to 500 women in..."
                            className="min-h-[400px] font-mono text-sm leading-relaxed"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                        />
                        <Button
                            className="w-full bg-purple-700 hover:bg-purple-800"
                            size="lg"
                            onClick={handleAnalyze}
                            disabled={loading || !draft}
                        >
                            {loading ? "Analyzing with Gemini..." : "Score My Proposal"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Section */}
                <div className="space-y-6">
                    {result ? (
                        <>
                            <Card className="border-purple-100 bg-purple-50/50">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-purple-900">Success Probability</CardTitle>
                                        <span className="text-3xl font-bold text-purple-700">{result.score}/100</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Progress value={result.score} className="h-3 bg-purple-200" indicatorClassName="bg-purple-600" />
                                    <p className="text-sm text-purple-600 mt-2 font-medium">
                                        {result.verdict}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Strengths</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {result.strengths.map((s, i) => (
                                        <div key={i} className="flex gap-2 text-sm text-slate-700">
                                            <CheckCircle2 className="text-green-600 h-5 w-5 shrink-0" />
                                            {s}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Areas for Improvement</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {result.weaknesses.map((w, i) => (
                                        <div key={i} className="flex gap-2 text-sm text-slate-700">
                                            <AlertCircle className="text-amber-600 h-5 w-5 shrink-0" />
                                            {w}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <div className="bg-slate-900 text-white p-4 rounded-lg text-sm">
                                <strong className="block mb-1 text-purple-300">💡 AI Suggestion:</strong>
                                {result.suggestion}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed rounded-xl p-10">
                            <Sparkles size={48} className="mb-4 opacity-20" />
                            <p>AI analysis results will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
