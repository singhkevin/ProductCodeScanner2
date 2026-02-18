import { useState } from 'react';
import { ShieldCheck, Loader2, Plus, AlertCircle } from 'lucide-react';
import { dashboardApi } from '../api';

export default function ManualAdd() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        batchNumber: '',
        description: '',
        quantity: '1'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            await dashboardApi.createProduct(formData);
            setSuccess(true);
            setFormData({
                name: '',
                sku: '',
                batchNumber: '',
                description: '',
                quantity: '1'
            });
        } catch (error: any) {
            console.error('Failed to create product', error);
            alert(error.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="pb-6 border-b border-slate-200/50">
                <h1 className="text-3xl font-bold text-white tracking-tight">Provision Single Asset</h1>
                <p className="text-slate-400 mt-1 text-sm">Direct injection terminal for core cryptographic registration</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 premium-card p-10 rounded-[2.5rem] relative group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Asset Identifier</label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Core-X Processor"
                            className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 px-5 py-3 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-600 text-sm outline-none"
                        />
                    </div>
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Stock Unit ID (SKU)</label>
                        <input
                            required
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            placeholder="e.g. SKU-990-CX"
                            className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 px-5 py-3 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-600 text-sm outline-none"
                        />
                    </div>
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Batch Log Hash</label>
                        <input
                            required
                            type="text"
                            name="batchNumber"
                            value={formData.batchNumber}
                            onChange={handleChange}
                            placeholder="e.g. Alpha-2024"
                            className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 px-5 py-3 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-600 text-sm outline-none"
                        />
                    </div>
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Quantity Flux</label>
                        <input
                            required
                            type="number"
                            min="1"
                            max="500"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 px-5 py-3 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Technical Specifications</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Define hardware parameters and verification metadata..."
                        className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 px-5 py-3 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-600 text-sm outline-none resize-none"
                    />
                </div>

                <div className="pt-4">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-xl shadow-indigo-600/20 font-bold text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.99]"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                        {loading ? 'Executing Cypher...' : 'Deploy to Registry'}
                    </button>
                </div>

                {success && (
                    <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center gap-5 animate-in zoom-in-95">
                        <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Provision Complete</p>
                            <p className="text-sm font-semibold text-white mt-0.5">Units registered and cryptographic keys injected successfully.</p>
                        </div>
                    </div>
                )}
            </form>

            <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-3xl flex gap-6 items-center">
                <div className="p-4 bg-white/5 rounded-2xl text-indigo-400 ring-1 ring-white/10 shrink-0">
                    <AlertCircle size={28} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-white font-semibold text-sm">Priority Protocol Active</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        Manual additions bypass standard batch queues. Authentication codes are injected into the global mesh instantly with valid cryptographic signatures. Proceed with caution.
                    </p>
                </div>
            </div>
        </div>
    );
}
