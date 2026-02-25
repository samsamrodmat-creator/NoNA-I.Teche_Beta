"use client";

import { useState, useEffect, useRef } from "react";
import MapLibreGL from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "maplibre-gl/dist/maplibre-gl.css";
import area from "@turf/area";
import { featureCollection } from "@turf/helpers";
import { X, Check, Loader2 } from "lucide-react";

interface VisualPlannerProps {
    initialLat: number;
    initialLng: number;
    onClose: () => void;
    onSave: (data: { area_terreno?: number; cos_footprint?: number }) => void;
}

export function VisualPlanner({ initialLat = 25.6866, initialLng = -100.3161, onClose, onSave }: VisualPlannerProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<MapLibreGL.Map | null>(null);
    const draw = useRef<MapboxDraw | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);

    // Areas
    const [terrainArea, setTerrainArea] = useState(0);
    const [residentialArea, setResidentialArea] = useState(0);
    const [commercialArea, setCommercialArea] = useState(0);
    const [parkingArea, setParkingArea] = useState(0);

    const [activeMode, setActiveMode] = useState<'terrain' | 'residential' | 'commercial' | 'parking' | null>(null);
    const activeModeRef = useRef<'terrain' | 'residential' | 'commercial' | 'parking' | null>(null);

    useEffect(() => {
        activeModeRef.current = activeMode;
    }, [activeMode]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 1. Initialize Map (Only Once)
    useEffect(() => {
        if (!mounted || !mapContainer.current || map.current) return;

        try {
            console.log("Initializing Map...");
            const mapInstance = new MapLibreGL.Map({
                container: mapContainer.current,
                style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
                center: [initialLng || -100.3161, initialLat || 25.6866],
                zoom: 17,
                attributionControl: false
            });

            mapInstance.addControl(new MapLibreGL.AttributionControl({ compact: true }), 'bottom-right');
            mapInstance.addControl(new MapLibreGL.NavigationControl(), 'bottom-right');

            mapInstance.on('load', () => {
                console.log("Map Loaded");
                setMapLoaded(true);
                // Force resize to ensure canvas fits modal
                mapInstance.resize();
            });

            mapInstance.on('error', (e) => {
                console.error("Map Error:", e);
                setMapError("Error loading map tiles.");
            });

            // Double check resize after a slight delay for modal transitions
            setTimeout(() => {
                mapInstance.resize();
            }, 200);

            map.current = mapInstance;
        } catch (err) {
            console.error("Error initializing map:", err);
            setMapError("Failed to initialize map.");
        }

        return () => {
            // Cleanup handled by ref check
        };
    }, [mounted, initialLat, initialLng]);

    // 2. Initialize Draw Control (Once Map is Ready)
    useEffect(() => {
        if (!mapLoaded || !map.current || draw.current) return;

        try {
            console.log("Initializing Draw Control...");

            // Define robust styles matching MapboxDraw requirements
            const styles: any[] = [
                // --- ACTIVE DRAWING (Mode = draw_polygon) ---
                {
                    "id": "gl-draw-line-drawing",
                    "type": "line",
                    "filter": ["all", ["==", "$type", "LineString"], ["==", "mode", "draw_polygon"]],
                    "layout": { "line-cap": "round", "line-join": "round" },
                    "paint": {
                        "line-color": "#D20C0C", // Will be updated dynamically
                        "line-dasharray": [0.2, 2],
                        "line-width": 2
                    }
                },
                {
                    "id": "gl-draw-polygon-fill-drawing",
                    "type": "fill",
                    "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "draw_polygon"]],
                    "paint": {
                        "fill-color": "#D20C0C",
                        "fill-outline-color": "#D20C0C",
                        "fill-opacity": 0.2
                    }
                },
                {
                    "id": "gl-draw-vertex-drawing",
                    "type": "circle",
                    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["==", "mode", "draw_polygon"]],
                    "paint": { "circle-radius": 5, "circle-color": "#FFF" }
                },

                // --- STATIC & SELECTED (Everything NOT drawing) ---
                // We use explicit filters for stability
                {
                    "id": "gl-draw-polygon-fill-static",
                    "type": "fill",
                    "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "draw_polygon"]],
                    "paint": {
                        "fill-color": ["coalesce", ["get", "user_color"], "#D20C0C"],
                        "fill-outline-color": ["coalesce", ["get", "user_color"], "#D20C0C"],
                        "fill-opacity": 0.3
                    }
                },
                {
                    "id": "gl-draw-polygon-stroke-static",
                    "type": "line",
                    "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "draw_polygon"]],
                    "layout": { "line-cap": "round", "line-join": "round" },
                    "paint": {
                        "line-color": ["coalesce", ["get", "user_color"], "#D20C0C"],
                        "line-width": 2
                    }
                },
                {
                    "id": "gl-draw-vertex-selected",
                    "type": "circle",
                    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "draw_polygon"]],
                    "paint": { "circle-radius": 4, "circle-color": "#FFF", "circle-stroke-width": 1, "circle-stroke-color": "#555" }
                }
            ];

            const drawInstance = new MapboxDraw({
                displayControlsDefault: false,
                controls: { polygon: true, trash: true },
                defaultMode: 'simple_select',
                userProperties: true, // IMPORTANT: Allows styling based on properties
                styles: styles
            });

            draw.current = drawInstance;

            // @ts-ignore - Ignore type mismatch for this specific library combination
            map.current.addControl(drawInstance);

            // Listeners
            map.current.on('draw.create', handleCreate);
            map.current.on('draw.delete', updateArea);
            map.current.on('draw.update', updateArea);

            console.log("Draw Control Added Successfully");

        } catch (err) {
            console.error("Error adding draw control:", err);
        }

        // Cleanup listeners on unmount (Map cleanup handles control removal)
        return () => {
            if (map.current) {
                map.current.off('draw.create', handleCreate);
                map.current.off('draw.delete', updateArea);
                map.current.off('draw.update', updateArea);
            }
        };

    }, [mapLoaded]); // Depend on mapLoaded to ensure map is ready

    // 3. Handle Active Mode Changes (Dynamic Style Updates)
    useEffect(() => {
        if (!mapLoaded || !map.current || !activeMode) return;

        let activeColor = '#D20C0C';
        if (activeMode === 'terrain') activeColor = '#10B981'; // Green
        else if (activeMode === 'residential') activeColor = '#000000'; // Black
        else if (activeMode === 'commercial') activeColor = '#8B5CF6'; // Purple
        else if (activeMode === 'parking') activeColor = '#71717A'; // Gray

        const updateLayers = () => {
            const layers = ['gl-draw-line-drawing', 'gl-draw-polygon-fill-drawing'];
            layers.forEach(id => {
                if (map.current?.getLayer(id)) {
                    const prop = id.includes('line') ? 'line-color' : 'fill-color';
                    map.current!.setPaintProperty(id, prop, activeColor);
                    if (id.includes('fill')) {
                        map.current!.setPaintProperty(id, 'fill-outline-color', activeColor);
                    }
                }
            });
        };

        if (map.current.isStyleLoaded()) {
            updateLayers();
        } else {
            map.current.once('styledata', updateLayers);
        }

        // Trigger drawing mode safely
        if (draw.current) {
            setTimeout(() => {
                try {
                    // Only switch if not already drawing to avoid resetting interaction
                    // But if user clicked button, we force it.
                    draw.current?.changeMode('draw_polygon');
                } catch (e) { console.warn(e); }
            }, 50);
        }

    }, [activeMode, mapLoaded]);

    const updateArea = () => {
        if (!draw.current) return;
        const data = draw.current.getAll();

        let tArea = 0;
        let resArea = 0;
        let comArea = 0;
        let parkArea = 0;

        const currentMode = activeModeRef.current;

        data.features.forEach(f => {
            try {
                // @ts-ignore
                const a = area(f);
                const type = f.properties?.type;

                if (type === 'terrain') tArea += a;
                else if (type === 'residential') resArea += a;
                else if (type === 'commercial') comArea += a;
                else if (type === 'parking') parkArea += a;
                // Treat untyped features as current mode for visual feedback
                else if (!type && currentMode) {
                    if (currentMode === 'terrain') tArea += a;
                    else if (currentMode === 'residential') resArea += a;
                    else if (currentMode === 'commercial') comArea += a;
                    else if (currentMode === 'parking') parkArea += a;
                }
            } catch (err) { console.error("Area calc error", err); }
        });

        setTerrainArea(Number(tArea.toFixed(2)));
        setResidentialArea(Number(resArea.toFixed(2)));
        setCommercialArea(Number(comArea.toFixed(2)));
        setParkingArea(Number(parkArea.toFixed(2)));
    };

    const handleCreate = (e: any) => {
        const currentMode = activeModeRef.current;
        if (currentMode && draw.current) {
            if (!e.features || !e.features[0]) {
                console.warn("No features in create event");
                return;
            }

            const id = e.features[0].id;
            let color = '#10B981'; // Default Green
            if (currentMode === 'residential') color = '#000000'; // Black
            else if (currentMode === 'commercial') color = '#8B5CF6'; // Purple
            else if (currentMode === 'parking') color = '#71717A'; // Gray

            draw.current.setFeatureProperty(id, 'type', currentMode);
            // We set 'color' property, which MapboxDraw prefixes as 'user_color' due to userProperties: true
            draw.current.setFeatureProperty(id, 'color', color);

            // Reset mode after completion so we stop forcing "draw_polygon"
            setTimeout(() => {
                setActiveMode(null);
                setTimeout(updateArea, 50);
            }, 0);
        }
    };

    const startDraw = (type: 'terrain' | 'residential' | 'commercial' | 'parking') => {
        setActiveMode(type);
    };

    const handleSave = () => {
        const totalFootprint = residentialArea + commercialArea + parkingArea;
        onSave({
            area_terreno: terrainArea > 0 ? terrainArea : undefined,
            cos_footprint: totalFootprint > 0 ? totalFootprint : undefined
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 w-full h-[85vh] max-w-7xl rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">

                {/* Header / Toolbar */}
                <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 z-10">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <span className="text-indigo-500">Visual</span>Planner
                    </h2>

                    {/* Stats */}
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 py-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-mono">Terreno: {terrainArea.toLocaleString()} m²</span>
                        </div>
                        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 py-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                            <div className="flex -space-x-1">
                                <div className="w-3 h-3 rounded-full bg-black ring-1 ring-white dark:ring-zinc-900"></div>
                                <div className="w-3 h-3 rounded-full bg-purple-500 ring-1 ring-white dark:ring-zinc-900"></div>
                            </div>
                            <span className="text-xs font-mono">Huella Total: {(residentialArea + commercialArea + parkingArea).toLocaleString()} m²</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 relative bg-zinc-900 w-full">
                    {!mapLoaded && !mapError && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-900 text-white gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            <span className="text-sm">Loading Map...</span>
                        </div>
                    )}

                    {mapError && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-900 text-red-500 gap-3">
                            <X className="w-8 h-8" />
                            <span className="text-sm">{mapError}</span>
                        </div>
                    )}

                    <div ref={mapContainer} className="absolute inset-0 z-0 bg-black w-full h-full" />

                    {/* Toolbar Overlay */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        <div className="bg-white dark:bg-zinc-950 p-2 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2 pt-1 pb-1">Herramientas</p>

                            <button
                                onClick={() => startDraw('terrain')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeMode === 'terrain'
                                    ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-500/20'
                                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                                    }`}
                            >
                                <div className={`w-3 h-3 rounded-full ${activeMode === 'terrain' ? 'bg-white' : 'bg-emerald-500'}`} />
                                Terreno Active: {activeMode === 'terrain' ? 'YES' : 'NO'}
                            </button>

                            <div className="h-px bg-zinc-100 dark:bg-zinc-900 my-0.5" />

                            <button
                                onClick={() => startDraw('residential')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeMode === 'residential'
                                    ? 'bg-black text-white shadow-md ring-2 ring-black/20'
                                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                                    }`}
                            >
                                <div className={`w-3 h-3 rounded-full ${activeMode === 'residential' ? 'bg-white' : 'bg-black'}`} />
                                Huella Residencial
                            </button>
                            <button
                                onClick={() => startDraw('commercial')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeMode === 'commercial'
                                    ? 'bg-purple-500 text-white shadow-md ring-2 ring-purple-500/20'
                                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                                    }`}
                            >
                                <div className={`w-3 h-3 rounded-full ${activeMode === 'commercial' ? 'bg-white' : 'bg-purple-500'}`} />
                                Huella Comercial
                            </button>
                            <button
                                onClick={() => startDraw('parking')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeMode === 'parking'
                                    ? 'bg-zinc-600 text-white shadow-md ring-2 ring-zinc-500/20'
                                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                                    }`}
                            >
                                <div className={`w-3 h-3 rounded-full ${activeMode === 'parking' ? 'bg-white' : 'bg-zinc-500'}`} />
                                Estacionamiento
                            </button>
                        </div>
                    </div>

                    {/* Save Button Overlay */}
                    <div className="absolute bottom-8 right-8 z-10">
                        <button
                            onClick={handleSave}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 font-medium transition-all transform hover:scale-105 active:scale-95"
                        >
                            <Check className="w-5 h-5" />
                            Aplicar Medidas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
