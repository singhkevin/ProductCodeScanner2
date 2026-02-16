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
    const [map, setMap] = useState<any>(null);

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
        <div className="space-y-12 flex flex-col animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2 border-b-[4px] border-black pb-8">
                <div>
                    <h1 className="text-4xl font-black text-black tracking-tighter uppercase selection:bg-black selection:text-[#facc15]">Fraud Hotspots</h1>
                    <p className="text-black font-black italic mt-1 font-mono tracking-tighter uppercase text-xs">Geospatial threat intelligence & vector mesh</p>
                </div>
                <div className="bg-[#3b82f6] border-[3px] border-black px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
                    <div className="w-4 h-4 bg-white border-2 border-black animate-pulse"></div>
                    <span className="text-white text-[11px] font-black uppercase tracking-[0.2em]">Live Threat Stream</span>
                </div>
            </div>

            <div className="w-full h-[650px] bg-white border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 relative">
                {isLoaded ? (
                    <div className="w-full h-full border-[4px] border-black overflow-hidden relative">
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
                                        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                        scaledSize: new google.maps.Size(40, 40)
                                    }}
                                />
                            ))}

                            {selectedSpot && (
                                <InfoWindow
                                    position={{ lat: selectedSpot.latitude, lng: selectedSpot.longitude }}
                                    onCloseClick={() => setSelectedSpot(null)}
                                >
                                    <div className="p-4 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[200px]">
                                        <h4 className="font-black text-black flex items-center gap-3 uppercase text-sm tracking-tighter">
                                            <ShieldAlert size={18} className="text-[#ef4444]" />
                                            Fraud Detected
                                        </h4>
                                        <p className="text-[10px] font-bold text-black/60 mt-2 font-mono">{new Date(selectedSpot.createdAt).toLocaleString().toUpperCase()}</p>
                                        <div className="mt-4 pt-3 border-t-2 border-black">
                                            <span className="text-[9px] font-black uppercase text-white bg-[#ef4444] py-1 px-3 border-2 border-black">
                                                Auth_Failure_Event
                                            </span>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                        <div className="w-16 h-16 border-[8px] border-black border-t-[#3b82f6] animate-spin"></div>
                        <p className="text-black font-black uppercase text-sm tracking-widest italic">Initializing Geo_Terminal...</p>
                    </div>
                )}

                <div className="absolute top-12 right-12 z-[10] bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-72">
                    <h4 className="text-black font-black text-[11px] uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                        <MapPin size={20} className="text-[#3b82f6]" strokeWidth={3} />
                        LEGEND_MESH
                    </h4>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-[#ef4444] border-2 border-black shadow-[2px_2px_0px_0px_black] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all"></div>
                                <span className="text-black text-[10px] font-black uppercase tracking-widest">Active Threats</span>
                            </div>
                            <div className="bg-black text-white px-3 py-1 text-[10px] font-black">
                                {hotspots.length}
                            </div>
                        </div>
                        <p className="text-[10px] text-black/70 font-black leading-tight pt-6 border-t-2 border-black uppercase italic">
                            High-confidence counterfeit vectors. Engage security protocols per region.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                <div className="bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-10 flex items-center gap-10 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <div className="p-8 border-[4px] border-black bg-[#eeeeee] shadow-[6px_6px_0px_0px_black] text-[#ef4444]">
                        <ShieldAlert size={48} strokeWidth={3} />
                    </div>
                    <div>
                        <p className="text-black/50 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Neutralized Vectors</p>
                        <h2 className="text-5xl font-black text-black tracking-tighter uppercase">{stats?.fakeScans || 0}</h2>
                    </div>
                </div>
                <div className="bg-[#facc15] border-[4px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-10 flex items-center gap-10 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <div className="p-8 border-[4px] border-black bg-white shadow-[6px_6px_0px_0px_black] text-black">
                        <AlertTriangle size={48} strokeWidth={3} />
                    </div>
                    <div>
                        <p className="text-black text-[10px] font-black uppercase tracking-[0.3em] mb-2">Verification Flux</p>
                        <h2 className="text-5xl font-black text-black tracking-tighter uppercase">{stats?.totalScans || 0}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
