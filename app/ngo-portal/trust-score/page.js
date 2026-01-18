import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, AlertCircle, Info } from "lucide-react";

// Mock User Retrieval
const getMockUserId = async () => {
    const ngo = await prisma.nGO.findFirst({
        include: { user: true }
    });
    return ngo?.userId;
};

export default async function TrustScorePage() {
    const userId = await getMockUserId();
    if (!userId) return <div>User not found</div>;

    const ngo = await prisma.nGO.findUnique({
        where: { userId }
    });

    if (!ngo) return <div>NGO Profile not found</div>;

    // Parse breakdown (mock logic if string is empty)
    let breakdown = { regulatory: 0, financial: 0, operational: 0, social: 0 };
    try {
        breakdown = JSON.parse(ngo.trustBreakdown || '{"regulatory": 300, "financial": 200, "operational": 100, "social": 50}');
    } catch (e) { console.error("Error parsing breakdown", e); }

    const maxScore = 900;
    const percentage = (ngo.trustScore / maxScore) * 100;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Trust Score Analysis</h1>
                    <p className="text-slate-500">Understand what drives your score and how to improve it.</p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-extrabold text-blue-600">{ngo.trustScore}</div>
                    <div className="text-sm text-slate-500">out of 900</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Score Composition</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Regulatory & Compliance (Max 400)</span>
                                <span className="font-bold">{breakdown.regulatory}</span>
                            </div>
                            <Progress value={(breakdown.regulatory / 400) * 100} className="h-2 bg-slate-100" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Financial Health (Max 300)</span>
                                <span className="font-bold">{breakdown.financial}</span>
                            </div>
                            <Progress value={(breakdown.financial / 300) * 100} className="h-2 bg-slate-100" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Operational Discipline (Max 150)</span>
                                <span className="font-bold">{breakdown.operational}</span>
                            </div>
                            <Progress value={(breakdown.operational / 150) * 100} className="h-2 bg-slate-100" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Social Proof (Max 50)</span>
                                <span className="font-bold">{breakdown.social}</span>
                            </div>
                            <Progress value={(breakdown.social / 50) * 100} className="h-2 bg-slate-100" />
                        </div>
                    </CardContent>
                </Card>

                {/* Improver Actions */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <ArrowUpCircle className="text-green-600 h-5 w-5" /> How to Improve Score
                    </h3>

                    {/* Suggestion 1 */}
                    <Card className="border-l-4 border-l-green-500 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                        <CardContent className="p-4 flex gap-4 items-start">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 mt-1">+50 pts</Badge>
                            <div>
                                <div className="font-bold text-slate-900">Upload Q3 Impact Report</div>
                                <div className="text-sm text-slate-600">Your reporting consistency is dropping. Uploading on time boosts 'Operational Discipline'.</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Suggestion 2 */}
                    <Card className="border-l-4 border-l-green-500 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                        <CardContent className="p-4 flex gap-4 items-start">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 mt-1">+20 pts</Badge>
                            <div>
                                <div className="font-bold text-slate-900">Verify 80G Renewal</div>
                                <div className="text-sm text-slate-600">Your 80G certificate expires in 45 days. Renew now to prevent a score drop.</div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-800">
                        <Info className="h-5 w-5 shrink-0" />
                        Trust Scores are recalculated every Monday at 00:00 IST based on your previous week's activity.
                    </div>
                </div>
            </div>
        </div>
    );
}
