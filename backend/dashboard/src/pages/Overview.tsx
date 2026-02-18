import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShieldCheck, ShieldAlert, Package, TrendingUp } from 'lucide-react';
import { dashboardApi } from '../api';

export default function Overview({ user }: { user: any }) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState<any[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<string>('');

    const isAdmin = user.role === 'ADMIN';

    useEffect(() => {
        if (isAdmin) {
            dashboardApi.getCompanies().then(res => setCompanies(res.data));
        }
    }, [isAdmin]);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const cid = isAdmin ? selectedCompany : user.companyId;
                const response = await dashboardApi.getOverviewStats(cid);
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [selectedCompany, user.companyId, isAdmin]);

    const displayStats = stats ? [
        { label: 'Total Scans', value: stats.totalScans.toLocaleString(), change: '+12.5%', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Genuine Products', value: stats.genuineScans.toLocaleString(), change: '+8.2%', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Fake Detected', value: stats.fakeScans.toLocaleString(), change: '-3.1%', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Registered Units', value: stats.registeredProducts.toLocaleString(), change: '+4.9%', icon: Package, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ] : [];

    const mockData = [
        { name: 'Mon', genuine: 400, fake: 24 },
        { name: 'Tue', genuine: 300, fake: 13 },
        { name: 'Wed', genuine: 200, fake: 98 },
        { name: 'Thu', genuine: 278, fake: 39 },
        { name: 'Fri', genuine: 189, fake: 48 },
        { name: 'Sat', genuine: 239, fake: 38 },
        { name: 'Sun', genuine: 349, fake: 43 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/50">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">System Intelligence</h1>
                    <p className="text-slate-400 mt-1 text-sm">Real-time product verification and security telemetry</p>
                </div>

                {isAdmin && (
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Node</label>
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-2 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm outline-none cursor-pointer min-w-[200px]"
                        >
                            <option value="">Global Registry</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center py-24 gap-4">
                    <div className="w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium text-sm">Gathering metrics...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayStats.map((stat, idx) => (
                        <div key={idx} className="premium-card p-6 rounded-2xl group">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                    <h3 className="text-3xl font-bold text-white tabular-nums">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} ring-1 ring-white/10 group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={22} />
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {stat.change}
                                </span>
                                <span className="text-slate-500 text-[11px] font-medium">vs last month</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="premium-card p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Scan Matrix</h3>
                            <p className="text-xs text-slate-500 mt-1">Daily verification distribution</p>
                        </div>
                        <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Live Sync</span>
                    </div>
                    <div className="h-72 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockData}>
                                <XAxis dataKey="name" stroke="#475569" fontSize={11} axisLine={false} tickLine={false} />
                                <YAxis stroke="#475569" fontSize={11} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#ffffff10' }}
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                                        color: '#f1f5f9'
                                    }}
                                />
                                <Bar dataKey="genuine" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={16} />
                                <Bar dataKey="fake" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="premium-card p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Threat Stream</h3>
                            <p className="text-xs text-slate-500 mt-1">Anomalous activity detection</p>
                        </div>
                        <span className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase italic">Critical Path</span>
                    </div>
                    <div className="h-72 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockData}>
                                <XAxis dataKey="name" stroke="#475569" fontSize={11} axisLine={false} tickLine={false} />
                                <YAxis stroke="#475569" fontSize={11} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="fake"
                                    stroke="#f43f5e"
                                    strokeWidth={3}
                                    dot={{ fill: '#f43f5e', r: 4, strokeWidth: 2, stroke: '#1e293b' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
