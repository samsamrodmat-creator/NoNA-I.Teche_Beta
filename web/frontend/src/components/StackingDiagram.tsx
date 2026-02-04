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

    // 2.5D Update
    // We add a 'perspective' container and rotate the inner container slightly

    return (
        <div className="bg-zinc-100 dark:bg-zinc-900 border border-black dark:border-zinc-800 rounded-xl p-6 h-full flex flex-col relative overflow-hidden min-h-[400px]">
            <h3 className="text-black dark:text-zinc-400 text-sm font-medium mb-4 absolute top-6 left-6 z-20">Diagrama de Apilamiento (Volumetría Est.)</h3>

            <div className="flex-1 flex items-end justify-center perspective-[800px] mb-8 mt-12">
                <div
                    className="relative w-48 transition-transform duration-500"
                    style={{
                        transform: "rotateX(20deg) rotateY(-20deg) rotateZ(0deg)",
                        transformStyle: "preserve-3d"
                    }}
                >
                    {/* Shadow Base */}
                    <div className="absolute bottom-0 w-full h-full bg-black/40 blur-xl transform translate-y-4 scale-x-110" />

                    <div className="flex flex-col-reverse relative z-10 w-full">
                        {/* Commercial Block */}
                        {commercialFloors > 0 && (
                            <Block3D
                                colorClass="bg-blue-600"
                                shadeClass="bg-blue-800"
                                topClass="bg-blue-400"
                                height={commercialFloors * pxPerFloor}
                                label="Comercial"
                                floors={commercialFloors}
                            />
                        )}

                        {/* Parking Block */}
                        {parkingFloors > 0 && (
                            <Block3D
                                colorClass="bg-zinc-600"
                                shadeClass="bg-zinc-800"
                                topClass="bg-zinc-400"
                                height={parkingFloors * pxPerFloor}
                                label="Estacionamiento"
                                floors={parkingFloors}
                            />
                        )}

                        {/* Residential Block */}
                        {residentialFloors > 0 && (
                            <Block3D
                                colorClass="bg-indigo-600"
                                shadeClass="bg-indigo-800"
                                topClass="bg-indigo-400"
                                height={residentialFloors * pxPerFloor}
                                label="Vivienda"
                                floors={residentialFloors}
                            />
                        )}

                        {/* Ground Plate */}
                        <div className="absolute -bottom-4 -left-4 w-[120%] h-4 bg-zinc-700/50 transform translate-z-[-1px] rounded" />
                    </div>
                </div>
            </div>

            <div className="absolute top-6 right-6 text-xs text-black/60 dark:text-zinc-500 text-right z-20">
                <p>Niveles Totales: <span className="text-black dark:text-white font-bold">{(commercialFloors + residentialFloors + parkingFloors).toFixed(1)}</span></p>
                <p>Huella: <span className="text-black dark:text-white font-bold">{footprint.toFixed(0)}m²</span></p>
            </div>

        </div>
    );
}

function Block3D({ colorClass, shadeClass, topClass, height, label, floors }: { colorClass: string, shadeClass: string, topClass: string, height: number, label: string, floors: number }) {
    // Simplified 2.5D Block
    // Front Face = main div
    // Side Face = pseudo element via normal div
    // Top Face = separate div

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: Math.max(height, 8), opacity: 1 }}
            className="relative w-full group transition-all duration-300 hover:brightness-110"
            style={{ transformStyle: "preserve-3d" }}
        >
            {/* Front Face */}
            <div className={`absolute inset-0 ${colorClass} border-b border-white/5 flex items-center justify-center`}>
                <span className="text-[10px] text-white/70 font-bold z-10 drop-shadow-md">{label}</span>
            </div>

            {/* Side Face (Right) */}
            <div
                className={`absolute right-0 top-0 h-full w-4 ${shadeClass} origin-right transform rotate-y-90 translate-x-full border-b border-white/5`}
            />

            {/* Top Face (Only visible if it's the top block conceptually, but we render for all for simplicity or stack logic)
                Actually in 'flex-col-reverse', the 'top' of this div is visually the top.
            */}
            <div
                className={`absolute top-0 left-0 w-full h-4 ${topClass} origin-top transform rotate-x-90 -translate-y-full`}
            />

            {/* Tooltip */}
            <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-8 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none border border-zinc-800/50"
                style={{ transform: "rotateY(20deg) rotateX(-20deg)" }} // Counter rotate?
            >
                {floors.toFixed(1)} Niveles
            </div>
        </motion.div>
    )
}
