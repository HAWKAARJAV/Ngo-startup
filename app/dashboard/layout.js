"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users,
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Building2,
    HandHeart,
    Search,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import AIChatbotWidget from "@/components/ai-chatbot";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Find NGOs", href: "/dashboard/search", icon: Search },
    { label: "My Projects", href: "/dashboard/projects", icon: HandHeart },
    { label: "Volunteering", href: "/dashboard/volunteering", icon: Users },
    { label: "Live Needs", href: "/live-needs", icon: Users },
    { label: "Reports", href: "/dashboard/reports", icon: FileText },
    { label: "AI Reviewer", href: "/dashboard/proposal-check", icon: Sparkles },
    { label: "Corporate", href: "/dashboard/corporate", icon: Building2 },
];

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ease-in-out",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                    {isSidebarOpen ? (
                        <span className="text-xl font-bold tracking-tight text-blue-400">NGO-CONNECT</span>
                    ) : (
                        <span className="text-xl font-bold text-blue-400">NC</span>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </Button>
                </div>

                <nav className="p-4 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon size={20} />
                                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 justify-start",
                            !isSidebarOpen && "justify-center px-0"
                        )}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={cn(
                    "flex-1 transition-all duration-300 ease-in-out",
                    isSidebarOpen ? "ml-64" : "ml-20"
                )}
            >
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-slate-800">
                        {NAV_ITEMS.find(n => n.href === pathname)?.label || "Dashboard"}
                    </h1>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="hidden md:flex">
                            <Building2 className="mr-2 h-4 w-4" />
                            Reliance Foundation
                        </Button>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    {children}
                </div>

                {/* Global Floating AI Widget */}
                <AIChatbotWidget />
            </main>
        </div>
    );
}
