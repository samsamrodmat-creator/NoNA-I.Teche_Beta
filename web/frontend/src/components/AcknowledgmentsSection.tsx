"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";

export default function AcknowledgmentsSection() {
    const [isOpen, setIsOpen] = useState(false);

    const names = [
        "Claudia",
        "David F",
        "David",
        "María",
        "Andres",
        "Cesar",
        "Paula",
        "Mariana",
        "Cesar M",
        "Ma del Carmen",
        "Felipe A",
        "Rosalinda",
        "Benjamin R",
        "Alejandra R",
        "Valentina R",
        "Luis",
        "Miguel",
        "Pablo",
        "Mery",
        "Nathalia",
        "Ana P",
        "Mauricio",
        "Yael",
        "Diego",
        "Ana G",
        "Montse",
        "Gilberto",
        "Fernanda",
        "Virginia",
        "Melanie",
        "Sayuri",
        "Enrique",
        "Victor",
        "Pedro",
        "Paola",
        "Jessica",
        "Regina",
        "Diana",
        "Valeria N",
        "Valeria",
        "Daniel",
        "Josue",
        "Ximena F",
        "Rubén B",
        "Andres O"
    ];

    return (
        <>
            {/* Trigger Button */}
            <div className="w-full flex justify-center py-8 bg-slate-200 border-t border-slate-300/50 relative z-20">
                <button
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors duration-300"
                >
                    <Heart className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>Agradecimientos</span>
                </button>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Heart className="w-5 h-5 fill-current" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                            Agradecimientos
                                        </h3>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                            Gracias por hacerlo posible
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Scrollable Names List (Inline Format) */}
                            <div className="p-6 md:p-8 overflow-y-auto max-h-[50vh]">
                                <div className="text-slate-600 font-medium leading-[2.5] text-lg text-center md:text-left">
                                    {names.map((name, index) => (
                                        <motion.span
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="inline-flex items-center"
                                        >
                                            <span className="whitespace-nowrap">{name}</span>
                                            {index < names.length - 1 && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mx-3 inline-block shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                            )}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>

                            {/* Decorative bottom border */}
                            <div className="h-1 lg:h-2 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-400" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
