"use client";

import { ParticleBackground } from "@/components/ParticleBackground";
import WorldMap from "@/components/WorldMap";
import PricingSection from "@/components/PricingSection";
import TeamSection from "@/components/TeamSection";
import ValuePropSection from "@/components/ValuePropSection";
import MissionVisionSection from "@/components/MissionVisionSection";
import MediaSection from "@/components/MediaSection";
import AcknowledgmentsSection from "@/components/AcknowledgmentsSection";
import BetaRegistrationCTA, { CountdownTimer } from "@/components/BetaRegistrationCTA";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
    const router = useRouter();
    const [isZooming, setIsZooming] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showScroll, setShowScroll] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setShowScroll(false);
            } else {
                setShowScroll(true);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleEnter = () => {
        setIsLoading(true);
        setIsZooming(true);
        // Wait for zoom animation naturally before navigating
        setTimeout(() => {
            router.push("/dashboard");
        }, 1200); // Slightly longer delay for the effect to really "pop"
    };

    return (
        <main className="relative w-full min-h-screen bg-slate-50 selection:bg-blue-500/30 font-sans overflow-x-clip">

            {/* Fixed Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Blueprint Grid Background */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Background Animation */}
                <div className={`absolute inset-0 transition-opacity duration-1000 ${isZooming ? 'opacity-0' : 'opacity-100'}`}>
                    <ParticleBackground isExploding={isZooming} />
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="relative z-10 w-full flex flex-col items-center">

                {/* HERO SECTION */}
                <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center p-4">
                    {/* Content Card - Minimalist Blueprint Container */}
                    <div className={`relative z-10 text-center space-y-8 p-12 md:p-20 rounded-[4rem] border border-white/40 bg-white/60 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 ${isZooming ? 'opacity-0 scale-150 blur-lg pointer-events-none' : 'visible'}`}>

                        {/* Logo */}
                        <div className="space-y-6 select-none flex flex-col items-center">
                            <div className="relative inline-block animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                <h1 className="text-8xl md:text-[120px] leading-tight font-black tracking-tighter text-slate-900 drop-shadow-sm">
                                    NoNA
                                </h1>
                                <span className="absolute -bottom-6 left-1 text-xl md:text-2xl font-bold tracking-widest text-blue-600/60 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
                                    I.Tech
                                </span>
                            </div>

                            <p className="text-[10px] md:text-xs font-medium tracking-[0.3em] text-slate-400 uppercase opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-forwards pt-4">
                                beta Release 3 de marzo del 2026
                            </p>
                        </div>

                        {/* Beta Registration Button */}
                        <div className="pb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-forwards relative z-20">
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSdRXd7yhatKbHssyLMBQguBcIS4OCX1wW_XmotKx-yBUbL2AQ/viewform?usp=sf_link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative inline-flex items-center justify-center px-10 py-3.5 text-[11px] uppercase tracking-[0.25em] font-black text-white transition-all duration-300 
                                bg-gradient-to-r from-blue-600 to-blue-500 rounded-full hover:from-blue-500 hover:to-sky-400 
                                shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] hover:-translate-y-1 group overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center">
                                    Regístrate para la Beta
                                    <svg className="w-3.5 h-3.5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                                {/* Highlight overlay effect */}
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
                                {/* Subtle pulse border */}
                                <div className="absolute inset-0 rounded-full border border-blue-400/50 group-hover:border-white/50 animate-pulse"></div>
                            </a>
                        </div>

                        {/* Countdown to Launch */}
                        <div className="w-full">
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <div className="h-px bg-slate-200 flex-grow max-w-[50px]"></div>
                                <span className="text-[10px] font-bold text-blue-600 tracking-[0.3em] uppercase">Lanzamiento Oficial</span>
                                <div className="h-px bg-slate-200 flex-grow max-w-[50px]"></div>
                            </div>
                            <CountdownTimer />
                        </div>

                        {/* Enter Button - Technical Style */}
                        <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <button
                                onClick={handleEnter}
                                disabled={isLoading}
                                className={`group relative inline-flex items-center justify-center px-12 py-4 text-sm uppercase tracking-widest font-bold text-slate-500 transition-all duration-300 
                                bg-white/40 border border-slate-200 rounded-full shadow-sm
                                ${isLoading ? 'bg-blue-50 text-blue-400 cursor-wait' : 'hover:bg-blue-600 hover:border-blue-600 hover:text-white hover:shadow-[0_10px_30px_rgba(37,99,235,0.3)]'}
                                focus:outline-none`}
                            >
                                <span>{isLoading ? 'Inicializando...' : 'Ingresar'}</span>
                                {!isLoading && (
                                    <svg
                                        className="w-4 h-4 ml-3 opacity-50 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                                {isLoading && (
                                    <div className="ml-3 h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                                )}
                            </button>
                        </div>
                    </div> {/* End of Hero Card Content */}

                    {/* Scroll Indicator - Fixed to Viewport */}
                    <div
                        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                        className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer transition-all duration-700 delay-500 z-50 group ${isZooming || !showScroll ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 hover:-translate-y-1'}`}
                    >
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-blue-600/80 drop-shadow-sm group-hover:text-blue-600 transition-colors whitespace-nowrap">
                            Descubre más sobre NoNA
                        </span>

                        {/* Animated Mouse/Scroll Icon */}
                        <div className="w-6 h-10 sm:w-7 sm:h-12 border-2 border-blue-200 rounded-full flex justify-center pt-2 pb-1 bg-white/50 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:border-blue-400 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all">
                            <div className="w-1.5 h-2.5 sm:w-1.5 sm:h-3 bg-blue-500 rounded-full animate-[bounce_1.5s_infinite]"></div>
                        </div>

                        {/* Animated Chevrons */}
                        <div className="flex flex-col items-center mt-[-6px] sm:mt-[-8px] opacity-60 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-[pulse_2s_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 animate-[pulse_2s_infinite_200ms] -mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </section>

                {/* VALUE PROP SECTION */}
                <section className="w-full min-h-[60vh] flex flex-col items-center justify-center relative z-20 bg-slate-50">
                    <ValuePropSection />
                </section>

                {/* MISSION & VISION SECTION */}
                <MissionVisionSection />

                {/* EXPERIENCE SECTION (World Map) */}
                <section className="w-full h-screen relative z-20 bg-gradient-to-b from-slate-100 to-slate-100 overflow-hidden">
                    <WorldMap />
                </section>

                {/* PRICING SECTION */}
                <PricingSection />

                {/* TEAM SECTION */}
                <section className="w-full min-h-screen flex flex-col items-center justify-center relative z-20 bg-gradient-to-b from-slate-100 via-slate-100 to-white">
                    <TeamSection />
                </section>

                {/* BOTTOM CALL TO ACTION (BETA REGISTRATION) */}
                <BetaRegistrationCTA />

                {/* MEDIA / PRESS SECTION */}
                <MediaSection />

                {/* ACKNOWLEDGMENTS SECTION */}
                <AcknowledgmentsSection />

                {/* FOOTER */}
                <footer className="w-full py-12 text-center text-slate-500 text-xs uppercase tracking-widest border-t border-slate-200 bg-slate-200 relative z-20">
                    <p>© 2026 NoNA I.Tech - Todos los derechos reservados</p>
                </footer>
            </div>

            {/* System Status - Fixed at bottom left when at top, or fades out? Let's keep it fixed but unobtrusive */}
            <div className={`fixed bottom-6 left-6 z-50 flex items-center gap-6 text-[10px] font-mono text-slate-400 uppercase tracking-widest transition-opacity duration-500 ${isZooming ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="hidden md:inline">System: Online</span>
                </div>
            </div>

        </main>
    );
}
