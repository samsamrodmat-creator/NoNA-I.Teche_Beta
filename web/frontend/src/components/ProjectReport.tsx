import { Calculator, LayoutDashboard, TrendingUp, DollarSign, PieChart, Activity } from "lucide-react";

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
        <div id="project-report" className="w-[1240px] bg-white text-zinc-900 p-16 font-mono text-sm hidden">

            {/* 0. HEADER */}
            <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">{projectName}</h1>
                    <p className="text-zinc-500">{address}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">REPORTE DE PREFACTIBILIDAD</p>
                    <p className="text-zinc-500">{currentDate}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12">

                {/* COL 1 */}
                <div className="space-y-8">

                    {/* 1. TERRENO */}
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
                                <span className="font-mono">{stats.Text_ROI}</span>
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

            {/* ERROR / DEBUG WARNING if missing data */}
            {(!raw.utilidad_optimizada && raw.utilidad_optimizada !== 0) && (
                <div className="mt-8 p-4 border border-red-500 text-red-600 bg-red-50 text-xs">
                    Advertencia: Algunos datos no se calcularon correctamente. Verifique las entradas.
                </div>
            )}
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
            <span className={`font-mono ${bold ? 'font-bold' : ''}`}>{value || "-"}</span>
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


