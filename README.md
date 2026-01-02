# NoNA Feasibility Calculator

**NoNA** (Normativa - Numbers - Analysis) is a professional real estate feasibility tool designed for the Mexican market. It calculates regulatory potential (COS, CUS, CAS), financial viability, and construction costs for mixed-use developments.

## 🚀 Web Interface (New v2.0)
The project now includes a standalone web application for easier access and scenario management.

### Features
*   **Real-time Dashboard**: Modify land/normative parameters and see instant financial results.
*   **Scenario Management**: Save multiple design options ("Option A", "Option B") per client and compare them side-by-side.
*   **Local Database**: All data is stored securely on your machine (`nona.db`).
*   **Professional UI**: Dark-mode interface built with Next.js and Tailwind CSS.
*   **Key Metrics**: Includes ROI, Total Cost, and "Costo por Depto".

### Installation & Usage

**Prerequisites**:
*   Python 3.8+
*   Node.js 18+

#### 1. Start the Backend (Analytic Engine)
The backend handles calculations and the database.
```bash
cd web/backend
pip install -r requirements.txt
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
The original Python script for Rhino 3D / Grasshopper is still available in `NoNA.py`.

### Inputs (Grasshopper)
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

## ⚠️ Disclaimer
This tool provides estimates for feasibility analysis only. It does not replace professional structural engineering, official government zoning certificates, or detailed architectural budgeting.
