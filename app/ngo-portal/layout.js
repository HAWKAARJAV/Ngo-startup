"use client";

import { useEffect, useState, useId } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileCheck,
    Briefcase,
    Wallet,
    ShieldAlert,
    Settings,
    Menu,
    LogOut,
    MessageCircle,
    Inbox,
    Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/app/login/actions";
import NotificationCenter from '@/components/notification-center';
import socketManager from '@/lib/socket';

// Helper to get cookie value
function getCookie(name) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

export default function NgoDashboardLayout({ children }) {
    const pathname = usePathname();
    const [userData, setUserData] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const sheetId = useId();
    
    // Hydration fix - only render client-specific content after mount
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // Get user data from cookie and initialize socket
    useEffect(() => {
        const tokenCookie = getCookie('token');
        if (tokenCookie) {
            try {
                const session = JSON.parse(decodeURIComponent(tokenCookie));
                setUserData(session);
                
                // Connect socket with actual user data
                if (session.role === 'NGO') {
                    socketManager.connect(session.id, 'NGO', session.email.split('@')[0]);
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

    const navItems = [
        { href: '/ngo-portal', label: 'Command Center', icon: LayoutDashboard },
        { href: '/ngo-portal/projects', label: 'Projects', icon: Briefcase },
        { href: '/ngo-portal/chat', label: 'Messages', icon: MessageCircle },
        { href: '/ngo-portal/compliance', label: 'Compliance Vault', icon: FileCheck },
        { href: '/ngo-portal/trust-score', label: 'Trust Score', icon: ShieldAlert },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold tracking-tight text-blue-400">NGO Connect</h1>
                <p className="text-xs text-slate-400 mt-1">Operational Console</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || 
                        (item.href !== '/ngo-portal' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                isActive 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 mb-2"
                >
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                </Button>
                <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 shrink-0 shadow-xl z-20">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar - Only render after hydration */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                {isMounted ? (
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline" className="bg-slate-900 border-slate-700 text-white">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 border-r-slate-800 bg-slate-900 w-64 text-white">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                ) : (
                    <Button size="icon" variant="outline" className="bg-slate-900 border-slate-700 text-white">
                        <Menu className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto">
                {/* Top Header for NGO Portal */}
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-slate-800">
                        {navItems.find(n => pathname === n.href || (n.href !== '/ngo-portal' && pathname.startsWith(n.href)))?.label || "NGO Portal"}
                    </h1>

                    <div className="flex items-center gap-4">
                        {/* Notification Center */}
                        {userData && (
                            <NotificationCenter userId={userData.id} userRole="NGO" />
                        )}
                        
                        <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=40&h=40&fit=crop" />
                            <AvatarFallback>{userData?.email?.substring(0,2).toUpperCase() || 'NG'}</AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
