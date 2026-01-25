import Link from 'next/link';
import {
    ShieldAlert,
    Users,
    Building2,
    Wallet,
    Activity,
    Settings,
    Lock,
    LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
    title: 'Admin Portal | CorpoGN',
    description: 'Super Administrator Console',
};

export default function AdminLayout({ children }) {
    const navItems = [
        { href: '/admin/dashboard', label: 'Global Cockpit', icon: Activity },
        { href: '/admin/ngos', label: 'NGO Registry', icon: Users },
        { href: '/admin/corporates', label: 'Donor Registry', icon: Building2 },
        { href: '/admin/finance', label: 'Fund Control', icon: Wallet },
        { href: '/admin/audit-logs', label: 'System Audit', icon: ShieldAlert },
        { href: '/admin/settings', label: 'System Config', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-neutral-900 text-neutral-100">
            {/* Admin Sidebar - Always Dark */}
            <aside className="w-64 flex flex-col border-r border-neutral-800 bg-black">
                <div className="p-6 flex items-center gap-2 border-b border-neutral-800">
                    <Lock className="h-6 w-6 text-red-600" />
                    <div>
                        <h1 className="font-bold text-lg tracking-wider text-neutral-100">GOD MODE</h1>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500">Super Admin</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-neutral-800">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center text-red-500 text-xs font-bold">
                            SA
                        </div>
                        <div>
                            <div className="text-sm font-medium">System Admin</div>
                            <div className="text-xs text-neutral-600">admin@ngoconnect.in</div>
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-neutral-800">
                        <LogOut className="h-4 w-4 mr-2" />
                        Secure Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto bg-neutral-950">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
