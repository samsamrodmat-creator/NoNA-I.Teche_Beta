from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nona.db")

# Handle Render/Railway postgres:// vs postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

if "sqlite" in DATABASE_URL:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    scenarios = relationship("Scenario", back_populates="customer")

class Scenario(Base):
    __tablename__ = "scenarios"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Store the full input payload
    input_data = Column(JSON)
    
    # Store key result metrics for quick access
    result_summary = Column(JSON)
    
    customer = relationship("Customer", back_populates="scenarios")

class Parameter(Base):
    __tablename__ = "parameters"
    
    key = Column(String, primary_key=True, index=True)
    value = Column(Float)
    description = Column(String)
    group = Column(String, index=True) # Costos, Normativa, etc.


def init_db():
    Base.metadata.create_all(bind=engine)
