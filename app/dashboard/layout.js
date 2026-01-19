"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users,
    LayoutDashboard,
    FileText,
    LogOut,
    Menu,
    X,
    Building2,
    HandHeart,
    Search,
    Sparkles,
    MessageCircle,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import AIChatbotWidget from "@/components/ai-chatbot";
import NotificationCenter from "@/components/notification-center";
import socketManager from "@/lib/socket";

import { logout } from "@/app/login/actions";

// Helper to get cookie value
function getCookie(name) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Discover NGOs", href: "/dashboard/discover", icon: Search },
    { label: "My Projects", href: "/dashboard/projects", icon: HandHeart },
    { label: "Chat", href: "/dashboard/chat", icon: MessageCircle },
    { label: "Live Needs", href: "/live-needs", icon: Users },
    { label: "Reports", href: "/dashboard/reports", icon: FileText },
    { label: "AI Reviewer", href: "/dashboard/proposal-check", icon: Sparkles },
];

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userData, setUserData] = useState(null);
    const pathname = usePathname();

    // Get user data from cookie and initialize socket
    useEffect(() => {
        const tokenCookie = getCookie('token');
        if (tokenCookie) {
            try {
                const session = JSON.parse(decodeURIComponent(tokenCookie));
                setUserData(session);
                
                // Connect socket with actual user data
                if (session.role === 'CORPORATE') {
                    socketManager.connect(session.id, 'CORPORATE', session.email.split('@')[0]);
                }
            } catch (e) {
                console.error('Error parsing token:', e);
            }
        }

        return () => {
            // Don't disconnect on unmount as other components may need it
        };
    }, []);

    const handleLogout = async () => {
        socketManager.disconnect();
        await logout();
    };

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
                        onClick={handleLogout}
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
                        {/* Notification Center */}
                        {userData && (
                            <NotificationCenter userId={userData.id} userRole="CORPORATE" />
                        )}
                        
                        <Button variant="outline" className="hidden md:flex">
                            <Building2 className="mr-2 h-4 w-4" />
                            {userData?.email?.split('@')[0] || 'Corporate'}
                        </Button>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>{userData?.email?.substring(0,2).toUpperCase() || 'CO'}</AvatarFallback>
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
