import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
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
                // If company, use their companyId. If admin, use selectedCompany.
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
        { label: 'Total Scans', value: stats.totalScans.toLocaleString(), change: '+0%', icon: TrendingUp, color: 'text-blue-500' },
        { label: 'Genuine Products', value: stats.genuineScans.toLocaleString(), change: '+0%', icon: ShieldCheck, color: 'text-green-500' },
        { label: 'Fake Detected', value: stats.fakeScans.toLocaleString(), change: '+0%', icon: ShieldAlert, color: 'text-red-500' },
        { label: 'Registered Units', value: stats.registeredProducts.toLocaleString(), change: '+0%', icon: Package, color: 'text-purple-500' },
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
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2 border-b-[4px] border-black pb-8">
                <div>
                    <h1 className="text-4xl font-black text-black tracking-tighter uppercase selection:bg-black selection:text-[#facc15]">Market Intelligence</h1>
                    <p className="text-black font-black italic mt-1 font-mono tracking-tighter uppercase text-xs">Real-time product verification & threat matrix</p>
                </div>

                {isAdmin && (
                    <div className="flex flex-col md:flex-row md:items-center gap-4 group">
                        <label className="text-black text-[11px] font-black uppercase tracking-widest">Active Node:</label>
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="bg-white text-black px-6 py-3 border-[4px] border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase text-sm cursor-pointer appearance-none min-w-[240px]"
                        >
                            <option value="">GLOBAL_REGISTRY</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center py-24 gap-6">
                    <div className="w-14 h-14 border-[6px] border-black border-t-[#3b82f6] animate-spin"></div>
                    <p className="text-black font-black tracking-[0.2em] text-xs uppercase">Deciphering Telemetry...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {displayStats.map((stat, idx) => (
                        <div key={idx} className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-black/50 uppercase tracking-[0.2em]">{stat.label}</p>
                                    <h3 className="text-4xl font-black text-black tracking-tighter">{stat.value}</h3>
                                </div>
                                <div className={`p-4 border-[3px] border-black bg-[#eeeeee] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#facc15] transition-colors ${stat.color}`}>
                                    <stat.icon size={28} />
                                </div>
                            </div>
                            <div className="mt-10 flex items-center gap-4">
                                <div className="bg-[#22c55e] border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <span className="text-black text-[10px] font-black tracking-widest">{stat.change}</span>
                                </div>
                                <span className="text-black/60 text-[10px] uppercase font-black tracking-tighter italic">Δ Velocity Index</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-10">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-sm font-black text-black uppercase tracking-[0.3em]">Scan Registry Matrix</h3>
                        <div className="bg-[#3b82f6] text-white border-2 border-black px-4 py-1.5 text-[10px] font-black tracking-widest uppercase">7d_Log_Mesh</div>
                    </div>
                    <div className="h-80 w-full border-[3px] border-black bg-[#f8f9fa] p-4 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockData}>
                                <CartesianGrid strokeDasharray="0" stroke="#000000" strokeWidth={1} vertical={false} opacity={0.1} />
                                <XAxis dataKey="name" stroke="#000000" axisLine={{ strokeWidth: 3 }} tickLine={false} fontSize={10} fontWeight="900" tick={{ fill: '#000000' }} />
                                <YAxis stroke="#000000" axisLine={{ strokeWidth: 3 }} tickLine={false} fontSize={10} fontWeight="900" tick={{ fill: '#000000' }} />
                                <Tooltip
                                    cursor={{ fill: '#000000', opacity: 0.1 }}
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '4px solid #000000',
                                        borderRadius: '0px',
                                        boxShadow: '4px 4px 0px 0px #000000',
                                        padding: '10px'
                                    }}
                                />
                                <Bar dataKey="genuine" fill="#3b82f6" barSize={24} stroke="#000000" strokeWidth={2} />
                                <Bar dataKey="fake" fill="#ef4444" barSize={24} stroke="#000000" strokeWidth={2} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-10">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-sm font-black text-black uppercase tracking-[0.3em]">Threat Vector Stream</h3>
                        <div className="bg-[#ef4444] text-white border-2 border-black px-4 py-1.5 text-[10px] font-black tracking-widest uppercase italic">Sec_Protocol_Active</div>
                    </div>
                    <div className="h-80 w-full border-[3px] border-black bg-[#f8f9fa] p-4 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockData}>
                                <CartesianGrid strokeDasharray="0" stroke="#000000" strokeWidth={1} vertical={false} opacity={0.1} />
                                <XAxis dataKey="name" stroke="#000000" axisLine={{ strokeWidth: 3 }} tickLine={false} fontSize={10} fontWeight="900" />
                                <YAxis stroke="#000000" axisLine={{ strokeWidth: 3 }} tickLine={false} fontSize={10} fontWeight="900" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '4px solid #000000',
                                        borderRadius: '0px',
                                        boxShadow: '4px 4px 0px 0px #000000'
                                    }}
                                />
                                <Line
                                    type="stepAfter"
                                    dataKey="fake"
                                    stroke="#ef4444"
                                    strokeWidth={6}
                                    dot={{ fill: '#ffffff', stroke: '#000000', strokeWidth: 3, r: 6 }}
                                    activeDot={{ r: 8, strokeWidth: 4, fill: '#ef4444', stroke: '#000000' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
