"use client";

import React from 'react';
import { TrendingDown, CheckCircle, Building2, Store, GitBranch, LayoutGrid, Move, MapPin, Car, ShieldAlert, ShieldCheck, PlusCircle, Home, Zap, Lightbulb } from 'lucide-react';

/* ─────────────────────────────────────────────────
   NONA INSIGHTS — Advisory Panel
   Clean, editorial design language
   ───────────────────────────────────────────────── */

interface Insight {
  tipo: 'warning' | 'success' | 'tip' | 'insight';
  icono: string;
  titulo: string;
  descripcion: string;
  accion: string | null;
}

interface BankingMetrics {
  dscr: number;
  ltv_pct: number;
  monto_credito: number;
  pago_mensual_credito: number;
  costo_m2_vendible: number;
  ingreso_m2_vendible: number;
  costo_ingreso_ratio: number;
  ratio_terreno_inversion: number;
  eficiencia_arq: number;
}

const iconMap: Record<string, React.ReactNode> = {
  'trending-down': <TrendingDown size={15} />,
  'check-circle': <CheckCircle size={15} />,
  'building': <Building2 size={15} />,
  'store': <Store size={15} />,
  'git-branch': <GitBranch size={15} />,
  'layout': <LayoutGrid size={15} />,
  'move': <Move size={15} />,
  'map-pin': <MapPin size={15} />,
  'car': <Car size={15} />,
  'shield-alert': <ShieldAlert size={15} />,
  'shield-check': <ShieldCheck size={15} />,
  'plus-circle': <PlusCircle size={15} />,
  'home': <Home size={15} />,
  'zap': <Zap size={15} />,
};

const TYPE_ACCENT: Record<string, { border: string; dot: string; label: string }> = {
  warning: { border: 'border-l-amber-400', dot: 'bg-amber-400', label: 'Atención' },
  success: { border: 'border-l-emerald-400', dot: 'bg-emerald-400', label: 'Fortaleza' },
  tip:     { border: 'border-l-sky-400', dot: 'bg-sky-400', label: 'Oportunidad' },
  insight: { border: 'border-l-violet-400', dot: 'bg-violet-400', label: 'Hallazgo' },
};

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function NonaInsights({
  insights,
  banking,
  comercialRecomendacion,
  comercialRazon,
  onAutoAjustar,
  isPrint = false
}: {
  insights: Insight[],
  banking: BankingMetrics,
  comercialRecomendacion: string,
  comercialRazon: string,
  onAutoAjustar?: () => void,
  isPrint?: boolean
}) {
  if (!insights || insights.length === 0) return null;

  const RECO_STYLES: Record<string, { bg: string; accent: string; label: string }> = {
    vender:  { bg: 'bg-zinc-900',  accent: 'text-blue-400', label: 'Venta Especulativa' },
    rentar:  { bg: 'bg-zinc-900',  accent: 'text-emerald-400', label: 'Renta Patrimonial' },
    hibrida: { bg: 'bg-zinc-900',  accent: 'text-violet-400', label: 'Estrategia Mixta' },
    evaluar: { bg: 'bg-zinc-900',  accent: 'text-amber-400', label: 'Requiere Evaluación' },
  };
  const reco = RECO_STYLES[comercialRecomendacion];

  return (
    <div className="space-y-4">
      {/* ── RECOMMENDATION ── */}
      {reco && (
        <div className={`${reco.bg} rounded-xl overflow-hidden`}>
          <div className="px-6 py-4 flex items-center gap-6">
            <div className="shrink-0">
              <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-[0.15em] mb-1">Estrategia Recomendada</p>
              <p className={`text-xl font-black ${reco.accent}`}>{reco.label}</p>
            </div>
            <div className="flex-1 border-l border-zinc-700 pl-6">
              <p className="text-zinc-400 text-[13px] leading-relaxed">{comercialRazon}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── INSIGHTS ── */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-zinc-100 px-5 py-2.5">
          <span className="font-bold text-[11px] uppercase tracking-[0.12em] text-zinc-500">Diagnóstico del Proyecto</span>
        </div>
        <div className={`grid ${isPrint ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'} divide-y md:divide-y-0 md:divide-x divide-zinc-100`}>
          {/* Left Column */}
          <div className="divide-y divide-zinc-50">
            {insights.filter((_, i) => i % 2 === 0).map((ins, idx) => (
              <InsightRow key={idx} insight={ins} onAutoAjustar={onAutoAjustar} />
            ))}
          </div>
          {/* Right Column */}
          <div className="divide-y divide-zinc-50">
            {insights.filter((_, i) => i % 2 !== 0).map((ins, idx) => (
              <InsightRow key={idx} insight={ins} onAutoAjustar={onAutoAjustar} />
            ))}
          </div>
        </div>
      </div>

      {/* ── BANKING METRICS ── */}
      {banking && (
        <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-zinc-100 px-5 py-2.5">
            <span className="font-bold text-[11px] uppercase tracking-[0.12em] text-zinc-500">Indicadores Institucionales</span>
          </div>
          <div className={`grid ${isPrint ? 'grid-cols-5' : 'grid-cols-3 lg:grid-cols-5'} divide-x divide-zinc-100`}>
            <BankKPI label="DSCR" value={`${banking.dscr}x`} desc="Cobertura de Deuda" good={banking.dscr >= 1.25} />
            <BankKPI label="LTV" value={`${banking.ltv_pct}%`} desc="Loan to Value" good={banking.ltv_pct < 80} />
            <BankKPI label="$/m² Vendible" value={fmt(banking.costo_m2_vendible)} desc="Costo Unitario" />
            <BankKPI label="Ingreso/m²" value={fmt(banking.ingreso_m2_vendible)} desc="Ingreso Unitario" />
            <BankKPI label="Eficiencia" value={`${banking.eficiencia_arq}%`} desc="Área Vendible" good={banking.eficiencia_arq >= 70} />
          </div>
        </div>
      )}
    </div>
  );
}

function InsightRow({ insight, onAutoAjustar }: { insight: Insight, onAutoAjustar?: () => void }) {
  const accent = TYPE_ACCENT[insight.tipo] || TYPE_ACCENT.tip;
  return (
    <div className={`px-5 py-3.5 border-l-[3px] ${accent.border} flex gap-3 hover:bg-zinc-50/50 transition-colors`}>
      <div className="text-zinc-400 mt-0.5 shrink-0">
        {iconMap[insight.icono] || <Lightbulb size={15} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <div className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
          <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">{accent.label}</span>
        </div>
        <h4 className="font-semibold text-[13px] text-zinc-800 leading-snug">{insight.titulo}</h4>
        <p className="text-[11.5px] text-zinc-500 mt-1 leading-relaxed">{insight.descripcion}</p>
        {insight.accion === 'auto_ajustar_precio' && onAutoAjustar && (
          <button onClick={onAutoAjustar} className="mt-2 text-[11px] font-semibold text-zinc-700 hover:text-zinc-900 transition-colors flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            Ajustar automáticamente
          </button>
        )}
      </div>
    </div>
  );
}

function BankKPI({ label, value, desc, good }: { label: string, value: string, desc: string, good?: boolean }) {
  return (
    <div className="px-4 py-3.5 text-center">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">{label}</p>
      <p className={`text-lg font-bold tabular-nums ${good === true ? 'text-emerald-600' : good === false ? 'text-red-500' : 'text-zinc-800'}`}>{value}</p>
      <p className="text-[10px] text-zinc-400 mt-0.5">{desc}</p>
    </div>
  );
}
