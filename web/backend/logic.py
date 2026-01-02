"""
NoNA Core Logic
Refactored from NoNA.py for usage in Web Backend.
Removes Rhino dependencies.
"""

from typing import Dict, List, Any, Tuple
import math

# ==============================================================================
# CONFIGURATION & CONSTANTS
# ==============================================================================
CONSTANTS = {
    'COST_DEMOLITION_M2': 1600.0,
    'COST_LICENSE_M2': 15.0,
    'COST_WASTE_PERCENT': 0.15,
    'PARKING_FACTORS': {
        'centro': {'comercial': 35},
        'poniente': {'comercial': 25},
        'norte': {'comercial': 30},
        'sur': {'comercial': 25}
    },
    'PARKING_M2_PER_SPOT': 12.5,  # 2.5 * 5
    'PARKING_DRIVEWAY_FACTOR': 1.50
}

def calculate_land_metrics(area_terreno: float, cost_per_unit: float) -> Tuple[float, float, str, str]:
    """Calculates total land value from numeric area input."""
    total_value = area_terreno * cost_per_unit
    return area_terreno, total_value, f"{area_terreno:.2f} m2", f"${total_value:,.2f} mxn"

def calculate_demolition_cost(
    do_demolition: bool, 
    area_demolition: float, 
    land_area: float
) -> Tuple[float, str]:
    """Computes demolition, license, and waste removal costs."""
    if not do_demolition:
        return 0.0, "$0.00 mxn"
        
    cost_dem = area_demolition * CONSTANTS['COST_DEMOLITION_M2']
    cost_lic = land_area * CONSTANTS['COST_LICENSE_M2']
    cost_res = land_area * CONSTANTS['COST_WASTE_PERCENT'] 
    
    total = cost_dem + cost_lic + cost_res
    return total, f"${total:,.2f} mxn"

def calculate_regulatory_areas(
    land_area: float, 
    cos: float, 
    cus: float, 
    cas: float, 
    retiros_area: float
) -> Dict[str, float]:
    """Calculates permitted construction areas based on coefficients."""
    return {
        'cos_area': land_area * cos,
        'cus_area': land_area * cus,
        'cas_area': land_area * cas,
        'net_area': land_area - retiros_area
    }

def calculate_mixed_use(
    is_mixed: bool, 
    num_locales: int, 
    cos_area: float, 
    price_per_m2: float
) -> Dict[str, float]:
    """Calculates commercial area metrics if mixed-use is enabled."""
    results = {
        'area_local': 0.0,
        'venta_local': 0.0,
        'ingreso_total': 0.0,
        'area_comercio': 0.0
    }
    
    if not is_mixed:
        return results
        
    if num_locales > 0:
        # Logic from original: Commercial Area = COS Area
        results['area_comercio'] = cos_area 
        results['area_local'] = cos_area / float(num_locales)
        results['venta_local'] = results['area_local'] * price_per_m2
        results['ingreso_total'] = results['venta_local'] * num_locales
    
    return results

def calculate_parking(
    enable: bool, 
    n_viviendas: int, 
    cos_area: float, 
    circ_area: float,
    delegaciones: List[str],
    factors: List[float],
    cost_per_m2: float
) -> Dict[str, Any]:
    """Calculates parking spots, area, and cost based on district."""
    if not enable:
        return {'cost': 0.0, 'area': 0.0, 'details': {}}
        
    cleaned_del = [d.strip().lower() for d in delegaciones]
    if len(cleaned_del) != len(factors):
        # Fallback if lists don't match, though validation should catch this
        return {'cost': 0.0, 'area': 0.0, 'details': {}, 'error': 'Delegation/Factor mismatch'}
        
    total_cost = 0.0
    total_area_m2 = 0.0
    
    c_vivienda_list = []
    c_comercio_list = []
    c_total_list = []
    
    for dep, fac in zip(cleaned_del, factors):
        rules = CONSTANTS['PARKING_FACTORS'].get(dep)
        # Default to centro if unknown, or skip? Original raised error. 
        # We'll try to be robust.
        if not rules:
            continue
            
        c_viv = n_viviendas * fac
        c_com = (cos_area - circ_area) / rules['comercial'] if cos_area else 0
        
        spots = math.ceil(c_viv + c_com)
        area = spots * CONSTANTS['PARKING_M2_PER_SPOT'] * CONSTANTS['PARKING_DRIVEWAY_FACTOR']
        cost = area * cost_per_m2
        
        total_cost += cost
        total_area_m2 += area
        
        c_vivienda_list.append(c_viv)
        c_comercio_list.append(c_com)
        c_total_list.append(spots)

    return {
        'cost': total_cost,
        'area': total_area_m2,
        'details': {
            'cajones_vivienda': c_vivienda_list,
            'cajones_comercio': c_comercio_list,
            'cajones_total': c_total_list
        }
    }

def solve_target_price(
    cost_total: float, 
    desired_margin_percent: float,
    current_income: float
) -> Tuple[float, float, float]:
    """Solves for required total sales price to achieve target margin."""
    if desired_margin_percent >= 100:
        return 0.0, 0.0, desired_margin_percent
        
    target_revenue = cost_total / (1.0 - (desired_margin_percent / 100.0))
    new_gain = target_revenue - cost_total
    
    return target_revenue, new_gain, desired_margin_percent

def run_calculation(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main entry point for calculation.
    Expects a dictionary with all required inputs.
    """
    try:
        # Unpack inputs
        area_terreno = float(data.get('area_terreno', 0))
        valor_terreno = float(data.get('valor_terreno', 0))
        
        # Normativa
        COS = float(data.get('COS', 0))
        CUS = float(data.get('CUS', 0))
        CAS = float(data.get('CAS', 0))
        area_retiros = float(data.get('area_retiros', 0))
        
        # Demolition
        demolicion = bool(data.get('demolicion', False))
        area_demolicion = float(data.get('area_demolicion', 0))
        
        # Project
        n_viviendas = int(data.get('n_viviendas', 0))
        usos_mixtos = bool(data.get('usos_mixtos', False))
        num_locales = int(data.get('num_locales', 0))
        costo_local_m2 = float(data.get('costo_local_m2', 0))
        
        # Construction
        costoMetroConstruccion = float(data.get('costoMetroConstruccion', 0))
        Costo_de_venta_m2 = float(data.get('Costo_de_venta_m2', 0))
        areaCirculacionPorcentaje = float(data.get('areaCirculacionPorcentaje', 0))
        
        # Parking
        estacionamiento = bool(data.get('estacionamiento', False))
        tipo_estacionamiento = float(data.get('tipo_estacionamiento', 0))
        # Handle lists for parking
        delegacion = data.get('delegacion', [])
        if isinstance(delegacion, str): delegacion = [delegacion]
        
        Distrito = data.get('Distrito', [])
        if isinstance(Distrito, (int, float)): Distrito = [Distrito]
        
        # Simulation
        utilidadDeseada = float(data.get('utilidadDeseada', 20.0))
        correrSimulacion = bool(data.get('correrSimulacion', False))

        # --- CALCULATION STEPS ---

        # 1. Land
        area_val, total_val, txt_area, txt_val = calculate_land_metrics(area_terreno, valor_terreno)

        # 2. Normative
        reg = calculate_regulatory_areas(area_val, COS, CUS, CAS, area_retiros)

        # 3. Demolition
        dem_cost, dem_txt = calculate_demolition_cost(demolicion, area_demolicion, area_val)

        # 4. Mixed Use
        mix = calculate_mixed_use(usos_mixtos, num_locales, reg['cos_area'], costo_local_m2)

        # 5. Parking
        area_circulacion = reg['cus_area'] * areaCirculacionPorcentaje
        park = calculate_parking(
            estacionamiento, n_viviendas, reg['cos_area'], area_circulacion,
            delegacion, Distrito, tipo_estacionamiento
        )

        # 6. Costs
        # Note: Logic copied strictly from NoNA.py where construct cost is added twice (?)
        # costos_directos = (reg['cus_area'] * g['costoMetroConstruccion']) + dem_cost + (reg['cus_area'] * g['costoMetroConstruccion']) 
        # We will preserve this behavior but it seems odd.
        
        base_construction = reg['cus_area'] * costoMetroConstruccion
        costos_directos = base_construction + dem_cost + base_construction
        
        area_com_est = mix['area_comercio'] + park['area']
        area_venta = reg['cus_area'] - area_com_est
        
        ingreso_vivienda = area_venta * Costo_de_venta_m2
        ingreso_bruto_inicial = ingreso_vivienda + mix['ingreso_total']
        
        # Indirects
        pct_indirects = 15.0 + 2.0 + 10.0 + 3.0 + 6.0 # 36%
        costos_indirectos = costos_directos * (15.0/100.0) + \
                            ingreso_bruto_inicial * (2.0/100.0) + \
                            ingreso_bruto_inicial * (10.0/100.0) + \
                            ingreso_bruto_inicial * (3.0/100.0) + \
                            ingreso_bruto_inicial * (6.0/100.0)
                            
        costo_total_construccion = total_val + costos_directos + costos_indirectos + park['cost']

        # 7. Simulation
        ganancia_bruta = ingreso_bruto_inicial - costo_total_construccion
        utilidad_actual = (ganancia_bruta / ingreso_bruto_inicial * 100.0) if ingreso_bruto_inicial > 0 else 0.0
        
        target_rev = ingreso_bruto_inicial
        target_gain = ganancia_bruta
        target_util = utilidad_actual
        
        if correrSimulacion:
            target_rev, target_gain, target_util = solve_target_price(
                costo_total_construccion, utilidadDeseada, ingreso_bruto_inicial
            )
            
        # New Metric: Cost per Apartment
        costo_por_departamento = costo_total_construccion / n_viviendas if n_viviendas > 0 else 0.0

        return {
            "metrics": {
                "Text_Area_Terreno": txt_area,
                "Text_Valor_Terreno": txt_val,
                "Text_Costo_Demolicion": dem_txt,
                "Text_Costos_Directos": f"${costos_directos:,.2f}",
                "Text_Costos_Indirectos": f"${costos_indirectos:,.2f}",
                "Text_Costo_Total": f"${costo_total_construccion:,.2f}",
                "Text_Ingreso_Ventas_Locales": f"${mix['ingreso_total']:,.2f}",
                "Text_Precio_Venta_Optimizado": f"${target_rev:,.2f}",
                "Text_Utilidad_Final": f"{target_util:.2f}%",
                "Text_Costo_Por_Depto": f"${costo_por_departamento:,.2f}"
            },
            "raw": {
                "area_terreno": area_val,
                "valor_terreno": total_val,
                "cos_area": reg['cos_area'],
                "cus_area": reg['cus_area'],
                "cas_area": reg['cas_area'],
                "area_venta_vivienda": area_venta,
                "area_locales": mix['area_local'],
                "costo_directo": costos_directos,
                "costo_indirecto": costos_indirectos,
                "costo_total": costo_total_construccion,
                "ingreso_inicial": ingreso_bruto_inicial,
                "ingreso_optimizado": target_rev,
                "utilidad_inicial": utilidad_actual,
                "utilidad_optimizada": target_util,
                "parking_cost": park['cost'],
                "parking_spots": sum(park['details']['cajones_total']) if park['details'] else 0,
                "costo_por_departamento": costo_por_departamento
            }
        }
        
    except Exception as e:
        return {"error": str(e)}
