"use client";

import { motion } from "framer-motion";
import { Target, Lightbulb, HandHeart, Users, MapPin, Globe2, Cpu } from "lucide-react";

export default function MissionVisionSection() {
    return (
        <section className="w-full py-24 md:py-32 px-6 flex flex-col items-center justify-center relative z-20 bg-slate-50 overflow-hidden border-t border-slate-200">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="max-w-6xl w-full flex flex-col items-center space-y-20 relative z-10">

                {/* Intro / Core Philosophy - Left Aligned Design */}
                <div className="w-full flex flex-col md:flex-row gap-12 items-start justify-between">

                    {/* Left Column: Heading */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-widest uppercase">
                            <HandHeart className="w-4 h-4" />
                            <span>Propósito</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
                            Más que eficiencia;<br />
                            un motor de <span className="text-blue-600">viabilidad socialmente responsable</span>.
                        </h2>
                    </motion.div>

                    {/* Right Column: Text & Question */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 flex flex-col justify-center space-y-6"
                    >
                        <p className="text-lg md:text-xl text-slate-500 leading-relaxed text-justify md:text-left">
                            El valor real de nuestro algoritmo es resolver la ecuación que el mercado tradicional ignora por completo.
                        </p>

                        <div className="bg-white p-6 md:p-8 rounded-2xl border-l-4 border-blue-600 shadow-lg shadow-blue-900/5 relative overflow-hidden group hover:border-l-8 transition-all duration-300">
                            {/* Decorative blur */}
                            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors duration-500" />

                            <p className="relative z-10 text-xl md:text-2xl font-black text-slate-800 leading-snug">
                                ¿Cómo hacer que la vivienda asequible sea <span className="text-blue-600">rentable</span> para el inversionista?
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Mission & Vision Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-10">

                    {/* Mission Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-blue-200 transition-all duration-500 group relative overflow-hidden"
                    >
                        {/* Decorative background circle */}
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl group-hover:bg-blue-50 transition-colors duration-700 pointer-events-none" />

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-4 text-blue-600 mb-4">
                                <div className="p-3 bg-blue-50 rounded-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <Target className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Nuestra Misión</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Point 1 */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Users className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-base text-slate-600 leading-relaxed text-justify relative z-10">
                                        <span className="text-slate-900 font-bold">Democratizar el acceso a la vivienda</span> mediante inteligencia algorítmica aplicada a la redensificación estratégica.
                                    </p>
                                </div>

                                {/* Point 2 */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-base text-slate-600 leading-relaxed text-justify relative z-10">
                                        Facilitamos la creación de <span className="font-semibold text-slate-800">ciudades de 15 minutos</span> al optimizar suelos subutilizados y transformar la complejidad normativa en modelos de usos mixtos que garantizan <span className="text-blue-600 font-semibold bg-blue-100/50 px-3 py-1 rounded-md ml-1 inline-block mt-1 md:mt-0">rentabilidad para el inversionista</span> y <span className="text-emerald-600 font-semibold bg-emerald-100/50 px-3 py-1 rounded-md ml-1 inline-block mt-1 md:mt-0">asequibilidad para el usuario final</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Vision Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-slate-900 rounded-[2.5rem] p-10 md:p-12 border border-slate-800 shadow-2xl hover:border-blue-500/50 transition-all duration-500 group relative overflow-hidden text-white"
                    >
                        {/* Decorative background circle */}
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-slate-800 rounded-full blur-3xl group-hover:bg-blue-900 transition-colors duration-700 pointer-events-none" />

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-4 text-blue-400 mb-4">
                                <div className="p-3 bg-slate-800 rounded-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <Lightbulb className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-widest">Nuestra Visión</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Point 1 */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 group-hover:bg-blue-900/50 transition-colors">
                                            <Globe2 className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-base text-slate-300 leading-relaxed text-justify relative z-10">
                                        <span className="text-white font-bold">Liderar la transformación del paisaje urbano</span> en Latinoamérica, convirtiendo la crisis de vivienda en una oportunidad de desarrollo inteligente y humano.
                                    </p>
                                </div>

                                {/* Point 2 */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-900/50 transition-colors">
                                            <Cpu className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-base text-slate-300 leading-relaxed text-justify relative z-10">
                                        Aspiramos a ser el <span className="text-emerald-400 font-semibold">motor tecnológico</span> que permita que la vivienda céntrica y asequible vuelva a ser una realidad, estableciendo un estándar de transparencia que conecte el capital con el impacto social y la eficiencia urbana.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
