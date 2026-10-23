# 🏗️ BuildSphere — Complete Construction Lifecycle Super App

> **"Every Construction Need, One App."**  
> An all-in-one modular platform covering the entire home construction journey across India — from verified land discovery and digital survey to building materials procurement, skilled workforce bookings, heavy equipment rentals, 28-milestone engineering project tracking, and post-move-in AMC care.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.19-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1.9-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![i18n](https://img.shields.io/badge/Languages-English%20%7C%20తెలుగు%20%7C%20हिन्दी-success)](#-multilingual-support-3-languages)

---

## 🌟 Key Highlights

- **Complete End-to-End Homebuilding Lifecycle:** Connects every phase of residential construction into one seamless flow.
- **🗺️ Interactive Land Location Map:** Explore verified plots on satellite imagery & GIS grids (Hyderabad, Bengaluru, Amaravati) with cadastral boundaries and real GPS coordinates.
- **🌐 Trilingual Support (1-Click Switch):** Full 100% key parity across **English**, **తెలుగు (Telugu)**, and **हिन्दी (Hindi)**.
- **⚡ 7-Step Guided Construction Flow:** Step-by-step interactive simulation from land purchase to keys handover.
- **📦 Direct-to-Site Materials Marketplace:** Order UltraTech/Maha Cement, Jindal TMT Steel, sand, and bricks directly to construction coordinates with live truck dispatch and GST invoices.
- **👷 Licensed Trade Workforce Booking:** Book certified electricians (Havells/Finolex), plumbers (Ashirvad/Supreme), and masons with milestone-based payment escrow.
- **🚜 Heavy Machinery Rental:** Deploy JCB 3DX excavators and transit concrete mixers with certified operators.
- **📊 28 Sequential Engineering Milestones:** Track daily site progress, photo logs, and real-time budget variance.
- **🛡️ Handover Snagging & AMC Care:** 45-point pre-move-in snag inspection, water tank deep cleaning, and pest control.

---

## 🧭 The 8-Step Construction Workflow

```
1. Land & GIS Map ➔ 2. Soil Test & Survey ➔ 3. Floor Plan & Approvals ➔ 4. Cement & Steel
       ➔ 5. Electrician & Plumber ➔ 6. JCB & Machinery ➔ 7. 28 Milestones ➔ 8. Keys & AMC
```

| Step | Phase | Key Deliverables |
|---|---|---|
| **1** | **Land Discovery & GIS Map** | HMDA/RERA verified plots, 30-year link deed checks, nil-EC verification, and interactive cadastral location map. |
| **2** | **Soil Test & Land Survey** | Total Station boundary contour survey & Safe Bearing Capacity (SBC) geotechnical soil test. |
| **3** | **Floor Plan & Approvals** | Contemporary cross-ventilated 2D/3D architectural floor plans & municipal sanction (TS-bPASS / GHMC / BBMP). |
| **4** | **Materials Direct to Site** | 1-Click order UltraTech/Maha Cement bags, Jindal TMT steel, sand & red bricks with live vehicle tracking. |
| **5** | **Skilled Trade Bookings** | Certified electricians, plumbers, and masons with transparent daily wages & escrow stage releases. |
| **6** | **Machinery Rental** | Rent JCB 3DX excavators and ready-mix transit concrete mixers with certified operators. |
| **7** | **28 Milestones & Budget** | Track structural RCC milestones, plastering, plumbing rough-in, and budget variance ledger. |
| **8** | **Handover & AMC Care** | 45-point snag check, Gruhapravesam move-in, water tank cleaning, and annual maintenance contracts. |

---

## 🌐 Multilingual Support (3 Languages)

BuildSphere features native, prominent language switcher buttons in both the header navigation bar and top banner:
- **🇬🇧 English**
- **🇮🇳 తెలుగు (Telugu)**
- **🇮🇳 हिन्दी (Hindi)**

*All 336+ translation keys are verified with 100% key parity via automated unit tests.*

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework:** React 18.3.1 with TypeScript 5.9.3
- **Build Tool:** Vite 5.4.21 (Fast HMR & optimized production chunking)
- **Styling:** Tailwind CSS 3.4.19 with custom design tokens & glassmorphism
- **Iconography:** Lucide React icons
- **State Management & Persistence:** Reactive Context API store synced to browser `localStorage`
- **Testing:** Vitest 2.1.9 (Unit & integration test suites covering workflows, cart math, and i18n parity)
- **Self-Contained Architecture:** Operates with simulated checkout, live cart, and logistics tracking without requiring external third-party API tokens.

---

## 📁 Project Directory Structure

```
buildsphere/
├── docs/
│   └── PROJECT_STATUS.md           # Metrics, LOC tracker, and status report
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Header.tsx          # Nav header with 3-language segmented switcher
│   │       ├── Footer.tsx          # Clean footer with portal links
│   │       ├── GlobalSearchModal.tsx # Universal search modal
│   │       ├── GuidedJourneyWizard.tsx # 7-step interactive lifecycle simulator
│   │       └── LandLocationMap.tsx # Interactive GIS & Satellite Land Map
│   ├── data/
│   │   └── mockData.ts             # Realistic Indian construction datasets (plots, materials, trades)
│   ├── i18n/
│   │   └── index.tsx               # Internationalization engine with INR currency formatter
│   ├── locales/
│   │   ├── en.json                 # English translations
│   │   ├── te.json                 # Telugu translations (తెలుగు)
│   │   └── hi.json                 # Hindi translations (हिन्दी)
│   ├── pages/
│   │   ├── HomePage.tsx            # Hero, guided wizard, 6-module grid, cost estimator
│   │   ├── PropertiesPage.tsx      # Plots directory, Land Location Map, legal due diligence
│   │   ├── MaterialsPage.tsx       # Materials catalog (Structural, Electrical, Plumbing)
│   │   ├── CartPage.tsx            # Live cart with GST invoice breakdown
│   │   ├── OrdersPage.tsx          # Real-time order dispatch tracking
│   │   ├── ServicesPage.tsx        # Contractor & skilled trades directory
│   │   ├── BookingsPage.tsx        # 13-stage booking transitions & work logs
│   │   ├── EquipmentPage.tsx       # JCB, excavator, and mixer rental fleet
│   │   ├── ProjectsPage.tsx        # 28-milestone construction progress ledger
│   │   ├── HandoverPage.tsx        # 45-point pre-handover snag checklist
│   │   ├── FinancePage.tsx         # Category budget audit & expense ledger
│   │   ├── MaintenancePage.tsx     # Post-construction AMC packages & service requests
│   │   ├── AdminPage.tsx           # Platform operational dashboard
│   │   └── SupportPage.tsx         # Help center & FAQ directory
│   ├── store/
│   │   └── index.tsx               # Unified state store with local persistence
│   ├── tests/
│   │   ├── workflows.test.ts       # Automated business logic tests
│   │   └── i18n.test.ts            # Translation key completeness tests
│   ├── types/
│   │   └── index.ts                # TypeScript domain models
│   ├── App.tsx                     # React Router configuration
│   └── main.tsx                    # React application entry point
├── package.json                    # Project dependencies & scripts
├── tailwind.config.js              # Tailwind design tokens & theme configuration
├── tsconfig.json                   # TypeScript compiler configuration
└── vite.config.ts                  # Vite build & Vitest test configuration
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher, tested on Node v24.22.1)
- `npm` or `pnpm`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nagaraju516/BuildSphere.git
   cd BuildSphere
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   # or run on Windows:
   .\dev.bat
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000/
   ```

---

## 🧪 Testing

Run the automated Vitest test suite:
```bash
npm run test
# or
npx vitest run
```

Expected output:
```
 ✓ src/tests/workflows.test.ts (6 tests)
 ✓ src/tests/i18n.test.ts (3 tests)

 Test Files  2 passed (2)
      Tests  9 passed (9)
```

---

## 📦 Production Build

Compile the production bundle:
```bash
npm run build
# or run on Windows:
.\build.bat
```

The compiled output will be generated in the `dist/` folder ready for deployment on Vercel, Netlify, or GitHub Pages.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author & Owner

**Developed with ❤️ by Nagaraju**  
GitHub: [@Nagaraju516](https://github.com/Nagaraju516)
