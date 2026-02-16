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

    if (loading) return <div className="text-slate-400 p-8">Loading queue...</div>;

    const pending = requests.filter(r => r.status === 'PENDING');
    const history = requests.filter(r => r.status !== 'PENDING');

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            <div className="px-2">
                <h1 className="text-3xl font-black text-white tracking-tight">APPROVAL PIPELINE</h1>
                <p className="text-slate-500 font-medium italic mt-1 font-mono tracking-tighter">Verification mesh for external bulk asset registration</p>
            </div>

            {/* Pending Requests */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 px-2">
                    <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                    <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                        Live Ingress Queue ({pending.length})
                    </h2>
                </div>

                {pending.length === 0 ? (
                    <div className="neu-pressed p-16 rounded-[3rem] text-center border-2 border-dashed border-slate-800/50">
                        <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">Registry is synchronized. No pending payloads.</p>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {pending.map((req) => (
                            <div key={req.id} className="neu-flat p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 group hover:scale-[1.01] transition-all duration-300">
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="p-5 rounded-2xl neu-pressed text-blue-400">
                                        <Building2 size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white text-xl tracking-tight group-hover:text-blue-400 transition-colors uppercase">{req.company.name}</h3>
                                        <div className="flex flex-wrap items-center gap-4 mt-2">
                                            <div className="neu-pressed-sm px-3 py-1 rounded-lg flex items-center gap-2">
                                                <FileText size={12} className="text-slate-500" />
                                                <span className="text-slate-400 text-[10px] font-black uppercase italic tracking-tighter">{req.filename}</span>
                                            </div>
                                            <div className="neu-pressed-sm px-3 py-1 rounded-lg flex items-center gap-2 border-l-2 border-blue-500/20">
                                                <Calendar size={12} className="text-slate-500" />
                                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-tighter">{new Date(req.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                                    <button
                                        onClick={() => handleAction(req.id, 'REJECT')}
                                        disabled={!!processing}
                                        className="neu-button p-5 rounded-2xl text-red-500 hover:text-red-400 transition-all active:scale-95"
                                        title="Purge Payload"
                                    >
                                        <X size={24} />
                                    </button>
                                    <button
                                        onClick={() => handleAction(req.id, 'APPROVE')}
                                        disabled={!!processing}
                                        className="neu-button px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 text-green-400 hover:text-green-300 disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        {processing === req.id ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
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
                <div className="flex items-center gap-4 px-2">
                    <div className="w-2.5 h-2.5 bg-slate-600 rounded-full"></div>
                    <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Processing Ledger</h2>
                </div>
                <div className="neu-flat rounded-[3rem] p-4 overflow-hidden">
                    <div className="neu-pressed rounded-[2.5rem] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/40 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                    <th className="px-8 py-6">Origin Entity</th>
                                    <th className="px-8 py-6">Logic State</th>
                                    <th className="px-8 py-6">Commit Sync</th>
                                    <th className="px-8 py-6 text-right">Batch Hex</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/30">
                                {history.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-800/10 transition-colors group">
                                        <td className="px-8 py-6 font-black text-slate-200 tracking-tight group-hover:text-white transition-colors uppercase">{req.company.name}</td>
                                        <td className="px-8 py-6">
                                            <span className={`neu-flat-sm px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${req.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-[11px] font-bold text-slate-500 font-mono italic">
                                            {new Date(req.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6 text-right font-mono text-slate-700 text-[11px] font-black group-hover:text-blue-500/50 transition-colors tracking-widest">
                                            {req.id.slice(0, 8).toUpperCase()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {history.length === 0 && (
                        <div className="py-12 text-center text-slate-600 font-black uppercase tracking-widest text-[9px]">Ledger is empty</div>
                    )}
                </div>
            </div>
        </div>
    );
}
