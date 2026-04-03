"use client";

import React, { useState } from 'react';
import { TrendingUp, Building2, Store, ArrowUpRight, ArrowDownRight, Shield, Clock, DollarSign, BarChart3, Percent, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════
   CFO COMMERCIAL ANALYSIS — INSTITUTIONAL GRADE
   Venta (Especulativo) vs Renta (Patrimonial)
   ═══════════════════════════════════════════════════════════════════════ */

interface CfoSummary {
  inversion_comercial: number;
  num_locales: number;
  area_por_local: number;
  costo_por_local: number;
  precio_venta_local: number;
  precio_venta_m2: number;
  renta_por_local: number;
  renta_m2_mensual: number;
  cap_rate: number;
  yield_on_cost: number;
  vacancia_pct: number;
  mantenimiento_pct: number;
  isr_pct: number;
  comision_venta_pct: number;
  incremento_anual: number;
  noi_anual: number;
  noi_mensual: number;
  ingreso_neto_renta_mensual: number;
  renta_anual_bruta: number;
  ingreso_neto_venta: number;
  ganancia_venta: number;
  margen_venta: number;
  comision_venta: number;
  payback_meses: number;
  breakeven_venta_mes: number;
  breakeven_renta_mes: number;
  roi_1y: number;
  roi_2y: number;
  roi_5y: number;
  acumulado_venta_final: number;
  acumulado_renta_final: number;
}

interface FlowEntry {
  mes: number;
  egreso: number;
  ingreso: number;
  flujo_neto: number;
  acumulado: number;
  renta_bruta?: number;
  isr?: number;
  ocupacion?: number;
}

interface CFOData {
  flujo_especulativo: FlowEntry[];
  flujo_patrimonial: FlowEntry[];
  cfo: CfoSummary;
  renta_mensual_estimada: number;
  payback_renta_meses: number;
  costo_comercial_total: number;
  cap_rate: number;
}

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtDec = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
const pct = (n: number) => `${n.toFixed(1)}%`;

export function CfoCommercialAnalysis({ data, isPrint = false }: { data: CFOData, isPrint?: boolean }) {
  const [showCashflow, setShowCashflow] = useState(false);

  if (!data?.flujo_especulativo || !data?.cfo) return null;

  const s = data.cfo;
  const venta = data.flujo_especulativo;
  const renta = data.flujo_patrimonial;

  // Chart scale
  const allVals = [...venta.map(d => d.acumulado), ...renta.map(d => d.acumulado)];
  const chartMax = Math.max(...allVals.map(Math.abs)) * 1.15;

  return (
    <div className={`flex flex-col ${isPrint ? 'p-10 text-[11px] max-w-[1240px] gap-5' : 'gap-6'}`}>

      {/* ════════════════════════════════════════════════════
          HEADER
         ════════════════════════════════════════════════════ */}
      <div className={`flex justify-between items-end border-b-[3px] border-black pb-3 ${isPrint ? '' : 'px-6 pt-6'}`}>
        <div>
          <h2 className={`font-black uppercase tracking-tight ${isPrint ? 'text-3xl' : 'text-2xl'}`}>
            Análisis Comercial — Decisión de Locales
          </h2>
          <p className="text-zinc-500 font-medium tracking-wide mt-1">
            MODELO ESPECULATIVO vs MODELO PATRIMONIAL • Proyección a 24 Meses
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {!isPrint && <div className="px-3 py-1 bg-black text-white text-[10px] font-black rounded tracking-widest">CFO PRO</div>}
          <div className="text-[10px] text-zinc-400 font-mono">{s.num_locales} LOCAL{s.num_locales > 1 ? 'ES' : ''} • {s.area_por_local.toFixed(0)} m² c/u</div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          ROW 1: INVESTMENT SUMMARY (Per-Local Breakdown)
         ════════════════════════════════════════════════════ */}
      <div className={`${isPrint ? '' : 'px-6'}`}>
        <SectionTitle icon={<DollarSign size={14}/>} title="1. RESUMEN DE INVERSIÓN COMERCIAL" />
        <div className={`grid ${isPrint ? 'grid-cols-6' : 'grid-cols-3 lg:grid-cols-6'} gap-3 mt-3`}>
          <KPI label="Inversión Total" value={fmt(s.inversion_comercial)} accent="zinc" />
          <KPI label="Costo / Local" value={fmt(s.costo_por_local)} accent="zinc" />
          <KPI label="Precio Venta / Local" value={fmt(s.precio_venta_local)} accent="blue" />
          <KPI label="Precio Venta / m²" value={fmtDec(s.precio_venta_m2)} accent="blue" />
          <KPI label="Renta Sugerida / Local" value={fmt(s.renta_por_local) + "/mes"} accent="emerald" />
          <KPI label="Renta / m² / mes" value={fmtDec(s.renta_m2_mensual)} accent="emerald" />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          ROW 2: DUAL SCENARIO COMPARISON TABLE
         ════════════════════════════════════════════════════ */}
      <div className={`${isPrint ? '' : 'px-6'}`}>
        <SectionTitle icon={<BarChart3 size={14}/>} title="2. COMPARATIVO VENTA vs RENTA" />
        <div className={`grid grid-cols-2 gap-4 mt-3`}>

          {/* ── VENTA Column ── */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl overflow-hidden">
            <div className="bg-blue-600 text-white px-5 py-3 flex items-center gap-2">
              <Store size={16} className="stroke-[2.5]" />
              <span className="font-black text-sm tracking-wide">ESCENARIO A: VENTA</span>
              <span className="ml-auto text-blue-200 text-[10px] font-mono">ESPECULATIVO</span>
            </div>
            <div className="p-5 space-y-3">
              <CompRow label="Ingreso Bruto por Venta" value={fmt(data.cfo.ingreso_neto_venta + data.cfo.comision_venta)} />
              <CompRow label="(-) Comisión Inmobiliaria" value={`-${fmt(s.comision_venta)}`} sub pct={pct(s.comision_venta_pct * 100)} />
              <div className="border-t border-blue-200 my-1" />
              <CompRow label="Ingreso Neto" value={fmt(s.ingreso_neto_venta)} bold />
              <CompRow label="(-) Inversión Comercial" value={`-${fmt(s.inversion_comercial)}`} sub />
              <div className="border-t-2 border-blue-300 my-1" />
              <CompRow label="GANANCIA NETA" value={fmt(s.ganancia_venta)} bold highlight={s.ganancia_venta >= 0 ? 'green' : 'red'} />
              <CompRow label="Margen de Utilidad" value={pct(s.margen_venta)} bold />
              <CompRow label="Break-even (Mes)" value={`Mes ${s.breakeven_venta_mes || '—'}`} sub />
              <CompRow label="Liquidez" value="Inmediata" sub />
            </div>
          </div>

          {/* ── RENTA Column ── */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl overflow-hidden">
            <div className="bg-emerald-600 text-white px-5 py-3 flex items-center gap-2">
              <Building2 size={16} className="stroke-[2.5]" />
              <span className="font-black text-sm tracking-wide">ESCENARIO B: RENTA</span>
              <span className="ml-auto text-emerald-200 text-[10px] font-mono">PATRIMONIAL</span>
            </div>
            <div className="p-5 space-y-3">
              <CompRow label="Renta Anual Bruta (GAB)" value={fmt(s.renta_anual_bruta)} />
              <CompRow label="(-) Vacancia Estructural" value={`-${fmt(s.renta_anual_bruta * s.vacancia_pct)}`} sub pct={pct(s.vacancia_pct * 100)} />
              <CompRow label="(-) Mantenimiento" value={`-${fmt(s.inversion_comercial * s.mantenimiento_pct)}`} sub pct={pct(s.mantenimiento_pct * 100)} />
              <div className="border-t border-emerald-200 my-1" />
              <CompRow label="NOI (Ingreso Oper. Neto)" value={fmt(s.noi_anual)} bold />
              <CompRow label="(-) ISR (30%)" value={`-${fmt(s.noi_anual * s.isr_pct)}`} sub pct={pct(s.isr_pct * 100)} />
              <div className="border-t-2 border-emerald-300 my-1" />
              <CompRow label="FLUJO NETO ANUAL" value={fmt(s.noi_anual * (1 - s.isr_pct))} bold highlight="green" />
              <CompRow label="Cap Rate" value={pct(s.cap_rate * 100)} bold />
              <CompRow label="Yield on Cost" value={pct(s.yield_on_cost)} sub />
              <CompRow label="Incremento Anual Renta" value={pct(s.incremento_anual * 100)} sub />
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          ROW 3: KPI STRIP — MULTI-HORIZON ROI (RENTA)
         ════════════════════════════════════════════════════ */}
      <div className={`${isPrint ? '' : 'px-6'}`}>
        <SectionTitle icon={<TrendingUp size={14}/>} title="3. RETORNO SOBRE INVERSIÓN (RENTA PATRIMONIAL)" />
        <div className={`grid ${isPrint ? 'grid-cols-5' : 'grid-cols-2 lg:grid-cols-5'} gap-3 mt-3`}>
          <KPI label="ROI Año 1" value={pct(s.roi_1y)} accent="emerald" />
          <KPI label="ROI Año 2" value={pct(s.roi_2y)} accent="emerald" />
          <KPI label="ROI Año 5" value={pct(s.roi_5y)} accent="emerald" />
          <KPI label="Payback (después de Obra)" value={`${Math.ceil(s.payback_meses)} meses`} accent="amber" />
          <KPI label="Break-even Total" value={s.breakeven_renta_mes > 0 ? `Mes ${s.breakeven_renta_mes}` : `>${data.flujo_patrimonial.length} meses`} accent="amber" />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          ROW 4: DUAL CASHFLOW CHARTS
         ════════════════════════════════════════════════════ */}
      <div className={`${isPrint ? '' : 'px-6'}`}>
        <SectionTitle icon={<Calendar size={14}/>} title="4. FLUJO DE EFECTIVO ACUMULADO (24 MESES)" />
        <div className="grid grid-cols-2 gap-4 mt-3">
          <ChartPanel
            title="Venta (Especulativo)"
            subtitle="Pre-venta → Entregas → Finiquito"
            data={venta}
            chartMax={chartMax}
            colorPositive="bg-blue-500"
            colorNegative="bg-red-400"
            breakeven={s.breakeven_venta_mes}
            finalValue={s.acumulado_venta_final}
            isPrint={isPrint}
          />
          <ChartPanel
            title="Renta (Patrimonial)"
            subtitle="Absorción progresiva → Estabilización → Escalamiento"
            data={renta}
            chartMax={chartMax}
            colorPositive="bg-emerald-500"
            colorNegative="bg-red-400"
            breakeven={s.breakeven_renta_mes}
            finalValue={s.acumulado_renta_final}
            isPrint={isPrint}
          />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          ROW 5: EXPANDABLE MONTH-BY-MONTH TABLE
         ════════════════════════════════════════════════════ */}
      {!isPrint && (
        <div className="px-6">
          <button 
            onClick={() => setShowCashflow(!showCashflow)}
            className="w-full flex items-center justify-between bg-zinc-100 hover:bg-zinc-200 transition-colors rounded-xl px-5 py-3 text-sm font-bold text-zinc-700"
          >
            <span>📊 Tabla Detallada Mes a Mes (Cash Flow)</span>
            {showCashflow ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
          {showCashflow && (
            <div className="mt-3 overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-zinc-800 text-white text-[10px] uppercase tracking-wider">
                    <th className="py-2 px-3 text-center" rowSpan={2}>Mes</th>
                    <th className="py-2 px-3 text-center border-l border-zinc-600" colSpan={3}>ESCENARIO VENTA</th>
                    <th className="py-2 px-3 text-center border-l border-zinc-600" colSpan={4}>ESCENARIO RENTA</th>
                  </tr>
                  <tr className="bg-zinc-700 text-zinc-300 text-[9px] uppercase tracking-wider">
                    <th className="py-1 px-2 text-center border-l border-zinc-600">Egreso</th>
                    <th className="py-1 px-2 text-center">Ingreso</th>
                    <th className="py-1 px-2 text-center">Acumulado</th>
                    <th className="py-1 px-2 text-center border-l border-zinc-600">Egreso</th>
                    <th className="py-1 px-2 text-center">Ingreso Neto</th>
                    <th className="py-1 px-2 text-center">Ocupación</th>
                    <th className="py-1 px-2 text-center">Acumulado</th>
                  </tr>
                </thead>
                <tbody>
                  {venta.map((v, i) => {
                    const r = renta[i];
                    const isBreakV = s.breakeven_venta_mes === v.mes;
                    const isBreakR = s.breakeven_renta_mes === r.mes;
                    return (
                      <tr key={i} className={`border-b border-zinc-100 ${i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'} ${(isBreakV || isBreakR) ? '!bg-yellow-50' : ''}`}>
                        <td className="py-2 px-3 text-center font-bold text-zinc-500">{v.mes}</td>
                        <td className="py-2 px-2 text-center text-red-500 font-mono">{v.egreso < 0 ? fmt(v.egreso) : '—'}</td>
                        <td className="py-2 px-2 text-center text-blue-600 font-mono">{v.ingreso > 0 ? fmt(v.ingreso) : '—'}</td>
                        <td className={`py-2 px-2 text-center font-bold font-mono ${v.acumulado >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{fmt(v.acumulado)}</td>
                        <td className="py-2 px-2 text-center text-red-500 font-mono border-l border-zinc-200">{r.egreso < 0 ? fmt(r.egreso) : '—'}</td>
                        <td className="py-2 px-2 text-center text-emerald-600 font-mono">{r.ingreso > 0 ? fmt(r.ingreso) : '—'}</td>
                        <td className="py-2 px-2 text-center text-zinc-500">{r.ocupacion !== undefined ? pct(r.ocupacion * 100) : '—'}</td>
                        <td className={`py-2 px-2 text-center font-bold font-mono ${r.acumulado >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{fmt(r.acumulado)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          ROW 6: ASSUMPTIONS & CFO VERDICT
         ════════════════════════════════════════════════════ */}
      <div className={`grid grid-cols-2 gap-4 ${isPrint ? '' : 'px-6 pb-6'}`}>
        {/* Assumptions */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="text-zinc-500"/>
            <span className="font-black text-xs uppercase tracking-widest text-zinc-500">Supuestos del Modelo</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <AssumptionRow label="Cap Rate" value={pct(s.cap_rate * 100)} />
            <AssumptionRow label="Vacancia Estructural" value={pct(s.vacancia_pct * 100)} />
            <AssumptionRow label="Mantenimiento Anual" value={pct(s.mantenimiento_pct * 100)} />
            <AssumptionRow label="ISR sobre Rentas" value={pct(s.isr_pct * 100)} />
            <AssumptionRow label="Comisión Venta" value={pct(s.comision_venta_pct * 100)} />
            <AssumptionRow label="Incremento Renta / Año" value={pct(s.incremento_anual * 100)} />
            <AssumptionRow label="Duración de Obra" value="12 meses" />
            <AssumptionRow label="Horizonte Proyección" value="24 meses" />
          </div>
        </div>

        {/* CFO Verdict */}
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-indigo-600"/>
            <span className="font-black text-xs uppercase tracking-widest text-indigo-600">Dictamen CFO</span>
          </div>
          <p className={`text-indigo-900 leading-relaxed ${isPrint ? 'text-[10px]' : 'text-xs'}`}>
            {s.ganancia_venta > 0 ? (
              <>
                La <strong>Venta Especulativa</strong> genera una ganancia neta de <strong>{fmt(s.ganancia_venta)}</strong> con un margen del {pct(s.margen_venta)}, alcanzando break-even en el <strong>Mes {s.breakeven_venta_mes}</strong>. Es la opción indicada si el fondo requiere <em>liquidez acelerada</em> y reciclaje de capital.
              </>
            ) : (
              <>
                La <strong>Venta Especulativa</strong> presenta un margen negativo ({pct(s.margen_venta)}). Se recomienda considerar la <strong>Renta Patrimonial</strong> como estrategia prioritaria.
              </>
            )}
            {' '}El modelo <strong>Patrimonial</strong> proyecta un ROI del <strong>{pct(s.roi_5y)}</strong> a 5 años con flujo perpetuo neto de <strong>{fmt(s.ingreso_neto_renta_mensual)}/mes</strong> después de impuestos, con un payback estimado de <strong>{Math.ceil(s.payback_meses)} meses</strong> post-entrega.
            {' '}La decisión óptima depende del costo de oportunidad del capital y la estrategia del portafolio inmobiliario.
          </p>
        </div>
      </div>

    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════════════════════════════ */

function SectionTitle({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
      <div className="text-zinc-400">{icon}</div>
      <h3 className="font-black text-xs uppercase tracking-[0.15em] text-zinc-500">{title}</h3>
    </div>
  );
}

function KPI({ label, value, accent = 'zinc' }: { label: string, value: string, accent?: string }) {
  const bgMap: Record<string, string> = {
    zinc: 'bg-zinc-50 border-zinc-200',
    blue: 'bg-blue-50 border-blue-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    amber: 'bg-amber-50 border-amber-200',
  };
  const textMap: Record<string, string> = {
    zinc: 'text-zinc-800',
    blue: 'text-blue-700',
    emerald: 'text-emerald-700',
    amber: 'text-amber-700',
  };
  return (
    <div className={`p-3 rounded-lg border ${bgMap[accent] || bgMap.zinc}`}>
      <div className="text-[9px] uppercase font-bold tracking-[0.12em] text-zinc-400 mb-1 leading-tight">{label}</div>
      <div className={`font-black text-base ${textMap[accent] || textMap.zinc}`}>{value}</div>
    </div>
  );
}

function CompRow({ label, value, sub, bold, highlight, pct: pctLabel }: { label: string, value: string, sub?: boolean, bold?: boolean, highlight?: 'green' | 'red', pct?: string }) {
  return (
    <div className={`flex justify-between items-baseline ${sub ? 'text-[11px] pl-3 text-zinc-500' : 'text-xs'}`}>
      <span className={`${bold ? 'font-bold text-zinc-900' : ''} flex items-center gap-1`}>
        {highlight === 'green' && <ArrowUpRight size={12} className="text-emerald-500"/>}
        {highlight === 'red' && <ArrowDownRight size={12} className="text-red-500"/>}
        {label}
        {pctLabel && <span className="text-[9px] text-zinc-400 font-mono ml-1">({pctLabel})</span>}
      </span>
      <span className={`font-mono ${bold ? 'font-black' : 'font-medium'} ${highlight === 'green' ? 'text-emerald-600' : highlight === 'red' ? 'text-red-500' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function AssumptionRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-zinc-500">{label}</span>
      <span className="font-bold font-mono text-zinc-700">{value}</span>
    </div>
  );
}

function ChartPanel({ title, subtitle, data, chartMax, colorPositive, colorNegative, breakeven, finalValue, isPrint }: {
  title: string; subtitle: string; data: FlowEntry[]; chartMax: number;
  colorPositive: string; colorNegative: string; breakeven: number; finalValue: number; isPrint: boolean;
}) {
  const fmtShort = (n: number) => {
    const abs = Math.abs(n);
    if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n.toFixed(0)}`;
  };

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="font-bold text-sm text-zinc-900">{title}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">{subtitle}</div>
        </div>
        <div className={`text-right ${finalValue >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          <div className="text-[9px] uppercase tracking-wider font-bold text-zinc-400">Acum. M24</div>
          <div className="font-black text-sm">{fmt(finalValue)}</div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative flex-1 min-h-[180px] flex items-end">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-[8px] font-mono text-zinc-400 pr-1 text-right z-10">
          <span>{fmtShort(chartMax)}</span>
          <span>$0</span>
          <span>{fmtShort(-chartMax)}</span>
        </div>

        {/* Bars */}
        <div className="ml-14 flex-1 relative flex items-center gap-[2px]" style={{ height: '100%' }}>
          {/* Zero line */}
          <div className="absolute w-full border-t border-dashed border-zinc-300 z-0" style={{ top: '50%' }} />
          
          {/* Breakeven marker */}
          {breakeven > 0 && breakeven <= 24 && (
            <div className="absolute z-20 border-l-2 border-amber-400" style={{ left: `${((breakeven - 0.5) / 24) * 100}%`, top: 0, bottom: 0 }}>
              <div className="absolute -top-0.5 -left-[1px] bg-amber-400 text-[7px] font-bold text-amber-900 px-1 rounded-b whitespace-nowrap">
                BE M{breakeven}
              </div>
            </div>
          )}

          {data.map((d, i) => {
            const val = d.acumulado;
            const isNeg = val < 0;
            const heightPct = Math.min((Math.abs(val) / chartMax) * 50, 50);

            return (
              <div key={i} className="relative flex-1 flex flex-col z-10" style={{ height: '100%' }}>
                {isNeg ? (
                  <>
                    <div style={{ height: '50%' }} />
                    <div style={{ height: '50%' }} className="flex items-start">
                      <div className={`w-full ${colorNegative} rounded-b-[1px] opacity-75`} style={{ height: `${heightPct}%` }} />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ height: '50%' }} className="flex items-end">
                      <div className={`w-full ${colorPositive} rounded-t-[1px] opacity-85`} style={{ height: `${heightPct}%` }} />
                    </div>
                    <div style={{ height: '50%' }} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis */}
      <div className="ml-14 flex justify-between text-[8px] font-mono text-zinc-400 mt-1">
        {[1, 6, 12, 18, 24].map(m => (
          <span key={m}>M{m}</span>
        ))}
      </div>
    </div>
  );
}
