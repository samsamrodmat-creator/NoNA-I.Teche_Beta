"use client";

import { motion, useInView, useSpring, useMotionValue, useTransform, type Variants } from "framer-motion";
import { Clock, TrendingDown, FileText, CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";

// --- Components ---

function Counter({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
    const formatted = useTransform(springValue, (latest) => `${prefix}${Math.round(latest)}${suffix}`);

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    return <motion.span ref={ref}>{formatted}</motion.span>;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 50 }
    }
};

export default function ValuePropSection() {
    return (
        <section className="w-full py-24 md:py-32 px-6 flex flex-col items-center justify-center relative z-20 bg-slate-50 overflow-hidden">

            {/* Background Elements */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="max-w-6xl w-full flex flex-col items-center space-y-24 relative z-10">

                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-6">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[10px] font-bold text-blue-600 tracking-[0.4em] uppercase"
                    >
                        Rendimiento Superior
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 uppercase leading-none max-w-2xl"
                    >
                        Ingeniería de Valor <br /> <span className="text-blue-600">vs</span> Método Tradicional
                    </motion.h2>
                </div>

                {/* BENTO GRID LAYOUT */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                >

                    {/* CARD 1: TIME (Large) */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.01 }}
                        className="col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group hover:border-blue-400 transition-all duration-500"
                    >
                        <div className="space-y-4 max-w-md">
                            <div className="flex items-center gap-3 text-blue-600 mb-2">
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Clock className="w-6 h-6" />
                                </motion.div>
                                <span className="text-xs font-bold tracking-widest uppercase">Velocidad</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800">Análisis Multivariable</h3>
                            <p className="text-sm text-slate-500 leading-relaxed text-justify">
                                Generas y evalúas decenas de variables de diseño en minutos. Lo que antes requería semanas de iteración manual, ahora permite explorar el espectro completo de posibilidades instantáneamente.
                            </p>
                        </div>
                        <div className="flex flex-col items-center md:items-end">
                            <span className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors duration-500">
                                <Counter value={800} suffix="%" />
                            </span>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mt-2">
                                Más Rápido
                            </span>
                        </div>
                    </motion.div>

                    {/* CARD 2: COST (Tall) */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.01 }}
                        className="col-span-1 md:col-span-1 lg:row-span-2 bg-slate-900 rounded-[2rem] p-8 md:p-10 border border-slate-800 shadow-xl flex flex-col justify-between gap-8 group"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-blue-400 mb-2">
                                <TrendingDown className="w-6 h-6" />
                                <span className="text-xs font-bold tracking-widest uppercase">Costos Operativos</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white">Economía Inteligente</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Reducción drástica de costos operativos al permitir análisis de pre-factibilidad económica desde las primeras ideas conceptuales, evitando retrabajos costosos.
                            </p>
                        </div>
                        <div className="flex flex-col items-start pt-8 border-t border-slate-800">
                            <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                                <Counter value={200} suffix="%" />
                            </span>
                            <span className="text-sm font-medium text-slate-400 mt-2">
                                Más económico
                            </span>
                        </div>
                    </motion.div>

                    {/* CARD 3: REPORTS (Small) */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="col-span-1 md:col-span-1 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group hover:border-blue-300"
                    >
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Reportes Ejecutivos</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Generación automática de documentación técnica, financiera y normativa listas para exportación PDF y presentación a inversionistas.
                        </p>
                    </motion.div>

                    {/* CARD 4: NORMATIVE (Small) */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="col-span-1 md:col-span-1 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group hover:border-blue-300"
                    >
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 mb-6 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Zonificación & Concepto</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Integramos la visión conceptual del arquitecto directamente con la zonificación normativa, asegurando viabilidad financiera desde el primer trazo.
                        </p>
                    </motion.div>
                </motion.div>

                {/* COMPARATIVE GRAPH - RADIAL */}
                <div className="w-full pt-16 border-t border-slate-200">
                    <div className="flex flex-col items-center mb-16 space-y-4">
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Comparativa de Rendimiento</h3>
                        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Estudio de Factibilidad Inmobiliaria</p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 w-full">

                        {/* RADIAL 1: TIME */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="relative flex flex-col items-center group lg:scale-100"
                        >
                            <div className="relative w-64 h-64 flex items-center justify-center">
                                {/* Background Circle (Traditional) */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="128" cy="128" r="120" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                                    <circle cx="128" cy="128" r="120" stroke="#94a3b8" strokeWidth="8" fill="transparent" strokeDasharray="753.98" strokeDashoffset="0" className="opacity-20" />
                                </svg>

                                {/* Foreground Circle (NoNA) */}
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                    <motion.circle
                                        cx="128" cy="128" r="120"
                                        stroke="#3b82f6" strokeWidth="12" fill="transparent"
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: "753.98 753.98", strokeDashoffset: 753.98 }}
                                        whileInView={{ strokeDashoffset: 753.98 - (753.98 * 0.05) }} // 5% fill
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                    />
                                </svg>

                                {/* Center Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-slate-900">
                                        <Counter value={95} prefix="-" suffix="%" />
                                    </span>
                                    <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-2">Tiempo</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-8 text-center space-y-2">
                                <p className="text-xs text-slate-400 font-medium">Tradicional: <span className="text-slate-600 font-bold">4 Semanas</span></p>
                                <p className="text-sm text-blue-600 font-bold">NoNA I.Tech: &lt; 48 Horas</p>
                            </div>
                        </motion.div>

                        {/* RADIAL 2: COST */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative flex flex-col items-center group lg:scale-100"
                        >
                            <div className="relative w-64 h-64 flex items-center justify-center">
                                {/* Background Circle (Traditional) */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="128" cy="128" r="120" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                                    <circle cx="128" cy="128" r="120" stroke="#94a3b8" strokeWidth="8" fill="transparent" strokeDasharray="753.98" strokeDashoffset="0" className="opacity-20" />
                                </svg>

                                {/* Foreground Circle (NoNA) */}
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                    <motion.circle
                                        cx="128" cy="128" r="120"
                                        stroke="#0ea5e9" strokeWidth="12" fill="transparent"
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: "753.98 753.98", strokeDashoffset: 753.98 }}
                                        whileInView={{ strokeDashoffset: 753.98 - (753.98 * 0.30) }} // 30% fill
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                                    />
                                </svg>

                                {/* Center Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-slate-900">
                                        <Counter value={70} prefix="-" suffix="%" />
                                    </span>
                                    <span className="text-xs font-bold text-sky-500 uppercase tracking-widest mt-2">Costo</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-8 text-center space-y-2">
                                <p className="text-xs text-slate-400 font-medium">Tradicional: <span className="text-slate-600 font-bold">100% Inversión</span></p>
                                <p className="text-sm text-sky-600 font-bold">NoNA I.Tech: ~30% Inversión</p>
                            </div>
                        </motion.div>

                        {/* RADIAL 3: VERSATILITY */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="relative flex flex-col items-center group lg:scale-100"
                        >
                            <div className="relative w-64 h-64 flex items-center justify-center">
                                {/* Background Circle */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <defs>
                                        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ffffff" />
                                            <stop offset="50%" stopColor="#38bdf8" />
                                            <stop offset="100%" stopColor="#1e3a8a" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="128" cy="128" r="120" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                                    {/* Tiny segment for 1 proposal */}
                                    <circle cx="128" cy="128" r="120" stroke="#94a3b8" strokeWidth="8" fill="transparent" strokeDasharray="753.98" strokeDashoffset={753.98 - (753.98 * 0.02)} className="opacity-20" />
                                </svg>

                                {/* Foreground Circle (NoNA - Infinite) */}
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                    <motion.circle
                                        cx="128" cy="128" r="120"
                                        stroke="url(#blueGradient)" strokeWidth="12" fill="transparent"
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: "753.98 753.98", strokeDashoffset: 753.98 }}
                                        whileInView={{ strokeDashoffset: 0 }} // 100% full
                                        viewport={{ once: true }}
                                        transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
                                    />
                                </svg>

                                {/* Center Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.5, type: "spring" }}
                                        className="text-6xl font-black text-slate-900 pb-2 bg-gradient-to-br from-slate-900 to-blue-900 bg-clip-text text-transparent"
                                    >
                                        ∞
                                    </motion.span>
                                    <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">Propuestas</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-8 text-center space-y-2">
                                <p className="text-xs text-slate-400 font-medium">Tradicional: <span className="text-slate-600 font-bold">1 Propuesta</span></p>
                                <p className="text-sm text-blue-900 font-bold">NoNA I.Tech: Infinitas</p>
                            </div>
                        </motion.div>


                    </div>
                </div>

            </div>
        </section>
    );
}
