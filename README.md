# NoNA Feasibility Calculator

**NoNA** (Normativa - Numbers - Analysis) is a professional real estate feasibility tool designed for the Mexican market. It calculates regulatory potential (COS, CUS, CAS), financial viability, and construction costs for mixed-use developments.

## 🚀 Web Interface (New v2.0)
The project now includes a standalone web application for easier access and scenario management.

### Features
*   **Real-time Dashboard**: Modify land/normative parameters and see instant financial results.
### Pro Features
*   **📊 Advanced Reports**: 
    *   **Investment Teaser**: Professional A4 PDF Executive Summary with key financial metrics and charts.
    *   **Mathematical Audit**: Detailed formula breakdown justifying every calculation step.
*   **🗺️ Interactive Map**: Integrated OpenStreetMap to pinpoint project location.
*   **⚙️ Configurable Params**: Adjust construction, demolition, and soft cost assumptions globally from the Settings.
*   **📂 Scenarios**: Save multiple versions (e.g. "Scenario A: High Density", "Scenario B: Mixed Use") per client key.
*   **Key Metrics**: Includes ROI, Total Cost, "Costo por Depto", and dynamic Profit Margin analysis.

### Installation & Usage

**Prerequisites**:
*   Python 3.10+
*   Node.js 18+ (npm)

#### 1. Start the Backend (Analytic Engine)
The backend handles calculations, database (`nona.db`), and PDF generation logic.
```bash
cd web/backend
# Create virtual env (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Server
uvicorn main:app --reload
```
*   Server API: `http://localhost:8000`
*   Docs (Swagger): `http://localhost:8000/docs`

#### 2. Start the Frontend (Visual Dashboard)
The user interface where you input data.
```bash
cd web/frontend
npm install
npm run dev
```
*   Open Browser: `http://localhost:3000`

---

## 🏗️ Grasshopper Component (Legacy)
The original Python script for Rhino 3D / Grasshopper is available in `NoNA.py`. It shares the same logic structure but operates within Rhino 7/8.

### Data Inputs
| Input Name | Type | Description |
| :--- | :--- | :--- |
| `area_terreno` | Surface | The 3D surface representing the land plot. |
| `valor_terreno` | Number | Land cost per square meter (MXN). |
| `COS` | Number | Coeficiente de Ocupación del Suelo (0.0 - 1.0). |
| `CUS` | Number | Coeficiente de Utilización del Suelo (e.g., 2.5). |
| `CAS` | Number | Coeficiente de Absorción del Suelo (0.0 - 1.0). |
| ... | ... | (See script for full list) |

### Outputs
*   **Metrics**: Formatted text strings for dashboard displays (e.g., "$10,500,000.00 mxn").
*   **Raw Numbers**: Numeric values for downstream Grasshopper components.

---

## 🛠️ Architecture
*   **Frontend**: Next.js 14, React, Tailwind CSS, Lucide Icons.
*   **Backend**: FastAPI, Pydantic, SQLAlchemy, SQLite.
*   **Core Logic**: `web/backend/logic.py` (Refactored from `NoNA.py`).
*   **Formulas**: [Mathematical Formulas](MATHEMATICAL_FORMULAS.md)

## ⚠️ Disclaimer
This tool provides estimates for feasibility analysis only. It does not replace professional structural engineering, official government zoning certificates, or detailed architectural budgeting.
