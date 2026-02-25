"use client";

import { motion } from "framer-motion";

import Image from "next/image";

export default function TeamSection() {
    const team = [
        {
            name: "Samuel Rodriguez Matus",
            role: "Co-Founder & Director General",
            location: "Monterrey Nuevo León",
            image: "/team/samuel20.png", // Updated to expected naming if exists, keeping original path
            linkedin: "https://www.linkedin.com/in/samuel-rodr%C3%ADguez-matus-60a63b246/",
            bio: [
                "Arquitecto por la Universidad La Salle Cuernavaca y Maestro en Arquitecturas Avanzadas por la Universidad de Monterrey. Ha desarrollado y colaborado en proyectos arquitectónicos en 11 países, participando activamente en etapas de ejecución y desarrollo técnico.",
                "Ganador del Tercer Lugar Nacional de Arquitectura UIC 2022, ha publicado algoritmos aplicados al diseño arquitectónico en contextos nacionales e internacionales. Su práctica se especializa en diseño computacional, integrando arquitectura, análisis de datos, diseño paramétrico, diseño generativo e inteligencia artificial para evaluar la viabilidad normativa y financiera de proyectos inmobiliarios.",
                "En NoNA, lidera la visión estratégica y tecnológica, desarrollando una metodología algorítmica replicable que permite tomar decisiones basadas en datos para impulsar vivienda asequible y modelos urbanos más eficientes."
            ]
        },
        {
            name: "Diego Quezada Méndez",
            role: "Co-Founder & Director de Arquitectura",
            location: "Ciudad de México CDMX",
            image: "/team/diego2.png", // Keeping original path
            linkedin: "https://www.linkedin.com/in/diego-quezada-m%C3%A9ndez-649721245/",
            bio: [
                "Arquitecto por la Universidad Iberoamericana, con experiencia en obra pública y privada, especializado en la articulación entre diseño arquitectónico y ejecución técnica.",
                "Participó en procesos de reconstrucción estructural tras el sismo de 2017 en México, así como en el desarrollo de vivienda plurifamiliar en contextos urbanos consolidados, aportando un enfoque riguroso en normativa, sistemas constructivos y viabilidad técnica.",
                "En NoNA, Diego Quezada Méndez integra la experiencia de campo al desarrollo tecnológico, asegurando que los algoritmos de factibilidad respondan a criterios constructivos reales, normativa vigente y condiciones operativas del mercado. Su enfoque garantiza que la automatización no pierda lógica técnica, sostenibilidad ni dimensión humana."
            ]
        }
    ];

    return (
        <section className="w-full py-24 md:py-32 px-6 flex flex-col items-center justify-center relative z-20 overflow-hidden">

            <div className="max-w-7xl w-full space-y-6">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-3">
                    <span className="text-[10px] font-bold text-blue-600 tracking-[0.4em] uppercase">
                        Liderazgo & Visión
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase">
                        Nuestro Equipo
                    </h2>
                    <div className="w-px h-8 bg-gradient-to-b from-blue-500 to-transparent mt-2"></div>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start relative">
                    {/* Vertical Divider for desktop */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2"></div>

                    {team.map((member, index) => (
                        <div key={member.name} className="group flex flex-col items-center gap-8">

                            {/* Image Container with Tech Borders */}
                            <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative w-full max-w-[280px] aspect-[4/5] overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-blue-500 transition-colors duration-700 block cursor-pointer"
                                title={`Ver perfil de LinkedIn de ${member.name}`}
                            >
                                {member.image ? (
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                        <span className="text-6xl font-black">{member.name.charAt(0)}</span>
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                {/* Decorators - Tech Corners */}
                                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>

                                <div className="absolute bottom-4 right-4 text-[9px] text-white/90 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 tracking-widest hidden md:block pointer-events-none">
                                    /// {member.name.split(" ")[0].toUpperCase()}_PROFILE
                                </div>
                            </a>

                            {/* Text Visuals */}
                            <div className="space-y-5 w-full">
                                <div className="border-l-4 border-blue-600 pl-4 py-1">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5 uppercase">
                                        {member.name}
                                    </h3>
                                    <p className="text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase">
                                        {member.role}
                                    </p>
                                    {member.location && (
                                        <p className="text-[10px] font-medium text-slate-500 tracking-[0.1em] uppercase mt-1 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {member.location}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3 opacity-80 group-hover:opacity-100 transition-opacity pl-6 md:pl-0">
                                    {member.bio.map((paragraph, pIdx) => (
                                        <p key={pIdx} className="text-sm md:text-base leading-relaxed text-slate-500 text-justify font-medium">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
