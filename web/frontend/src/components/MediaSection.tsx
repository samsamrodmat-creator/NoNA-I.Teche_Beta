"use client";

import { motion } from "framer-motion";
import { Newspaper, ChevronRight, Share2, Quote } from "lucide-react";

export default function MediaSection() {
    return (
        <section className="w-full py-24 md:py-32 px-6 flex flex-col items-center justify-center relative z-20 bg-slate-50 overflow-hidden border-t border-slate-200">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-6xl w-full flex flex-col items-center space-y-16 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold tracking-[0.2em] uppercase"
                    >
                        <Newspaper className="w-4 h-4" />
                        <span>Apariciones en Prensa</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-none max-w-2xl"
                    >
                        NoNA en los Medios
                    </motion.h2>
                </div>

                {/* Newspaper Article Card (Glassmorphism Bento) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col lg:flex-row group"
                >
                    {/* Image Column (Left on Desktop, Top on Mobile) */}
                    <div className="lg:w-2/5 md:h-96 lg:h-auto relative bg-slate-900 overflow-hidden min-h-[300px]">
                        <img
                            src="/images/media/el_norte_2025.jpg"
                            alt="Artículo del periódico El Norte"
                            className="absolute inset-0 w-full h-full object-cover object-top filter grayscale contrast-125 opacity-80 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                            onError={(e) => {
                                // Fallback styling if image is missing so it still looks decent
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-slate-200', 'to-slate-300');
                                target.parentElement!.innerHTML = '<div class="text-slate-400 font-mono text-sm tracking-widest uppercase text-center p-6"><svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>Pendiente de subir <br/> <code class="lowercase mt-2 block bg-slate-100 p-1 rounded text-slate-500">/public/images/media/el_norte_2025.jpg</code></div>';
                            }}
                        />

                        {/* Blue Tint Overlay */}
                        <div className="absolute inset-0 bg-blue-600/30 mix-blend-color pointer-events-none z-10 group-hover:bg-transparent transition-colors duration-700" />

                        {/* Overlay gradient for text readability at the bottom edge */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                    </div>

                    {/* Content Column (Right on Desktop, Bottom on Mobile) */}
                    <div className="lg:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-between relative bg-white">

                        <div className="space-y-8">
                            {/* Publisher & Date Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-sm font-bold tracking-wider uppercase text-slate-500">
                                <span className="text-blue-600 px-3 py-1 bg-blue-50 rounded-md">El Norte</span>
                                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                <span>Monterrey, N.L.</span>
                                <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                <span>Lun 22 Sept, 2025</span>
                            </div>

                            {/* Headline */}
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 leading-[1.15] tracking-tight">
                                Ofrece alumno de posgrado de la UDEM alternativas a la expansión urbana regia
                            </h3>

                            {/* Subtitle / Excerpt with Quote styling */}
                            <div className="relative">
                                <Quote className="absolute -top-3 -left-4 w-8 h-8 text-blue-100 rotate-180" />
                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium pl-6 border-l-4 border-blue-500 relative z-10 text-justify">
                                    Como Proyecto de Evaluación Final para graduarse de la Maestría en Arquitecturas Avanzadas... el alumno Samuel Rodríguez Matus creó una plataforma que facilita el acceso a la normativa de construcción y genera modelos volumétricos.
                                </p>
                            </div>

                            {/* Short Summary context */}
                            <p className="text-sm text-slate-500 leading-relaxed text-justify">
                                La herramienta computacional busca proponer soluciones de redensificación para Monterrey, evaluando la viabilidad económica y normativa de terrenos. Esto permite a usuarios comprender rápidamente qué se puede edificar, fomentando un crecimiento inteligente de la ciudad.
                            </p>
                        </div>

                        {/* Footer action (Optional, could open image modal or external link) */}
                        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                            <button className="group/btn inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">
                                Ver recorte original
                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>

                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Compartir">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                    </div>
                </motion.div>

            </div>
        </section>
    );
}
