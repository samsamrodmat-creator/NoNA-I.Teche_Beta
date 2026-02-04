
from database import SessionLocal, Parameter, init_db

def seed_defaults():
    db = SessionLocal()
    
    defaults = [
        {"key": "COST_DEMOLITION_M2", "value": 1600.0, "description": "Costo de demolición por m2", "group": "Costos"},
        {"key": "COST_LICENSE_M2", "value": 15.0, "description": "Costo de licencia por m2", "group": "Costos"},
        {"key": "COST_WASTE_PERCENT", "value": 0.15, "description": "% de costo por retiro de escombro", "group": "Costos"},
        {"key": "PARKING_M2_PER_SPOT", "value": 12.5, "description": "Metros cuadrados por cajón de estacionamiento", "group": "Estacionamiento"},
        {"key": "PARKING_DRIVEWAY_FACTOR", "value": 1.50, "description": "Factor de circulación (rampas, pasillos)", "group": "Estacionamiento"},
        {"key": "PCT_HONORARIOS", "value": 15.0, "description": "% Honorarios", "group": "Indirectos"},
        {"key": "PCT_LEGALES", "value": 2.0, "description": "% Legales", "group": "Indirectos"},
        {"key": "PCT_ADM", "value": 10.0, "description": "% Administración", "group": "Indirectos"},
        {"key": "PCT_FIN", "value": 3.0, "description": "% Financiero", "group": "Indirectos"},
        {"key": "PCT_COM", "value": 6.0, "description": "% Comercialización", "group": "Indirectos"},
    ]

    for d in defaults:
        exists = db.query(Parameter).filter(Parameter.key == d["key"]).first()
        if not exists:
            p = Parameter(**d)
            db.add(p)
    
    db.commit()
    db.close()
    print("✅ Defaults seeded.")

if __name__ == "__main__":
    init_db()
    seed_defaults()
