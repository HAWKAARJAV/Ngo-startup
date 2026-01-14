import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function VolunteeringPage() {
    // Mock volunteer events (in production, this would be a separate model)
    // We can link them to existing NGOs from DB to make it partly dynamic
    const ngos = await prisma.nGO.findMany({ take: 3 });

    const events = [
        {
            id: 1,
            title: "Weekend Teaching Drive",
            ngo: ngos[0]?.orgName || "Salaam Baalak Trust",
            date: "Sat, Oct 24 • 10:00 AM",
            location: ngos[0]?.city || "Old Delhi",
            spots: 12,
            type: "Education",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"
        },
        {
            id: 2,
            title: "Yamuna Cleanup Drive",
            ngo: ngos[1]?.orgName || "Goonj",
            date: "Sun, Oct 25 • 06:30 AM",
            location: ngos[1]?.city || "Yamuna Ghat",
            spots: 45,
            type: "Environment",
            image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80"
        },
        {
            id: 3,
            title: "Meal Packaging for Schools",
            ngo: ngos[2]?.orgName || "Akshaya Patra",
            date: "Fri, Oct 30 • 09:00 AM",
            location: ngos[2]?.city || "Vasant Kunj Kitchen",
            spots: 20,
            type: "Nutrition",
            image: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=800&q=80"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Employee Volunteering</h1>
                    <p className="text-muted-foreground mt-1">Engage your workforce in meaningful onsite impact activities.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">View My Calendar</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden border-border transition-all hover:shadow-md group">
                        <div className="h-48 overflow-hidden relative">
                            <div className="absolute top-3 left-3 z-10">
                                <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur shadow-sm">
                                    {event.type}
                                </Badge>
                            </div>
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <CardDescription className="font-medium text-primary">{event.ngo}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar size={16} className="text-slate-400" />
                                {event.date}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin size={16} className="text-slate-400" />
                                {event.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users size={16} className="text-slate-400" />
                                {event.spots} spots remaining
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Register Interest</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Impact Quote */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center mt-12">
                <blockquote className="text-xl font-medium text-blue-900 italic">
                    "The best way to find yourself is to lose yourself in the service of others."
                </blockquote>
                <p className="text-blue-600 font-bold mt-4">— Mahatma Gandhi</p>
            </div>
        </div>
    )
}
