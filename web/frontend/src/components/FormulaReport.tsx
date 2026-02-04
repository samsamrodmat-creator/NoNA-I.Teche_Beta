import { Calculator, Ruler, DollarSign, BookOpen } from "lucide-react";

interface FormulaReportProps {
    data?: any;
    results?: any;
}

export function FormulaReport({ data, results }: FormulaReportProps) {
    // Default values if data not present (for layout preview)
    const areaT = data?.area_terreno || 0;
    const valorT = data?.valor_terreno || 0;
    const cosVal = data?.COS || 0;
    const cusVal = data?.CUS || 0;

    // Calculated or Raw Results
    const totalLandVal = results?.raw?.valor_terreno || 0;
    const cosArea = results?.raw?.cos_area || 0;
    const cusArea = results?.raw?.cus_area || 0;

    // Construction
    const costM2 = data?.costoMetroConstruccion || 0;
    const costDirect = results?.raw?.costo_directo || 0;
    const parkingCost = results?.raw?.parking_cost || 0;
    const totalCost = results?.raw?.costo_total || 0;

    // Financial
    const income = results?.raw?.ingreso_inicial || 0;
    const profitPct = results?.raw?.utilidad_inicial || 0;
    const targetProfit = data?.utilidadDeseada || 0;
    const targetIncome = results?.raw?.ingreso_optimizado || 0;

    return (
        <div id="formula-report" className="w-[800px] bg-white text-zinc-900 p-12 font-serif hidden">
            {/* Header */}
            <div className="border-b-2 border-zinc-900 pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Memoria de Cálculo</h1>
                    <p className="text-zinc-500 text-sm">Sustento Matemático y Procedimiento - Proyecto: {data?.project_name || "Sin Título"}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-zinc-400">Generado el: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* 1. Métricas Terreno */}
                <Section title="1. Valor del Terreno" icon={Ruler}>
                    <Formula
                        tex="Valor_{terreno} = Area_{terreno} \times Costo_{unitario}"
                        desc="Cálculo base del costo de la tierra."
                    />
                    <CalculationStep
                        label="Sustitución"
                        equation={`${areaT.toLocaleString()} m^2 \\times $${valorT.toLocaleString()}`}
                        result={`$${totalLandVal.toLocaleString()}`}
                    />
                </Section>

                {/* 2. Normativa */}
                <Section title="2. Normativa y Áreas" icon={BookOpen}>
                    <p className="text-sm text-zinc-600 mb-4">Cálculo de potenciales basado en coeficientes urbanos.</p>

                    {/* COS */}
                    <div className="mb-6">
                        <Formula
                            tex="Area_{COS} = Area_{terreno} \times COS"
                            desc="Área máxima de desplante en planta baja."
                        />
                        <CalculationStep
                            label="Procedimiento"
                            equation={`${areaT.toLocaleString()} \\times ${cosVal}`}
                            result={`${cosArea.toFixed(2)} m^2`}
                        />
                    </div>

                    {/* CUS */}
                    <div>
                        <Formula
                            tex="Area_{CUS} = Area_{terreno} \times CUS"
                            desc="Área total permitida de construcción."
                        />
                        <CalculationStep
                            label="Procedimiento"
                            equation={`${areaT.toLocaleString()} \\times ${cusVal}`}
                            result={`${cusArea.toFixed(2)} m^2`}
                        />
                    </div>
                </Section>

                {/* 3. Costos Construcción */}
                <Section title="3. Estimación de Costos" icon={Calculator}>
                    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 mb-6">
                        <h4 className="font-bold text-sm mb-2">Costos Directos (Llave en Mano)</h4>
                        <div className="font-mono text-sm bg-zinc-100 p-2 rounded mb-2">
                            Costos_Directos = (Area_CUS × Costo_m2 × 2)
                        </div>
                        <CalculationStep
                            label="Procedimiento"
                            equation={`(${cusArea.toFixed(0)} \\times $${costM2.toLocaleString()} \\times 2)`}
                            result={`$${costDirect.toLocaleString()}`}
                        />
                    </div>

                    <h4 className="font-bold text-sm mb-2">Costo Total de Inversión</h4>
                    <Formula
                        tex="Costo_{total} = Tierra + Directos + Indirectos + Estacionamiento"
                        desc="Suma total de la inversión requerida."
                    />
                    <CalculationStep
                        label="Sustitución"
                        equation={`$${totalLandVal.toLocaleString()} + $${costDirect.toLocaleString()} + Indirectos + $${parkingCost.toLocaleString()}`}
                        result={`$${totalCost.toLocaleString()}`}
                    />
                </Section>

                {/* 4. Rentabilidad */}
                <Section title="4. Rentabilidad y Optimización" icon={DollarSign}>
                    <div className="mb-6">
                        <Formula
                            tex="Utilidad_{\%} = \frac{Ingreso - Costo_{total}}{Ingreso} \times 100"
                            desc="Margen neto de utilidad actual."
                        />
                        <CalculationStep
                            label="Procedimiento"
                            equation={`\\frac{$${income.toLocaleString()} - $${totalCost.toLocaleString()}}{$${income.toLocaleString()}} \\times 100`}
                            result={`${profitPct.toFixed(2)}%`}
                        />
                    </div>

                    <div>
                        <h4 className="font-bold text-sm mb-2">Simulación de Precio Objetivo</h4>
                        <p className="text-sm text-zinc-600 mb-2">{'Para alcanzar una utilidad deseada ($U_{target}$):'}</p>
                        <Formula
                            tex="Ingreso_{meta} = \frac{Costo_{total}}{1 - (U_{target} \div 100)}"
                            desc="Ingreso total necesario para garantizar el margen objetivo."
                        />
                        <CalculationStep
                            label="Sustitución"
                            equation={`\\frac{$${totalCost.toLocaleString()}}{1 - (${targetProfit} \\div 100)}`}
                            result={`$${targetIncome.toLocaleString()}`}
                        />
                    </div>
                </Section>
            </div>

            <div className="mt-12 pt-8 border-t border-zinc-200 text-center">
                <p className="text-xs text-zinc-400">Documento generado automáticamente por NoNA Feasibility Engine.</p>
            </div>
        </div>
    );
}

function Section({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
    return (
        <section>
            <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-800 mb-4 border-b border-zinc-100 pb-2">
                <Icon className="w-5 h-5 text-indigo-600" />
                {title}
            </h3>
            {children}
        </section>
    );
}

function Formula({ tex, desc }: { tex: string, desc: string }) {
    return (
        <div className="mb-2">
            <div className="bg-zinc-50 border border-zinc-200 rounded p-3 mb-1 shadow-sm">
                <code className="text-indigo-900 font-bold font-mono text-sm">{tex}</code>
            </div>
            <p className="text-xs text-zinc-500 ml-1">{desc}</p>
        </div>
    )
}

function CalculationStep({ label, equation, result }: { label: string, equation: string, result: string }) {
    return (
        <div className="flex items-center gap-2 text-sm ml-4 border-l-2 border-zinc-200 pl-4 py-1">
            <span className="text-zinc-500 uppercase text-xs tracking-wider">{label}:</span>
            <span className="font-mono text-zinc-700">{equation}</span>
            <span className="text-zinc-400">=</span>
            <span className="font-bold text-emerald-600 font-mono bg-emerald-50 px-2 rounded border border-emerald-100">{result}</span>
        </div>
    )
}
