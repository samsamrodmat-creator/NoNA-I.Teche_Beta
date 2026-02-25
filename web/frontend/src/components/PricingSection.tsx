"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Star, Zap, Code2, GraduationCap } from "lucide-react";

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

export default function PricingSection() {
    return (
        <section id="pricing" className="w-full py-24 md:py-32 px-6 flex flex-col items-center justify-center relative z-20 bg-white overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }}
            />

            <div className="max-w-7xl w-full flex flex-col items-center space-y-20 relative z-10">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-6">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[10px] font-bold text-blue-600 tracking-[0.4em] uppercase"
                    >
                        Planes y Precios
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight max-w-3xl"
                    >
                        Encuentra el modelo ideal para tu <span className="text-blue-600">flujo de trabajo</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 max-w-2xl text-sm md:text-base"
                    >
                        Desde estudiantes buscando validar sus primeras ideas, hasta desarrolladoras integrando la tecnología en sus ERPs.
                    </motion.p>
                </div>

                {/* PRICING CARDS */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 w-full"
                >
                    {/* PLAN GRANUITO */}
                    <motion.div variants={itemVariants} className="flex flex-col bg-slate-50 rounded-[2rem] p-8 border border-slate-200 shadow-sm relative group hover:border-blue-200 transition-all duration-300">
                        <div className="mb-8">
                            <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center mb-6">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Gratuito</h3>
                            <p className="text-xs text-slate-500 mt-2">Para estudiantes y validaciones rápidas.</p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900">$0.00</span>
                                <span className="text-xs text-slate-500 font-medium">MXN/mes</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Hasta 3 Evaluaciones por mes</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Búsqueda y Selección en Mapa</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Cálculos Normativos Básicos (CUS, CAS, COS)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Estimación de Costos Genéricos</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Reporte PDF Resumen (Con marca de agua)</span>
                            </li>
                        </ul>

                        <button className="w-full py-3 rounded-full border border-slate-300 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors">
                            Comenzar Gratis
                        </button>
                    </motion.div>

                    {/* PLAN NORMAL */}
                    <motion.div variants={itemVariants} className="flex flex-col bg-white rounded-[2rem] p-8 border border-slate-200 shadow-md relative group hover:border-blue-400 hover:shadow-lg transition-all duration-300">
                        <div className="mb-8">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Normal</h3>
                            <p className="text-xs text-slate-500 mt-2">Para arquitectos independientes.</p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900 blur-sm select-none">$999.00</span>
                                <span className="text-xs text-slate-500 font-medium">MXN/mes</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-700 font-medium">Evaluaciones Ilimitadas</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Cálculo de Estacionamientos</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Costos Indirectos e Impuestos</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Historial (Hasta 10 proyectos)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Reporte Completo Estándar</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Soporte por Correo</span>
                            </li>
                        </ul>

                        <button className="w-full py-3 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all">
                            Elegir Plan
                        </button>
                    </motion.div>

                    {/* PLAN PRO (Destacado) */}
                    <motion.div variants={itemVariants} className="flex flex-col bg-slate-900 rounded-[2rem] p-8 border-2 border-blue-500 shadow-2xl relative group transform md:-translate-y-4 xl:scale-105 z-10 transition-transform hover:scale-100 xl:hover:scale-105">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-sky-400 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">
                            Más Popular
                        </div>

                        <div className="mb-8 mt-2">
                            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                                <Star className="w-5 h-5 fill-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Pro</h3>
                            <p className="text-xs text-slate-400 mt-2">Para firmas y comercializadoras.</p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white blur-sm select-none">$2,999.00</span>
                                <span className="text-xs text-slate-400 font-medium">MXN/mes</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-white font-medium">Todo lo de Normal, más:</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-300">Ajuste Manual de Parámetros de Costo</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-300">Proyectos en la Nube Ilimitados</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-300">Exportación de Excel / CSV</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-300">Reportes Ejecutivos (Logo Propio / White-label)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-300">Soporte Prioritario 24/7</span>
                            </li>
                        </ul>

                        <button className="w-full py-3 rounded-full bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-500 shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all">
                            Elegir Plan Pro
                        </button>
                    </motion.div>

                    {/* PLAN DESARROLLADOR */}
                    <motion.div variants={itemVariants} className="flex flex-col bg-slate-50 rounded-[2rem] p-8 border border-slate-200 shadow-sm relative group hover:border-blue-400 hover:shadow-lg transition-all duration-300">
                        <div className="mb-8">
                            <div className="w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center mb-6">
                                <Code2 className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Desarrollador</h3>
                            <p className="text-xs text-slate-500 mt-2">Integración tecnológica total.</p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900 blur-sm select-none">$7,999.00</span>
                                <span className="text-xs text-slate-500 font-medium">MXN/mes</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-slate-800 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-900 font-medium">Todo lo de Pro, más:</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-slate-800 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Acceso a la API (Endpoints directos)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-slate-800 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Descarga del motor original en Grasshopper / Rhino</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-slate-800 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Licencia de redistribución interna</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-slate-800 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-600">Soporte Técnico Directo (Videollamada)</span>
                            </li>
                        </ul>

                        <button className="w-full py-3 rounded-full border border-slate-300 text-slate-900 font-bold text-xs uppercase tracking-widest hover:border-slate-800 hover:bg-slate-800 hover:text-white transition-all">
                            Hablar con Ventas
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
