"use client";

import Link from 'next/link';
import {
    LayoutDashboard,
    FileCheck,
    Briefcase,
    Wallet,
    ShieldAlert,
    Settings,
    Menu,
    LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logout } from "@/app/login/actions";

export default function NgoDashboardLayout({ children }) {
    const navItems = [
        { href: '/ngo-portal', label: 'Command Center', icon: LayoutDashboard },
        { href: '/ngo-portal/compliance', label: 'Compliance Ops', icon: FileCheck },
        { href: '/ngo-portal/projects', label: 'Projects', icon: Briefcase },
        { href: '/ngo-portal/finance', label: 'Funds & Grants', icon: Wallet },
        { href: '/ngo-portal/trust-score', label: 'Trust Score', icon: ShieldAlert },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold tracking-tight text-blue-400">NGO Connect</h1>
                <p className="text-xs text-slate-400 mt-1">Operational Console</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
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
                    onClick={async () => await logout()}
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

            {/* Mobile Sidebar */}
            <div className="md:hidden fixed top-4 left-4 z-50">
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
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
