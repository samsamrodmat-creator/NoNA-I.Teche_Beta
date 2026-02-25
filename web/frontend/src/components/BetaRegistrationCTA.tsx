"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function CountdownTimer() {
    const targetDate = new Date("2026-03-03T15:33:00").getTime();
    const [mounted, setMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    // Don't render until mounted to avoid hydration errors
    if (!mounted) return (
        <div className="flex gap-4 sm:gap-6 justify-center mt-8 pt-4 pb-2">
            {["Días", "Hrs", "Min", "Seg"].map((unit, idx) => (
                <div key={idx} className="flex flex-col items-center">
                    <div className="w-14 h-16 sm:w-16 sm:h-20 bg-slate-100/30 backdrop-blur-md border border-slate-200/50 rounded-xl flex items-center justify-center shadow-inner">
                        <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter tabular-nums drop-shadow-sm">00</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-3">{unit}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex gap-4 sm:gap-6 justify-center mt-8 pt-4 pb-2">
            {[
                { label: "Días", value: timeLeft.days },
                { label: "Hrs", value: timeLeft.hours },
                { label: "Min", value: timeLeft.minutes },
                { label: "Seg", value: timeLeft.seconds }
            ].map((unit, idx) => (
                <div key={idx} className="flex flex-col items-center">
                    <div className="w-14 h-16 sm:w-16 sm:h-20 bg-slate-100/30 backdrop-blur-md border border-slate-200/50 rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden group">
                        {/* Glow effect inside box */}
                        <div className="absolute inset-0 bg-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter tabular-nums drop-shadow-sm relative z-10">
                            {unit.value.toString().padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-3">
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function BetaRegistrationCTA() {
    return (
        <section className="w-full py-32 px-6 flex flex-col items-center justify-center relative z-20 bg-white overflow-hidden border-t border-slate-200">
            {/* Animated Ambient Holographic Background on White */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-multiply opacity-100">
                {/* Top left large orb */}
                <motion.div
                    animate={{
                        scale: [1, 1.25, 1],
                        opacity: [0.7, 0.95, 0.7],
                        x: [0, 60, 0],
                        y: [0, -40, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-[10%] -left-[10%] w-[65%] h-[85%] bg-blue-400/75 rounded-full blur-[75px]"
                />

                {/* Middle right smaller orb */}
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 0.9, 0.6],
                        x: [0, -45, 0],
                        y: [0, 55, 0]
                    }}
                    transition={{
                        duration: 11,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-[10%] -right-[10%] w-[55%] h-[75%] bg-cyan-300/80 rounded-full blur-[85px]"
                />

                {/* Bottom center orb */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 0.95, 0.7],
                        x: [0, 75, 0],
                        y: [0, -45, 0]
                    }}
                    transition={{
                        duration: 9,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-[-10%] left-[20%] w-[60%] h-[80%] bg-indigo-300/75 rounded-full blur-[95px]"
                />
            </div>

            {/* Subtle Grid overlay for texture - adjusted for light bg */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }}
            />

            <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-12 relative z-10">

                {/* Header text */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/50 border border-blue-200 text-[10px] font-bold text-blue-600 tracking-[0.3em] uppercase mb-4 backdrop-blur-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span>
                        Lanzamiento Oficial: 3 de Marzo 2026
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight drop-shadow-sm"
                    >
                        ¿Listo para empezar a encontrar <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.2)]">el cómo sí?</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed"
                    >
                        Asegura tu lugar en nuestra Beta y descubre cómo la NoNA I.Tech
                        cambiará para siempre la forma en la que analizas viabilidades inmobiliarias.
                    </motion.p>
                </div>

                {/* Countdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="w-full flex justify-center py-6"
                >
                    <CountdownTimer />
                </motion.div>

                {/* Call To Action Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="relative"
                >
                    {/* Glow effect behind button */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-sky-400 opacity-20 blur-2xl rounded-full"></div>

                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSdRXd7yhatKbHssyLMBQguBcIS4OCX1wW_XmotKx-yBUbL2AQ/viewform?usp=sf_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative flex items-center justify-center px-12 py-5 text-sm md:text-base uppercase tracking-[0.2em] font-black text-white transition-all duration-300 
                        bg-slate-900 rounded-full hover:bg-blue-600 
                        shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 group overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Regístrate para la Beta
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                        {/* Hover light sweep */}
                        <div className="absolute inset-0 w-1/4 h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-out"></div>
                    </a>
                </motion.div>

            </div>
        </section>
    );
}
