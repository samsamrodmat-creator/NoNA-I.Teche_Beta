"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, TrendingUp, DollarSign, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialAnalysisProps {
    data: any; // Raw results from API
}

export function FinancialAnalysis({ data }: FinancialAnalysisProps) {
    if (!data || !data.raw) return null;

    const raw = data.raw;
    const [desiredMargin, setDesiredMargin] = useState(raw.utilidadDeseada || 20);

    // Sync with incoming data if it changes, but allow local override
    useEffect(() => {
        if (raw.utilidadDeseada) {
            setDesiredMargin(raw.utilidadDeseada);
        }
    }, [raw.utilidadDeseada]);

    // Instant Sensitivity Calculation
    // Revenue = Total Cost / (1 - Margin%)
    const totalCost = raw.costo_total || 0;
    const computedRevenue = totalCost / (1 - (desiredMargin / 100));
    const computedProfit = computedRevenue - totalCost;

    // Cost Breakdown for Donut Ring
    const landCost = raw.valor_terreno || 0;
    const directCost = raw.costo_directo || 0;
    const indirectCost = raw.costo_indirecto || 0;
    const parkingCost = raw.parking_cost || 0;

    // Combine Direct + Parking for simplicity in chart if needed, or keep separate
    const constructionTotal = directCost + parkingCost;

    const costStructure = [
        { label: "Tierra", value: landCost, color: "bg-emerald-500", text: "text-emerald-500" },
        { label: "Construcción", value: constructionTotal, color: "bg-blue-500", text: "text-blue-500" },
        { label: "Indirectos", value: indirectCost, color: "bg-purple-500", text: "text-purple-500" },
    ];

    const totalStructureCost = landCost + constructionTotal + indirectCost;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

            {/* 1. Cost Structure Visualization (Donut/Bar Hybrid) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-100 dark:bg-zinc-900 border border-black dark:border-zinc-800 rounded-xl p-6"
            >
                <div className="flex items-center gap-2 mb-6">
                    <PieChart className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    <h3 className="text-lg font-semibold text-black dark:text-white">Estructura de Costos</h3>
                </div>

                <div className="space-y-4">
                    {/* Visual Bar Logic */}
                    <div className="h-4 w-full flex rounded-full overflow-hidden">
                        {costStructure.map((item, idx) => {
                            const pct = (item.value / totalStructureCost) * 100;
                            return (
                                <div
                                    key={idx}
                                    style={{ width: `${pct}%` }}
                                    className={cn("h-full", item.color)}
                                />
                            );
                        })}
                    </div>

                    {/* Legend & Amounts */}
                    <div className="grid grid-cols-1 gap-3">
                        {costStructure.map((item, idx) => {
                            const pct = (item.value / totalStructureCost) * 100;
                            return (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                        <span className="text-black dark:text-zinc-400">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-black/60 dark:text-zinc-500 text-xs">{pct.toFixed(1)}%</span>
                                        <span className="text-black dark:text-white font-mono font-medium">
                                            ${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="pt-4 mt-4 border-t border-black/20 dark:border-zinc-800 flex justify-between items-end">
                        <span className="text-black dark:text-zinc-400">Costo Total</span>
                        <span className="text-xl font-bold text-black dark:text-white">
                            ${totalStructureCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* 2. Sensitivity Analysis (Real-time Slider) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-zinc-100 dark:bg-zinc-900 border border-black dark:border-zinc-800 rounded-xl p-6 flex flex-col justify-between"
            >
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-lg font-semibold text-black dark:text-white">Simulador de Rentabilidad</h3>
                    </div>
                    <p className="text-zinc-500 text-sm mb-8">
                        Ajusta el margen deseado para ver el impacto en el precio de venta meta.
                    </p>

                    <div className="mb-8">
                        <div className="flex justify-between text-sm mb-4">
                            <span className="text-black dark:text-zinc-300">Margen Deseado</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">{desiredMargin.toFixed(1)}%</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            step="0.5"
                            value={desiredMargin}
                            onChange={(e) => setDesiredMargin(parseFloat(e.target.value))}
                            className="w-full h-2 bg-zinc-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
                        />
                        <div className="flex justify-between text-xs text-black/60 dark:text-zinc-600 mt-2">
                            <span>5%</span>
                            <span>25%</span>
                            <span>50%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-950/50 rounded-lg p-4 border border-black/20 dark:border-zinc-800/50">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-black/60 dark:text-zinc-500 text-xs uppercase tracking-wider mb-1">Venta Meta</p>
                            <p className="text-xl font-bold text-black dark:text-white">
                                ${computedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-black/60 dark:text-zinc-500 text-xs uppercase tracking-wider mb-1">Utilidad Neta</p>
                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                +${computedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function RowSmall({ label, value }: { label: string, value: number }) {
    if (!value || value === 0) return null;
    return (
        <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
            <span>{label}</span>
            <span className="font-mono">${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
    )
}
