import { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { dashboardApi } from '../api';

export default function BulkUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<{ id: string, message: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await dashboardApi.uploadBulk(formData);

            setResult({
                id: response.data.requestId,
                message: response.data.message
            });
        } catch (error: any) {
            console.error('Upload failed', error);
            alert(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="pb-6 border-b border-slate-200/50">
                <h1 className="text-3xl font-bold text-white tracking-tight">Bulk Asset Ingress</h1>
                <p className="text-slate-400 mt-1 text-sm">Scalable registration terminal for cryptographic payloads</p>
            </div>

            <div className="premium-card border-2 border-dashed border-slate-800/50 p-16 rounded-3xl group ">
                <div className="flex flex-col items-center justify-center text-center relative z-10">
                    <div className="p-8 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-8 group-hover:scale-110 transition-transform duration-500 ring-1 ring-white/5">
                        <Upload size={48} />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                        {file ? file.name : 'Drop payload here'}
                    </h3>
                    <p className="text-slate-500 text-sm mb-10 max-w-xs mx-auto leading-relaxed">
                        Secure CSV mapping protocol enabled for mass asset distribution
                    </p>

                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />

                    <label
                        htmlFor="file-upload"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3.5 rounded-xl cursor-pointer font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        {file ? 'Replace File' : 'Select CSV Payload'}
                    </label>
                </div>
            </div>

            <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8">
                <div className="flex items-center gap-6 flex-1">
                    <div className="p-4 bg-white/5 rounded-xl text-indigo-400 ring-1 ring-white/10 shrink-0">
                        <FileText size={28} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm mb-1">Structure Protocol</h4>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Required parameters: <code className="text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">product_name</code>, <code className="text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">sku</code>, <code className="text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">batch_number</code>, <code className="text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">quantity</code>.
                        </p>
                    </div>
                </div>
                <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl text-xs font-semibold transition-all shrink-0">
                    Download Template
                </button>
            </div>

            {file && !result && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/20 font-bold text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.99]"
                >
                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                    {uploading ? 'Transmitting Cryptographic Mesh...' : 'Commit Upload to Queue'}
                </button>
            )}

            {result && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 rounded-3xl animate-in zoom-in-95 duration-500 flex flex-col gap-8">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">Inbound Synchronized</h3>
                                <p className="text-slate-400 text-sm mt-1">Payload awaiting administrative verification</p>
                            </div>
                        </div>
                        <button onClick={() => { setResult(null); setFile(null); }} className="text-slate-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5">
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">Transmission Hash</p>
                            <p className="font-mono text-xl font-bold text-emerald-400 tracking-wider overflow-x-auto">{result.id}</p>
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-xl border border-white/5">
                            <AlertCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-slate-300 text-xs leading-relaxed">
                                {result.message} Assets will be distributed into the global mesh once verified.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
