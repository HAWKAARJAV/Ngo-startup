"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, HeartHandshake } from "lucide-react";
import { useState } from "react";

const EVENTS = [
    {
        id: 1,
        title: "Weekend Teaching Drive",
        ngo: "Vidya Foundation",
        location: "Dwarka, Delhi",
        date: "Sat, 24 Feb",
        time: "10:00 AM - 2:00 PM",
        spots: 5,
        type: "On-Site"
    },
    {
        id: 2,
        title: "Fundraising Strategy Call",
        ngo: "Green Earth Society",
        location: "Remote (Zoom)",
        date: "Fri, 23 Feb",
        time: "6:00 PM - 7:00 PM",
        spots: 1,
        type: "Remote"
    },
    {
        id: 3,
        title: "Food Distribution Drive",
        ngo: "Roti Bank",
        location: "CP, Delhi",
        date: "Sun, 25 Feb",
        time: "8:00 AM - 11:00 AM",
        spots: 12,
        type: "On-Site"
    }
];

export default function VolunteeringPage() {
    const [joined, setJoined] = useState([]);

    const handleJoin = (id) => {
        setJoined([...joined, id]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <HeartHandshake className="text-red-500" /> Employee Volunteering
                    </h1>
                    <p className="text-slate-500">Engage your employees in meaningful social impact.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {EVENTS.map(event => {
                    const isJoined = joined.includes(event.id);

                    return (
                        <Card key={event.id} className="hover:shadow-lg transition-all border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                        {event.type}
                                    </Badge>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        {event.spots} Spots Left
                                    </span>
                                </div>
                                <CardTitle className="text-xl">{event.title}</CardTitle>
                                <CardDescription>{event.ngo}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <MapPin size={16} className="text-slate-400" /> {event.location}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Calendar size={16} className="text-slate-400" /> {event.date} • {event.time}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className={`w-full ${isJoined ? "bg-green-600 hover:bg-green-700" : "bg-slate-900"}`}
                                    onClick={() => handleJoin(event.id)}
                                    disabled={isJoined}
                                >
                                    {isJoined ? (
                                        <><Users size={16} className="mr-2" /> Registered</>
                                    ) : "Join Event"}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
