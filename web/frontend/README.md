# NoNA Frontend

The **NoNA Frontend** is a modern web application built with [Next.js 16](https://nextjs.org) and [React 19](https://react.dev), designed to provide a rich, interactive interface for real-time real estate feasibility analysis. It connects to the NoNA backend API to perform calculations, manage scenarios, and generate reports.

## 🚀 Key Features

*   **Real-Time Dashboard**: Modify key project parameters (Land Cost, Area, Regulatory Norms) and instantly view financial outcomes (ROI, Profit Margin, Total Investment).
*   **Interactive Location Picker**: Integrated [Leaflet](https://leafletjs.com/) map allows users to search for addresses, pin exact locations, and capture satellite views for reports.
*   **Scenario Management**:
    *   **Save & Load**: Persist calculation scenarios for specific clients in a SQLite database.
    *   **Compare**: Easily switch between saved scenarios to compare different development strategies.
*   **Professional Reporting**:
    *   **Executive Summary**: Generate high-quality PDF reports with project visuals, key metrics, and charts using `jspdf` and `html-to-image`.
    *   **Mathematical Audit**: Detailed breakdown of every formula used, ensuring transparency and trust in the numbers.
*   **Configurable Settings**: Adjust global assumptions (Indirect Cost %, Demolition Costs, Parking Ratios) directly from the UI without touching code.
*   **Responsive Design**: optimizing for a seamless experience on desktop and tablet, built with Tailwind CSS v4.

## 🛠 Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **UI Library**: React 19 (RC)
*   **Styling**: Tailwind CSS v4
*   **Icons**: Lucide React
*   **Animations**: Framer Motion
*   **Maps**: React Leaflet / Leaflet / OpenStreetMap
*   **PDF Generation**: jsPDF, html-to-image
*   **Language**: TypeScript

## 📂 Project Structure

```bash
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable UI components
│   ├── ui/           # Basic atoms (buttons, inputs, cards)
│   ├── logic/        # Business logic components (Calculator, Scenarios)
│   ├── maps/         # Map related components
│   └── reports/      # PDF Report templates
├── hooks/            # Custom React hooks (useCalculator, useScenarios)
├── lib/              # Utility functions and API clients
├── types/            # TypeScript type definitions
└── constants/        # Default values and configuration
```

## 🏁 Getting Started

### Prerequisites

*   Node.js 18.17 or later
*   npm or yarn or pnpm
*   Running NoNA Backend (the frontend requires the API to be active at `http://localhost:8000`)

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd web/frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📜 Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Runs the built production application.
*   `npm run lint`: Runs ESLint to check for code quality issues.
