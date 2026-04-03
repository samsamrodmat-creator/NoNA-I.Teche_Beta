"use client";

import React from 'react';

/* ─────────────────────────────────────────────────
   VIABILITY SCORE — Gauge + Optimizer
   Designed to feel like an architect's instrument
   ───────────────────────────────────────────────── */

interface OptimizerSuggestion {
  dimension: string;
  parametro: string;
  parametro_label: string;
  valor_actual: number;
  valor_sugerido: number;
  impacto: string;
  dim_actual: number;
  dim_nueva: number;
  unidad?: string;
}

interface Optimizer {
  necesario: boolean;
  score_actual: number;
  score_objetivo: number;
  sugerencias: OptimizerSuggestion[];
}

export interface ViabilityData {
  total: number;
  dimensiones: {
    utilidad: number;
    eficiencia: number;
    costo_ingreso: number;
    cashflow: number;
    financiabilidad: number;
  };
  label: string;
  optimizer?: Optimizer | null;
}

const DIM_META: Record<string, { label: string; abbr: string }> = {
  utilidad:        { label: "Utilidad",           abbr: "UTL" },
  eficiencia:      { label: "Eficiencia Arq.",    abbr: "EFC" },
  costo_ingreso:   { label: "Costo / Ingreso",   abbr: "C/I" },
  cashflow:        { label: "Cash Flow",          abbr: "CF" },
  financiabilidad: { label: "Financiabilidad",    abbr: "FIN" },
};

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

function scoreHue(s: number) {
  if (s >= 80) return '#059669';
  if (s >= 60) return '#2563eb';
  if (s >= 40) return '#d97706';
  return '#dc2626';
}

export function ViabilityScore({ data, onOptimize, isPrint = false }: {
  data: ViabilityData,
  onOptimize?: (changes: Record<string, number>) => void,
  isPrint?: boolean
}) {
  if (!data) return null;
  const color = scoreHue(data.total);
  const opt = data.optimizer;

  const handleAutoOptimize = () => {
    if (!opt?.sugerencias || !onOptimize) return;
    const changes: Record<string, number> = {};
    for (const s of opt.sugerencias) {
      changes[s.parametro] = s.parametro === 'areaCirculacionPorcentaje'
        ? s.valor_sugerido / 100
        : s.valor_sugerido;
    }
    onOptimize(changes);
  };

  return (
    <div className={isPrint ? '' : 'bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden'}>
      {/* ── Header Bar ── */}
      <div className={`flex items-center justify-between ${isPrint ? 'border-b-2 border-zinc-900 pb-2 mb-5' : 'border-b border-zinc-100 px-6 py-3'}`}>
        <div className="flex items-center gap-2">
          <div className="w-[3px] h-4 rounded-full" style={{ background: color }} />
          <span className="font-bold text-[11px] uppercase tracking-[0.12em] text-zinc-500">Índice de Viabilidad</span>
        </div>
        {data.total >= 80 && (
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">Proyecto Óptimo</span>
        )}
        {data.total < 80 && data.total >= 40 && (
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">Requiere Optimización</span>
        )}
        {data.total < 40 && (
          <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">Riesgo Elevado</span>
        )}
      </div>

      <div className={isPrint ? '' : 'px-6 py-5'}>
        <div className="flex items-start gap-10">
          {/* ── Score Dial ── */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative w-[120px] h-[120px]">
              {/* Background track */}
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f4f4f5" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${data.total * 3.267} 326.7`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[32px] font-black leading-none" style={{ color }}>{data.total}</span>
                <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider mt-1">{data.label}</span>
              </div>
            </div>
          </div>

          {/* ── Dimensions ── */}
          <div className="flex-1 space-y-2.5 pt-1">
            {Object.entries(data.dimensiones).map(([key, val]) => {
              const dimColor = scoreHue(val);
              const meta = DIM_META[key];
              return (
                <div key={key} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold text-zinc-300 w-6">{meta?.abbr}</span>
                      <span className="text-[11px] font-medium text-zinc-600">{meta?.label || key}</span>
                    </div>
                    <span className="text-[11px] font-bold tabular-nums" style={{ color: dimColor }}>{val}/100</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm transition-all duration-700"
                      style={{ width: `${val}%`, background: dimColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Optimizer ── */}
        {opt && opt.necesario && opt.sugerencias.length > 0 && !isPrint && (
          <div className="mt-6 border border-zinc-200 rounded-xl overflow-hidden">
            <div className="bg-zinc-900 px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">Optimización Sugerida</p>
                <p className="text-zinc-400 text-[11px]">Ajustes necesarios para alcanzar un score de {opt.score_objetivo}+</p>
              </div>
              <button
                onClick={handleAutoOptimize}
                className="flex items-center gap-1.5 bg-white text-zinc-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-100 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Aplicar Ajustes
              </button>
            </div>
            <div className="divide-y divide-zinc-100">
              {opt.sugerencias.map((s, idx) => (
                <div key={idx} className="px-5 py-3 flex items-center gap-6 bg-white hover:bg-zinc-50/50 transition-colors">
                  <div className="w-20 shrink-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">{s.dimension}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-800">{s.parametro_label}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{s.impacto}</p>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-sm shrink-0">
                    <span className="text-zinc-400 line-through">
                      {s.parametro === 'areaCirculacionPorcentaje' ? `${s.valor_actual}%` : fmt(s.valor_actual)}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    <span className="font-bold text-zinc-900">
                      {s.parametro === 'areaCirculacionPorcentaje' ? `${s.valor_sugerido}%` : fmt(s.valor_sugerido)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
