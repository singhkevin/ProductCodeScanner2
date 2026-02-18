import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { ShieldAlert, AlertTriangle, MapPin } from 'lucide-react';
import { dashboardApi } from '../api';

const center = {
    lat: 20.5937,
    lng: 78.9629
};

// Premium Dark Mode Styles for Google Maps
const darkStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

export default function HotspotsMap() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
    });

    const [hotspots, setHotspots] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [selectedSpot, setSelectedSpot] = useState<any>(null);
    const [, setMap] = useState<any>(null);

    const onLoad = useCallback(function callback(mapInstance: any) {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hotspotsRes = await dashboardApi.getFraudHotspots();
                setHotspots(hotspotsRes.data);

                const statsRes = await dashboardApi.getOverviewStats();
                setStats(statsRes.data);
            } catch (error) {
                console.error('Failed to fetch hotspot data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/50">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Geospatial Intelligence</h1>
                    <p className="text-slate-400 mt-1 text-sm">Real-time fraud vectors and security telemetry</p>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 px-6 py-3 rounded-2xl flex items-center gap-3 ring-1 ring-rose-500/10">
                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.5)]"></div>
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-[0.2em]">Live Threat Stream</span>
                </div>
            </div>

            <div className="w-full h-[650px] premium-card p-4 relative overflow-hidden rounded-[2.5rem]">
                {isLoaded ? (
                    <div className="w-full h-full rounded-[2rem] overflow-hidden relative border border-slate-800 shadow-inner">
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            center={center}
                            zoom={5}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            options={{
                                styles: darkStyles,
                                disableDefaultUI: false,
                                zoomControl: true,
                                streetViewControl: true,
                                mapTypeControl: false,
                                fullscreenControl: true
                            }}
                        >
                            {hotspots.filter(s => s.latitude && s.longitude).map((spot, idx) => (
                                <Marker
                                    key={idx}
                                    position={{ lat: spot.latitude, lng: spot.longitude }}
                                    onClick={() => setSelectedSpot(spot)}
                                    icon={{
                                        path: google.maps.SymbolPath.CIRCLE,
                                        fillColor: '#f43f5e',
                                        fillOpacity: 0.9,
                                        strokeWeight: 2,
                                        strokeColor: '#ffffff',
                                        scale: 10,
                                    }}
                                />
                            ))}

                            {selectedSpot && (
                                <InfoWindow
                                    position={{ lat: selectedSpot.latitude, lng: selectedSpot.longitude }}
                                    onCloseClick={() => setSelectedSpot(null)}
                                >
                                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl min-w-[220px] shadow-2xl">
                                        <h4 className="font-bold text-white flex items-center gap-2.5 text-xs uppercase tracking-tight">
                                            <ShieldAlert size={14} className="text-rose-500" />
                                            Anomalous Event
                                        </h4>
                                        <p className="text-[10px] font-medium text-slate-500 mt-2 font-mono">{new Date(selectedSpot.createdAt).toLocaleString().toUpperCase()}</p>
                                        <div className="mt-4 pt-4 border-t border-white/5">
                                            <span className="text-[9px] font-bold uppercase text-white bg-rose-500 px-3 py-1 rounded-lg shadow-lg shadow-rose-500/20">
                                                Auth_Failure_Verified
                                            </span>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest italic">Initializing Geo_Terminal...</p>
                    </div>
                )}

                <div className="absolute top-10 right-10 z-[10] bg-slate-900/90 backdrop-blur-md border border-slate-800 p-8 rounded-3xl w-72 shadow-2xl">
                    <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2.5">
                        <MapPin size={16} className="text-indigo-500" />
                        Legend Mesh
                    </h4>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-3.5 h-3.5 bg-rose-500 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.4)] transition-all"></div>
                                <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Active Vectors</span>
                            </div>
                            <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-0.5 rounded-lg text-[10px] font-black">
                                {hotspots.length}
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed pt-6 border-t border-white/5 uppercase italic">
                            High-confidence counterfeit payloads. Security protocols active per regional quadrant.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="premium-card p-8 rounded-[2rem] flex items-center gap-8 group">
                    <div className="p-6 rounded-2xl bg-rose-500/10 text-rose-500 ring-1 ring-white/5 group-hover:scale-110 transition-transform">
                        <ShieldAlert size={40} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">Neutralized Vectors</p>
                        <h2 className="text-4xl font-bold text-white tracking-tight tabular-nums">{stats?.fakeScans || 0}</h2>
                    </div>
                </div>
                <div className="premium-card p-8 rounded-[2rem] flex items-center gap-8 group">
                    <div className="p-6 rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-white/5 group-hover:scale-110 transition-transform">
                        <AlertTriangle size={40} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">Verification Flux</p>
                        <h2 className="text-4xl font-bold text-white tracking-tight tabular-nums">{stats?.totalScans || 0}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
