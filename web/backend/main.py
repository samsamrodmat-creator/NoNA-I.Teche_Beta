from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logic
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database

# Initialize Database
database.init_db()

app = FastAPI(title="NoNA API")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependency ---
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Pydantic Models for API ---
class CalculationRequest(BaseModel):
    area_terreno: float
    valor_terreno: float
    COS: float
    CUS: float
    CAS: float
    area_retiros: Optional[float] = 0.0
    
    demolicion: bool
    area_demolicion: Optional[float] = 0.0
    
    n_viviendas: int
    usos_mixtos: bool
    num_locales: Optional[int] = 0
    costo_local_m2: Optional[float] = 0.0
    
    costoMetroConstruccion: float
    Costo_de_venta_m2: float
    areaCirculacionPorcentaje: float
    
    estacionamiento: bool
    tipo_estacionamiento: Optional[float] = 0.0
    delegacion: List[str]
    Distrito: List[float]
    
    utilidadDeseada: float
    correrSimulacion: bool

class CustomerCreate(BaseModel):
    name: str

class CustomerOut(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True

class ScenarioCreate(BaseModel):
    customer_id: int
    name: str
    input_data: CalculationRequest

class ScenarioOut(BaseModel):
    id: int
    name: str
    customer_id: int
    input_data: Dict[str, Any]
    result_summary: Dict[str, Any]
    class Config:
        orm_mode = True

# --- Endpoints ---

@app.post("/calculate")
async def calculate(req: CalculationRequest):
    data = req.dict()
    result = logic.run_calculation(data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

# Customer Endpoints
@app.get("/customers", response_model=List[CustomerOut])
def get_customers(db: Session = Depends(get_db)):
    return db.query(database.Customer).all()

@app.post("/customers", response_model=CustomerOut)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    db_customer = db.query(database.Customer).filter(database.Customer.name == customer.name).first()
    if db_customer:
        return db_customer
    new_customer = database.Customer(name=customer.name)
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

# Scenario Endpoints
@app.post("/scenarios", response_model=ScenarioOut)
def create_scenario(scenario: ScenarioCreate, db: Session = Depends(get_db)):
    # Run calculation first to get summary
    calc_result = logic.run_calculation(scenario.input_data.dict())
    
    summary = {}
    if "metrics" in calc_result:
        summary = {
            "utilidad": calc_result["metrics"].get("Text_Utilidad_Final"),
            "costo_total": calc_result["metrics"].get("Text_Costo_Total"),
            "roi": calc_result["raw"].get("utilidad_optimizada")
        }
    
    new_scenario = database.Scenario(
        customer_id=scenario.customer_id,
        name=scenario.name,
        input_data=scenario.input_data.dict(),
        result_summary=summary
    )
    db.add(new_scenario)
    db.commit()
    db.refresh(new_scenario)
    return new_scenario

@app.get("/customers/{customer_id}/scenarios", response_model=List[ScenarioOut])
def get_scenarios(customer_id: int, db: Session = Depends(get_db)):
    return db.query(database.Scenario).filter(database.Scenario.customer_id == customer_id).all()
