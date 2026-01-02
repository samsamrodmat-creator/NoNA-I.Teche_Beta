"use client";

import { useState, useEffect, useCallback } from "react";
import { MetricCard } from "@/components/MetricCard";
import { InputField } from "@/components/InputField";
import { StackingDiagram } from "@/components/StackingDiagram";
import {
  calculateMetrics,
  CalculationRequest,
  getCustomers,
  createCustomer,
  createScenario,
  getScenarios,
  Customer,
  Scenario
} from "@/lib/api";
import {
  Building2,
  DollarSign,
  TrendingUp,
  Calculator,
  LayoutDashboard,
  Car,
  Receipt
} from "lucide-react";

export default function Home() {
  const [data, setData] = useState<CalculationRequest>({
    area_terreno: 1000,
    valor_terreno: 5000,
    COS: 0.7,
    CUS: 2.5,
    CAS: 0.2,
    area_retiros: 50,
    demolicion: false,
    area_demolicion: 0,
    n_viviendas: 20,
    usos_mixtos: false,
    num_locales: 0,
    costo_local_m2: 35000,
    costoMetroConstruccion: 12000,
    Costo_de_venta_m2: 45000,
    areaCirculacionPorcentaje: 0.15,
    estacionamiento: true,
    tipo_estacionamiento: 4500,
    delegacion: ["centro"],
    Distrito: [1.0],
    utilidadDeseada: 25.0,
    correrSimulacion: true
  });

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Scenario State
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadPanel, setShowLoadPanel] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [scenariosList, setScenariosList] = useState<Scenario[]>([]);
  const [scenarioName, setScenarioName] = useState("");

  // Fetch customers on load
  useEffect(() => {
    getCustomers().then(setCustomers).catch(console.error);
  }, []);

  const handleCalculate = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await calculateMetrics(data);
      setResults(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [data]);

  // Debounced auto-calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCalculate();
    }, 800);
    return () => clearTimeout(timer);
  }, [data, handleCalculate]);

  const handleChange = (field: keyof CalculationRequest, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 flex items-center px-6 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">NoNA <span className="text-zinc-500 font-medium">Feasibility</span></h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded-full border border-zinc-800">v2.0 Web</span>
        </div>
      </header>

      <main className="pt-20 pb-10 px-6 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar Inputs */}
        <aside className="lg:col-span-3 space-y-8 overflow-y-auto max-h-[calc(100vh-6rem)] pr-2 scrollbar-thin scrollbar-thumb-zinc-800">

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Terreno</h2>
            <div className="space-y-3">
              <InputField
                label="Area Terreno (m²)"
                type="number"
                value={data.area_terreno}
                onChange={e => handleChange('area_terreno', parseFloat(e.target.value))}
              />
              <InputField
                label="Valor ($/m²)"
                type="number"
                value={data.valor_terreno}
                onChange={e => handleChange('valor_terreno', parseFloat(e.target.value))}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Normativa</h2>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="COS" type="number" step="0.05" value={data.COS} onChange={e => handleChange('COS', parseFloat(e.target.value))} />
              <InputField label="CUS" type="number" step="0.1" value={data.CUS} onChange={e => handleChange('CUS', parseFloat(e.target.value))} />
              <InputField label="CAS" type="number" step="0.05" value={data.CAS} onChange={e => handleChange('CAS', parseFloat(e.target.value))} />
              <InputField label="Retiros (m²)" type="number" value={data.area_retiros} onChange={e => handleChange('area_retiros', parseFloat(e.target.value))} />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Proyecto</h2>
            <InputField label="# Viviendas" type="number" value={data.n_viviendas} onChange={e => handleChange('n_viviendas', parseInt(e.target.value))} />

            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" checked={data.usos_mixtos} onChange={e => handleChange('usos_mixtos', e.target.checked)} className="accent-indigo-500" />
              <label className="text-sm text-zinc-300">Usos Mixtos</label>
            </div>

            {data.usos_mixtos && (
              <div className="pl-4 border-l-2 border-zinc-800 space-y-3">
                <InputField label="# Locales" type="number" value={data.num_locales} onChange={e => handleChange('num_locales', parseInt(e.target.value))} />
                <InputField label="Precio Local ($/m²)" type="number" value={data.costo_local_m2} onChange={e => handleChange('costo_local_m2', parseFloat(e.target.value))} />
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Estacionamiento</h2>
            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" checked={data.estacionamiento} onChange={e => handleChange('estacionamiento', e.target.checked)} className="accent-indigo-500" />
              <label className="text-sm text-zinc-300">Calcular Estacionamiento</label>
            </div>
            {data.estacionamiento && (
              <InputField label="Costo Const ($/m²)" type="number" value={data.tipo_estacionamiento} onChange={e => handleChange('tipo_estacionamiento', parseFloat(e.target.value))} />
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Financiero</h2>
            <InputField label="Costo Const ($/m²)" type="number" value={data.costoMetroConstruccion} onChange={e => handleChange('costoMetroConstruccion', parseFloat(e.target.value))} />
            <InputField label="Precio Venta ($/m²)" type="number" value={data.Costo_de_venta_m2} onChange={e => handleChange('Costo_de_venta_m2', parseFloat(e.target.value))} />
            <InputField label="Utilidad Meta (%)" type="number" value={data.utilidadDeseada} onChange={e => handleChange('utilidadDeseada', parseFloat(e.target.value))} />
          </section>

        </aside>

        {/* Dashboard Content */}
        <div className="lg:col-span-9 space-y-6">

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Utilidad Final"
              value={results?.metrics?.Text_Utilidad_Final || "0%"}
              icon={TrendingUp}
              className={results && results.raw.utilidad_optimizada < data.utilidadDeseada ? "border-red-500/50 bg-red-500/5" : "border-emerald-500/50 bg-emerald-500/5"}
            />
            <MetricCard
              label="Precio Promedio"
              value={results?.metrics?.Text_Precio_Venta_Optimizado || "$0"}
              icon={DollarSign}
            />
            <MetricCard
              label="Costo Total"
              value={results?.metrics?.Text_Costo_Total || "$0"}
              icon={Receipt}
            />
            <MetricCard
              label="Area Vendible"
              value={results ? `${results.raw.area_venta_vivienda.toFixed(0)} m²` : "0 m²"}
              subValue={`+ ${results?.raw.area_locales.toFixed(0) || 0} m² Comercial`}
              icon={LayoutDashboard}
            />
            <MetricCard
              label="Costo por Depto"
              value={results?.metrics?.Text_Costo_Por_Depto || "$0"}
              icon={DollarSign}
            />
          </div>

          {/* Detailed Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Financial Breakdown */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-500" />
                Desglose Financiero
              </h3>
              <div className="space-y-4">
                <Row label="Valor Terreno" value={results?.metrics?.Text_Valor_Terreno} />
                <Row label="Costos Directos" value={results?.metrics?.Text_Costos_Directos} />
                <Row label="Costos Indirectos" value={results?.metrics?.Text_Costos_Indirectos} />
                <div className="h-px bg-zinc-800 my-2" />
                <Row label="Ingreso Ventas" value={results?.metrics?.Text_Ingreso_Ventas_Locales} highlight />
              </div>
            </div>

            {/* Normative & Parking */}
            <div className="space-y-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-zinc-300">Normativa</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <StatBox label="COS Area" value={`${results?.raw.cos_area.toFixed(1) || 0} m²`} />
                  <StatBox label="CUS Area" value={`${results?.raw.cus_area.toFixed(1) || 0} m²`} />
                  <StatBox label="CAS Area" value={`${results?.raw.cas_area.toFixed(1) || 0} m²`} />
                </div>
              </div>

              {/* Stacking Diagram */}
              <div className="h-[400px]">
                <StackingDiagram
                  landArea={data.area_terreno}
                  cos={data.COS}
                  commercialArea={results?.raw.area_locales || 0}
                  residentialArea={results?.raw.area_venta_vivienda || 0} // Using sellable area as proxy for vol for now
                  parkingArea={results?.raw.parking_spots ? results.raw.parking_spots * 25 : 0} // Estimating 25m2 per spot (circ included)
                />
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-indigo-500" />
                  Estacionamiento
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <StatBox label="Cajones Total" value={results?.raw.parking_spots || 0} />
                  <StatBox label="Costo" value={results?.raw.parking_cost ? `$${(results.raw.parking_cost / 1000000).toFixed(1)}M` : "$0"} />
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>


      {/* --- SCENARIO MANAGEMENT UI --- */}

      {/* 1. Header Actions */}
      <div className="fixed top-4 right-6 flex gap-2 z-50">
        <button
          onClick={() => setShowLoadPanel(true)}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-medium border border-zinc-700 transition-colors"
        >
          Load / Compare
        </button>
        <button
          onClick={() => setShowSaveModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium border border-indigo-500 transition-colors shadow-lg shadow-indigo-900/20"
        >
          Save Scenario
        </button>
      </div>

      {/* 2. Save Modal */}
      {
        showSaveModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Save Scenario</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-400">Customer</label>
                  <div className="flex gap-2 mt-1">
                    <select
                      value={selectedCustomerId || ""}
                      onChange={e => setSelectedCustomerId(Number(e.target.value))}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white"
                    >
                      <option value="" disabled>Select Customer</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button
                      onClick={async () => {
                        const name = prompt("New Customer Name:");
                        if (name) {
                          const newC = await createCustomer(name);
                          setCustomers(prev => [...prev, newC]);
                          setSelectedCustomerId(newC.id);
                        }
                      }}
                      className="px-3 bg-zinc-800 rounded-md text-zinc-400 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-400">Scenario Name</label>
                  <input
                    type="text"
                    value={scenarioName}
                    onChange={e => setScenarioName(e.target.value)}
                    className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white"
                    placeholder="e.g. Option A - High Density"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancel</button>
                  <button
                    onClick={async () => {
                      if (selectedCustomerId && scenarioName) {
                        await createScenario(selectedCustomerId, scenarioName, data);
                        setShowSaveModal(false);
                        setScenarioName("");
                        alert("Scenario Saved!");
                      }
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* 3. Load / Compare Drawer (Simple Overlay) */}
      {
        showLoadPanel && (
          <div className="fixed inset-y-0 right-0 w-96 bg-zinc-900 border-l border-zinc-800 z-50 p-6 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Load Scenario</h3>
              <button onClick={() => setShowLoadPanel(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-zinc-400">Filter by Customer</label>
                <select
                  value={selectedCustomerId || ""}
                  onChange={async e => {
                    const cid = Number(e.target.value);
                    setSelectedCustomerId(cid);
                    const scens = await getScenarios(cid);
                    setScenariosList(scens);
                  }}
                  className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white"
                >
                  <option value="" disabled>Select Customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                {scenariosList.map(s => (
                  <div key={s.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-white">{s.name}</span>
                      <span className="text-xs text-indigo-400 border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                        {s.result_summary?.utilidad || "?"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setData(s.input_data);
                          setShowLoadPanel(false);
                        }}
                        className="flex-1 bg-zinc-800 text-xs py-1.5 rounded hover:bg-zinc-700 text-zinc-300"
                      >
                        Load
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        )}

    </div>
  );
}

function Row({ label, value, highlight }: { label: string, value?: string, highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className={cn("font-medium font-mono", highlight ? "text-emerald-400" : "text-zinc-200")}>
        {value || "-"}
      </span>
    </div>
  )
}

function StatBox({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800/50">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className="text-lg font-bold text-zinc-200">{value}</div>
    </div>
  )
}

function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}
