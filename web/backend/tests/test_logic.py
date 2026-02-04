import pytest
from logic import (
    calculate_land_metrics,
    calculate_demolition_cost,
    calculate_regulatory_areas,
    calculate_mixed_use,
    calculate_parking,
    run_calculation,
    DEFAULT_PARAMS
)

def test_land_metrics():
    area, val, txt_area, txt_val = calculate_land_metrics(100.0, 5000.0)
    assert area == 100.0
    assert val == 500000.0
    assert txt_area == "100.00 m2"
    
def test_demolition_cost():
    # Test OFF
    cost, txt = calculate_demolition_cost(False, 100, 500, DEFAULT_PARAMS)
    assert cost == 0.0
    
    # Test ON
    # Demolition: 100 * 1600 = 160,000
    # License: 500 * 15 = 7,500
    # Waste: 500 * 0.15 = 75
    # Total: 167,575
    cost, txt = calculate_demolition_cost(True, 100, 500, DEFAULT_PARAMS)
    assert cost == 160000 + 7500 + 75
    
def test_regulatory_areas():
    res = calculate_regulatory_areas(1000, 0.7, 2.5, 0.2, 50)
    assert res['cos_area'] == 700.0
    assert res['cus_area'] == 2500.0
    assert res['cas_area'] == 200.0
    assert res['net_area'] == 950.0

def test_run_calculation_cost_fix():
    """
    Verifies that construction cost is NOT double counted.
    """
    data = {
        'area_terreno': 100,
        'valor_terreno': 1000,
        'COS': 1.0, # 100m2 footprint
        'CUS': 1.0, # 100m2 build
        'CAS': 0.0,
        'demolicion': False,
        'costoMetroConstruccion': 1000,
        'Costo_de_venta_m2': 0,
        'utilidadDeseada': 20,
        'parameters': {} 
    }
    
    # Expected Direct Cost:
    # Base = COS Area (100) * Cost/m2 (1000) = 100,000
    # Demolition = 0
    # Total Direct = 100,000 (It was 200,000 before fix)
    
    result = run_calculation(data)
    
    # We need to parse back from the formatted string or check the raw dict if available
    # The current logic.py returns a dict with 'metrics' and 'raw'.
    
    direct_cost = result['raw']['costo_directo']
    assert direct_cost == 100000.0, f"Expected 100,000 but got {direct_cost}. Double counting might still be present."
