"use client";

import { motion } from "framer-motion";

interface StackingDiagramProps {
    landArea: number;
    cos: number;
    commercialArea: number;
    residentialArea: number;
    parkingArea: number;
}

export function StackingDiagram({
    landArea,
    cos,
    commercialArea,
    residentialArea,
    parkingArea,
}: StackingDiagramProps) {
    // 1. Calculate Footprint
    const footprint = landArea * cos;

    // 2. Estimate Floors (Assuming uniform footprint)
    const commercialFloors = footprint > 0 ? commercialArea / footprint : 0;
    const residentialFloors = footprint > 0 ? residentialArea / footprint : 0;
    const parkingFloors = footprint > 0 ? parkingArea / footprint : 0;

    // 3. Scale Factor (Pixels per Floor)
    const pxPerFloor = 20;

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-full flex flex-col items-center justify-end relative overflow-hidden min-h-[400px]">

            {/* Ground Plane */}
            <div className="absolute bottom-0 w-full h-1 bg-zinc-700 mx-auto" />

            <div className="z-10 flex flex-col-reverse w-32 relative bottom-1">

                {/* Commercial Block */}
                {commercialFloors > 0 && (
                    <Block
                        color="bg-blue-500"
                        height={commercialFloors * pxPerFloor}
                        label="Commercial"
                        floors={commercialFloors}
                    />
                )}

                {/* Parking Block */}
                {parkingFloors > 0 && (
                    <Block
                        color="bg-zinc-600"
                        height={parkingFloors * pxPerFloor}
                        label="Parking"
                        floors={parkingFloors}
                    />
                )}

                {/* Residential Block */}
                {residentialFloors > 0 && (
                    <Block
                        color="bg-indigo-500"
                        height={residentialFloors * pxPerFloor}
                        label="Living"
                        floors={residentialFloors}
                    />
                )}
            </div>

            <div className="absolute top-4 right-4 text-xs text-zinc-500 text-right">
                <p>Est. Total Levels: {(commercialFloors + residentialFloors + parkingFloors).toFixed(1)}</p>
                <p>Footprint: {footprint.toFixed(0)}m²</p>
            </div>

        </div>
    );
}

function Block({ color, height, label, floors }: { color: string, height: number, label: string, floors: number }) {
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: Math.max(height, 4), opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`w-full ${color} border-b border-white/10 flex items-center justify-center relative group`}
        >
            <span className="text-[10px] text-white/50 font-medium">{label}</span>

            {/* Tooltip */}
            <div className="absolute left-full ml-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
                {floors.toFixed(1)} Levels
            </div>
        </motion.div>
    )
}
