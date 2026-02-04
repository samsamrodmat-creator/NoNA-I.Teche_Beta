
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_integration():
    print("🚀 Starting Integration Test...")
    
    # 1. Check Parameters
    try:
        resp = requests.get(f"{BASE_URL}/parameters")
        params = resp.json()
        print(f"✅ GET /parameters: Found {len(params)} parameters.")
        
        # Find Demolition Cost
        demo_param = next((p for p in params if p['key'] == 'COST_DEMOLITION_M2'), None)
        print(f"   Current Demolition Cost: {demo_param['value']}")
        original_value = demo_param['value']
    except Exception as e:
        print(f"❌ Failed to connect to API: {e}")
        return

    # 2. Run Calculation (Baseline)
    payload = {
        "area_terreno": 1000,
        "valor_terreno": 5000,
        "COS": 0.7,
        "CUS": 2.5,
        "CAS": 0.2,
        "area_demolicion": 100,
        "demolicion": True,
        "n_viviendas": 10,
        "usos_mixtos": False,
        "estacionamiento": False,
        "costoMetroConstruccion": 10000,
        "Costo_de_venta_m2": 30000,
        "areaCirculacionPorcentaje": 0.15,
        "delegacion": ["centro"],
        "Distrito": [1.0],
        "utilidadDeseada": 20,
        "correrSimulacion": False
    }
    
    resp = requests.post(f"{BASE_URL}/calculate", json=payload)
    res_base = resp.json()
    cost_demo_base = res_base['metrics']['Text_Costo_Demolicion']
    print(f"✅ Baseline Calculation: Demolition Cost = {cost_demo_base}")

    # 3. Update Parameter (Double the cost)
    new_cost = 3200.0
    print(f"📝 Updating Demolition Cost to {new_cost}...")
    requests.put(f"{BASE_URL}/parameters", json=[{"key": "COST_DEMOLITION_M2", "value": new_cost}])
    
    # 4. Run Calculation (Updated)
    resp = requests.post(f"{BASE_URL}/calculate", json=payload)
    res_updated = resp.json()
    cost_demo_updated = res_updated['metrics']['Text_Costo_Demolicion']
    print(f"✅ Updated Calculation: Demolition Cost = {cost_demo_updated}")
    
    # Verification
    # $160,000 vs $320,000 (roughly)
    if cost_demo_updated != cost_demo_base:
        print("🎉 SUCCESS: Calculation logic respected the parameter update!")
    else:
        print("❌ FAILURE: Calculation result did not change.")
        
    # Reset
    requests.put(f"{BASE_URL}/parameters", json=[{"key": "COST_DEMOLITION_M2", "value": original_value}])
    print("🔄 Reset parameter to original value.")

if __name__ == "__main__":
    test_integration()
