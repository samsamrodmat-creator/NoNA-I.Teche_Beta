
<div align="center">

  # 🏙️ NoNA | Feasibility Intelligence
  
  **Next-Gen Real Estate Financial Modeling & Normative Analysis**
  <br>
  **Modelado Financiero Inmobiliario y Análisis Normativo de Nueva Generación**

  [![Status](https://img.shields.io/badge/Status-Beta-blue)]()
  [![Stack](https://img.shields.io/badge/Stack-Next.js_14_|_FastAPI_|_PostgreSQL-black)]()
  [![License](https://img.shields.io/badge/License-Proprietary-red)]()

  <p align="center">
    <a href="#-english">English</a> •
    <a href="#-español">Español</a>
  </p>
</div>

---

<div id="english"></div>

## 💡 About (English)

**NoNA** (Normativa • Numbers • Analysis) is an enterprise-grade feasibility platform engineered for agile real estate developers in the Mexican market. It bridges the critical gap between urban regulations (*Normativa*) and complex financial modeling.

Unlike traditional static spreadsheets, NoNA offers a **dynamic, real-time environment** where architectural massing (COS/CUS) directly drives financial outcomes (ROI, Net Profit), enabling teams to iterate on feasibility 10x faster.

### 🚀 Key Features

- **⚡️ Real-Time Feasibility Engine**
  - Instant calculation of regulatory potentials (COS, CUS, CAS) and financial metrics.
  - Sub-second latency for complex "what-if" scenario modeling.

- **📊 Advanced Financial Intelligence**
  - Dynamic residual land value analysis.
  - Automated sensitivity analysis for construction costs and sales prices.
  - "Glass Box" philosophy: [Full transparency on mathematical formulas](MATHEMATICAL_FORMULAS.md).

- **📍 Geospatial Integration**
  - Integrated OpenStreetMap (Leaflet) for precise site selection.

- **📝 Executive Reporting**
  - One-click generation of institutional-grade Investment Teasers (PDF).
  - Automated visual stacking diagrams and massing previews.

---

<div id="español"></div>

## 💡 Acerca de (Español)

**NoNA** (Normativa • Numbers • Analysis) es una plataforma de viabilidad de nivel empresarial diseñada para desarrolladores inmobiliarios ágiles en el mercado mexicano. Cierra la brecha crítica entre la normativa urbana y el modelado financiero complejo.

A diferencia de las hojas de cálculo estáticas tradicionales, NoNA ofrece un **entorno dinámico en tiempo real** donde la masa arquitectónica (COS/CUS) impulsa directamente los resultados financieros (ROI, Utilidad Neta), permitiendo a los equipos iterar la viabilidad 10 veces más rápido.

### 🚀 Características Principales

- **⚡️ Motor de Viabilidad en Tiempo Real**
  - Cálculo instantáneo de potenciales normativos (COS, CUS, CAS) y métricas financieras.
  - Latencia de sub-segundos para el modelado de escenarios complejos "what-if".

- **📊 Inteligencia Financiera Avanzada**
  - Análisis dinámico del valor residual de la tierra.
  - Análisis de sensibilidad automatizado para costos de construcción y precios de venta.
  - Filosofía "Caja de Cristal": [Transparencia total en fórmulas matemáticas](MATHEMATICAL_FORMULAS.md).

- **📍 Integración Geoespacial**
  - OpenStreetMap (Leaflet) integrado para una selección precisa del sitio.

- **📝 Reportes Ejecutivos**
  - Generación en un clic de Teasers de Inversión (PDF) de grado institucional.
  - Diagramas de apilamiento visual (Stacking) y previsualización de masas automatizados.

---

## 🛠 Architecture / Arquitectura

The platform is built on a modern, type-safe, and scalable stack designed for cloud deployment.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14** | React Server Components, TypeScript, TailwindCSS v4. |
| **Backend** | **FastAPI** | High-performance Python async framework. |
| **Database** | **PostgreSQL** | Relational data persistence (SQLite for local dev). |
| **ORM** | **SQLAlchemy** | Robust database abstraction and schema management. |
| **DevOps** | **Docker** | Container-ready (Vercel/Railway compatible). |

## 🏁 Getting Started / Comenzar

### Installation / Instalación

1. **Clone the Repository**
   ```bash
   git clone https://github.com/samsamrodmat-creator/NoNA-Beta-V_1.git
   cd NoNA
   ```

2. **Backend Setup**
   ```bash
   cd web/backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd web/frontend
   npm install
   cp .env.example .env.local # Configure API URL
   npm run dev
   ```

## 📄 License / Licencia

**© 2026 Samuel R. & Advanced Development Team.**
All Rights Reserved. This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

Todos los derechos reservados. Este software es propietario y confidencial. La copia, distribución o uso no autorizado está estrictamente prohibido.

---
<div align="center">
  <sub>Built with precision for the modern developer.</sub>
</div>
