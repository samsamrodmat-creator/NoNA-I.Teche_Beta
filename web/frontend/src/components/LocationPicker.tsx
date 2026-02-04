"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, MapPin } from "lucide-react";
import { Map, MapMarker, MapControls, useMap, MarkerContent } from "@/components/ui/map";
import type { LngLat } from "maplibre-gl";

type Props = {
    lat: number;
    lng: number;
    onLocationSelect: (lat: number, lng: number, address?: string) => void;
};

// Helper to handle map clicks
function MapEventHandler({ onMapClick }: { onMapClick: (lng: number, lat: number) => void }) {
    const { map } = useMap();

    useEffect(() => {
        if (!map) return;

        const handleClick = (e: maplibregl.MapMouseEvent) => {
            onMapClick(e.lngLat.lng, e.lngLat.lat);
        };

        map.on('click', handleClick);
        return () => {
            map.off('click', handleClick);
        };
    }, [map, onMapClick]);

    return null;
}

// Helper to update map view when props change
function MapUpdater({ lat, lng }: { lat: number, lng: number }) {
    const { map } = useMap();

    useEffect(() => {
        if (!map) return;

        map.flyTo({
            center: [lng, lat],
            zoom: 16,
            duration: 1500
        });
    }, [map, lat, lng]);

    return null;
}

function LocationPicker({ lat, lng, onLocationSelect }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);


    // Default to CDMX if no coords
    const initialLat = lat || 19.4326;
    const initialLng = lng || -99.1332;

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setLoading(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lon);
                onLocationSelect(newLat, newLng, display_name);
            }
        } catch (e) {
            console.error("Search failed", e);
        } finally {
            setLoading(false);
        }
    };

    const handleMapClick = useCallback((clickedLng: number, clickedLat: number) => {
        onLocationSelect(clickedLat, clickedLng);
    }, [onLocationSelect]);

    const handleMarkerDragEnd = useCallback((lngLat: { lng: number, lat: number }) => {
        onLocationSelect(lngLat.lat, lngLat.lng);
    }, [onLocationSelect]);

    if (!mounted) return <div className="h-[300px] w-full bg-zinc-900 animate-pulse text-zinc-500 flex items-center justify-center">Loading Map...</div>;

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                        placeholder="Search address (e.g. Av Reforma 222, CDMX)"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? '...' : 'Search'}
                </button>
            </div>

            <div className="h-[300px] w-full rounded-lg overflow-hidden border border-zinc-800 relative z-0">
                <Map
                    center={[initialLng, initialLat]}
                    zoom={14}
                    attributionControl={false}
                >
                    <MapControls showZoom showLocate />

                    <MapMarker
                        longitude={initialLng}
                        latitude={initialLat}
                        draggable
                        onDragEnd={handleMarkerDragEnd}
                    >
                        <MarkerContent />
                    </MapMarker>

                    <MapEventHandler onMapClick={handleMapClick} />
                    <MapUpdater lat={initialLat} lng={initialLng} />
                </Map>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-500">
                <MapPin className="w-3 h-3" />
                <span>Click on map or drag pin to adjust position.</span>
            </div>
        </div>
    );
}

LocationPicker.displayName = "LocationPicker";

export default LocationPicker;
