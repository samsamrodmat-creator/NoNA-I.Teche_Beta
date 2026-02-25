"use client";

export default function BrainSection() {
    return (
        <section className="w-full relative py-32 bg-slate-50 flex flex-col items-center justify-center overflow-hidden z-20">
            {/* Minimalist Background Pattern */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: 0.05,
                    backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    backgroundPosition: 'center center'
                }}
            />

            <div className="flex flex-col items-center text-center px-4 max-w-4xl z-10 space-y-8">
                <div className="space-y-2">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
                        El Cerebro de NoNA
                    </h2>
                    <p className="text-sm md:text-base tracking-[0.3em] uppercase font-bold text-blue-500">
                        Inteligencia Paramétrica
                    </p>
                </div>

                <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-300 to-transparent my-8" />

                <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-800 leading-tight">
                    Inteligencia que Transforma Ciudades.
                </h3>
                <p className="text-xl md:text-2xl text-slate-600 font-light max-w-3xl leading-relaxed">
                    El entorno tradicional subutiliza el potencial normativo. Descubre cómo nuestro motor inyecta las variables locales como parámetros de diseño a tu favor.
                </p>
            </div>
        </section>
    );
}
