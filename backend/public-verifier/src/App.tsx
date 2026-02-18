import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ShieldCheck, ShieldAlert, Scan, MapPin, Loader2, RefreshCw } from 'lucide-react';
import axios from 'axios';

// Get API URL from env or fallback
const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function App() {
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [locationError, setLocationError] = useState<string | null>(null);

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.warn("Location access denied", err);
          setLocationError("Location access is required for cryptographic verification.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this device.");
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    if (!scanned && !isManualMode) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        /* verbose= */ false
      );

      scanner.render(onScanSuccess, onScanFailure);

      function onScanSuccess(decodedText: string) {
        scanner.clear();
        handleVerification(decodedText);
      }

      function onScanFailure(error: any) {
        // Silent
      }

      return () => {
        scanner.clear();
      };
    }
  }, [scanned, isManualMode]);

  const handleVerification = async (code: string) => {
    if (!location) {
      setError("Location verification failed. Please enable GPS and try again.");
      setScanned(true);
      return;
    }

    setScanned(true);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/scans/verify`, {
        code,
        latitude: location?.lat,
        longitude: location?.lng
      });

      setResult(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Verification uplink failure. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setScanned(false);
    setResult(null);
    setError(null);
    setManualCode("");
  };

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header */}
      <nav className="p-6 glass border-b border-white/10 sticky top-0 z-50 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Scan size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white uppercase opacity-90">GuardHub</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-500 ${location ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
            <div className={`w-2 h-2 rounded-full ${location ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 animate-pulse'}`}></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {location ? 'Geo-Linked' : 'GPS Offline'}
            </span>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:items-center lg:justify-center p-6 md:p-8 lg:p-0 overflow-hidden">
        <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

          <div className="flex-1 w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {!scanned ? (
              <div className="space-y-8">
                <div className="text-center lg:text-left space-y-3">
                  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    {isManualMode ? 'Manual Uplink' : 'Verify Asset'}
                  </h1>
                  <p className="text-slate-400 text-sm md:text-base max-w-sm mx-auto lg:mx-0 leading-relaxed">
                    {isManualMode
                      ? 'Manually enter the secure product hash from the packaging.'
                      : 'Align the secure QR signature within the optical frame.'}
                  </p>
                </div>

                {locationError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-3xl flex flex-col items-center gap-4 animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-3 text-rose-500">
                      <MapPin size={24} />
                      <p className="font-bold text-sm tracking-tight">{locationError}</p>
                    </div>
                    <button
                      onClick={requestLocation}
                      className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl transition-all text-[10px] uppercase tracking-widest"
                    >
                      Initialize GPS Link
                    </button>
                  </div>
                )}

                {isManualMode ? (
                  <div className="bg-slate-900/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                        Secure Asset Hash
                      </label>
                      <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="COMMIT_HASH..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono tracking-[0.3em] uppercase placeholder:text-slate-700"
                      />
                    </div>
                    <button
                      onClick={() => handleVerification(manualCode)}
                      disabled={!manualCode.trim() || loading}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-[10px]"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                      Execute Verification
                    </button>
                    <button
                      onClick={() => setIsManualMode(false)}
                      className="w-full text-slate-500 hover:text-indigo-400 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      <Scan size={14} />
                      Optical Scanner
                    </button>
                  </div>
                ) : (
                  <div className="relative group max-w-sm mx-auto lg:mx-0">
                    <div id="reader" className="overflow-hidden rounded-[2.5rem] border border-slate-800 shadow-2xl bg-slate-900/40 backdrop-blur-md"></div>

                    {/* Decorative Targetting UI */}
                    <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-indigo-500 rounded-tl-xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-indigo-500 rounded-tr-xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-indigo-500 rounded-bl-xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-indigo-500 rounded-br-xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-indigo-500/20 pointer-events-none animate-pulse"></div>

                    <button
                      onClick={() => setIsManualMode(true)}
                      className="w-full mt-8 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg uppercase tracking-widest text-[10px]"
                    >
                      Manual Hash Entry
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500 w-full max-w-md mx-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-24 space-y-6 bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-white/5">
                    <div className="relative">
                      <Loader2 size={64} className="text-indigo-500 animate-spin" strokeWidth={1.5} />
                      <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold uppercase tracking-[0.3em] text-[10px]">Processing Uplink</p>
                      <p className="text-slate-500 text-[9px] mt-2 font-mono italic">CRYPT_AUTH_PENDING...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="bg-slate-900/40 backdrop-blur-md border border-rose-500/20 p-10 rounded-[3rem] text-center space-y-8 shadow-2xl">
                    <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500 ring-1 ring-rose-500/20">
                      <ShieldAlert size={48} />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-3xl font-bold text-white tracking-tight">Auth Failure</h2>
                      <p className="text-slate-400 leading-relaxed text-sm font-medium">{error}</p>
                    </div>
                    <button
                      onClick={reset}
                      className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] shadow-xl shadow-rose-900/20"
                    >
                      <RefreshCw size={20} />
                      Retry Verification
                    </button>
                  </div>
                ) : (
                  <div className={`border p-10 rounded-[3rem] shadow-2xl relative overflow-hidden transition-all duration-700 bg-slate-900/60 backdrop-blur-xl ${result.success ? 'border-emerald-500/20' : 'border-rose-500/20'
                    }`}>
                    {/* Status Icon */}
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 ring-1 shadow-2xl ${result.success ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20 shadow-emerald-500/10' : 'bg-rose-500/10 text-rose-500 ring-rose-500/20 shadow-rose-500/10'
                      }`}>
                      {result.success ? <ShieldCheck size={56} className="animate-in zoom-in-50 duration-500" /> : <ShieldAlert size={56} className="animate-in zoom-in-50 duration-500" />}
                    </div>

                    <div className="text-center space-y-3 mb-10">
                      <h2 className={`text-4xl font-bold tracking-tight uppercase ${result.success ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {result.success ? 'Genuine Item' : 'Invalid Asset'}
                      </h2>
                      <p className="text-slate-400 font-medium px-4 text-sm leading-relaxed tracking-tight">{result.message}</p>
                    </div>

                    {result.success && result.product && (
                      <div className="space-y-5 bg-white/5 p-8 rounded-[2rem] border border-white/5 mb-10 animate-in fade-in slide-in-from-bottom-4 delay-300">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 opacity-60">Identity Signature</p>
                          <p className="text-2xl font-bold text-white tracking-tight">{result.product.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 pt-5 border-t border-white/5">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-60">Entity</p>
                            <p className="text-sm font-bold text-slate-200 mt-1">{result.product.company}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-60">BatchID</p>
                            <p className="text-sm font-mono text-indigo-400 font-bold mt-1 uppercase">{result.product.batchNumber}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-5">
                      <button
                        onClick={reset}
                        className={`w-full font-bold py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] ${result.success
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                          }`}
                      >
                        <RefreshCw size={20} />
                        Next Verification
                      </button>

                      <div className="flex items-center justify-center gap-3 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] pt-2">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                        <span>Geo_Verified_Secure_Mesh</span>
                      </div>
                    </div>

                    <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-1000 ${result.success ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Info Panel */}
          <div className="lg:w-80 w-full space-y-6 shrink-0 lg:block animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
            <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 flex flex-col gap-6 shadow-2xl group hover:border-indigo-500/20 transition-all">
              <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500 w-fit ring-1 ring-indigo-500/20 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-white text-xl tracking-tight uppercase opacity-90">Cryptographic Shield</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Direct nexus verification confirms physical product origin and manufacturing lineage in real-time.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/30 p-8 rounded-[2rem] border border-white/5 flex items-center gap-5 text-slate-500 group">
              <ShieldAlert size={28} className="shrink-0 group-hover:text-rose-500 transition-colors" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed italic">
                Report anomalous items to the manufacturer immediately for escalation.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 border-t border-white/5 flex flex-col md:flex-row justify-center md:justify-between items-center gap-6 glass shrink-0">
        <p className="text-[10px] font-bold tracking-[0.3em] text-slate-600 uppercase">
          Powered by GuardHub Global Security Matrix
        </p>
        <div className="flex gap-10 opacity-60">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-400 cursor-pointer transition-colors">Portal_v2.0</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-400 cursor-pointer transition-colors">Compliance_Opt</span>
        </div>
      </footer>
    </div>
  );
}
