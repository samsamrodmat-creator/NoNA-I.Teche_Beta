"use client";

import { useState } from "react";

export default function NormativaMenuPage() {
    const [loadingCity, setLoadingCity] = useState<string | null>(null);
    const [showMessage, setShowMessage] = useState<string | null>(null);

    const handleCityClick = (city: string) => {
        if (city === "mty") {
            // Monterey links directly to the HTML
            window.location.href = "/normativa_nona.html";
            return;
        }

        // For CDMX and GDL: Simulate loading, then show message
        setLoadingCity(city);
        setShowMessage(null); // Reset message state if clicking another

        setTimeout(() => {
            setLoadingCity(null);
            setShowMessage(city);
        }, 1500); // 1.5 second loading simulation
    };

    const closeModal = () => {
        setShowMessage(null);
    };

    const upcomingStates = [
        "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
        "Chihuahua", "Coahuila", "Colima", "Durango", "Estado de México",
        "Guanajuato", "Guerrero", "Hidalgo", "Michoacán", "Morelos",
        "Nayarit", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo",
        "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas",
        "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
    ];

    return (
        <main className="relative w-full min-h-screen bg-white selection:bg-blue-500/30 font-sans overflow-hidden flex items-center justify-center p-4">

            {/* Background Effects - Light Holographic */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50"></div>

                {/* Holographic Orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-multiply opacity-70">
                    <div className="absolute -top-[10%] -left-[10%] w-[65%] h-[85%] bg-blue-300/40 rounded-full blur-[80px]"></div>
                    <div className="absolute top-[10%] -right-[10%] w-[55%] h-[75%] bg-cyan-200/50 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[80%] bg-indigo-200/40 rounded-full blur-[90px]"></div>
                </div>

                {/* Subtle Grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 backdrop-blur-md mb-4 text-blue-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">Normativa Urbana Nacional</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 drop-shadow-sm">
                        Selecciona tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">Región</span>
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto font-medium">
                        Accede a las bases de datos de normativa urbana inteligente de las principales zonas metropolitanas del país.
                    </p>
                </div>

                {/* City Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">

                    {/* CDMX Card */}
                    <CityCard
                        id="cdmx"
                        title="Ciudad de México"
                        subtitle="ZM Valle de México"
                        status="work-in-progress"
                        isLoading={loadingCity === "cdmx"}
                        onClick={() => handleCityClick("cdmx")}
                        bgGradient="from-pink-600/20 to-rose-600/5"
                        borderColor="hover:border-pink-500/50"
                        glowColor="group-hover:shadow-[0_0_30px_rgba(219,39,119,0.3)]"
                    />

                    {/* Monterrey Card */}
                    <CityCard
                        id="mty"
                        title="Monterrey"
                        subtitle="ZM de Nuevo León"
                        status="available"
                        isLoading={false}
                        onClick={() => handleCityClick("mty")}
                        bgGradient="from-blue-600/10 to-sky-600/5"
                        borderColor="hover:border-blue-400/80 border-blue-500/30" // Highlighted border initially
                        glowColor="group-hover:shadow-[0_10px_40px_rgba(59,130,246,0.2)] shadow-[0_10px_30px_rgba(59,130,246,0.1)]"
                    />

                    {/* Guadalajara Card */}
                    <CityCard
                        id="gdl"
                        title="Guadalajara"
                        subtitle="ZM de Guadalajara"
                        status="work-in-progress"
                        isLoading={loadingCity === "gdl"}
                        onClick={() => handleCityClick("gdl")}
                        bgGradient="from-amber-600/10 to-orange-600/5"
                        borderColor="hover:border-amber-400/80 border-slate-200"
                        glowColor="group-hover:shadow-[0_10px_40px_rgba(245,158,11,0.2)] shadow-[0_10px_30px_rgba(245,158,11,0.05)]"
                    />
                </div>

                {/* Upcoming Metro Zones Section */}
                <div className="mt-20 w-full max-w-5xl flex flex-col items-center">
                    <div className="flex items-center gap-4 w-full mb-8">
                        <div className="h-px bg-slate-200 flex-grow"></div>
                        <h2 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Próximas Zonas Metropolitanas
                        </h2>
                        <div className="h-px bg-slate-200 flex-grow"></div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {upcomingStates.map((state) => (
                            <div
                                key={state}
                                className="px-4 py-2 rounded-xl bg-white/40 border border-slate-200/60 backdrop-blur-sm text-[11px] font-medium text-slate-500 transition-all duration-300 hover:bg-white/80 hover:text-slate-800 hover:border-slate-300 hover:shadow-sm cursor-default flex items-center gap-2 group"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-400 transition-colors"></div>
                                {state}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Back to Home Link */}
                <div className="mt-16">
                    <a href="/" className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-white transition-colors uppercase tracking-widest gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver al inicio
                    </a>
                </div>
            </div>

            {/* Modal Overlay / Toast for "Working on it" message */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${showMessage ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={closeModal}></div>

                {/* Modal Content */}
                <div className={`relative bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center transition-transform duration-500 delay-100 ${showMessage ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}>

                    {/* Animated builder/wrench icon */}
                    <div className="w-16 h-16 mx-auto bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
                        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">¡Próximamente!</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-8">
                        El equipo de <span className="font-semibold text-white">NoNA I.Tech</span> está trabajando para traerte la Normativa de esta región muy pronto.
                    </p>

                    <button
                        onClick={closeModal}
                        className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                        Entendido
                    </button>
                </div>
            </div>

        </main>
    );
}

// Sub-component for individual City Cards
function CityCard({
    id,
    title,
    subtitle,
    status,
    isLoading,
    onClick,
    bgGradient,
    borderColor,
    glowColor
}: {
    id: string,
    title: string,
    subtitle: string,
    status: 'available' | 'work-in-progress',
    isLoading: boolean,
    onClick: () => void,
    bgGradient: string,
    borderColor: string,
    glowColor: string
}) {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`group relative w-full text-left p-8 rounded-[2rem] border bg-white/60 backdrop-blur-xl overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 focus:outline-none ${borderColor} ${glowColor} shadow-xl shadow-slate-200/50`}
        >
            {/* Hover Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            {/* Loading Spinner Overlay */}
            <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin mb-3"></div>
                <span className="text-xs font-medium text-blue-600 uppercase tracking-widest animate-pulse">Cargando...</span>
            </div>

            <div className="relative z-10 flex flex-col h-full min-h-[180px]">
                <div className="flex justify-between items-start mb-auto">
                    {/* Status Badge */}
                    <div className="inline-flex">
                        {status === 'available' ? (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-600 uppercase tracking-widest shadow-sm">
                                Disponible
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-600 uppercase tracking-widest shadow-sm">
                                Próximamente
                            </span>
                        )}
                    </div>

                    {/* Arrow Icon */}
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:scale-110 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-300 shadow-sm">
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>

                <div className="mt-8">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-[0.15em] mb-1">{subtitle}</p>
                    <h3 className="text-2xl font-black text-slate-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-700 group-hover:to-sky-500 transition-all">
                        {title}
                    </h3>
                </div>
            </div>

            {/* Decorative structural lines */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </button>
    );
}
