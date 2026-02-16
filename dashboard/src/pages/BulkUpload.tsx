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
        <div className="max-w-5xl space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="px-2 border-b-[4px] border-black pb-8">
                <h1 className="text-4xl font-black text-black tracking-tighter uppercase selection:bg-black selection:text-[#facc15]">Bulk Ingress</h1>
                <p className="text-black font-black italic mt-1 font-mono tracking-tighter uppercase text-xs">Scalable asset registration & cryptographic payload terminal</p>
            </div>

            <div className="bg-white border-[6px] border-black shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] p-16 relative group transition-all duration-500">
                <div className="flex flex-col items-center justify-center text-center relative z-10">
                    <div className="p-10 border-[4px] border-black bg-[#eeeeee] shadow-[8px_8px_0px_0px_black] text-[#3b82f6] mb-12 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0px_0px_black] transition-all">
                        <Upload size={56} strokeWidth={3} />
                    </div>

                    <h3 className="text-3xl font-black text-black mb-4 tracking-tighter uppercase">
                        {file ? file.name : 'Awaiting Payload'}
                    </h3>
                    <p className="text-black/50 font-black tracking-[0.3em] text-xs uppercase mb-12 italic border-b-2 border-black/10 pb-2">
                        Surface drop or manual mapping enabled
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
                        className="bg-black text-white px-12 py-5 border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] cursor-pointer font-black uppercase tracking-[0.3em] text-xs transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95"
                    >
                        {file ? 'Replace Mapping' : 'Initiate Mapping'}
                    </label>
                </div>
            </div>

            <div className="bg-[#facc15] border-[4px] border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-10 group">
                <div className="flex items-center gap-8 flex-1">
                    <div className="p-6 bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_black]">
                        <FileText size={32} strokeWidth={3} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-black font-black text-[12px] uppercase tracking-[0.3em] mb-2 px-1 border-l-4 border-black">Structure Protocol</h4>
                        <p className="text-black font-black text-xs leading-relaxed uppercase italic">
                            Payload must include: <code className="bg-black text-[#facc15] px-2 py-0.5">product_name</code>, <code className="bg-black text-[#facc15] px-2 py-0.5">sku</code>, <code className="bg-black text-[#facc15] px-2 py-0.5">batch_number</code>, <code className="bg-black text-[#facc15] px-2 py-0.5">quantity</code>.
                        </p>
                    </div>
                </div>
                <button className="bg-white border-[3px] border-black px-8 py-4 text-[11px] font-black text-black uppercase tracking-widest shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    DL_TEMPLATE_MAP
                </button>
            </div>

            {file && !result && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full py-8 bg-[#3b82f6] text-white border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] font-black uppercase tracking-[0.4em] text-sm transition-all flex items-center justify-center gap-6 disabled:opacity-50"
                >
                    {uploading ? <Loader2 className="animate-spin" size={28} /> : <div className="w-4 h-4 bg-white border-2 border-black animate-pulse"></div>}
                    {uploading ? 'Transmitting Cryptographic Mesh...' : 'Commit Upload to Queue'}
                </button>
            )}

            {result && (
                <div className="bg-[#22c55e] border-[6px] border-black p-12 shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-500">
                    <div className="flex justify-between items-start mb-12">
                        <div className="flex items-center gap-8">
                            <div className="p-6 bg-white border-2 border-black text-black shadow-[6px_6px_0px_0px_black]">
                                <CheckCircle2 size={40} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter uppercase selection:bg-black selection:text-[#22c55e]">Transmission Successful</h3>
                                <p className="text-black font-black text-[11px] uppercase tracking-widest mt-2 italic px-2 border-l-4 border-black/30">Payload awaiting core administrative verification</p>
                            </div>
                        </div>
                        <button onClick={() => { setResult(null); setFile(null); }} className="bg-white border-[3px] border-black p-4 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_black] transition-all text-black">
                            <X size={24} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="space-y-10">
                        <div className="bg-black text-[#22c55e] p-8 border-[4px] border-white/20">
                            <p className="text-[#22c55e]/50 text-[11px] font-black uppercase tracking-[0.4em] mb-4">Request Hash ID</p>
                            <p className="font-mono text-3xl font-black tracking-[0.2em]">{result.id.toUpperCase()}</p>
                        </div>

                        <div className="flex items-start gap-6 p-8 bg-white/10 border-2 border-black/20">
                            <AlertCircle size={24} className="text-white shrink-0 mt-1" strokeWidth={3} />
                            <p className="text-white font-black text-xs leading-relaxed uppercase italic">
                                {result.message} Assets will be distributed into the global mesh once verified by a core administrator. Priority protocol active.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
