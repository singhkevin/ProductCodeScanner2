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
        <div className="max-w-4xl space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="px-2 border-b-[4px] border-black pb-8">
                <h1 className="text-4xl font-black text-black tracking-tighter uppercase selection:bg-black selection:text-[#facc15]">Provision Asset</h1>
                <p className="text-black font-black italic mt-1 font-mono tracking-tighter uppercase text-xs">Cryptographic registry & unit injection terminal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 bg-white border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 relative group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-black uppercase tracking-[0.3em] ml-1">ASSET_IDENTIFIER</label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. CORE-X PROCESSOR"
                            className="w-full bg-white text-black px-6 py-4 border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all placeholder:text-black/30 font-black uppercase text-sm outline-none"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-black uppercase tracking-[0.3em] ml-1">STOCK_UNIT_ID (SKU)</label>
                        <input
                            required
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            placeholder="e.g. SKU-990-CX"
                            className="w-full bg-white text-black px-6 py-4 border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all placeholder:text-black/30 font-black uppercase text-sm outline-none"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-black uppercase tracking-[0.3em] ml-1">BATCH_LOG_HASH</label>
                        <input
                            required
                            type="text"
                            name="batchNumber"
                            value={formData.batchNumber}
                            onChange={handleChange}
                            placeholder="e.g. ALPHA-2024"
                            className="w-full bg-white text-black px-6 py-4 border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all placeholder:text-black/30 font-black uppercase text-sm outline-none"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-black uppercase tracking-[0.3em] ml-1">QUANTITY_FLUX</label>
                        <input
                            required
                            type="number"
                            min="1"
                            max="500"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full bg-white text-black px-6 py-4 border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all font-black text-sm outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[11px] font-black text-black uppercase tracking-[0.3em] ml-1">TECHNICAL_SPECIFICATIONS</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="ENTER HARDWARE PARAMETERS..."
                        className="w-full bg-white text-black px-6 py-4 border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all placeholder:text-black/30 font-bold uppercase text-sm outline-none resize-none"
                    />
                </div>

                <div className="pt-8">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-6 bg-[#3b82f6] text-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] font-black uppercase tracking-[0.3em] text-sm transition-all flex items-center justify-center gap-6 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} strokeWidth={3} />}
                        {loading ? 'EXECUTING_CYPHER...' : 'DEPLOY_REGISTRY_CORE'}
                    </button>
                </div>

                {success && (
                    <div className="mt-10 bg-[#22c55e] border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-6 animate-in zoom-in-95">
                        <div className="p-4 bg-white border-2 border-black text-black">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <p className="text-[12px] font-black uppercase tracking-widest text-black/80">PROVISION_COMPLETE</p>
                            <p className="text-lg font-black text-white selection:bg-black selection:text-[#22c55e] uppercase tracking-tighter mt-1">Units registered. Crypto-keys injected.</p>
                        </div>
                    </div>
                )}
            </form>

            <div className="bg-[#facc15] border-[4px] border-black p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex gap-8 items-center">
                <div className="p-5 bg-white border-2 border-black text-black shrink-0">
                    <AlertCircle size={32} strokeWidth={3} />
                </div>
                <div className="space-y-2">
                    <h4 className="text-black font-black text-[12px] uppercase tracking-[0.3em] px-2 border-l-4 border-black">PRIORITY_PROTOCOL_A1</h4>
                    <p className="text-black font-black text-xs leading-relaxed uppercase italic">
                        Manual additions bypass standard batch queues. Authentication codes are injected into the global mesh instantly with valid cryptographic signatures. Proceed with caution.
                    </p>
                </div>
            </div>
        </div>
    );
}
