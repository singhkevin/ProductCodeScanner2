import { useState, useEffect } from 'react';
import { Package, Search, Scan, X, ChevronRight, Copy, Check, ShieldCheck } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { dashboardApi } from '../api';

export default function Products() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        let scanner: any = null;
        if (isScanning) {
            scanner = new Html5QrcodeScanner(
                "inventory-scanner",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            scanner.render(
                (decodedText: string) => {
                    setSearchTerm(decodedText);
                    setIsScanning(false);
                    scanner.clear();
                },
                () => { /* ignore scans that don't match */ }
            );
        }
        return () => {
            if (scanner) scanner.clear();
        };
    }, [isScanning]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await dashboardApi.getProducts();
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredProducts = products.filter(p => {
        const searchLower = searchTerm.toLowerCase();
        const matchesBasic = p.name.toLowerCase().includes(searchLower) || p.sku.toLowerCase().includes(searchLower);
        const matchesCode = p.qrCodes?.some((c: any) => c.code.toLowerCase().includes(searchLower));
        return matchesBasic || matchesCode;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/50">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Asset Inventory</h1>
                    <p className="text-slate-400 mt-1 text-sm">Registry of all authenticated physical units</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={() => setIsScanning(!isScanning)}
                        className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg active:scale-95 ${isScanning ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-500'
                            }`}
                    >
                        <Scan size={18} />
                        {isScanning ? 'Halt Scanner' : 'Initiate Scan'}
                    </button>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Query registry..."
                            className="bg-slate-800/50 border border-slate-700 text-slate-200 pl-11 pr-4 py-2.5 rounded-xl focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500 text-sm w-64 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {isScanning && (
                <div className="premium-card p-8 rounded-3xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hardware Vision Active</h3>
                        <div className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-[10px] font-black uppercase animate-pulse ring-1 ring-rose-500/20">Scanning Terminal</div>
                    </div>
                    <div className="aspect-video max-w-2xl mx-auto rounded-2xl overflow-hidden border border-slate-700 bg-black relative">
                        <div id="inventory-scanner" className="w-full h-full"></div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-sm font-medium">Hydrating registry...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-slate-900/20 border-2 border-dashed border-slate-800 p-24 text-center rounded-3xl">
                    <Package className="mx-auto text-slate-700 mb-6" size={64} />
                    <p className="text-slate-500 font-semibold text-lg">Registry Empty</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="premium-card p-8 rounded-3xl group flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform ring-1 ring-white/5">
                                    <Package size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full ring-1 ring-white/5">
                                    {product.sku || 'NO_SKU'}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                            <p className="text-slate-500 text-sm line-clamp-2 h-10 leading-relaxed">{product.description || 'No technical specifications provided for this asset.'}</p>

                            <div className="mt-8 space-y-6">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Provisioned Units</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl font-bold text-white tabular-nums">{product.qrCodes?.length || 0}</span>
                                            <span className="text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg ring-1 ring-emerald-500/20">Active</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        className="h-12 w-12 flex items-center justify-center bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-lg active:scale-95 group/btn"
                                    >
                                        <ChevronRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>

                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-1000"
                                        style={{ width: `${Math.min((product.qrCodes?.length || 0) * 10, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-indigo-600/20 to-transparent">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">{selectedProduct.name}</h2>
                                <p className="text-indigo-400 font-semibold text-[10px] mt-1 uppercase tracking-[0.2em]">Authentication Code Registry</p>
                            </div>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-90"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50">
                            {selectedProduct.qrCodes && selectedProduct.qrCodes.length > 0 ? (
                                selectedProduct.qrCodes.map((codeObj: any, index: number) => (
                                    <div key={codeObj.id} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl group flex flex-col">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full ring-1 ring-white/5">Unit #{index + 1}</span>
                                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        </div>

                                        <div className="aspect-square max-w-[200px] mx-auto bg-white p-4 rounded-2xl shadow-xl transition-transform group-hover:scale-105 duration-500 mb-6">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${codeObj.code}`}
                                                alt="QR Code"
                                                className="w-full h-full mix-blend-multiply opacity-90"
                                            />
                                        </div>

                                        <div className="bg-black/30 backdrop-blur-sm border border-white/5 px-4 py-3 rounded-xl mb-6">
                                            <code className="text-slate-300 font-mono text-center block text-[11px] truncate">{codeObj.code}</code>
                                        </div>

                                        <div className="flex gap-3 mt-auto">
                                            <button
                                                onClick={() => copyToClipboard(codeObj.code)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5 rounded-xl transition-all text-[11px] font-bold"
                                            >
                                                {copiedId === codeObj.code ? <Check className="text-emerald-500" size={14} /> : <Copy size={14} />}
                                                {copiedId === codeObj.code ? 'Copied' : 'Copy ID'}
                                            </button>
                                            <a
                                                href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${codeObj.code}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/10 text-[11px] font-bold"
                                            >
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-600 border border-dashed border-slate-800 rounded-3xl">
                                    <Package size={48} className="mb-4 opacity-20" />
                                    <p className="text-xs font-semibold uppercase tracking-widest">No units found</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-slate-950/50 border-t border-white/5 flex items-center gap-6">
                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 ring-1 ring-indigo-500/20">
                                <ShieldCheck size={20} />
                            </div>
                            <p className="text-slate-500 text-[10px] leading-relaxed font-medium">
                                <span className="text-slate-300 font-bold uppercase tracking-wider block mb-1">Security Directive</span>
                                These unique cryptographic identifiers are provisioned for physical verification only.
                                Ensure tamper-evident protocols are active during field deployment.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
