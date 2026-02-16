import { LayoutDashboard, Package, Upload, Map as MapIcon, LogOut, ShieldCheck, Plus } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    user: any;
    onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, user, onLogout }: SidebarProps) {
    const isAdmin = user.role === 'ADMIN';

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
        ...(isAdmin
            ? [{ icon: Package, label: 'Approval Queue', id: 'approvals' }]
            : [
                { icon: Upload, label: 'Bulk Upload', id: 'bulk' },
                { icon: Plus, label: 'Add Product', id: 'add-product' },
                { icon: Package, label: 'Inventory', id: 'inventory' }
            ]
        ),
        { icon: MapIcon, label: 'Fraud Hotspots', id: 'hotspots' },
    ];

    return (
        <div className="w-72 h-screen flex flex-col p-6 bg-[#111111] border-r-[6px] border-black">
            <div className="p-6 mb-10 flex items-center gap-4 bg-[#facc15] border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <ShieldCheck className="text-black" size={32} />
                <span className="font-black text-2xl tracking-tighter text-black uppercase">GuardHub</span>
            </div>

            <nav className="flex-1 space-y-6">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 px-6 py-4 border-[4px] border-black transition-all font-black uppercase tracking-tighter ${activeTab === item.id
                            ? 'bg-[#3b82f6] text-white translate-x-[4px] translate-y-[4px] shadow-none'
                            : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
                            }`}
                    >
                        <item.icon size={22} className={activeTab === item.id ? 'text-white' : 'text-black'} />
                        <span className="text-sm">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 bg-[#ef4444] text-white border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase tracking-tighter"
                >
                    <LogOut size={22} />
                    <span className="text-sm">Sever Session</span>
                </button>
            </div>
        </div>
    );
}
