
import { useState, useCallback, useEffect } from "react";
import { CalculationRequest, calculateMetrics } from "@/lib/api";

const DEFAULT_DATA: CalculationRequest = {
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
    correrSimulacion: true,
    segmento: "Interés Medio",
    iva_percent: 0.16
};

export function useCalculator() {
    const [data, setData] = useState<CalculationRequest>(DEFAULT_DATA);
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const calculate = useCallback(async (payload: CalculationRequest) => {
        setLoading(true);
        setError("");
        try {
            const res = await calculateMetrics(payload);
            setResults(res);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            calculate(data);
        }, 800);
        return () => clearTimeout(timer);
    }, [data, calculate]);

    const handleChange = (field: keyof CalculationRequest, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    return {
        data,
        results,
        loading,
        error,
        handleChange,
        setData // Exposed for scenario loading
    };
}
