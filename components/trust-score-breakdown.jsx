"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, ShieldCheck, FileText } from "lucide-react";

export default function TrustScoreBreakdown({ score, breakdownJson, expenseRatio }) {
    let breakdown = { compliance: 0, financial: 0, impact: 0 };
    try {
        breakdown = JSON.parse(breakdownJson || "{}");
    } catch (e) { }

    // Normalize for display (assuming max roughly 40/30/30)
    // We want to show them as 100% bars relative to their own max
    const compliancePct = (breakdown.compliance / 40) * 100 || 0;
    const financialPct = (breakdown.financial / 30) * 100 || 0;
    const impactPct = (breakdown.impact / 30) * 100 || 0;

    return (
        <Card className="bg-slate-50/50 border-slate-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                    <span>Trust Score Analysis</span>
                    <Badge variant={score > 80 ? "default" : "secondary"} className="text-lg px-3 py-1">
                        {score}/100
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                {/* Compliance */}
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-1 text-slate-600"><ShieldCheck size={14} /> Regulatory Compliance</span>
                        <span className="font-bold text-slate-900">{breakdown.compliance}/40</span>
                    </div>
                    <Progress value={compliancePct} className="h-2 bg-slate-200" indicatorClassName="bg-blue-600" />
                    <p className="text-[10px] text-slate-400 mt-1">Based on 12A, 80G, FCRA & CSR-1 validity.</p>
                </div>

                {/* Financial */}
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-1 text-slate-600"><TrendingUp size={14} /> Financial Health</span>
                        <span className="font-bold text-slate-900">{breakdown.financial}/30</span>
                    </div>
                    <Progress value={financialPct} className="h-2 bg-slate-200" indicatorClassName="bg-green-600" />
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-[10px] text-slate-400">Expense Ratio: {expenseRatio}% (Industry Avg: 15%)</p>
                    </div>
                </div>

                {/* Impact */}
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-1 text-slate-600"><FileText size={14} /> Ops & Reporting</span>
                        <span className="font-bold text-slate-900">{breakdown.impact}/30</span>
                    </div>
                    <Progress value={impactPct} className="h-2 bg-slate-200" indicatorClassName="bg-purple-600" />
                    <p className="text-[10px] text-slate-400 mt-1">Based on active projects & verified documents.</p>
                </div>

            </CardContent>
        </Card>
    );
}
