import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StoriesPage() {
    const stories = [
        {
            id: 1,
            title: "Clean Water for 5,000 Families",
            ngo: "Smile Foundation",
            location: "Rajasthan",
            category: "Healthcare",
            image: "https://images.unsplash.com/photo-1541976844346-618be1b1f297?w=800&q=80",
            impact: "Installed 15 community RO plants reducing waterborne diseases by 60%.",
            raised: "₹12,00,000",
            donors: 45
        },
        {
            id: 2,
            title: "Digital Schools in Rural Maharashtra",
            ngo: "Pratham",
            location: "Pune District",
            category: "Education",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
            impact: "Equipped 20 schools with smart classrooms and tablets.",
            raised: "₹25,00,000",
            donors: 112
        },
        {
            id: 3,
            title: "Disaster Relief: Flood Response",
            ngo: "Goonj",
            location: "Assam",
            category: "Disaster Relief",
            image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80",
            impact: "Provided 10,000 'Rahat' kits with dry ration and clothes.",
            raised: "₹50,00,000",
            donors: 320
        },
        {
            id: 4,
            title: "Skill Training for Women",
            ngo: "SEWA",
            location: "Gujarat",
            category: "Livelihood",
            image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80",
            impact: "Trained 500 women in textile and handicraft design.",
            raised: "₹15,00,000",
            donors: 85
        },
        {
            id: 5,
            title: "Urban Forestation Drive",
            ngo: "Green Yatra",
            location: "Mumbai",
            category: "Environment",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?w=800&q=80",
            impact: "Planted 50,000 saplings using Miyawaki technique.",
            raised: "₹18,00,000",
            donors: 210
        },
        {
            id: 6,
            title: "Nutrition for Street Children",
            ngo: "Akshaya Patra",
            location: "Delhi NCR",
            category: "Hunger",
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
            impact: "Served 1 million hot meals in 6 months.",
            raised: "₹45,00,000",
            donors: 500
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-slate-900 py-16 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <Badge variant="outline" className="border-blue-400 text-blue-200 mb-4 px-4 py-1">Impact Gallery</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Real Stories. Real Change.</h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
                        Discover how verified NGOs and committed corporates are transforming lives across India, one project at a time.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/dashboard"><Button size="lg" className="bg-white text-slate-900 hover:bg-slate-200">Start Your Journey</Button></Link>
                    </div>
                </div>
            </header>

            {/* Stories Grid */}
            <main className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stories.map(story => (
                        <Card key={story.id} className="group overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={story.image}
                                    alt={story.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <Badge className="absolute top-4 right-4 bg-white/90 text-slate-900 border-none backdrop-blur-sm">
                                    {story.category}
                                </Badge>
                            </div>
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${story.ngo}&background=random`} />
                                        <AvatarFallback>{story.ngo[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-semibold text-slate-500">{story.ngo}</span>
                                    <span className="text-xs text-slate-300">•</span>
                                    <span className="text-xs text-slate-500">{story.location}</span>
                                </div>
                                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{story.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 text-sm mb-4">
                                    {story.impact}
                                </p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-500">Raised</span>
                                        <span className="text-green-600">{story.raised}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-green-500 h-full rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-slate-50/50 p-4 flex justify-between">
                                <div className="flex items-center gap-1 text-slate-500 text-sm">
                                    <Heart className="h-4 w-4 text-red-500 fill-red-500" /> {story.donors} Supporters
                                </div>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0 hover:bg-transparent">
                                    Read Role <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>

            {/* Footer CTA */}
            <section className="bg-blue-600 py-16 text-center text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-4">Ready to Create Your Own Success Story?</h2>
                    <p className="mb-8 text-blue-100 max-w-xl mx-auto">Join 50+ Verified NGOs and Top Corporates in making a measurable difference.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/register/corporate">
                            <Button size="lg" variant="secondary" className="font-bold">Partner as Corporate</Button>
                        </Link>
                        <Link href="/register/ngo">
                            <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white border border-blue-500">Register NGO</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
