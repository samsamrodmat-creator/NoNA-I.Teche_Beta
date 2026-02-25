"use client";

import { useState, useEffect, useRef } from "react";
import { MetricCard } from "@/components/MetricCard";
import { InputField } from "@/components/InputField";
import { SelectField } from "@/components/SelectField";
import { SEGMENT_TYPES, PARKING_TYPES } from "@/lib/constants";
// import { StackingDiagram } from "@/components/StackingDiagram";
import { SettingsModal } from "@/components/SettingsModal";
import { FinancialAnalysis } from "@/components/FinancialAnalysis";
import { ProjectReport } from "@/components/ProjectReport";
import { FormulaReport } from "@/components/FormulaReport";
import { Toast, ToastType } from "@/components/ui/Toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCalculator } from "@/hooks/useCalculator";
import {
  getCustomers,
  createCustomer,
  createScenario,
  getScenarios,
  exportCSV,
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
  Receipt,
  Settings,
  Save,
  FolderOpen,
  Download,
  FileText,
  BookOpen,
  Maximize
} from "lucide-react";
import dynamic from 'next/dynamic';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  loading: () => <div className="h-[300px] w-full bg-zinc-900 animate-pulse rounded-lg" />,
  ssr: false
});

const VisualPlanner = dynamic(() => import('@/components/VisualPlanner').then(mod => mod.VisualPlanner), {
  ssr: false
});

export default function Home() {
  const { data, results, error: calcError, handleChange, setData } = useCalculator();

  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [showVisualPlanner, setShowVisualPlanner] = useState(false);
  const [toast, setToast] = useState<{ msg: string, type: ToastType, visible: boolean }>({ msg: "", type: "info", visible: false });

  // Scenario State
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadPanel, setShowLoadPanel] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [scenariosList, setScenariosList] = useState<Scenario[]>([]);
  const [scenarioName, setScenarioName] = useState("");

  // Load Customers
  useEffect(() => {
    getCustomers().then(setCustomers).catch(e => showToast("Failed to load customers", "error"));
  }, []);

  const showToast = (msg: string, type: ToastType = "success") => {
    setToast({ msg, type, visible: true });
  };

  const exportPDF = async () => {
    // Use the new Project Report component
    const element = document.getElementById('project-report');
    if (!element) return;

    // Temporarily show
    element.style.display = 'block';

    try {
      showToast("Generating Executive Report...", "info");

      const dataUrl = await toPng(element, {
        backgroundColor: '#ffffff',
        cacheBust: true,
        pixelRatio: 2 // High quality
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise(resolve => img.onload = resolve);

      // Calculate aspect ratio for A4 Landscape approx
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [img.width, img.height] // Match image size exactly for crispness
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
      pdf.save(`NoNA_Executive_${data.project_name || 'Project'}_${new Date().toISOString().slice(0, 10)}.pdf`);

      showToast("Report Exported");

    } catch (e) {
      console.error(e);
      showToast("Failed to generate report", "error");
    } finally {
      element.style.display = 'none';
    }
  };

  const exportFormulasPDF = async () => {
    const element = document.getElementById('formula-report');
    if (!element) return;

    // Temporarily show it
    element.style.display = 'block';

    try {
      showToast("Generating Formula Report...", "info");

      const dataUrl = await toPng(element, {
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise(resolve => img.onload = resolve);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [img.width, img.height]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
      pdf.save(`NoNA_Formulas_${new Date().toISOString().slice(0, 10)}.pdf`);

      showToast("Formulas Downloaded");

    } catch (e) {
      console.error(e);
      showToast("Failed to export Formulas", "error");
    } finally {
      element.style.display = 'none'; // Hide again
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30 relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col">
        <Toast
          message={toast.msg}
          type={toast.type}
          isVisible={toast.visible}
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        />

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSaveSuccess={() => {
            showToast("Settings Updated & Saved");
          }}
        />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/60 backdrop-blur-md border-b border-white/40 flex items-center px-6 z-40 transition-colors duration-300 shadow-sm">
          <div className="flex items-center gap-1 select-none">
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 drop-shadow-sm">
              NoNA
            </h1>
            <span className="text-[10px] font-bold tracking-[0.2em] text-blue-600/80 uppercase mt-2 ml-1">
              I.Tech
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              title="Global Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-zinc-800 mx-1" />
            <button
              onClick={() => setShowLoadPanel(true)}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            >
              <FolderOpen className="w-4 h-4" /> Load
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg shadow-indigo-900/20 transition-all"
            >
              <Save className="w-4 h-4" /> Save
            </button>
            <div className="h-6 w-px bg-zinc-800 mx-1" />
            <button
              onClick={async () => {
                try {
                  await exportCSV(data);
                  showToast("CSV Exported Successfully");
                } catch (e) {
                  showToast("Failed to export CSV", "error");
                }
              }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg shadow-emerald-900/20 transition-all"
              title="Export to CSV (Excel/Numbers)"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg shadow-red-900/20 transition-all"
              title="Export to PDF"
            >
              <FileText className="w-4 h-4" /> Reports
            </button>

            {/* Hidden Actions Menu for Reports? Simplified: Just add another button for Formulas if space permits or combine */}
            <button
              onClick={exportFormulasPDF}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              title="Download Methodology"
            >
              <BookOpen className="w-4 h-4" /> Formulas
            </button>
          </div>
        </header>

        <main className="pt-24 pb-10 px-6 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

          {/* Sidebar Inputs */}
          <aside className="lg:col-span-3 space-y-8 overflow-y-auto max-h-[calc(100vh-8rem)] pr-4 scrollbar-thin scrollbar-thumb-slate-300 bg-white/60 backdrop-blur-md border border-white/40 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all">

            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Proyecto</h2>
              <div className="space-y-3">
                <InputField
                  label="Nombre del Proyecto"
                  type="text"
                  value={data.project_name || ""}
                  onChange={e => handleChange('project_name', e.target.value)}
                />
                <div className="pt-2">
                  <label className="text-xs text-zinc-400 mb-1 block">Ubicación</label>
                  <LocationPicker
                    lat={data.lat || 19.4326}
                    lng={data.lng || -99.1332}
                    onLocationSelect={(lat, lng, addr) => {
                      handleChange('lat', lat);
                      handleChange('lng', lng);
                      if (addr) handleChange('address', addr);
                    }}
                  />
                  {data.address && (
                    <p className="text-xs text-zinc-500 mt-2 italic px-1">{data.address}</p>
                  )}
                </div>

                {/* Visual Planner Button */}
                <button
                  onClick={() => setShowVisualPlanner(true)}
                  className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2 px-4 rounded-lg text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Planificador Visual
                </button>

              </div>
            </section>

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
                <input type="checkbox" checked={data.usos_mixtos} onChange={e => handleChange('usos_mixtos', e.target.checked)} className="accent-indigo-600 w-4 h-4 rounded border-black/50 dark:border-zinc-700 bg-white dark:bg-zinc-900" />
                <label className="text-sm text-black dark:text-zinc-300 select-none">Usos Mixtos</label>
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
                <input type="checkbox" checked={data.estacionamiento} onChange={e => handleChange('estacionamiento', e.target.checked)} className="accent-indigo-600 w-4 h-4 rounded border-black/50 dark:border-zinc-700 bg-white dark:bg-zinc-900" />
                <label className="text-sm text-black dark:text-zinc-300 select-none">Calcular Estacionamiento</label>
              </div>
              {data.estacionamiento && (
                <div className="space-y-3">
                  <SelectField
                    label="Tipo de Estacionamiento"
                    value={data.tipo_estacionamiento || 5500}
                    onChange={(e) => handleChange('tipo_estacionamiento', parseFloat(e.target.value))}
                    options={PARKING_TYPES.map(p => ({ label: p.label, value: p.cost }))}
                  />

                  <InputField
                    label="Cajones / Vivienda"
                    type="number"
                    step="0.1"
                    value={data.Distrito?.[0] || 1.0}
                    onChange={e => handleChange('Distrito', [parseFloat(e.target.value)])}
                  />

                  <p className="text-xs text-zinc-500 text-right">Costo: ${data.tipo_estacionamiento}/m²</p>
                </div>
              )}
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Financiero</h2>

              <SelectField
                label="Segmento / Nivel"
                value={data.segmento || "Interés Medio"}
                onChange={(e) => {
                  const seg = SEGMENT_TYPES.find(s => s.label === e.target.value);
                  if (seg) {
                    handleChange('segmento', seg.label);
                    handleChange('costoMetroConstruccion', seg.cost);
                    handleChange('areaCirculacionPorcentaje', seg.circ);
                  }
                }}
                options={SEGMENT_TYPES.map(s => ({ label: s.label, value: s.label }))}
              />

              <InputField label="Costo Const ($/m²)" type="number" value={data.costoMetroConstruccion} onChange={e => handleChange('costoMetroConstruccion', parseFloat(e.target.value))} />
              <InputField
                label="% Circulación (0-1)"
                type="number"
                step="0.01"
                value={data.areaCirculacionPorcentaje}
                onChange={e => handleChange('areaCirculacionPorcentaje', parseFloat(e.target.value))}
              />

              <InputField label="Precio Venta ($/m²)" type="number" value={data.Costo_de_venta_m2} onChange={e => handleChange('Costo_de_venta_m2', parseFloat(e.target.value))} />
              <InputField label="Utilidad Meta (%)" type="number" value={data.utilidadDeseada} onChange={e => handleChange('utilidadDeseada', parseFloat(e.target.value))} />

              <InputField
                label="IVA (%)"
                type="number"
                step="0.01"
                value={data.iva_percent || 0.16}
                onChange={e => handleChange('iva_percent', parseFloat(e.target.value))}
              />
            </section>

          </aside>

          {/* Dashboard Content */}
          <div id="dashboard-content" className="lg:col-span-9 space-y-6">

            {calcError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {calcError}
              </div>
            )}

            {/* Top KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              <MetricCard
                label="Utilidad Final"
                value={results?.metrics?.Text_Utilidad_Final || "0%"}
                icon={TrendingUp}
                className={results && results.raw.utilidad_optimizada < data.utilidadDeseada ? "border-red-500/50 bg-red-500/5" : "border-emerald-500/50 bg-emerald-500/5"}
              />
              <MetricCard
                label="Costo por construcción de departamento"
                value={results?.metrics?.Text_Costo_Por_Depto || "$0"}
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
                label="Precio por departamento"
                value={results?.metrics?.Text_Precio_Promedio_Vivienda || "$0"}
                icon={DollarSign}
              />
              <MetricCard
                label="M2 por departamento"
                value={results?.metrics?.Text_Area_Promedio_Vivienda || "0 m²"}
                icon={Maximize}
              />
            </div>

            {/* New Financial Analysis Section */}
            {results && !results.error && (
              <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
                <FinancialAnalysis data={results} />
              </div>
            )}

            {/* Detailed Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Financial Breakdown */}
              <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-2xl p-6 transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 tracking-tight">
                  <Calculator className="w-5 h-5 text-blue-500" />
                  Desglose Financiero
                </h3>

                <div className="space-y-6">

                  {/* 1. COSTOS / INVERSION */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500 mb-2 border-b border-zinc-200 pb-1">Inversión (Costos)</h4>
                    <Row label="Valor Terreno" value={results?.metrics?.Text_Valor_Terreno} />

                    <Row label="Costos Directos" value={results?.metrics?.Text_Costos_Directos} />
                    <div className="pl-4 space-y-1 border-l-2 border-zinc-200 dark:border-zinc-800 ml-2 py-1">
                      <RowSmallPage label="Obra Civil" value={`$${(results?.raw?.base_construction || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                      {/* Demolition Detail */}
                      <div className="group">
                        <RowSmallPage label="Demolición y Preliminares" value={`$${(results?.raw?.total_dem_cost || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                        {(results?.raw?.total_dem_cost > 0) && (
                          <div className="pl-4 text-[10px] text-zinc-400 space-y-0.5 mt-0.5">
                            <RowSmallPage label="- Demolición" value={`$${(results?.raw?.dem_cost_only || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                            <RowSmallPage label="- Licencias" value={`$${(results?.raw?.lic_cost || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                            <RowSmallPage label="- Residuos" value={`$${(results?.raw?.res_cost || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                          </div>
                        )}
                      </div>
                      <RowSmallPage label="Estacionamiento" value={`$${(results?.raw?.parking_cost || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                    </div>

                    <Row label="Costos Indirectos" value={results?.metrics?.Text_Costos_Indirectos} />
                    <div className="pl-4 space-y-1 border-l-2 border-zinc-200 dark:border-zinc-800 ml-2 py-1">
                      <RowSmallPage label="Honorarios" value={`$${(results?.raw?.costos_indirectos_desglose?.honorarios || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                      <RowSmallPage label="Legales" value={`$${(results?.raw?.costos_indirectos_desglose?.legales || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                      <RowSmallPage label="Administrativos" value={`$${(results?.raw?.costos_indirectos_desglose?.administrativos || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                      <RowSmallPage label="Financieros" value={`$${(results?.raw?.costos_indirectos_desglose?.financieros || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                      <RowSmallPage label="Comerciales" value={`$${(results?.raw?.costos_indirectos_desglose?.comerciales || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                    </div>

                    <Row label="IVA (16%)" value={results?.metrics?.Text_Monto_IVA} />
                    <div className="h-px bg-zinc-300 dark:bg-zinc-700 my-1" />
                    <Row label="INVERSIÓN TOTAL" value={results?.metrics?.Text_Costo_Total} highlightColor="text-black dark:text-white font-bold" />
                  </div>

                  {/* 2. INGRESOS */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500 mb-2 border-b border-zinc-200 pb-1">Beneficios (Ingresos)</h4>

                    <Row label="Venta de Locales" value={results?.metrics?.Text_Ingreso_Locales || "$0.00"} />
                    <Row label="Venta de Vivienda" value={results?.metrics?.Text_Ingreso_Vivienda || "$0.00"} />

                    <div className="h-px bg-zinc-300 dark:bg-zinc-700 my-1" />
                    <Row label="INGRESO TOTAL" value={results?.metrics?.Text_Ingreso_Total_Optimizado} highlightColor="text-indigo-600 dark:text-indigo-400 font-bold" />
                  </div>

                  {/* 3. UTILIDAD */}
                  <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Ganancia Bruta</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        ${((results?.raw?.ingreso_optimizado || 0) - (results?.raw?.costo_total || 0)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-zinc-500">
                      <span>Margen de Utilidad</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        {results?.metrics?.Text_Utilidad_Final || "0%"}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Normative & Parking */}
              <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-2xl p-6 transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
                  <h3 className="text-lg font-bold mb-4 text-slate-900 tracking-tight">Normativa</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <StatBox label="COS Area" value={`${results?.raw.cos_area.toFixed(1) || 0} m²`} />
                    <StatBox label="CUS Area" value={`${results?.raw.cus_area.toFixed(1) || 0} m²`} />
                    <StatBox label="CAS Area" value={`${results?.raw.cas_area.toFixed(1) || 0} m²`} />
                  </div>
                </div>

                {/* Stacking Diagram 
              <div className="h-[400px]">
                <StackingDiagram
                  landArea={data.area_terreno}
                  cos={data.COS}
                  commercialArea={results?.raw.area_locales || 0}
                  residentialArea={results?.raw.area_venta_vivienda || 0}
                  parkingArea={results?.raw.parking_spots ? results.raw.parking_spots * 25 : 0}
                />
              </div>
              */}

                <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-2xl p-6 transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 tracking-tight">
                    <Car className="w-5 h-5 text-blue-500" />
                    Estacionamiento
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <StatBox label="Cajones Vivienda" value={results?.metrics?.Text_Cajones_Vivienda || 0} />
                    <StatBox label="Cajones Comercio" value={results?.metrics?.Text_Cajones_Comercio || 0} />
                    <StatBox label="Total Cajones" value={results?.metrics?.Text_Cajones_Total || 0} />
                    <StatBox label="Costo Total" value={results?.raw.parking_cost ? `$${(results.raw.parking_cost / 1000000).toFixed(1)}M` : "$0"} />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </main >

        {/* Hidden Formula Report Template */}
        <div className="fixed top-0 left-0 pointer-events-none opacity-0">
          <ProjectReport data={data} results={results} />
          <FormulaReport data={data} results={results} />
        </div>


        {/* --- SCENARIO MANAGEMENT UI --- */}
        {/* Save Modal */}
        {
          showSaveModal && (
            <div className="fixed inset-0 bg-white/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 w-full max-w-md shadow-[0_30px_60px_rgba(0,0,0,0.1)]">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Save Scenario</h3>
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
                            try {
                              const newC = await createCustomer(name);
                              setCustomers(prev => [...prev, newC]);
                              setSelectedCustomerId(newC.id);
                              showToast("Customer created");
                            } catch (e) { showToast("Failed to create customer", "error"); }
                          }
                        }}
                        className="px-3 bg-zinc-800 rounded-md text-zinc-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-400">Scenario Name</label>
                    <input
                      type="text"
                      value={scenarioName}
                      onChange={e => setScenarioName(e.target.value)}
                      className="w-full mt-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                      placeholder="e.g. Option A - High Density"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancel</button>
                    <button
                      onClick={async () => {
                        if (selectedCustomerId && scenarioName) {
                          try {
                            await createScenario(selectedCustomerId, scenarioName, data);
                            setShowSaveModal(false);
                            setScenarioName("");
                            showToast("Scenario Saved Successfully");
                          } catch (e) {
                            showToast("Failed to save scenario", "error");
                          }
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

        {/* Load Drawer */}
        {
          showLoadPanel && (
            <div className="fixed inset-y-0 right-0 w-96 bg-white/80 backdrop-blur-xl border-l border-white/60 z-50 p-6 shadow-[0_0_50px_rgba(0,0,0,0.1)] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Load Scenario</h3>
                <button onClick={() => setShowLoadPanel(false)} className="text-slate-400 hover:text-slate-900 transition-colors">✕</button>
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
                    <div key={s.id} className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-zinc-900 dark:text-white">{s.name}</span>
                        <span className="text-xs text-indigo-400 border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                          {s.result_summary?.utilidad || "?"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setData(s.input_data);
                            setShowLoadPanel(false);
                            showToast(`Loaded: ${s.name}`);
                          }}
                          className="flex-1 bg-zinc-800 text-xs py-1.5 rounded hover:bg-zinc-700 text-zinc-300 transition-colors"
                        >
                          Load
                        </button>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          )
        }

        {/* Visual Planner Modal */}
        {showVisualPlanner && (
          <VisualPlanner
            initialLat={data.lat || 19.4326}
            initialLng={data.lng || -99.1332}
            onClose={() => setShowVisualPlanner(false)}
            onSave={(measures) => {
              if (measures.area_terreno) handleChange('area_terreno', measures.area_terreno);

              // Calculate COS based on footprint
              if (measures.cos_footprint && measures.area_terreno) {
                const calculatedCOS = measures.cos_footprint / measures.area_terreno;
                // Cap at 1.0 or keep exact? Usually helpful to update field
                handleChange('COS', Number(calculatedCOS.toFixed(2)));
              } else if (measures.cos_footprint && data.area_terreno) {
                const calculatedCOS = measures.cos_footprint / data.area_terreno;
                handleChange('COS', Number(calculatedCOS.toFixed(2)));
              }

              showToast("Medidas aplicadas desde el mapa planificador");
            }}
          />
        )}

      </div>
    </div >
  );
}

function Row({ label, value, highlight, highlightColor }: { label: string, value?: string, highlight?: boolean, highlightColor?: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-black dark:text-zinc-400 font-medium">{label}</span>
      <span className={highlightColor ? `font-bold font-mono ${highlightColor}` : highlight ? "font-bold font-mono text-indigo-700 dark:text-indigo-400" : "font-bold font-mono text-black dark:text-zinc-200"}>
        {value || "-"}
      </span>
    </div>
  )
}

function StatBox({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-white dark:bg-zinc-950 rounded-lg p-3 border border-black dark:border-zinc-800/50">
      <div className="text-xs text-black/70 dark:text-zinc-500 mb-1 font-semibold">{label}</div>
      <div className="text-lg font-bold text-black dark:text-zinc-200">{value}</div>
    </div>
  )
}

function RowSmallPage({ label, value }: { label: string, value: string }) {
  if (!value || value === "$0" || value === "0") return null;
  return (
    <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
      <span>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  )
}

