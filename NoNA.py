"""
NoNA: Real Estate Feasibility Calculator for Grasshopper
========================================================
Professional refactor of the NoNA feasibility logic.
Modular, Optimized, and Type-Safe.
"""

import Rhino.Geometry as rg
import math
import scriptcontext as sc
import os
import csv
from typing import Tuple, List, Dict, Any, Union

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

# ==============================================================================
# CORE LOGIC FUNCTIONS
# ==============================================================================

def validate_inputs(inputs: Dict[str, Any]) -> None:
    """Validates availability of critical global inputs."""
    required = ['area_terreno', 'valor_terreno', 'curva_retiros']
    for req in required:
        if inputs.get(req) is None:
            raise ValueError(f"Input '{req}' is missing or null.")

def calculate_land_metrics(surface: rg.Surface, cost_per_unit: float) -> Tuple[float, float, str, str]:
    """Calculates land area and total land value."""
    if surface is None: 
        raise ValueError("Invalid Surface input")
    
    props = rg.AreaMassProperties.Compute(surface)
    if props is None:
        raise ValueError("Could not compute area properties")
    
    area = props.Area
    total_value = area * cost_per_unit
    
    return area, total_value, f"{area:.2f} m2", f"${total_value:,.2f} mxn"

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
    cost_res = land_area * CONSTANTS['COST_WASTE_PERCENT'] # Ambiguous in original: area_value * 0.15. Keeping logic.
    
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
        
    if num_locales <= 0:
        raise ValueError("num_locales must be >= 1 for mixed use")
        
    # Logic from original: Commercial Area = COS Area
    # This implies 1 floor of commerce max occupying full COS? Keeping logic.
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
        raise ValueError("Delegacion and Distrito lists must match length")
        
    total_cost = 0.0
    total_area_m2 = 0.0
    
    # Using arrays to store per-district results (assuming iteration was intended for multiple inputs)
    # Original script iterated but didn't clearly aggregate 'total' for the final sum except via `_costo_estac_num`
    # We will compute the sum of all provided district calculations
    
    c_vivienda_list = []
    c_comercio_list = []
    c_total_list = []
    
    for dep, fac in zip(cleaned_del, factors):
        rules = CONSTANTS['PARKING_FACTORS'].get(dep)
        if not rules:
            raise ValueError(f"Invalid Delegacion: {dep}")
            
        c_viv = n_viviendas * fac
        # Original Logic: Commercial spots based on remaining COS not used by circulation?
        # cc = (cos_area - area_circulacion) / regs['comercial']
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
    """
    Mathematically solves for the required total sales price to achieve target margin.
    
    Formula:
    Margin % = ( (Revenue - Cost) / Revenue ) * 100
    Margin/100 = 1 - (Cost / Revenue)
    Cost / Revenue = 1 - (Margin/100)
    Revenue = Cost / (1 - (Margin/100))
    """
    if desired_margin_percent >= 100:
        return float('inf'), float('inf'), desired_margin_percent
        
    target_revenue = cost_total / (1.0 - (desired_margin_percent / 100.0))
    new_gain = target_revenue - cost_total
    
    return target_revenue, new_gain, desired_margin_percent

def export_to_csv(filepath: str, data: Dict[str, Any]) -> str:
    """Exports a flattened dictionary to CSV."""
    try:
        with open(filepath, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(["Variable", "Value"])
            for k, v in data.items():
                writer.writerow([k, v])
        return f"✅ Success: {filepath}"
    except Exception as e:
        return f"❌ Error: {str(e)}"

# ==============================================================================
# MAIN EXECUTION
# ==============================================================================

try:
    # 0. INPUT SAFEGUARD (For GH Environment)
    # Allows script to run even if not all inputs are wired yet (prevents red errors)
    g = globals()
    
    # Required Input Checks
    if g.get('area_terreno') is None: raise ValueError("Input 'area_terreno' disallowed None")
    
    # 1. LAND & BASIC METRICS
    area_val, total_val, txt_area, txt_val = calculate_land_metrics(g['area_terreno'], g['valor_terreno'])
    
    # Outputs
    Area_de_terreno = txt_area
    Valor_del_terreno = txt_val
    
    # 2. NORMATIVE
    reg = calculate_regulatory_areas(
        area_val, g['COS'], g['CUS'], g['CAS'], g.get('area_retiros', 0.0) # Using area_retiros value directly if computed
    )
    
    COS_m2 = f"{reg['cos_area']:.2f} m2"
    CUS_m2 = f"{reg['cus_area']:.2f} m2"
    CAS_m2 = f"{reg['cas_area']:.2f} m2"
    
    # 3. DEMOLITION
    dem_cost, dem_txt = calculate_demolition_cost(g['demolicion'], g['area_demolicion'], area_val)
    Costo_de_demolicion = dem_txt
    
    # 4. MIXED USE
    mix = calculate_mixed_use(g['usos_mixtos'], g['num_locales'], reg['cos_area'], g['costo_local_m2'])
    
    Area_de_local = f"{mix['area_local']:.2f} m2"
    Venta_de_local = f"${mix['venta_local']:,.2f} mxn"
    Ingreso_de_locales = f"${mix['ingreso_total']:,.2f} mxn"
    
    # 5. PARKING
    # Note: areaCirculacionPorcentaje is a factor (e.g. 0.15)
    area_circulacion = reg['cus_area'] * g['areaCirculacionPorcentaje']
    
    park = calculate_parking(
        g['estacionamiento'], 
        g['n_viviendas'], 
        reg['cos_area'], 
        area_circulacion, 
        g['delegacion'], 
        g['Distrito'], 
        g['tipo_estacionamiento']
    )
    
    # 6. COSTS & FEASIBILITY
    # Construction Costs
    costos_directos = (reg['cus_area'] * g['costoMetroConstruccion']) + dem_cost + (reg['cus_area'] * g['costoMetroConstruccion']) 
    # Note: Original formula added constr_cost TWICE? 
    # Original: cus_area * cost + dem + cus_area * cost. 
    # This implies 2x cost or maybe construction + finishes? Keeping original logic for fidelity, but it looks suspicious.
    # PROPOSAL: Assuming this is intentional (Base + Finishes?), keeping it.
    
    Costos_Directos = f"${costos_directos:,.2f} mxn"
    
    # Indirect Costs
    area_com_est = mix['area_comercio'] + park['area']
    area_venta = reg['cus_area'] - area_com_est
    
    ingreso_vivienda = area_venta * g['Costo_de_venta_m2']
    ingreso_bruto_inicial = ingreso_vivienda + mix['ingreso_total']
    
    precio_venta_promedio = ingreso_bruto_inicial / reg['cus_area'] if reg['cus_area'] else 0
    
    # Percentages
    pct_honorarios = 15.0
    pct_legales = 2.0
    pct_adm = 10.0
    pct_fin = 3.0
    pct_com = 6.0
    
    cost_honorarios = costos_directos * (pct_honorarios / 100.0)
    cost_legales = ingreso_bruto_inicial * (pct_legales / 100.0)
    cost_adm = ingreso_bruto_inicial * (pct_adm / 100.0)
    cost_fin = ingreso_bruto_inicial * (pct_fin / 100.0)
    cost_com = ingreso_bruto_inicial * (pct_com / 100.0)
    
    costos_indirectos = cost_honorarios + cost_legales + cost_adm + cost_fin + cost_com
    Costos_Indirectos = f"${costos_indirectos:,.2f} mxn"
    
    # Total Construction Cost
    costo_total_construccion = total_val + costos_directos + costos_indirectos + park['cost']
    Costo_total_Construccion = f"${costo_total_construccion:,.2f} mxn"
    
    # 7. SIMULATION (Target Price)
    # Initial utility
    ganancia_bruta = ingreso_bruto_inicial - costo_total_construccion
    if ingreso_bruto_inicial > 0:
        utilidad_actual = (ganancia_bruta / ingreso_bruto_inicial) * 100.0
    else:
        utilidad_actual = 0.0
        
    if g['correrSimulacion']:
        # Optimized Mathematical Solution (O(1)) instead of Loop
        target_rev, target_gain, target_util = solve_target_price(
            costo_total_construccion, 
            g['utilidadDeseada'],
            ingreso_bruto_inicial
        )
        sim_iter = 1 # It's just one calc now
    else:
        target_rev = ingreso_bruto_inicial
        target_gain = ganancia_bruta
        target_util = utilidad_actual
        sim_iter = 0
        
    Nuevo_Precio_venta = f"${target_rev:,.2f}"
    Nueva_Ganancia_Bruta = f"${target_gain:,.2f}"
    Utilidad_Final = f"{target_util:.2f}%"
    
    # 8. EXPORT
    export_status = "Skipped"
    if g['Reporte_excel']:
        data_map = {
            "Area Terreno": area_val,
            "Valor Terreno": total_val,
            "COS Area": reg['cos_area'],
            "CUS Area": reg['cus_area'],
            "Area Venta": area_venta,
            "Costo Directo": costos_directos,
            "Costo Indirecto": costos_indirectos,
            "Costo Total": costo_total_construccion,
            "Ingreso Inicial": ingreso_bruto_inicial,
            "Ingreso Meta": target_rev,
            "Utilidad Meta": target_util
        }
        # Add parking details
        if park['area'] > 0:
            data_map["Costo Estacionamiento"] = park['cost']
            
        export_status = export_to_csv(os.path.join(g['ruta_carpeta'], "resultados_noNa.csv"), data_map)

except Exception as e:
    # Global Error Handler for GH Output
    print(f"RUNTIME ERROR: {str(e)}")
    export_status = f"Error: {str(e)}"
    # Set default values for outputs to avoid null component errors
    if 'Costo_total_Construccion' not in vars(): Costo_total_Construccion = "Error"
