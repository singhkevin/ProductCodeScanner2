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
            ? [
                { icon: Package, label: 'Approval Queue', id: 'approvals' },
                { icon: Package, label: 'Active Inventory', id: 'inventory' }
            ]
            : [
                { icon: Upload, label: 'Bulk Upload', id: 'bulk' },
                { icon: Plus, label: 'Add Product', id: 'add-product' },
                { icon: Package, label: 'Inventory', id: 'inventory' }
            ]
        ),
        { icon: MapIcon, label: 'Fraud Hotspots', id: 'hotspots' },
    ];

    return (
        <div className="w-72 h-screen flex flex-col p-6 bg-slate-900/95 backdrop-blur-md border-r border-slate-800">
            <div className="px-4 py-8 mb-10 flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-500/20">
                    <ShieldCheck className="text-white" size={26} />
                </div>
                <span className="font-bold text-xl tracking-tight text-white uppercase">GuardHub</span>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${activeTab === item.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'} />
                        <span className="text-sm font-semibold">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-5 py-4 text-rose-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-2xl transition-all duration-300 font-bold uppercase tracking-wider text-[10px]"
                >
                    <LogOut size={20} />
                    <span>End Session</span>
                </button>
            </div>
        </div>
    );
}
