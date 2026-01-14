"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Activity, DollarSign, HandHeart, Trophy } from "lucide-react";

export default function EcosystemFeed() {
    const ACTIVITIES = [
        {
            user: "Reliance Foundation",
            action: "funded",
            target: "Project Shiksha",
            time: "2 mins ago",
            amount: "₹12L",
            icon: DollarSign,
            color: "text-green-600 bg-green-100"
        },
        {
            user: "Deepalaya NGO",
            action: "posted impact",
            target: "Q3 Education Report",
            time: "15 mins ago",
            icon: Activity,
            color: "text-blue-600 bg-blue-100"
        },
        {
            user: "Rahul M.",
            action: "volunteered for",
            target: "Food Drive @ CP",
            time: "1 hour ago",
            icon: HandHeart,
            color: "text-rose-600 bg-rose-100"
        },
        {
            user: "Goonj",
            action: "won grant",
            target: "Tech For Good 2025",
            time: "3 hours ago",
            icon: Trophy,
            color: "text-amber-600 bg-amber-100"
        }
    ];

    return (
        <Card className="h-full">
            <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" /> Live Ecosystem
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
                {ACTIVITIES.map((item, i) => (
                    <div key={i} className="flex gap-3 relative">
                        {/* Connecting Line */}
                        {i !== ACTIVITIES.length - 1 && (
                            <div className="absolute left-[18px] top-10 bottom-[-20px] w-[2px] bg-slate-100" />
                        )}

                        <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                            <item.icon size={16} />
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-slate-800">
                                <span className="font-semibold">{item.user}</span> {item.action} <span className="font-medium text-slate-900">{item.target}</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">{item.time}</span>
                                {item.amount && (
                                    <Badge variant="outline" className="text-[10px] h-5 px-1 border-green-200 text-green-700 bg-green-50">
                                        {item.amount}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
