import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ShieldCheck, ShieldAlert, Scan, MapPin, Loader2, RefreshCw } from 'lucide-react';
import axios from 'axios';

// Get API URL from env or fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
          setLocationError("Location access is required to verify product authenticity.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
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
        // Just ignore failures (it scans constantly)
      }

      return () => {
        scanner.clear();
      };
    }
  }, [scanned, isManualMode]);

  const handleVerification = async (code: string) => {
    if (!location) {
      setError("Location is required for verification. Please enable location access.");
      setScanned(true); // Show the error state
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
      setError(err.response?.data?.message || "Failed to verify. Please check your connection.");
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
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Header */}
      <nav className="p-6 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Scan size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">ProductGuard</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
            <div className={`w-2 h-2 rounded-full ${location ? 'bg-green-500' : locationError ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`}></div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              {location ? 'Location Active' : locationError ? 'Location Error' : 'Getting Location...'}
            </span>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:items-center lg:justify-center p-6 md:p-8 lg:p-0 overflow-hidden">
        <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16 lg:h-auto lg:max-h-[85vh]">

          <div className="flex-1 w-full space-y-8 animate-in fade-in duration-700">
            {!scanned ? (
              <div className="space-y-8">
                <div className="text-center lg:text-left space-y-2">
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                    {isManualMode ? 'Enter Code' : 'Scan to Verify'}
                  </h1>
                  <p className="text-slate-400 text-sm md:text-base max-w-sm mx-auto lg:mx-0">
                    {isManualMode
                      ? 'Manually enter the product code found on the packaging.'
                      : 'Position the QR code within the frame to check authenticity.'}
                  </p>
                </div>

                {locationError && (
                  <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex flex-col items-center gap-4 animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-3 text-red-500 text-center">
                      <MapPin size={24} />
                      <p className="font-bold text-sm tracking-tight">{locationError}</p>
                    </div>
                    <button
                      onClick={requestLocation}
                      className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-500 font-bold py-3 rounded-xl transition-all text-xs"
                    >
                      Enable Location Access
                    </button>
                  </div>
                )}

                {isManualMode ? (
                  <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                        Product Code / QR ID
                      </label>
                      <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="Enter code here..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono tracking-widest"
                      />
                    </div>
                    <button
                      onClick={() => handleVerification(manualCode)}
                      disabled={!manualCode.trim() || loading}
                      className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                      Verify Product
                    </button>
                    <button
                      onClick={() => setIsManualMode(false)}
                      className="w-full text-slate-500 hover:text-white text-sm font-medium transition-colors"
                    >
                      Switch to Camera Scanner
                    </button>
                  </div>
                ) : (
                  <div className="relative group max-w-sm mx-auto lg:mx-0">
                    <div id="reader" className="overflow-hidden rounded-3xl border border-slate-800 shadow-2xl bg-slate-900"></div>

                    {/* Decorative corners */}
                    <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-xl pointer-events-none"></div>
                    <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-xl pointer-events-none"></div>
                    <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-xl pointer-events-none"></div>
                    <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-xl pointer-events-none"></div>

                    <button
                      onClick={() => setIsManualMode(true)}
                      className="w-full mt-6 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 text-slate-300 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      Enter Code Manually
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500 w-full">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <Loader2 size={48} className="text-blue-500 animate-spin" />
                    <p className="text-slate-400 font-medium animate-pulse tracking-wide">Authenticating with server...</p>
                  </div>
                ) : error ? (
                  <div className="bg-slate-900 border border-red-500/20 p-8 rounded-[2rem] text-center space-y-6 max-w-md mx-auto">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                      <ShieldAlert size={40} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white tracking-tight">Verification Failed</h2>
                      <p className="text-slate-400 leading-relaxed text-sm">{error}</p>
                    </div>
                    <button
                      onClick={reset}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={20} />
                      Try Another Scan
                    </button>
                  </div>
                ) : (
                  <div className={`border p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-500 max-w-md mx-auto ${result.success ? 'bg-slate-900 border-green-500/30' : 'bg-slate-900 border-red-500/30'
                    }`}>
                    {/* Status Icon */}
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce ${result.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                      {result.success ? <ShieldCheck size={48} /> : <ShieldAlert size={48} />}
                    </div>

                    <div className="text-center space-y-2 mb-8">
                      <h2 className={`text-3xl font-black tracking-tight ${result.success ? 'text-green-500' : 'text-red-500'}`}>
                        {result.success ? 'Genuine Item' : 'Invalid Code'}
                      </h2>
                      <p className="text-slate-400 font-medium px-4 text-sm leading-relaxed">{result.message}</p>
                    </div>

                    {result.success && result.product && (
                      <div className="space-y-4 bg-slate-950/50 p-6 rounded-[1.5rem] border border-slate-800/50 mb-8 animate-in fade-in zoom-in-95 delay-200">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Product Details</p>
                          <p className="text-xl font-bold text-white leading-tight">{result.product.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Brand</p>
                            <p className="text-sm font-bold text-slate-200">{result.product.company}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Batch ID</p>
                            <p className="text-sm font-bold text-slate-200">{result.product.batchNumber}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <button
                        onClick={reset}
                        className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${result.success
                          ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
                          : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20'
                          }`}
                      >
                        <RefreshCw size={20} />
                        Scan Next Item
                      </button>

                      <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        <MapPin size={12} />
                        <span>GEO_VERIFIED: SECURE_MESH</span>
                      </div>
                    </div>

                    <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[80px] opacity-20 pointer-events-none ${result.success ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Right Panel (Visible on laptops) */}
          <div className="lg:w-80 w-full space-y-6 shrink-0 lg:block">
            <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800 flex items-start gap-4 shadow-xl">
              <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500 shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-white text-lg leading-tight">Authenticity Shield</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Our encrypted matrix confirms physical product origin and manufacturing batch in real-time.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/40 p-6 rounded-[1.5rem] border border-slate-800/50 flex items-center gap-4 text-slate-500">
              <ShieldAlert size={20} className="shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Report suspicious items to the manufacturer immediately.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-slate-900 flex justify-center lg:justify-between items-center bg-slate-950 shrink-0">
        <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
          POWERED BY PRODUCTGUARD GLOBAL SECURE
        </p>
        <div className="hidden lg:flex gap-6">
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest hover:text-slate-400 cursor-pointer">Security Portal</span>
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest hover:text-slate-400 cursor-pointer">Compliance</span>
        </div>
      </footer>
    </div>
  );
}
