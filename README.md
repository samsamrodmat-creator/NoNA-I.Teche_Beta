
<div align="center">

  # 🏙️ NoNA | Feasibility Intelligence
  
  **Next-Gen Real Estate Financial Modeling & Normative Analysis**

  [![Status](https://img.shields.io/badge/Status-Beta-blue)]()
  [![Stack](https://img.shields.io/badge/Stack-Next.js_14_|_FastAPI_|_PostgreSQL-black)]()
  [![License](https://img.shields.io/badge/License-Proprietary-red)]()

  <p align="center">
    <a href="#-about">About</a> •
    <a href="#-key-features">Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="DEPLOYMENT_GUIDE.md">Deployment</a>
  </p>
</div>

---

## 💡 About

**NoNA** (Normativa • Numbers • Analysis) is an enterprise-grade feasibility platform engineered for agile real estate developers in the Mexican market. It bridges the critical gap between urban regulations (*Normativa*) and complex financial modeling.

Unlike traditional static spreadsheets, NoNA offers a **dynamic, real-time environment** where architectural massing (COS/CUS) directly drives financial outcomes (ROI, Net Profit), enabling teams to iterate on feasibility 10x faster.

## 🚀 Key Features

- **⚡️ Real-Time Feasibility Engine**
  - Instant calculation of regulatory potentials (COS, CUS, CAS) and financial metrics.
  - Sub-second latency for complex "what-if" scenario modeling.

- **📊 Advanced Financial Intelligence**
  - Dynamic residual land value analysis.
  - Automated sensitivity analysis for construction costs and sales prices.
  - "Glass Box" philosophy: [Full transparency on mathematical formulas](MATHEMATICAL_FORMULAS.md).

- **📍 Geospatial Integration**
  - Integrated OpenStreetMap (Leaflet) for precise site selection.
  - Competitive landscape visualization (Future Roadmap).

- **📝 Executive Reporting**
  - One-click generation of institutional-grade Investment Teasers (PDF).
  - Automated visual stacking diagrams and massing previews.

## 🛠 Architecture

The platform is built on a modern, type-safe, and scalable stack designed for cloud deployment.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14** | React Server Components, TypeScript, TailwindCSS v4. |
| **Backend** | **FastAPI** | High-performance Python async framework. |
| **Database** | **PostgreSQL** | Relational data persistence (SQLite for local dev). |
| **ORM** | **SQLAlchemy** | Robust database abstraction and schema management. |
| **DevOps** | **Docker** | Container-ready (Vercel/Railway compatible). |

## 📂 Repository Structure

```bash
NoNA/
├── web/
│   ├── frontend/      # Next.js Application (UI Layer)
│   └── backend/       # FastAPI Service (Logic Layer)
├── MATHEMATICAL_FORMULAS.md  # Documentation of Core financial logic
├── DEPLOYMENT_GUIDE.md       # CI/CD & Cloud Deployment Instructions
└── README.md                 # Project Documentation
```

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/NoNA-Beta.git
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

## 📄 License

**© 2026 Samuel R. & Advanced Development Team.**
All Rights Reserved. This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---
<div align="center">
  <sub>Built with precision for the modern developer.</sub>
</div>
