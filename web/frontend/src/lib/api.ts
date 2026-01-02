const API_URL = 'http://localhost:8000';

export type CalculationRequest = {
    area_terreno: number;
    valor_terreno: number;
    COS: number;
    CUS: number;
    CAS: number;
    area_retiros?: number;
    demolicion: boolean;
    area_demolicion?: number;
    n_viviendas: number;
    usos_mixtos: boolean;
    num_locales?: number;
    costo_local_m2?: number;
    costoMetroConstruccion: number;
    Costo_de_venta_m2: number;
    areaCirculacionPorcentaje: number;
    estacionamiento: boolean;
    tipo_estacionamiento?: number;
    delegacion: string[];
    Distrito: number[];
    utilidadDeseada: number;
    correrSimulacion: boolean;
};

export async function calculateMetrics(data: CalculationRequest) {
    const res = await fetch(`${API_URL}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Calculation failed');
    }

    return res.json();
}

export type Customer = {
    id: number;
    name: string;
};

export type Scenario = {
    id: number;
    name: string;
    customer_id: number;
    input_data: CalculationRequest;
    result_summary: any;
};

export async function getCustomers(): Promise<Customer[]> {
    const res = await fetch(`${API_URL}/customers`);
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
}

export async function createCustomer(name: string): Promise<Customer> {
    const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to create customer');
    return res.json();
}

export async function createScenario(customerId: number, name: string, data: CalculationRequest): Promise<Scenario> {
    const res = await fetch(`${API_URL}/scenarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, name, input_data: data }),
    });
    if (!res.ok) throw new Error('Failed to save scenario');
    return res.json();
}

export async function getScenarios(customerId: number): Promise<Scenario[]> {
    const res = await fetch(`${API_URL}/customers/${customerId}/scenarios`);
    if (!res.ok) throw new Error('Failed to fetch scenarios');
    return res.json();
}
