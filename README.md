# BreatheWise AI 🍃 — Urban Air Quality & Sustainable Living Assistant

> **PromptWars Virtual Challenge 6: Urban Air Quality Assistant**  
> *"Create a GenAI-powered assistant that helps families and communities navigate severe winter smog and urban air pollution. The application should suggest low-emission daily routines, indoor air quality hacks, and sustainable alternatives tailored to their location and lifestyle, while clearly explaining the direct impact of their choices."*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://breathe-wise-ai-ivxy.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7_Strict-blue)](https://github.com/pavankarthikeyaatchyuta-lab/BreatheWise-AI)
[![Tests](https://img.shields.io/badge/tests-110%20passing-success)](https://github.com/pavankarthikeyaatchyuta-lab/BreatheWise-AI)
[![Repo Size](https://img.shields.io/badge/repo%20size-%3C%201%20MB-informational)](https://github.com/pavankarthikeyaatchyuta-lab/BreatheWise-AI)
[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black)](https://breathe-wise-ai-ivxy.vercel.app/)
[![Production Deployment](https://img.shields.io/badge/Vercel-Live%20Operational-success?logo=vercel)](https://breathe-wise-ai-ivxy.vercel.app/)

---

## 🌟 Product Overview & Core Promise

**Understand the smog. Protect your family. Act with scientific clarity.**

**BreatheWise AI** is an intelligent, family-first environmental assistant engineered for Indian metropolitan areas battling severe winter air pollution and thermal inversion episodes. Rather than relying on generic chatbots or ungrounded generative text, BreatheWise AI features a **Dual-Layer Intelligence Architecture** separating creative natural-language interaction from deterministic environmental and statutory calculations:

1. **Generative AI Layer:** Interprets natural-language queries, personalizes family health routines, and provides multilingual advice in English, Hindi (हिन्दी), and Telugu (తెలుగు). Powered by Google Gemini (`gemini-2.5-flash` / `gemini-3.8-flash`) with server-side credential isolation, two-stage prompt guardrails, runtime Zod schema validation, and an automatic deterministic fallback engine when external APIs are unavailable.
2. **Deterministic Environmental Engine:** Executes exact Central Pollution Control Board (CPCB) piecewise linear interpolation math, tracks diurnal atmospheric boundary layer shifts (nocturnal radiative cooling vs afternoon solar dispersion), enforces statutory Commission for Air Quality Management (CAQM) Graded Response Action Plan (GRAP) directives, and computes lifecycle emissions reductions benchmarked directly against the **Central Electricity Authority (CEA) Baseline Database Version 22.0**.

---

## 📋 Challenge Requirements Traceability Matrix

| Requirement | Implementation in BreatheWise AI | Verified Module / Route |
| :--- | :--- | :--- |
| **1. Severe winter smog & urban pollution** | CPCB NAQI Hero card, diurnal atmospheric boundary layer tracking ($6:00-9:30\text{ AM}$ & $19:30-22:00\text{ PM}$ thermal inversion spikes vs midday solar dispersion), and dominant pollutant diagnostics. | [`/dashboard`](src/app/dashboard/page.tsx), [`src/lib/aqi/cpcb-calc.ts`](src/lib/aqi/cpcb-calc.ts) |
| **2. Low-emission daily routines** | Personalized family schedule builder that shifts outdoor exertion away from nocturnal boundary layer compression into afternoon dispersion windows based on hourly forecasts. | [`/planner`](src/app/planner/page.tsx), [`src/lib/engine/planner-engine.ts`](src/lib/engine/planner-engine.ts) |
| **3. Indoor air quality hacks** | Evidence-based procedural coach enforcing a strict **Zero Fake Sensors Policy**. Includes cooking exhaust protocols, wet mopping over dry sweeping, and fire-safe DIY Corsi-Rosenthal box blueprints. | [`/indoor-coach`](src/app/indoor-coach/page.tsx), [`src/lib/engine/indoor-engine.ts`](src/lib/engine/indoor-engine.ts) |
| **4. Sustainable alternatives** | Multi-modal transit comparison (8 transport modes) with passenger-kilometre (pkm) emissions modeling, vehicle occupancy scaling, and verified operational disclosures (e.g. Patna Metro Rail priority section). | [`/alternatives`](src/app/alternatives/page.tsx), [`src/lib/engine/alternatives.ts`](src/lib/engine/alternatives.ts) |
| **5. Explainable direct impact** | Strictly decouples Personal Exposure Shift (hrs), Local Street Tailpipe $\text{PM}_{2.5}$ (g), and Grid Lifecycle $\text{CO}_2\text{e}$ (kg) with interactive calculation proofs citing CEA Version 22.0. | [`/impact`](src/app/impact/page.tsx), [`src/lib/engine/impact-engine.ts`](src/lib/engine/impact-engine.ts) |
| **6. Community & school action** | Dynamic CAQM GRAP tracking (Stages I–IV), school sports curbs, RWA open-burning bans, and one-click WhatsApp community broadcast generator. | [`/community`](src/app/community/page.tsx), [`src/lib/engine/grap-engine.ts`](src/lib/engine/grap-engine.ts) |
| **7. Grounded GenAI assistance** | Conversational assistant with two-stage prompt injection defense, server-side secret isolation, and streaming responses with deterministic fallback. | [`/assistant`](src/app/assistant/page.tsx), [`src/lib/ai/gemini-client.ts`](src/lib/ai/gemini-client.ts) |

---

## 🎯 Chosen Vertical

**Urban Air Quality & Sustainable Living (PromptWars Virtual Challenge 6)**  
Engineered specifically for Indian metropolitan families, schools, and vulnerable populations (infants, asthmatics, seniors) navigating severe winter smog, seasonal biomass burning, vehicular emissions, and diurnal atmospheric boundary layer inversions across major Indian metros (Delhi-NCR, Mumbai, Bengaluru, Hyderabad, Kolkata, Pune, Chennai, Lucknow, Patna).

---

## 🧠 Approach & Logic

Rather than relying on ungrounded or speculative generative chatbots, BreatheWise AI operates on a **Dual-Layer Intelligence Architecture** strictly separating empathetic natural-language personalization from deterministic mathematical and statutory calculations:

1. **Generative AI Layer (Google Gemini API):**  
   Interprets unstructured family prompts, personalizes daily schedules based on household health vulnerabilities, and provides culturally nuanced guidance across English, Hindi (हिन्दी), and Telugu (తెలుగు). Enforces two-stage prompt guardrails rejecting prompt extraction and jailbreaks, validated with strict runtime Zod schemas, with zero credential leakage and automatic deterministic fallback.

2. **Deterministic Environmental Engine:**  
   Executes exact Central Pollution Control Board (CPCB) continuous piecewise linear interpolation math, tracks diurnal atmospheric boundary layer shifts (nocturnal radiative cooling vs afternoon solar convective dispersion), synchronizes with statutory CAQM GRAP directives (Stages I–IV), and computes decoupled lifecycle carbon reductions benchmarked directly to the **Central Electricity Authority (CEA) Baseline Database Version 22.0**.

---

## ⚙️ How the Solution Works

1. **Statutory CPCB NAQI Interpolation:** Ingests 8 criteria pollutants ($\text{PM}_{2.5}, \text{PM}_{10}, \text{NO}_2, \text{SO}_2, \text{CO}, \text{O}_3, \text{NH}_3, \text{Pb}$) and applies continuous midpoint boundary bridging, eliminating decimal null gaps. Enforces the statutory 16-hour monitored completeness rule for official station readings while transparently classifying atmospheric models as indicative estimates.
2. **Diurnal Boundary Layer Dynamics:** Models diurnal mixing height shifts during winter smog episodes. Accurately identifies the morning ground inversion ($6:00-9:30\text{ AM}$) and evening traffic trapping window ($19:30-22:00\text{ PM}$) while guiding families toward the safe afternoon solar dispersion window ($13:00-16:00\text{ PM}$).
3. **Zero-Fake-Sensors Procedural Coach:** Refuses to invent indoor air numbers without calibrated hardware. Instead, applies procedural heuristics: cooking exhaust compartmentalization, wet mopping to prevent dust resuspension, and certified DIY Corsi-Rosenthal box filter specs (MERV-13, non-ozone box fans).
4. **Decoupled 3-Tier Impact Calculations:** Strictly separates personal smog duration avoidance (hrs) from local tailpipe particulate reduction (g) and global grid lifecycle greenhouse gas reduction (kg $\text{CO}_2\text{e}$). Transit emissions cite the **Central Electricity Authority (CEA) Baseline Database Version 22.0** ($0.675\text{ kg CO}_2/\text{kWh}$).
5. **Dynamic Regulatory Synchronization:** Maps ambient air quality to Commission for Air Quality Management (CAQM) GRAP triggers (Stages I–IV for Delhi-NCR), generating tailored RWA and school actions.

---

## 📐 Assumptions Made

To ensure total transparency, auditability, and scientific honesty, BreatheWise AI explicitly operates under the following documented engineering assumptions:

1. **CPCB Statutory Completeness Rule:** In strict accordance with the CPCB 2014 NAQI guidelines, an ambient reading is marked as an officially valid regulatory AQI if and only if: (a) at least 3 criteria pollutants are recorded, (b) at least one particulate matter pollutant ($\text{PM}_{2.5}$ or $\text{PM}_{10}$) is monitored, and (c) at least 16 hourly samples are available for 24-hour averages (or 8 hours for CO/O₃).
2. **Atmospheric Model Provenance Tracking:** Gridded atmospheric models (e.g. Copernicus CAMS via Open-Meteo at $\sim 45\text{ km}$ resolution) are explicitly flagged as indicative model estimates (`isValidOfficial: false`) and are never misrepresented to users as certified physical ground stations.
3. **Absence of Calibrated Indoor Sensors (Zero-Fake-Sensors Policy):** In the absence of certified, physically paired indoor hardware, the system will never fabricate numerical indoor $\text{PM}_{2.5}$ readings. It exclusively offers evidence-based procedural protocols (ventilation gating, wet mopping, cooking exhaust management).
4. **Decoupled Life-Cycle Grid Carbon Baseline:** Grid carbon calculations for electric buses and metro rail transit strictly adopt the **Central Electricity Authority (CEA) Baseline Database Version 22.0** weighted average grid emission factor ($0.675\text{ kg CO}_2\text{e/kWh}$) to eliminate inflated clean-tech claims.
5. **Neighborhood Privacy by Design:** Geographical coordinates are truncated to 2 decimal places ($\sim 1.1\text{ km}$ neighborhood grid scale) to prevent pinpoint household exposure while providing accurate local atmospheric telemetry.

---

## 🛠 Tech Stack & Repository Metrics

- **Framework:** Next.js 15.1.12 (App Router, React 19)
- **Language:** TypeScript 5.7 (Strict Mode, 0 compile errors)
- **Styling & Design System:** Tailwind CSS with Lucide Icons and responsive mobile navigation
- **AI & LLM Orchestration:** Google Gemini API (`@google/genai` v3.6.0) with server-side route execution
- **Test Framework:** Vitest 3.2.7 with 110 automated tests across 13 specialized test suites
- **DOM & Workflow Testing:** React Testing Library + jsdom for component interaction assertions
- **State Management:** React Context (CityContext & ScenarioContext) with LocalStorage persistence
- **Repository Size:** **~200 KB** clean archive, well below the 10 MB competition limit

---

## 🔒 Security & AI Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Optional: External LLM Integration (default model: gemini-2.5-flash)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Optional: OpenAQ Ground Monitoring API Key (v3)
OPENAQ_API_KEY=your_openaq_api_key_here
```

### Security Controls Implemented
- **Zero Client Secret Exposure:** API keys are accessed strictly in server route handlers via `process.env`. No credentials are prefixed with `NEXT_PUBLIC_` or bundled into client assets.
- **Runtime Zod Schema Validation:** All incoming chat requests are validated against strict Zod schemas (`ChatIncomingRequestSchema`) to enforce bounded string lengths and valid language codes.
- **Controlled Timeouts & Abort Signals:** 7,000 ms upstream timeout with active `AbortController` cancellation to eliminate orphaned network connections.
- **Sliding-Window Rate Limiting:** Enforces a 20 request/minute/IP sliding-window rate limit, preventing API flooding.
- **Location Privacy by Design:** User coordinates are truncated to 2 decimal places ($\sim 1.1\text{ km}$ neighborhood scale), preventing household address disclosure.
- **Safe Fallback Mode:** When external credentials are missing or upstream APIs experience capacity limits, the engine gracefully transitions to its deterministic rule engine without throwing uncaught exceptions.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher (tested on Node `v24.13.0`)
- npm 9.x or higher

### Installation
```bash
# 1. Clone repository
git clone https://github.com/pavankarthikeyaatchyuta-lab/BreatheWise-AI.git
cd BreatheWise-AI

# 2. Install dependencies
npm install

# 3. Setup environment variables (optional; deterministic engine runs out of the box)
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Automated Tests
```bash
npm run test -- --run   # Runs all 110 automated tests across 13 test suites
```

### Production Build & Linting
```bash
npx tsc --noEmit        # TypeScript strict verification (0 errors)
npm run lint            # ESLint check (0 errors, 0 warnings)
npm run build           # Next.js production build (13/13 routes compiled)
npm run start           # Run production server
```

---

## 🧪 Reproducible Benchmark Walkthrough

To verify the core intelligence engine against the challenge requirements:

1. Open the application at [https://breathe-wise-ai-ivxy.vercel.app/](https://breathe-wise-ai-ivxy.vercel.app/).
2. **Dashboard (`/`):** Switch location between **Delhi-NCR** and **Mumbai**. Observe how CPCB AQI, dominant pollutant, and 24-hour diurnal inversion curves recalibrate dynamically.
3. **Routine Planner (`/planner`):** Observe how morning fitness activities are shifted away from the ground inversion window ($6:00-9:30\text{ AM}$) into the afternoon dispersion window. Check the dynamic date pill displaying today's actual date.
4. **Indoor Coach (`/indoor-coach`):** Review the **Zero Fake Sensors** banner confirming that uncalibrated indoor numbers are never fabricated. Click **"View Build Guide"** to open the fire-safe DIY Corsi-Rosenthal Box specifications.
5. **Sustainable Alternatives (`/alternatives`):** Drag the commute distance slider from 15 km to 30 km. Observe real-time passenger-km emissions and exposure risks across 8 transit modes.
6. **Impact Intelligence (`/impact`):** Click **"View Calculation Proof"** to inspect the mathematical formulas and citations to the **Central Electricity Authority (CEA) Baseline Database Version 22.0**.
7. **Community Hub (`/community`):** Verify that ambient AQI dynamically triggers the corresponding CAQM GRAP stage (e.g. GRAP Stage II "Very Poor" for AQI 301–400) and click **"Copy"** to generate a pre-formatted WhatsApp advisory bulletin.

---

## 🌐 Live Deployment Status

- **Live URL:** [https://breathe-wise-ai-ivxy.vercel.app/](https://breathe-wise-ai-ivxy.vercel.app/)
- **Hosting Target:** Deployed on Vercel Edge with continuous deployment tracking `origin/main`.
- **Build Readiness:** Next.js 15 production build compiles cleanly with zero warnings or errors.

---

## 📄 License & Integrity Statement

BreatheWise AI is built with scientific and regulatory rigor. All air quality breakpoint calculations, emissions factors, and regulatory triggers are executed deterministically with full automated test coverage.

**Author:** Pavan Karthikeya Atchyuta  
**Challenge:** PromptWars Virtual Challenge 6 (November 2026)  
**License:** MIT
