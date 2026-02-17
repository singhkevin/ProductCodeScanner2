import { useState, useEffect } from 'react';
import { Package, Search, Scan, X, ChevronRight, Copy, Check } from 'lucide-react';
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
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2 border-b-[4px] border-black pb-8">
                <div>
                    <h1 className="text-4xl font-black text-black tracking-tighter uppercase selection:bg-black selection:text-[#facc15]">Asset Inventory</h1>
                    <p className="text-black font-black italic mt-1 font-mono tracking-tighter uppercase text-xs">Unified registry of authenticated physical units</p>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsScanning(!isScanning)}
                        className={`px-8 py-4 border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase text-sm tracking-tighter flex items-center gap-3 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${isScanning ? 'bg-[#ef4444] text-white' : 'bg-[#facc15] text-black'
                            }`}
                    >
                        <Scan size={22} strokeWidth={3} />
                        {isScanning ? 'Halt Scanner' : 'Initiate Scan'}
                    </button>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black z-10" size={20} />
                        <input
                            type="text"
                            placeholder="QUERY_REGISTRY..."
                            className="bg-white border-[4px] border-black text-black pl-14 pr-4 py-4 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-black/40 font-black uppercase text-sm w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {isScanning && (
                <div className="bg-white border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-10 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black text-black uppercase tracking-[0.3em] italic">Hardware Vision Active</h3>
                        <div className="bg-[#ef4444] text-white border-2 border-black px-4 py-1 text-[10px] font-black uppercase animate-pulse">Scanning...</div>
                    </div>
                    <div className="aspect-video max-w-2xl mx-auto border-[4px] border-black bg-black relative">
                        <div id="reader" className="w-full h-full"></div>
                        <div className="absolute inset-0 border-[2px] border-dashed border-[#22c55e] opacity-30 pointer-events-none"></div>
                    </div>
                    <p className="text-center text-black font-black text-[11px] uppercase tracking-widest mt-8 italic">Align asset QR code within terminal for instant indexing</p>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-6">
                    <div className="w-14 h-14 border-[6px] border-black border-t-[#3b82f6] animate-spin"></div>
                    <p className="text-black font-black text-xs uppercase tracking-[0.2em]">Hydrating Registry...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-white border-[6px] border-black border-dashed p-24 text-center">
                    <Package className="mx-auto text-black/20 mb-8" size={80} />
                    <p className="text-black font-black uppercase tracking-[0.3em] text-xl">Registry Empty</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-10 group hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-5 border-[3px] border-black bg-[#eeeeee] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[#3b82f6] group-hover:bg-[#facc15] group-hover:text-black transition-colors">
                                    <Package size={32} strokeWidth={3} />
                                </div>
                                <div className="bg-black text-white px-4 py-1.5 border-2 border-black text-[10px] font-black tracking-widest uppercase italic">
                                    SKU: {product.sku || 'UNKNOWN'}
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-black group-hover:underline decoration-[4px] decoration-[#3b82f6] underline-offset-8 tracking-tighter uppercase">{product.name}</h3>
                            <p className="text-black/70 text-sm mt-4 line-clamp-2 h-10 font-bold font-mono leading-tight">{product.description || 'GENERIC ASSET DESCRIPTION MISSING'}</p>

                            <div className="mt-12 space-y-8 pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-12 bg-[#3b82f6] border-2 border-black"></div>
                                        <div>
                                            <p className="text-[10px] font-black text-black/50 uppercase tracking-widest">Active Core Units</p>
                                            <p className="text-3xl font-black text-black tracking-tighter">{product.qrCodes?.length || 0}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        className="bg-white border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-[#3b82f6]"
                                    >
                                        <ChevronRight size={24} strokeWidth={3} />
                                    </button>
                                </div>

                                <div className="border-[3px] border-black h-4 bg-[#f1f5f9] relative overflow-hidden">
                                    <div
                                        className="h-full bg-[#3b82f6] border-r-[3px] border-black shadow-[2px_0_0_0_black]"
                                        style={{ width: `${Math.min((product.qrCodes?.length || 0) * 5, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* QR Codes Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 animate-in fade-in duration-300">
                    <div className="bg-white border-[8px] border-black w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[20px_20px_0px_0px_rgba(252,211,77,1)] animate-in zoom-in-95 duration-300">
                        <div className="p-10 border-b-[6px] border-black flex justify-between items-center bg-[#facc15]">
                            <div>
                                <h2 className="text-4xl font-black text-black tracking-tighter uppercase">{selectedProduct.name}</h2>
                                <p className="text-black font-black uppercase text-xs mt-2 italic tracking-widest opacity-70 px-1 border-l-4 border-black">Auth.Code Registry</p>
                            </div>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="bg-white border-[4px] border-black p-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-black"
                            >
                                <X size={28} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#eeeeee]">
                            {selectedProduct.qrCodes && selectedProduct.qrCodes.length > 0 ? (
                                selectedProduct.qrCodes.map((codeObj: any, index: number) => (
                                    <div key={codeObj.id} className="flex flex-col items-center bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group">
                                        <div className="w-full flex justify-between mb-6">
                                            <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">UNIT #{index + 1}</span>
                                            <div className="w-3 h-3 bg-[#22c55e] border-2 border-black"></div>
                                        </div>

                                        <div className="w-48 h-48 border-[4px] border-black p-4 bg-white mb-6">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${codeObj.code}`}
                                                alt="QR Code"
                                                className="w-full h-full grayscale brightness-90"
                                            />
                                        </div>

                                        <div className="w-full bg-[#f8f9fa] border-[3px] border-black p-4 mb-8">
                                            <code className="text-black font-black font-mono block break-all text-center text-xs">{codeObj.code}</code>
                                        </div>

                                        <div className="flex w-full gap-4 mt-auto">
                                            <button
                                                onClick={() => copyToClipboard(codeObj.code)}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-[10px] font-black uppercase"
                                            >
                                                {copiedId === codeObj.code ? <Check className="text-[#22c55e]" size={16} strokeWidth={3} /> : <Copy size={16} strokeWidth={3} />}
                                                {copiedId === codeObj.code ? 'COPIED' : 'COPY_ID'}
                                            </button>
                                            <a
                                                href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${codeObj.code}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#3b82f6] text-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-[10px] font-black uppercase"
                                            >
                                                DL_ASSET
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 bg-white border-[4px] border-black border-dashed flex flex-col items-center">
                                    <p className="text-black/50 font-black uppercase tracking-widest text-sm">No Authentication Units Provisioned</p>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-black flex items-center gap-8">
                            <div className="p-4 bg-[#facc15] border-2 border-white text-black shrink-0">
                                <Scan size={32} strokeWidth={3} />
                            </div>
                            <p className="text-white text-[11px] font-black leading-relaxed uppercase tracking-tighter italic">
                                SECURITY_PROTOCOL_A1: Unique cryptographic identifiers provisioned for physical verification.
                                Package authentication units for field deployment. Tamper-evident protocols required.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
