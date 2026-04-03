import { Calculator, LayoutDashboard, TrendingUp, DollarSign, PieChart, Activity } from "lucide-react";
import { StackingDiagram } from "./StackingDiagram";
import { CfoCommercialAnalysis } from "./CfoCommercialAnalysis";

interface ProjectReportProps {
    data?: any;
    results?: any;
    costStructure?: any[]; // Prepared data from page/financial analysis
}

export function ProjectReport({ data, results, costStructure }: ProjectReportProps) {
    if (!data || !results) return null;

    const raw = results.raw || {};
    const stats = results.metrics || {};
    const projectName = data.project_name || "Nuevo Proyecto";
    const address = data.address || "Sin dirección";
    const currentDate = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

    // Financial Metrics
    const totalCost = raw.costo_total || 0;
    const totalRevenue = raw.ingreso_optimizado || 0;
    const profit = raw.utilidad_monto || 0;
    const profitPct = raw.utilidad_optimizada || 0; // This is the %, coming directly from backend now (target_util)
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

    // Prepare Cost Structure default if not passed
    const structure = costStructure || [
        { label: "Tierra", value: raw.valor_terreno || 0, color: "bg-emerald-600" },
        { label: "Construcción", value: (raw.costo_directo + raw.parking_cost) || 0, color: "bg-blue-600" },
        { label: "Indirectos", value: raw.costo_indirecto || 0, color: "bg-purple-600" },
    ];
    const totalStructureCost = structure.reduce((acc: number, item: any) => acc + item.value, 0);

    return (
        <div id="project-report" className="hidden flex-col gap-8 h-0 overflow-visible" style={{ fontFamily: '"Avenir Next", Avenir, sans-serif' }}>
            
            {/* HOJA 1: PORTADA */}
            <div id="project-page-1" className="w-[1240px] h-[877px] bg-white text-zinc-900 p-16 flex flex-col justify-center border border-zinc-100 shrink-0 relative">
                <div className="flex items-center gap-1 select-none">
                    <h1 className="text-[7rem] font-black tracking-tighter text-slate-900 drop-shadow-sm leading-none m-0">NoNA</h1>
                    <span className="text-4xl font-bold tracking-[0.2em] text-blue-600/80 uppercase pt-8 ml-2">I.Tech</span>
                </div>
                <div className="mt-12 text-5xl font-light text-zinc-500 uppercase tracking-widest leading-tight">{projectName}</div>
                <div className="text-3xl text-zinc-400 mt-6 max-w-4xl leading-snug">{address}</div>
                
                <div className="absolute bottom-16 left-16 right-16 border-t-[8px] border-black pt-8">
                    <p className="text-right text-2xl font-bold uppercase tracking-wider text-black">Reporte de Prefactibilidad Y Diseño</p>
                    <p className="text-right text-xl text-zinc-500 mt-2">{currentDate}</p>
                </div>
            </div>

            {/* HOJA 2: SUPUESTOS + GUÍA DE LECTURA */}
            {raw.flujo_especulativo && raw.cfo && (() => {
                const s2 = raw.cfo;
                const fmtG = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
                const pctG = (n: number) => `${n.toFixed(1)}%`;
                return (
                <div id="project-page-2" className="w-[1240px] h-[877px] bg-white text-zinc-900 px-14 py-10 flex flex-col shrink-0 overflow-hidden relative border-t border-zinc-100 box-border">
                    <div className="border-b-[3px] border-black pb-3 mb-5 flex justify-between items-end">
                        <div>
                            <h1 className="text-[28px] font-black uppercase tracking-tight">Supuestos del Modelo y Guía de Lectura</h1>
                            <p className="text-zinc-500 text-xs font-medium tracking-wide mt-1">PARÁMETROS DEL ANÁLISIS • CÓMO INTERPRETAR ESTE REPORTE</p>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-mono text-zinc-400">Powered by</div>
                            <div className="font-black text-sm">NoNA I.tech</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 flex-1">
                        <div>
                            <h3 className="font-black text-[10px] uppercase tracking-[0.15em] text-zinc-500 border-b border-zinc-200 pb-1 mb-3">SUPUESTOS DEL MODELO FINANCIERO</h3>
                            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-5">
                                <div className="space-y-3 text-xs">
                                    <PrintAssumption label="Cap Rate (Tasa de Capitalización)" value={pctG(s2.cap_rate * 100)} desc="Rendimiento anual esperado sobre el valor del inmueble comercial." />
                                    <PrintAssumption label="Vacancia Estructural" value={pctG(s2.vacancia_pct * 100)} desc="Porcentaje del tiempo que los locales estarán desocupados." />
                                    <PrintAssumption label="Mantenimiento Anual" value={pctG(s2.mantenimiento_pct * 100)} desc="Porcentaje del costo de construcción para mantenimiento recurrente." />
                                    <PrintAssumption label="ISR sobre Rentas" value={pctG(s2.isr_pct * 100)} desc="Tasa de ISR aplicable al ingreso por arrendamiento (LISR)." />
                                    <PrintAssumption label="Comisión por Venta" value={pctG(s2.comision_venta_pct * 100)} desc="Comisión del bróker o comercializador inmobiliario." />
                                    <PrintAssumption label="Incremento Anual de Renta" value={pctG(s2.incremento_anual * 100)} desc="Escalamiento anual de la renta, anclado al INPC." />
                                    <PrintAssumption label="Duración de Obra" value="12 meses" desc="Tiempo estimado de construcción del proyecto." />
                                    <PrintAssumption label="Horizonte de Proyección" value="24 meses" desc="Periodo total del análisis financiero." />
                                </div>
                            </div>
                            <div className="mt-5 bg-zinc-50 border border-zinc-200 rounded-lg p-5">
                                <h4 className="font-black text-[10px] uppercase tracking-[0.15em] text-zinc-600 mb-2">DICTAMEN CFO</h4>
                                <p className="text-zinc-700 text-[10px] leading-relaxed">
                                    {s2.ganancia_venta > 0 ? (
                                        <>La <strong>Venta</strong> genera ganancia neta de <strong>{fmtG(s2.ganancia_venta)}</strong> ({pctG(s2.margen_venta)} margen), con break-even en <strong>Mes {s2.breakeven_venta_mes}</strong>.</>
                                    ) : (
                                        <>La <strong>Venta</strong> presenta margen negativo ({pctG(s2.margen_venta)}). Se recomienda el modelo <strong>Patrimonial</strong>.</>
                                    )}
                                    {' '}La <strong>Renta</strong> proyecta ROI de <strong>{pctG(s2.roi_5y)}</strong> a 5 años, flujo neto de <strong>{fmtG(s2.ingreso_neto_renta_mensual)}/mes</strong> post-ISR, y payback de <strong>{Math.ceil(s2.payback_meses)} meses</strong>.
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-black text-[10px] uppercase tracking-[0.15em] text-zinc-500 border-b border-zinc-200 pb-1 mb-3">GUÍA PRÁCTICA — CÓMO LEER ESTE REPORTE</h3>
                            <div className="space-y-4 text-[10.5px] leading-relaxed text-zinc-700">
                                <GuideItem number="1" title="Índice de Viabilidad (Pág. 3)" text="Calificación global del proyecto de 0 a 100. Evalúa 5 dimensiones: utilidad, eficiencia, costos, flujo de efectivo y financiabilidad. Un score por encima de 80 indica un proyecto óptimo." />
                                <GuideItem number="2" title="Análisis Financiero (Pág. 5)" text="Desglose completo de inversión: terreno, construcción, costos directos e indirectos, IVA, y la utilidad resultante. Si la utilidad aparece en verde, el proyecto es viable." />
                                <GuideItem number="3" title="Comparativo Venta vs Renta (Pág. 7)" text="Dos columnas lado a lado. La AZUL es si vendes los locales; la VERDE es si los rentas. Busca 'GANANCIA NETA' o 'FLUJO NETO ANUAL'. Si es positivo, el escenario es viable." />
                                <GuideItem number="4" title="Flujo de Efectivo (Pág. 8)" text="Gráficas de barras mes a mes. Barras rojas = meses de gasto. Barras de color = meses de ingreso. La línea amarilla 'BE' marca el break-even: cuando recuperas todo lo invertido." />
                                <GuideItem number="5" title="Tabla Mes a Mes (Pág. 8)" text="Versión numérica de las gráficas. Cada fila es un mes. 'Acumulado' en verde = ya superaste tu punto de equilibrio." />
                                <GuideItem number="6" title="¿Vender o Rentar?" text="VENTA: recuperas dinero rápido para reinvertir. RENTA: ingresos perpetuos mensuales. El 'Dictamen CFO' (izquierda) da la recomendación algorítmica de NoNA." />
                            </div>
                            <div className="mt-5 bg-zinc-900 text-white rounded-lg p-4 text-center">
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Generado con</p>
                                <p className="text-xl font-black tracking-tight">NoNA I.tech</p>
                                <p className="text-[9px] text-zinc-400 mt-1">Inteligencia Inmobiliaria de Nivel Institucional</p>
                            </div>
                        </div>
                    </div>
                </div>
                );
            })()}

            {/* HOJA 3: SCORE DE VIABILIDAD + INSIGHTS */}
            {raw.viability_score && (
                <div id="project-page-3" className="w-[1240px] h-[877px] bg-white text-zinc-900 px-14 py-10 flex flex-col shrink-0 overflow-hidden relative border-t border-zinc-100 box-border">
                    <div className="border-b-[3px] border-black pb-3 mb-5 flex justify-between items-end">
                        <div>
                            <h1 className="text-[28px] font-black uppercase tracking-tight">Índice de Viabilidad del Proyecto</h1>
                            <p className="text-zinc-500 text-xs font-medium tracking-wide mt-1">CALIFICACIÓN INTEGRAL • DIAGNÓSTICO Y MÉTRICAS INSTITUCIONALES</p>
                        </div>
                        <div className="text-right">
                            <p className="text-zinc-500 text-xs">{currentDate}</p>
                        </div>
                    </div>

                    {/* Score Section */}
                    {(() => {
                        const vs = raw.viability_score;
                        const scoreColor = vs.total >= 80 ? '#059669' : vs.total >= 60 ? '#2563eb' : vs.total >= 40 ? '#d97706' : '#dc2626';
                        const DL: Record<string, string> = { utilidad: "Utilidad", eficiencia: "Eficiencia Arq.", costo_ingreso: "Costo / Ingreso", cashflow: "Cash Flow", financiabilidad: "Financiabilidad" };
                        return (
                            <div className="flex gap-10 mb-6">
                                <div className="flex flex-col items-center shrink-0">
                                    <svg viewBox="0 0 120 120" className="w-[100px] h-[100px] -rotate-90">
                                        <circle cx="60" cy="60" r="52" fill="none" stroke="#f4f4f5" strokeWidth="8" />
                                        <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${vs.total * 3.267} 326.7`} />
                                    </svg>
                                    <div className="relative -mt-[70px] flex flex-col items-center">
                                        <span className="text-[28px] font-black" style={{ color: scoreColor }}>{vs.total}</span>
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">{vs.label}</span>
                                    </div>
                                    <div className="mt-8" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    {Object.entries(vs.dimensiones).map(([k, v]: [string, any]) => {
                                        const dc = v >= 80 ? '#059669' : v >= 60 ? '#2563eb' : v >= 40 ? '#d97706' : '#dc2626';
                                        return (
                                            <div key={k}>
                                                <div className="flex justify-between mb-0.5">
                                                    <span className="text-[10px] font-medium text-zinc-600">{DL[k] || k}</span>
                                                    <span className="text-[10px] font-bold" style={{ color: dc }}>{v}/100</span>
                                                </div>
                                                <div className="h-2 bg-zinc-100 rounded-sm overflow-hidden">
                                                    <div className="h-full rounded-sm" style={{ width: `${v}%`, background: dc }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Insights List */}
                    {raw.insights && raw.insights.length > 0 && (
                        <div className="mb-5">
                            <h3 className="font-black text-[10px] uppercase tracking-[0.15em] text-zinc-500 border-b border-zinc-200 pb-1 mb-3">DIAGNÓSTICO DEL PROYECTO</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {raw.insights.slice(0, 6).map((ins: any, idx: number) => {
                                    const dotColor = ins.tipo === 'warning' ? 'bg-amber-400' : ins.tipo === 'success' ? 'bg-emerald-400' : ins.tipo === 'tip' ? 'bg-sky-400' : 'bg-violet-400';
                                    const label = ins.tipo === 'warning' ? 'Atención' : ins.tipo === 'success' ? 'Fortaleza' : ins.tipo === 'tip' ? 'Oportunidad' : 'Hallazgo';
                                    return (
                                        <div key={idx} className="flex gap-2 py-1.5 border-l-[3px] border-zinc-200 pl-3">
                                            <div>
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                                    <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">{label}</span>
                                                </div>
                                                <p className="font-semibold text-[10px] text-zinc-800 leading-snug">{ins.titulo}</p>
                                                <p className="text-[9px] text-zinc-500 mt-0.5 leading-snug">{ins.descripcion}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Banking Metrics */}
                    {raw.banking && (
                        <div>
                            <h3 className="font-black text-[10px] uppercase tracking-[0.15em] text-zinc-500 border-b border-zinc-200 pb-1 mb-3">INDICADORES INSTITUCIONALES</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {[
                                    { l: "DSCR", v: `${raw.banking.dscr}x`, d: "Cobertura de Deuda" },
                                    { l: "LTV", v: `${raw.banking.ltv_pct}%`, d: "Loan to Value" },
                                    { l: "Costo/m² Vendible", v: `$${raw.banking.costo_m2_vendible?.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, d: "Inversión Unitaria" },
                                    { l: "Ingreso/m² Vendible", v: `$${raw.banking.ingreso_m2_vendible?.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, d: "Ingreso Unitario" },
                                    { l: "Eficiencia", v: `${raw.banking.eficiencia_arq}%`, d: "Área Vendible / Construida" },
                                ].map((kpi, idx) => (
                                    <div key={idx} className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-lg text-center">
                                        <div className="text-[8px] uppercase font-bold tracking-[0.1em] text-zinc-400 mb-0.5">{kpi.l}</div>
                                        <div className="font-black text-sm text-zinc-800">{kpi.v}</div>
                                        <div className="text-[8px] text-zinc-400 mt-0.5">{kpi.d}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Commercial Recommendation */}
                    {raw.comercial_recomendacion && raw.comercial_recomendacion !== 'sin_locales' && (
                        <div className="mt-auto bg-zinc-900 rounded-lg p-4 flex items-center gap-5">
                            <div className="shrink-0">
                                <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.15em] mb-0.5">Estrategia Recomendada</p>
                                <p className={`text-lg font-black ${raw.comercial_recomendacion === 'vender' ? 'text-blue-400' : raw.comercial_recomendacion === 'rentar' ? 'text-emerald-400' : raw.comercial_recomendacion === 'hibrida' ? 'text-violet-400' : 'text-amber-400'}`}>
                                    {raw.comercial_recomendacion === 'vender' ? 'Venta Especulativa' : raw.comercial_recomendacion === 'rentar' ? 'Renta Patrimonial' : raw.comercial_recomendacion === 'hibrida' ? 'Estrategia Mixta' : 'Requiere Evaluación'}
                                </p>
                            </div>
                            <div className="flex-1 border-l border-zinc-700 pl-5">
                                <p className="text-zinc-400 text-[10px] leading-relaxed">{raw.comercial_razon}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* HOJA 4: IMPLANTACIÓN URBANA */}
            <div id="project-page-4" className="w-[1240px] h-[877px] bg-white text-zinc-900 p-16 flex flex-col border border-zinc-100 shrink-0">
                <div className="border-b-[4px] border-black pb-6 mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-bold uppercase tracking-tight mb-2">Implantación Urbana</h2>
                        <p className="text-zinc-500">{projectName}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-16 flex-1 items-start mt-4">
                    {/* Mapa */}
                    <div className="flex flex-col h-full">
                        <h2 className="text-2xl font-bold border-b-2 border-zinc-200 mb-6 pb-2">Ubicación del Proyecto</h2>
                        <div className="w-full flex-1 min-h-[400px] bg-zinc-50 rounded-xl shadow-inner border border-zinc-200 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            <div className="z-10 bg-white p-5 rounded-full shadow-lg mb-4 border border-zinc-100">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <div className="z-10 text-center px-8 max-w-md">
                                <p className="font-bold text-zinc-800 text-xl mb-2">{address !== "Sin dirección" ? address : "Ubicación Georreferenciada"}</p>
                                <p className="font-mono text-sm text-zinc-500 bg-zinc-200 px-3 py-1.5 rounded inline-block">Lat: {data.lat?.toFixed(5) || "25.68661"}, Lng: {data.lng?.toFixed(5) || "-100.31611"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Zonificación */}
                    <div className="flex flex-col h-full">
                        <h2 className="text-2xl font-bold border-b-2 border-zinc-200 mb-6 pb-2">Zonificación Volumétrica</h2>
                        <div className="flex-1 min-h-[400px] shadow-sm rounded-xl border border-zinc-200 overflow-hidden">
                            <StackingDiagram
                                landArea={data.area_terreno}
                                cos={data.COS}
                                commercialArea={results?.raw?.area_comercio || 0}
                                residentialArea={results?.raw?.area_venta_vivienda || 0}
                                parkingArea={results?.raw?.parking_area ? results.raw.parking_area / 1.5 : 0} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* HOJA 5: ANÁLISIS FINANCIERO */}
            <div id="project-page-5" className="w-[1240px] h-[877px] bg-white text-zinc-900 p-16 flex flex-col shrink-0 text-sm overflow-hidden relative">
                
                {/* 0. HEADER */}
                <div className="border-b-[4px] border-black pb-6 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">Análisis Financiero</h1>
                        <p className="text-zinc-500">{projectName}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">DESGLOSE DE PREFACTIBILIDAD</p>
                        <p className="text-zinc-500">{currentDate}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-12">
                    {/* COL 1 */}
                    <div className="space-y-8">
                        <Section title="1. TERRENO">
                        <Row label="Área Terreno" value={stats.Text_Area_Terreno || `${raw.area_terreno?.toFixed(2)} m2`} />
                        <Row label="Valor Terreno" value={stats.Text_Valor_Terreno} />
                        <Row label="Costo Unitario" value={stats.Text_Costo_Unitario_Tierra} sub />
                    </Section>

                    {/* 2. NORMATIVA */}
                    <Section title="2. NORMATIVA URBANA">
                        <Row label="COS Permitido" value={data.COS ? `${(data.COS * 100).toFixed(1)}%` : "0%"} />
                        <Row label="Huella (COS)" value={stats.Text_COS_Area} sub />
                        <Row label="CUS Permitido" value={data.CUS ? `${data.CUS.toFixed(2)}` : "0"} />
                        <Row label="Área Construible (CUS)" value={stats.Text_CUS_Area} sub />
                        <Row label="Área Libre (CAS)" value={stats.Text_CAS_Area} sub />
                        <Row label="Área Neta Útil" value={stats.Text_Net_Area} highlight />
                    </Section>

                    {/* 3. DEMOLICION & PRELIMINARES */}
                    <Section title="3. COSTOS PRELIMINARES">
                        <Row label="Demolición Obra" value={stats.Text_Demolicion_Costo} />
                        <Row label="Licencias y Permisos" value={stats.Text_Licencia_Costo} />
                        <Row label="Retiro de Residuos" value={stats.Text_Residuos_Costo} />
                        <div className="border-t border-dashed border-zinc-300 my-1"></div>
                        <Row label="Total Demolición" value={stats.Text_Total_Demolicion} bold />
                    </Section>

                    {/* 4. ESTACIONAMIENTO */}
                    <Section title="4. CÁLCULO ESTACIONAMIENTO">
                        <Row label="Cajones Vivienda" value={stats.Text_Cajones_Vivienda} />
                        <Row label="Cajones Comercio" value={stats.Text_Cajones_Comercio} />
                        <Row label="Total Cajones" value={stats.Text_Cajones_Total} bold />
                        <Row label="Área Requerida" value={stats.Text_Area_Estacionamiento} sub />
                        <Row label="Costo Estacionamiento" value={stats.Text_Costo_Estacionamiento} highlight />
                    </Section>

                    {/* 5. DISTRIBUCION AREAS */}
                    <Section title="5. DISTRIBUCIÓN DE ÁREAS">
                        <Row label="CUS Total" value={stats.Text_CUS_Area} bold />
                        <Row label="- Circulación" value={stats.Text_Area_Circulacion} />
                        <Row label="- Comercio" value={stats.Text_Area_Comercio} />
                        <Row label="- Estacionamiento" value={stats.Text_Area_Estacionamiento} />
                        <div className="border-t border-black my-1"></div>
                        <Row label="= Área Vendible (Residencial)" value={stats.Text_Area_Vendible_Vivienda} bold highlight />
                        <Row label="Eficiencia" value={stats.Text_Eficiencia} sub />
                    </Section>

                </div>

                {/* COL 2 */}
                <div className="space-y-8">
                    {/* 6. ANALISIS COSTOS */}
                    <Section title="6. ANÁLISIS DE COSTOS">
                        <Row label="Construcción Base" value={stats.Text_Construccion_Base} />
                        <Row label="Demolición" value={stats.Text_Total_Demolicion} />
                        <Row label="Estacionamiento" value={stats.Text_Costo_Estacionamiento} />
                        <div className="border-t border-dashed border-zinc-300 my-1"></div>
                        <Row label="COSTOS DIRECTOS" value={stats.Text_Costos_Directos} bold />

                        <div className="mt-4 mb-2 text-xs font-bold text-zinc-400">INDIRECTOS</div>
                        <Row label="Honorarios" value={stats.Text_Honorarios} sub />
                        <Row label="Legales" value={stats.Text_Legales} sub />
                        <Row label="Administrativos" value={stats.Text_Administrativos} sub />
                        <Row label="Financieros" value={stats.Text_Financieros} sub />
                        <Row label="Comerciales" value={stats.Text_Comerciales} sub />
                        <Row label="Total Indirectos" value={stats.Text_Costos_Indirectos} bold />

                        <div className="border-t border-black my-1"></div>
                        <Row label="COSTO TOTAL PROYECTO" value={stats.Text_Costo_Total} bold highlight />
                    </Section>

                    {/* 7. ANALISIS INGRESOS */}
                    <Section title="7. INGRESOS PROYECTADOS">
                        <Row label="Ventas Vivienda" value={stats.Text_Ingreso_Vivienda} />
                        <Row label="Ventas Locales" value={stats.Text_Ingreso_Locales} />
                        <div className="border-t border-black my-1"></div>
                        <Row label="INGRESO TOTAL" value={stats.Text_Ingreso_Total_Optimizado} bold highlight />
                        <Row label="Precio Promedio / m²" value={stats.Text_Precio_Promedio_M2} sub />
                    </Section>

                    {/* 8. RENTABILIDAD */}
                    <Section title="8. RENTABILIDAD Y MÉTRICAS">
                        <Row label="Inversión Total" value={stats.Text_Costo_Total} />
                        <Row label="Ingreso Total" value={stats.Text_Ingreso_Total_Optimizado} />
                        <div className="border-t border-dashed border-zinc-300 my-1"></div>
                        <Row label="GANANCIA BRUTA" value={stats.Text_Ganancia_Bruta} bold />
                        <Row label="GANANCIA NETA (Est.)" value={stats.Text_Ganancia_Neta} bold />

                        <div className="mt-4 p-4 bg-zinc-100 rounded border border-zinc-300">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold">UTILIDAD FINAL</span>
                                <span className="text-2xl font-bold">{stats.Text_Utilidad_Final}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span>ROI</span>
                                <span className="font-bold">{stats.Text_ROI}</span>
                            </div>
                        </div>
                    </Section>

                    {/* 9. CRONOGRAMA */}
                    <Section title="9. ESTIMACIÓN CRONOGRAMA">
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                            <div className="bg-zinc-50 p-2 border">Trámites<br /><b>{stats.Text_Meses_Tramites}</b></div>
                            <div className="bg-zinc-50 p-2 border">Obra<br /><b>{stats.Text_Meses_Obra}</b></div>
                            <div className="bg-zinc-50 p-2 border">Venta<br /><b>{stats.Text_Meses_Venta}</b></div>
                            <div className="bg-zinc-900 text-white p-2 border border-black">Total<br /><b>{stats.Text_Duracion_Total}</b></div>
                        </div>
                    </Section>

                </div>
            </div>

            {/* HOJA 6: PRESUPUESTO PARAMÉTRICO */}
            <div id="project-page-6" className="w-[1240px] h-[877px] bg-white text-zinc-900 px-16 py-12 flex flex-col shrink-0 text-sm border-t border-zinc-100 box-border overflow-hidden">
                <div className="border-b-[3px] border-black pb-4 mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-tight mb-1">Presupuesto Paramétrico</h1>
                        <p className="text-zinc-500">{projectName}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">CATÁLOGO DE CONCEPTOS</p>
                        <p className="text-zinc-500 text-xs">Distribución Analizada de Costo Directo</p>
                    </div>
                </div>

                <div className="flex-1 w-full flex flex-col justify-center items-center">
                    <table className="w-full max-w-5xl text-left border-collapse mx-auto">
                        <thead>
                            <tr className="border-b-2 border-black text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                                <th className="pb-2 w-20 text-center">Clave</th>
                                <th className="pb-2">Partida de Construcción</th>
                                <th className="pb-2 text-center">Peso %</th>
                                <th className="pb-2 text-center">Monto Total</th>
                                <th className="pb-2 text-center text-blue-600">Vivienda</th>
                                <th className="pb-2 text-center text-emerald-600">Locales</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px]">
                            {raw.catalogo_obra && raw.catalogo_obra.map((partida: any, idx: number) => (
                                <tr key={idx} className={`border-b border-zinc-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}`}>
                                    <td className="py-3 px-2 font-mono font-medium text-zinc-400 text-center">{partida.clave}</td>
                                    <td className="py-3 px-2 font-bold text-zinc-800">{partida.concepto}</td>
                                    <td className="py-3 px-2 text-center font-medium text-zinc-600">{(partida.peso_porcentaje).toFixed(1)}%</td>
                                    <td className="py-3 px-2 text-center font-bold text-zinc-700">${(partida.monto_total || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                    <td className="py-3 px-2 text-center text-zinc-500">${(partida.monto_vivienda || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                    <td className="py-3 px-2 text-center text-zinc-500">${(partida.monto_comercial || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-[3px] border-black text-base bg-zinc-50">
                                <td colSpan={2} className="py-4 px-2 font-bold text-right uppercase tracking-wider text-xs text-zinc-500">Total Obra Pura (Sin Indirectos)</td>
                                <td className="py-4 px-2 text-center font-bold text-sm">100.0%</td>
                                <td className="py-4 px-2 text-center font-black text-blue-600">${((raw.base_construction || 0) + (raw.parking_cost || 0)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                <td colSpan={2} className="py-4"></td>
                            </tr>
                        </tfoot>
                    </table>
                    <div className="mt-12 text-[10px] text-zinc-400 max-w-5xl text-center">
                        *Nota: Esta distribución paramétrica abarca la cimentación, estructura prefabricada o in-situ, albañilería, instalaciones ingenieriles (MEP) y los acabados interioes/exteriores. No incluye costos del terreno ni cascajo de demolición.
                    </div>
                </div>
            </div>

            {/* ERROR / DEBUG WARNING if missing data */}
            {(!raw.utilidad_optimizada && raw.utilidad_optimizada !== 0) && (
                <div className="mt-8 p-4 border border-red-500 text-red-600 bg-red-50 text-xs">
                    Advertencia: Algunos datos no se calcularon correctamente. Verifique las entradas.
                </div>
            )}
            {/* ══════════════════════════════════════════════════════════════════
                HOJA 5: CFO — RESUMEN + COMPARATIVO
               ══════════════════════════════════════════════════════════════════ */}
            {raw.flujo_especulativo && raw.cfo && (() => {
                const s = raw.cfo;
                const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
                const fmtD = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
                const pct = (n: number) => `${n.toFixed(1)}%`;
                const venta = raw.flujo_especulativo;
                const renta = raw.flujo_patrimonial;
                const allVals = [...venta.map((d: any) => d.acumulado), ...renta.map((d: any) => d.acumulado)];
                const chartMax = Math.max(...allVals.map(Math.abs)) * 1.15;

                return (<>
                <div id="project-page-7" className="w-[1240px] h-[877px] bg-white text-zinc-900 px-14 py-10 flex flex-col shrink-0 overflow-hidden relative border-t border-zinc-100 box-border">
                    {/* HEADER */}
                    <div className="border-b-[3px] border-black pb-3 mb-5 flex justify-between items-end">
                        <div>
                            <h1 className="text-[28px] font-black uppercase tracking-tight">Análisis Comercial — Decisión de Locales</h1>
                            <p className="text-zinc-500 text-xs font-medium tracking-wide mt-1">MODELO ESPECULATIVO (VENTA) vs MODELO PATRIMONIAL (RENTA) • Proyección 24 Meses</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-mono text-zinc-400">{s.num_locales} LOCAL{s.num_locales > 1 ? 'ES' : ''} • {s.area_por_local?.toFixed(0)} m² c/u</p>
                            <p className="text-zinc-500 text-xs">{currentDate}</p>
                        </div>
                    </div>

                    {/* 1. RESUMEN DE INVERSIÓN */}
                    <div className="mb-5">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.15em] text-zinc-500 border-b border-zinc-200 pb-1 mb-3">1. RESUMEN DE INVERSIÓN COMERCIAL</h3>
                        <div className="grid grid-cols-6 gap-2">
                            {[
                                { l: "Inversión Total Comercial", v: fmt(s.inversion_comercial) },
                                { l: "Costo por Local", v: fmt(s.costo_por_local) },
                                { l: "Precio Venta / Local", v: fmt(s.precio_venta_local) },
                                { l: "Precio Venta / m²", v: fmtD(s.precio_venta_m2) },
                                { l: "Renta Sugerida / Local", v: fmt(s.renta_por_local) + "/mes" },
                                { l: "Renta / m² / mes", v: fmtD(s.renta_m2_mensual) },
                            ].map((kpi, idx) => (
                                <div key={idx} className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-lg">
                                    <div className="text-[8px] uppercase font-bold tracking-[0.1em] text-zinc-400 mb-0.5 leading-tight">{kpi.l}</div>
                                    <div className="font-black text-sm text-zinc-800">{kpi.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. COMPARATIVO */}
                    <div className="flex-1">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.15em] text-zinc-500 border-b border-zinc-200 pb-1 mb-3">2. COMPARATIVO VENTA vs RENTA</h3>
                        <div className="grid grid-cols-2 gap-4">

                            {/* VENTA */}
                            <div className="border border-blue-200 rounded-lg overflow-hidden">
                                <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
                                    <span className="font-black text-xs tracking-wide">ESCENARIO A: VENTA</span>
                                    <span className="text-blue-200 text-[9px] font-mono">ESPECULATIVO</span>
                                </div>
                                <div className="p-4 space-y-2 text-[11px] bg-blue-50/40">
                                    <PrintCompRow label="Ingreso Bruto por Venta" value={fmt(s.ingreso_neto_venta + s.comision_venta)} />
                                    <PrintCompRow label="(-) Comisión Inmobiliaria" value={`-${fmt(s.comision_venta)}`} sub note={pct(s.comision_venta_pct * 100)} />
                                    <div className="border-t border-blue-200 my-1" />
                                    <PrintCompRow label="Ingreso Neto" value={fmt(s.ingreso_neto_venta)} bold />
                                    <PrintCompRow label="(-) Inversión Comercial" value={`-${fmt(s.inversion_comercial)}`} sub />
                                    <div className="border-t-2 border-blue-300 my-1" />
                                    <PrintCompRow label="GANANCIA NETA" value={fmt(s.ganancia_venta)} bold green={s.ganancia_venta >= 0} />
                                    <PrintCompRow label="Margen de Utilidad" value={pct(s.margen_venta)} bold />
                                    <PrintCompRow label="Break-even" value={s.breakeven_venta_mes ? `Mes ${s.breakeven_venta_mes}` : '—'} sub />
                                    <PrintCompRow label="Tipo de Liquidez" value="Inmediata" sub />
                                </div>
                            </div>

                            {/* RENTA */}
                            <div className="border border-emerald-200 rounded-lg overflow-hidden">
                                <div className="bg-emerald-600 text-white px-4 py-2 flex justify-between items-center">
                                    <span className="font-black text-xs tracking-wide">ESCENARIO B: RENTA</span>
                                    <span className="text-emerald-200 text-[9px] font-mono">PATRIMONIAL</span>
                                </div>
                                <div className="p-4 space-y-2 text-[11px] bg-emerald-50/40">
                                    <PrintCompRow label="Renta Anual Bruta (GAB)" value={fmt(s.renta_anual_bruta)} />
                                    <PrintCompRow label="(-) Vacancia Estructural" value={`-${fmt(s.renta_anual_bruta * s.vacancia_pct)}`} sub note={pct(s.vacancia_pct * 100)} />
                                    <PrintCompRow label="(-) Mantenimiento" value={`-${fmt(s.inversion_comercial * s.mantenimiento_pct)}`} sub note={pct(s.mantenimiento_pct * 100)} />
                                    <div className="border-t border-emerald-200 my-1" />
                                    <PrintCompRow label="NOI (Ingreso Operativo Neto)" value={fmt(s.noi_anual)} bold />
                                    <PrintCompRow label="(-) ISR" value={`-${fmt(s.noi_anual * s.isr_pct)}`} sub note={pct(s.isr_pct * 100)} />
                                    <div className="border-t-2 border-emerald-300 my-1" />
                                    <PrintCompRow label="FLUJO NETO ANUAL" value={fmt(s.noi_anual * (1 - s.isr_pct))} bold green />
                                    <PrintCompRow label="Cap Rate" value={pct(s.cap_rate * 100)} bold />
                                    <PrintCompRow label="Yield on Cost" value={pct(s.yield_on_cost)} sub />
                                    <PrintCompRow label="Incremento Anual" value={pct(s.incremento_anual * 100)} sub />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════════════
                    HOJA 6: CFO — ROI + FLUJOS + TABLA MES A MES
                   ══════════════════════════════════════════════════════════════════ */}
                <div id="project-page-8" className="w-[1240px] h-[877px] bg-white text-zinc-900 px-14 py-10 flex flex-col shrink-0 overflow-hidden relative border-t border-zinc-100 box-border">
                    {/* HEADER */}
                    <div className="border-b-[3px] border-black pb-3 mb-5 flex justify-between items-end">
                        <div>
                            <h1 className="text-[28px] font-black uppercase tracking-tight">Flujo de Efectivo Comercial</h1>
                            <p className="text-zinc-500 text-xs font-medium tracking-wide mt-1">PROYECCIÓN A 24 MESES • CURVAS DE ABSORCIÓN Y TABLA DE CASH FLOW</p>
                        </div>
                        <div className="text-right">
                            <p className="text-zinc-500 text-xs">{currentDate}</p>
                        </div>
                    </div>

                    {/* 3. ROI */}
                    <div className="mb-4">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.15em] text-zinc-500 border-b border-zinc-200 pb-1 mb-2">3. RETORNO SOBRE INVERSIÓN (RENTA PATRIMONIAL)</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {[
                                { l: "ROI Año 1", v: pct(s.roi_1y) },
                                { l: "ROI Año 2", v: pct(s.roi_2y) },
                                { l: "ROI Año 5", v: pct(s.roi_5y) },
                                { l: "Payback (post-obra)", v: `${Math.ceil(s.payback_meses)} meses` },
                                { l: "Break-even Total", v: s.breakeven_renta_mes > 0 ? `Mes ${s.breakeven_renta_mes}` : `>24 meses` },
                            ].map((kpi, idx) => (
                                <div key={idx} className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
                                    <div className="text-[8px] uppercase font-bold tracking-[0.1em] text-zinc-400 mb-0.5">{kpi.l}</div>
                                    <div className="font-black text-sm text-emerald-700">{kpi.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. CHARTS */}
                    <div className="mb-4">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.15em] text-zinc-500 border-b border-zinc-200 pb-1 mb-2">4. FLUJO DE EFECTIVO ACUMULADO (24 MESES)</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <PrintChart title="Venta (Especulativo)" data={venta} chartMax={chartMax} color="bg-blue-500" breakeven={s.breakeven_venta_mes} finalVal={s.acumulado_venta_final} />
                            <PrintChart title="Renta (Patrimonial)" data={renta} chartMax={chartMax} color="bg-emerald-500" breakeven={s.breakeven_renta_mes} finalVal={s.acumulado_renta_final} />
                        </div>
                    </div>

                    {/* 5. TABLE */}
                    <div className="flex-1 overflow-hidden">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.15em] text-zinc-500 border-b border-zinc-200 pb-1 mb-2">5. TABLA DE CASH FLOW MES A MES</h3>
                        <table className="w-full text-[9px] border-collapse">
                            <thead>
                                <tr className="bg-zinc-800 text-white">
                                    <th className="py-1 px-1 text-center font-bold">Mes</th>
                                    <th className="py-1 px-1 text-center border-l border-zinc-600" colSpan={3}>━━ VENTA (ESPECULATIVO) ━━</th>
                                    <th className="py-1 px-1 text-center border-l border-zinc-600" colSpan={4}>━━ RENTA (PATRIMONIAL) ━━</th>
                                </tr>
                                <tr className="bg-zinc-700 text-zinc-300 text-[8px]">
                                    <th className="py-0.5 px-1"></th>
                                    <th className="py-0.5 px-1 text-center border-l border-zinc-600">Egreso</th>
                                    <th className="py-0.5 px-1 text-center">Ingreso</th>
                                    <th className="py-0.5 px-1 text-center font-bold">Acumulado</th>
                                    <th className="py-0.5 px-1 text-center border-l border-zinc-600">Egreso</th>
                                    <th className="py-0.5 px-1 text-center">Ingreso Neto</th>
                                    <th className="py-0.5 px-1 text-center">Ocup.</th>
                                    <th className="py-0.5 px-1 text-center font-bold">Acumulado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {venta.map((v: any, i: number) => {
                                    const r = renta[i];
                                    return (
                                        <tr key={i} className={`border-b border-zinc-100 ${i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/60'} ${v.mes === s.breakeven_venta_mes || v.mes === s.breakeven_renta_mes ? '!bg-yellow-50' : ''}`}>
                                            <td className="py-[3px] px-1 text-center font-bold text-zinc-500">{v.mes}</td>
                                            <td className="py-[3px] px-1 text-center text-red-400 font-mono">{v.egreso < 0 ? fmt(v.egreso) : '—'}</td>
                                            <td className="py-[3px] px-1 text-center text-blue-600 font-mono">{v.ingreso > 0 ? fmt(v.ingreso) : '—'}</td>
                                            <td className={`py-[3px] px-1 text-center font-bold font-mono ${v.acumulado >= 0 ? 'text-emerald-600' : 'text-red-400'}`}>{fmt(v.acumulado)}</td>
                                            <td className="py-[3px] px-1 text-center text-red-400 font-mono border-l border-zinc-200">{r.egreso < 0 ? fmt(r.egreso) : '—'}</td>
                                            <td className="py-[3px] px-1 text-center text-emerald-600 font-mono">{r.ingreso > 0 ? fmt(r.ingreso) : '—'}</td>
                                            <td className="py-[3px] px-1 text-center text-zinc-500">{r.ocupacion !== undefined ? `${(r.ocupacion * 100).toFixed(0)}%` : '—'}</td>
                                            <td className={`py-[3px] px-1 text-center font-bold font-mono ${r.acumulado >= 0 ? 'text-emerald-600' : 'text-red-400'}`}>{fmt(r.acumulado)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                </>);
            })()}
            </div>
        </div>
    );
}

// Helper Components for Thesis Report
function Section({ title, children }: any) {
    return (
        <div className="mb-6">
            <h3 className="font-bold border-b-2 border-zinc-200 mb-3 pb-1 text-sm uppercase tracking-wider text-black">{title}</h3>
            <div className="space-y-1">
                {children}
            </div>
        </div>
    )
}

function Row({ label, value, sub, bold, highlight }: any) {
    return (
        <div className={`flex justify-between items-baseline ${sub ? 'pl-4 text-xs text-zinc-500' : 'text-sm'} ${highlight ? 'bg-zinc-100 px-2 py-1 -mx-2 rounded' : ''}`}>
            <span className={`${bold ? 'font-bold text-black' : ''}`}>{label}</span>
            <span className={`${bold ? 'font-bold' : ''}`}>{value || "-"}</span>
        </div>
    )
}

function MetricBox({ label, value, sub, highlight }: any) {
    return (
        <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-4xl font-bold mb-1 ${highlight ? 'text-indigo-600' : 'text-zinc-900'}`}>{value}</p>
            <p className="text-zinc-400 text-xs">{sub}</p>
        </div>
    )
}

// ── CFO PDF Helpers ──────────────────────────────────────

function PrintCompRow({ label, value, sub, bold, green, note }: { label: string, value: string, sub?: boolean, bold?: boolean, green?: boolean, note?: string }) {
    return (
        <div className={`flex justify-between items-baseline ${sub ? 'pl-3 text-[10px] text-zinc-500' : ''}`}>
            <span className={`${bold ? 'font-bold text-zinc-900' : ''} flex items-center gap-1`}>
                {label}
                {note && <span className="text-[8px] text-zinc-400 font-mono">({note})</span>}
            </span>
            <span className={`font-mono ${bold ? 'font-black' : 'font-medium'} ${green ? 'text-emerald-600' : green === false ? 'text-red-500' : ''}`}>
                {value}
            </span>
        </div>
    )
}

function PrintChart({ title, data, chartMax, color, breakeven, finalVal }: { title: string, data: any[], chartMax: number, color: string, breakeven: number, finalVal: number }) {
    const fmtShort = (n: number) => {
        const abs = Math.abs(n);
        if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
        if (abs >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
        return `$${n.toFixed(0)}`;
    };
    const fmtV = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

    return (
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-xs text-zinc-900">{title}</div>
                <div className={`text-right ${finalVal >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    <div className="text-[8px] uppercase tracking-wider font-bold text-zinc-400">Acum. M24</div>
                    <div className="font-black text-xs">{fmtV(finalVal)}</div>
                </div>
            </div>
            <div className="relative flex-1 min-h-[120px] flex items-center">
                <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-[7px] font-mono text-zinc-400 pr-1 text-right z-10">
                    <span>{fmtShort(chartMax)}</span>
                    <span>$0</span>
                    <span>{fmtShort(-chartMax)}</span>
                </div>
                <div className="ml-12 flex-1 relative flex items-center gap-[1px]" style={{ height: '100%' }}>
                    <div className="absolute w-full border-t border-dashed border-zinc-300 z-0" style={{ top: '50%' }} />
                    {breakeven > 0 && breakeven <= 24 && (
                        <div className="absolute z-20 border-l-2 border-amber-400" style={{ left: `${((breakeven - 0.5) / 24) * 100}%`, top: 0, bottom: 0 }}>
                            <div className="absolute -top-0.5 bg-amber-400 text-[6px] font-bold text-amber-900 px-0.5 rounded-b whitespace-nowrap">BE M{breakeven}</div>
                        </div>
                    )}
                    {data.map((d: any, i: number) => {
                        const val = d.acumulado;
                        const isNeg = val < 0;
                        const heightPct = Math.min((Math.abs(val) / chartMax) * 50, 50);
                        return (
                            <div key={i} className="relative flex-1 flex flex-col z-10" style={{ height: '100%' }}>
                                {isNeg ? (
                                    <><div style={{ height: '50%' }} /><div style={{ height: '50%' }} className="flex items-start"><div className="w-full bg-red-400 rounded-b-[1px] opacity-75" style={{ height: `${heightPct}%` }} /></div></>
                                ) : (
                                    <><div style={{ height: '50%' }} className="flex items-end"><div className={`w-full ${color} rounded-t-[1px] opacity-85`} style={{ height: `${heightPct}%` }} /></div><div style={{ height: '50%' }} /></>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="ml-12 flex justify-between text-[7px] font-mono text-zinc-400 mt-0.5">
                {[1, 6, 12, 18, 24].map(m => <span key={m}>M{m}</span>)}
            </div>
        </div>
    )
}

function PrintAssumption({ label, value, desc }: { label: string, value: string, desc: string }) {
    return (
        <div className="border-b border-zinc-100 pb-2">
            <div className="flex justify-between items-baseline mb-0.5">
                <span className="font-bold text-zinc-800">{label}</span>
                <span className="font-black font-mono text-zinc-700">{value}</span>
            </div>
            <p className="text-[9px] text-zinc-400 leading-snug">{desc}</p>
        </div>
    )
}

function GuideItem({ number, title, text }: { number: string, title: string, text: string }) {
    return (
        <div className="flex gap-3">
            <div className="w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{number}</div>
            <div>
                <p className="font-bold text-zinc-900 text-[11px] mb-0.5">{title}</p>
                <p className="text-zinc-600">{text}</p>
            </div>
        </div>
    )
}
