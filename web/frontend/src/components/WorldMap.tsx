"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as d3 from 'd3-geo';
import worldData from './world-countries.json';

const CITIES = [
    { name: "Gol, Noruega", lat: 60.699, lng: 8.95 },
    { name: "Vancouver, Canada", lat: 49.28, lng: -123.12 },
    { name: "Chicago, USA", lat: 41.87, lng: -87.62 },
    { name: "Miami, USA", lat: 25.76, lng: -80.19 },
    { name: "Monterrey, México", lat: 25.68, lng: -100.31 },
    { name: "CDMX, México", lat: 19.43, lng: -99.13 },
    { name: "Morelos, México", lat: 18.92, lng: -99.23 },
    { name: "Querétaro, México", lat: 20.58, lng: -100.38 },
    { name: "Mérida, México", lat: 20.96, lng: -89.61 },
    { name: "Chihuahua, México", lat: 28.63, lng: -106.08 },
    { name: "Acapulco, México", lat: 16.85, lng: -99.82 },
    { name: "Toluca, México", lat: 19.28, lng: -99.65 },
    { name: "Madrid, España", lat: 40.41, lng: -3.70 },
    { name: "Barcelona, España", lat: 41.38, lng: 2.17 },
    { name: "Dublin, Irlanda", lat: 53.34, lng: -6.26 },
    { name: "Viena, Austria", lat: 48.20, lng: 16.37 },
    { name: "Sydney, Australia", lat: -33.86, lng: 151.20 },
    { name: "Wellington, Nueva Zelanda", lat: -41.28, lng: 174.77 },
    { name: "Londres, Inglaterra", lat: 51.50, lng: -0.12 },
    { name: "Lima, Perú", lat: -12.04, lng: -77.04 },
    { name: "Ciudad del Cabo, Sudáfrica", lat: -33.92, lng: 18.42 },
    { name: "Oslo, Noruega", lat: 59.91, lng: 10.75 },
];

export default function WorldMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [cityPositions, setCityPositions] = useState<{ x: number, y: number, name: string }[]>([]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Zoom out effect
    const scale = useTransform(scrollYProgress, [0, 0.4], [1.3, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    // Handle Resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                setDimensions({ width: clientWidth, height: clientHeight });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Draw Map & Calculate Positions
    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = dimensions;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // Projection
        const projection = d3.geoEquirectangular()
            .fitSize([width, height], worldData as any);

        // -- OFFSCREEN RASTERIZATION (Same as before) --
        const offscreen = document.createElement('canvas');
        offscreen.width = width;
        offscreen.height = height;
        const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

        if (!offCtx) return;

        const path = d3.geoPath(projection, offCtx);
        offCtx.fillStyle = '#000000';
        offCtx.beginPath();
        path(worldData as any);
        offCtx.fill();

        const imageData = offCtx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Draw Pattern
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const spacing = 7;
        const maxRadius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2)) + spacing;

        const landColor = '#3b82f6';
        const seaColor = '#cbd5e1';

        for (let r = 0; r < maxRadius; r += spacing) {
            const circumference = 2 * Math.PI * r;
            const numPoints = r === 0 ? 1 : Math.floor(circumference / spacing);

            for (let i = 0; i < numPoints; i++) {
                const theta = (i / numPoints) * 2 * Math.PI;
                const x = cx + r * Math.cos(theta);
                const y = cy + r * Math.sin(theta);

                if (x < 0 || x >= width || y < 0 || y >= height) continue;

                const px = Math.floor(x);
                const py = Math.floor(y);
                const index = (py * width + px) * 4;
                const alpha = data[index + 3];

                const isLand = alpha > 100;

                ctx.beginPath();
                ctx.arc(x, y, isLand ? 1.5 : 1, 0, 2 * Math.PI);
                ctx.fillStyle = isLand ? landColor : seaColor;
                ctx.globalAlpha = isLand ? 1.0 : 0.3;
                ctx.fill();
            }
        }

        // Calculate City Positions for HTML Overlay
        let newPositions = CITIES.map(city => {
            const [x, y] = projection([city.lng, city.lat]) || [0, 0];
            return { x, y, name: city.name };
        });

        // Sort by X (Longitude, Left to Right) for the connection line
        newPositions.sort((a, b) => a.x - b.x);

        setCityPositions(newPositions);

    }, [dimensions]);

    // Group CITIES for display in Sidebar
    const REGIONS = [
        {
            continent: "AMÉRICA",
            cities: ["CDMX", "Monterrey", "Cuernavaca", "Chihuahua", "Acapulco", "Toluca", "Querétaro", "Mérida", "Vancouver", "Chicago", "Miami", "Lima",]
        },
        {
            continent: "EUROPA",
            cities: ["Madrid", "Barcelona", "Londres", "Viena", "Dublin", "Gol", "Oslo"]
        },
        {
            continent: "ÁFRICA",
            cities: ["Ciudad del Cabo"]
        },
        {
            continent: "OCEANÍA",
            cities: ["Sydney", "Wellington"]
        }
    ];

    return (
        <div className="w-full h-screen flex flex-row relative overflow-hidden bg-slate-50/50">
            {/* Sidebar Info (Left) */}
            <div className="absolute left-6 md:left-12 top-0 bottom-0 z-20 flex flex-col justify-center w-full max-w-[220px] pointer-events-none">
                <div className="pointer-events-auto space-y-8 p-4"> {/* Minimal padding, transparent background */}

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4"
                    >
                        <div>
                            <p className="text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-1">Co- Founders con: </p>
                            <h2 className="text-3xl font-black tracking-tighter text-slate-900 leading-none shadow-white drop-shadow-sm">
                                EXPERIENCIA<br />INTERNACIONAL
                            </h2>
                        </div>

                        <div className="flex items-center gap-3 py-3 border-y border-slate-900/10">
                            <span className="text-5xl font-black text-blue-600">8</span>
                            <span className="text-xs font-bold text-slate-500 uppercase leading-tight tracking-wider">
                                Años de<br />Trayectoria
                            </span>
                        </div>
                    </motion.div>

                    {/* Regions List */}
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        {REGIONS.map((region) => (
                            <div key={region.continent}>
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                    {region.continent}
                                </h3>
                                <p className="text-[10px] font-medium text-slate-500 leading-relaxed opacity-90">
                                    {region.cities.join(" • ")}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <motion.div
                ref={containerRef}
                style={{ scale, opacity }}
                className="absolute inset-0 flex items-center justify-center pl-[20vw]" // Offset map to right to balance sidebar
            >
                <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />

                {/* Connection Line (Left to Right Animation) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {/* Background Track (Faint) */}
                    <path
                        d={cityPositions.map((pos, i) => (i === 0 ? `M ${pos.x} ${pos.y}` : `L ${pos.x} ${pos.y}`)).join(" ")}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="0.5"
                        strokeOpacity="0.2"
                    />

                    {/* Traveling Beam (Active) */}
                    <motion.path
                        d={cityPositions.map((pos, i) => (i === 0 ? `M ${pos.x} ${pos.y}` : `L ${pos.x} ${pos.y}`)).join(" ")}
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0.01, pathOffset: 0, opacity: 0 }}
                        animate={{
                            pathOffset: [0, 1],
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 1
                        }}
                    />
                </svg>

                {/* City Markers Overlay */}
                {cityPositions.map((city, index) => (
                    <div
                        key={index}
                        className="absolute group flex flex-col items-center"
                        style={{
                            left: city.x,
                            top: city.y,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {/* Pulse Effect */}
                        <div className="absolute w-4 h-4 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />

                        {/* Dot */}
                        <div className="w-2 h-2 rounded-full bg-blue-600 border border-white shadow-sm z-10 relative hover:scale-150 transition-transform duration-300" />

                        {/* Label (Tooltip style) */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
                            <div className="w-px h-4 bg-slate-800/50"></div>
                            <span className="bg-slate-900 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-lg tracking-widest translate-y-1">
                                {city.name}
                            </span>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
