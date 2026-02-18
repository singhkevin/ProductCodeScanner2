import { useState, useEffect } from 'react';
import { dashboardApi } from '../api';
import { Check, X, FileText, Calendar, Building2, Loader2 } from 'lucide-react';

export default function ApprovalQueue() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            const res = await dashboardApi.getBulkRequests();
            setRequests(res.data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
        setProcessing(id);
        try {
            await dashboardApi.handleBulkRequest(id, { action });
            await fetchRequests();
        } catch (error) {
            console.error('Failed to process request', error);
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium">Hydrating pipeline...</p>
        </div>
    );

    const pending = requests.filter(r => r.status === 'PENDING');
    const history = requests.filter(r => r.status !== 'PENDING');

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="pb-6 border-b border-slate-200/50">
                <h1 className="text-3xl font-bold text-white tracking-tight">Approval Pipeline</h1>
                <p className="text-slate-400 mt-1 text-sm">Verification terminal for physical-to-digital asset mapping</p>
            </div>

            {/* Pending Requests */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.5)]"></div>
                    <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                        Live Ingress Queue ({pending.length})
                    </h2>
                </div>

                {pending.length === 0 ? (
                    <div className="bg-slate-900/20 border-2 border-dashed border-slate-800 p-16 rounded-[2.5rem] text-center">
                        <p className="text-slate-600 font-semibold uppercase tracking-widest text-[10px]">Registry is synchronized. No pending payloads.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {pending.map((req) => (
                            <div key={req.id} className="premium-card p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 group">
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="p-5 rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-white/5">
                                        <Building2 size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-xl tracking-tight group-hover:text-indigo-400 transition-colors">{req.company.name}</h3>
                                        <div className="flex flex-wrap items-center gap-3 mt-3">
                                            <div className="bg-white/5 px-3 py-1 rounded-lg flex items-center gap-2 border border-white/5">
                                                <FileText size={12} className="text-slate-500" />
                                                <span className="text-slate-400 text-[10px] font-bold uppercase italic tracking-tighter">{req.filename}</span>
                                            </div>
                                            <div className="bg-white/5 px-3 py-1 rounded-lg flex items-center gap-2 border border-white/5">
                                                <Calendar size={12} className="text-slate-500" />
                                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">{new Date(req.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                    <button
                                        onClick={() => handleAction(req.id, 'REJECT')}
                                        disabled={!!processing}
                                        className="p-4 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-rose-500/5 ring-1 ring-rose-500/20"
                                        title="Purge Payload"
                                    >
                                        <X size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleAction(req.id, 'APPROVE')}
                                        disabled={!!processing}
                                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
                                    >
                                        {processing === req.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                        Initialize & Inject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* History Feed */}
            <div className="space-y-6 pt-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                    <h2 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Processing Ledger</h2>
                </div>
                <div className="premium-card rounded-[2rem] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                                    <th className="px-8 py-6">Origin Entity</th>
                                    <th className="px-8 py-6">Logic State</th>
                                    <th className="px-8 py-6">Commit Sync</th>
                                    <th className="px-8 py-6 text-right">Batch Hex</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.map((req) => (
                                    <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-6 font-bold text-slate-200 tracking-tight group-hover:text-white transition-colors uppercase">{req.company.name}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ring-1 ${req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' : 'bg-rose-500/10 text-rose-500 ring-rose-500/20'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-[11px] font-medium text-slate-500 font-mono italic">
                                            {new Date(req.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6 text-right font-mono text-slate-600 text-[10px] group-hover:text-indigo-400 transition-colors uppercase">
                                            {req.id.slice(0, 8)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {history.length === 0 && (
                        <div className="py-16 text-center text-slate-700 font-bold uppercase tracking-widest text-[9px]">Ledger is empty</div>
                    )}
                </div>
            </div>
        </div>
    );
}
