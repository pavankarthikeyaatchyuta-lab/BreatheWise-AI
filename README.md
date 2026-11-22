# BreatheWise AI 🍃
### Intelligent, Family-First Urban Air Quality & Sustainable Living Assistant

> **PromptWars Virtual Challenge 6 Problem Statement:**  
> *"Create a GenAI-powered assistant that helps families and communities navigate severe winter smog and urban air pollution. The application should suggest low-emission daily routines, indoor air quality hacks, and sustainable alternatives tailored to their location and lifestyle, while clearly explaining the direct impact of their choices."*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://breathe-wise-ai-ivxy.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7_Strict-blue)](https://github.com/pavankarthikeyaatchyuta-lab/BreatheWise-AI)
[![Tests](https://img.shields.io/badge/tests-87%20passing-success)](https://github.com/pavankarthikeyaatchyuta-lab/BreatheWise-AI)
[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black)](https://breathe-wise-ai-ivxy.vercel.app/)
[![Production Deployment](https://img.shields.io/badge/Vercel-Live%20Operational-success?logo=vercel)](https://breathe-wise-ai-ivxy.vercel.app/)

---

## 🌐 Quick Links & Live Application

* **Live Application:** [https://breathe-wise-ai-ivxy.vercel.app/](https://breathe-wise-ai-ivxy.vercel.app/) *(Hosted on Vercel Edge)*
* **Public GitHub Repository:** [https://github.com/pavankarthikeyaatchyuta-lab/BreatheWise-AI](https://github.com/pavankarthikeyaatchyuta-lab/BreatheWise-AI)

---

## 🌟 Product Overview & Core Promise

BreatheWise AI is an intelligent, family-first environmental assistant designed to navigate severe winter smog and urban air pollution across Indian metropolitan regions. Rather than relying on static advisory widgets or ungrounded generative text, BreatheWise AI pairs **Grounded Generative AI Assistance** with a **Deterministic Environmental Engine**:

1. **Generative AI Layer:** Server-side Google Gemini orchestration (with support for `gemini-2.5-flash` and `gemini-3.8-flash`) delivering culturally resonant, multilingual (English, Hindi, Telugu) lifestyle advice. All incoming requests and outgoing structured responses are validated against runtime Zod schemas, with instant deterministic fallback under API capacity limits.
2. **Deterministic Environmental Engine:** Executes exact Central Pollution Control Board (CPCB) piecewise linear interpolation math, enforces the Commission for Air Quality Management (CAQM) Graded Response Action Plan (GRAP) regulatory directives, evaluates diurnal boundary-layer shifts, and calculates emissions reductions cited directly from the **Central Electricity Authority (CEA) Baseline Database Version 22.0**.

---

## 📋 Challenge Requirements Traceability Matrix

| Requirement | Implementation in BreatheWise AI | Verified Module / Route |
| :--- | :--- | :--- |
| **1. Severe Winter Smog & Urban Pollution** | Real-time CPCB NAQI Hero card, diurnal atmospheric boundary layer tracking ($6:00-9:30\text{ AM}$ & $19:30-22:00\text{ PM}$ thermal inversion compression vs midday solar dispersion), and dominant pollutant diagnostics. | [`/`](src/app/page.tsx), [`src/lib/aqi/cpcb-calc.ts`](src/lib/aqi/cpcb-calc.ts) |
| **2. Low-Emission Daily Routines** | Personalized family schedule builder that shifts outdoor exertion away from nocturnal boundary layer compression into afternoon dispersion windows based on hourly forecasts. | [`/planner`](src/app/planner/page.tsx), [`src/lib/engine/planner-engine.ts`](src/lib/engine/planner-engine.ts) |
| **3. Indoor Air Quality Hacks** | Evidence-based procedural coach enforcing **Zero Fake Sensors Policy**. Includes cooking exhaust protocols, wet mopping over dry sweeping, and fire-safe DIY Corsi-Rosenthal box blueprints. | [`/indoor-coach`](src/app/indoor-coach/page.tsx), [`src/lib/engine/indoor-engine.ts`](src/lib/engine/indoor-engine.ts) |
| **4. Sustainable Alternatives** | Multi-modal transit comparison (8 transport modes) with passenger-kilometre (pkm) emissions modeling, vehicle occupancy scaling, and verified operational disclosures (e.g. Patna Metro Rail priority section). | [`/alternatives`](src/app/alternatives/page.tsx), [`src/lib/engine/alternatives.ts`](src/lib/engine/alternatives.ts) |
| **5. Explainable Impact Intelligence** | Strictly decouples Personal Exposure Shift (hrs), Local Street Tailpipe $\text{PM}_{2.5}$ (g), and Grid Lifecycle $\text{CO}_2\text{e}$ (kg) with interactive calculation proofs citing CEA Version 22.0. | [`/impact`](src/app/impact/page.tsx), [`src/lib/engine/impact-engine.ts`](src/lib/engine/impact-engine.ts) |
| **6. Community & School Action** | Statutory CAQM GRAP tracking (Stages I–IV), school sports restrictions, RWA open-burning bans, and one-click WhatsApp community broadcast generator. | [`/community`](src/app/community/page.tsx), [`src/lib/engine/grap-engine.ts`](src/lib/engine/grap-engine.ts) |
| **7. Grounded AI Assistance** | Multilingual assistant (English, Telugu, Hindi) with two-stage prompt injection defense, server-side secret isolation, and streaming responses with deterministic fallback. | [`/assistant`](src/app/assistant/page.tsx), [`src/lib/ai/gemini-client.ts`](src/lib/ai/gemini-client.ts) |

---

## 🏛 7-Panel Application Architecture

| View / Module | Route | Primary Purpose & Key Capabilities |
| :--- | :--- | :--- |
| **1. Air Intelligence Dashboard** | [`/`](https://breathe-wise-ai-ivxy.vercel.app/) | CPCB NAQI Hero card, dynamic 24h diurnal forecast graph with inversion threshold gating ($\ge 80\,\mu\text{g/m}^3$), dominant pollutant badge, and active advisory. |
| **2. Daily Routine Planner** | [`/planner`](https://breathe-wise-ai-ivxy.vercel.app/planner) | Low-exposure family routine builder with morning/evening smog window shifting, commute departure timing, and indoor exercise alternatives. |
| **3. Indoor Air Coach** | [`/indoor-coach`](https://breathe-wise-ai-ivxy.vercel.app/indoor-coach) | Evidence-based procedural coach (zero fabricated numbers). Features dynamic ventilation guidance, cooking exhaust isolation, and fire-safe DIY Corsi-Rosenthal box blueprints. |
| **4. Sustainable Alternatives** | [`/alternatives`](https://breathe-wise-ai-ivxy.vercel.app/alternatives) | Multi-modal transit comparison (8 modes) with distance slider, passenger occupancy scaling, and verified route disclosures (Patna Metro Rail priority section). |
| **5. Impact Intelligence** | [`/impact`](https://breathe-wise-ai-ivxy.vercel.app/impact) | Decouples Personal Exposure Shift (hrs), Local Tailpipe $\text{PM}_{2.5}$ (g), and Grid $\text{CO}_2\text{e}$ (kg). Features transparent Calculation Proof Modal citing CEA v22.0. |
| **6. Community & School Hub** | [`/community`](https://breathe-wise-ai-ivxy.vercel.app/community) | Dynamic CAQM GRAP Stage indicator, school sports restrictions, RWA open-burning bans, and one-click WhatsApp community broadcast generator. |
| **7. Grounded AI Assistant** | [`/assistant`](https://breathe-wise-ai-ivxy.vercel.app/assistant) | Conversational assistant supporting English, Telugu (తెలుగు), and Hindi (हिन्दी). Evaluator scenarios (Commuter, Child, Senior) with transparent audit metadata. |

---

## 🔬 Scientific Grounding & Regulatory Rigor

### A. Official CPCB 8-Pollutant NAQI Engine
BreatheWise AI implements the exact piecewise linear interpolation formula mandated by the Central Pollution Control Board (MoEFCC):

$$I_p = \frac{I_{HI} - I_{LO}}{B_{HI} - B_{LO}} \cdot (C_p - B_{LO}) + I_{LO}$$

* **All 8 Criteria Pollutants Supported**: $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, $\text{CO}$, $\text{O}_3$, $\text{NH}_3$, $\text{Pb}$.
* **Continuous Midpoint Interpolation**: Uses continuous interval boundary bridging to ensure decimal concentrations never return empty/null sub-indices.
* **Statutory Averaging Enforced**: 24h average ($\ge 16\text{h}$ monitored data required) for particulates, $\text{NO}_2$, $\text{SO}_2$, $\text{NH}_3$, and $\text{Pb}$; 8h average for $\text{CO}$ and $\text{O}_3$.
* **Statutory Validity Rules**: Requires $\ge 3$ valid pollutants, of which at least one must be a particulate matter indicator ($\text{PM}_{2.5}$ or $\text{PM}_{10}$). Atmospheric model forecasts are clearly distinguished as `ATMOSPHERIC_MODEL_FORECAST` with `isValidOfficial: false`.

### B. CEA Baseline Carbon Dioxide Emissions Database Version 22.0
All electricity and mass-transit grid emissions utilize the latest **Central Electricity Authority (CEA) Baseline Database Version 22.0 (August 2026, FY 2025–26)**:
* **Weighted Average Factor**: **$0.675\text{ tCO}_2/\text{MWh}$** ($0.675\text{ kg CO}_2/\text{kWh}$).
* **DMRC Metro Specific Energy**: $0.0363\text{ kWh/pkm} \times 0.675\text{ kg CO}_2/\text{kWh} = 24.5\text{ g CO}_2\text{e/pkm}$.
* **Electric AC Bus Factor**: $0.040\text{ kWh/pkm} \times 0.675\text{ kg CO}_2/\text{kWh} = 27\text{ g CO}_2\text{e/pkm}$.
* Fully synchronized across `impact-engine.ts`, `alternatives.ts`, the UI Calculation Proof modal, and test suites.

### C. Zero Fake Sensors & Transparent Provenance
* **No Fabricated Indoor Telemetry**: Without physical indoor hardware, BreatheWise AI strictly refuses to invent indoor AQI numbers.
* **Model Resolution Disclosures**: Live atmospheric model telemetry from Open-Meteo / Copernicus CAMS Global explicitly discloses its $\sim 45\text{ km}$ spatial grid and 3-hourly underlying model resolution, never claiming artificial street-level precision.
* **Strict Non-Live Badging**: Fallback and historical reference records are labeled `DEMO_RECORD` and cannot appear as live station measurements.

---

## 🔒 Security & Privacy Defense

* 🔐 **Server-Side Key Isolation**: `GEMINI_API_KEY` is strictly confined to server-side route execution (`src/app/api/chat/route.ts`). Zero client-side leakage (`NEXT_PUBLIC_` is never used for credentials).
* 🛡️ **Two-Stage Prompt Guardrails**: First-stage regex and semantic checks reject instruction hijacking, role tampering, and system prompt extraction. Second-stage context grounding binds the model to real-world CPCB and GRAP data.
* 🛑 **Input Validation & Rate Limiting**: All client payloads validated using strict Zod schemas (`ChatIncomingRequestSchema`). Built-in sliding-window IP rate limiting (20 requests per minute per IP) prevents abusive request flooding.
* ⏱️ **AbortController Timeout Cancellation**: Upstream external requests are coupled to an `AbortController` signal to abort connection overhead upon timeout.
* 🔒 **Location Privacy by Design**: User coordinates are truncated to 2 decimal places ($\sim 1.1\text{ km}$ neighborhood scale), preventing household address identification.

---

## 🧪 Testing & Verification Suite

The repository contains **87 passing automated tests** across 10 specialized test suites (`vitest`):

```bash
# Run all 87 unit and integration tests
npm run test -- --run

# Run TypeScript strict type-check
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Run Next.js production build
npm run build
```

### Verified Test Suites Breakdown:
1. `tests/cpcb-calc.test.ts` (15 tests): Official CPCB breakpoints, piecewise formulas, 8 criteria pollutants, $\ge 3$ pollutant rule, mandatory particulate checks.
2. `tests/personalization-engine.test.ts` (12 tests): Household vulnerability scoring, infant and senior sensitivity weighting, diurnal routine optimization.
3. `tests/impact-engine.test.ts` (9 tests): Decoupled exposure hours vs tailpipe $\text{PM}_{2.5}$ vs CEA v22.0 grid $\text{CO}_2\text{e}$ lifecycle formulas.
4. `tests/prompt-defense.test.ts` (9 tests): Jailbreak attempts, DAN mode exploits, system prompt extraction, HTML tag sanitization, injection rejection.
5. `tests/data-provenance.test.ts` (8 tests): Station vs model tagging, CAMS $\sim 45\text{ km}$ disclosure, diurnal inversion peak detection.
6. `tests/grap-regulatory.test.ts` (7 tests): CAQM Stages I–IV triggers, diesel generator restrictions, statutory NCR vs advisory non-NCR checks.
7. `tests/indoor-coach.test.ts` (7 tests): Zero-fake-sensors integrity, ventilation heuristic ($>120\,\mu\text{g/m}^3$), cooking exhaust rules, DIY CR-box specifications.
8. `tests/alternatives.test.ts` (7 tests): Passenger-km emissions across 8 modes, occupancy scaling, verified Patna Metro Rail priority section.
9. `tests/audit-resilience.test.ts` (7 tests): Fallback provider metadata, model attribution, error classification, zero key leaks.
10. `tests/gemini-verification.test.ts` (6 tests): Server-side key protection, 7s timeout, Zod output parsing, deterministic fallback takeover.

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18.x or higher (tested on Node `v24.13.0`)
* npm 9.x or higher

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

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📚 Statutory & Environmental References

1. **Central Pollution Control Board (CPCB)**: *National Air Quality Index (NAQI) Breakpoints & Guidelines*, Ministry of Environment, Forest and Climate Change (MoEFCC), Govt. of India (2014).
2. **Commission for Air Quality Management in NCR & Adjoining Areas (CAQM)**: *Statutory Graded Response Action Plan (GRAP)* under Section 12 of the CAQM Act, 2021.
3. **Central Electricity Authority (CEA)**: *CO2 Baseline Database for the Indian Power Sector, Version 22.0 (August 2026)*, Ministry of Power, Govt. of India.
4. **Automotive Research Association of India (ARAI)**: *Emission Factor Benchmarks for Indian On-Road Fleet & Mass Transit Modes*.
5. **Petroleum Conservation Research Association (PCRA)**: *Anti-Idling Fuel Conservation & Urban Emissions Protocol*.
6. **Copernicus Atmosphere Monitoring Service (CAMS)**: *ECMWF Integrated Forecasting System (IFS-AER) Global Atmospheric Composition Model (~45 km resolution)*.

---

**Author:** Pavan Karthikeya Atchyuta  
**Challenge:** PromptWars Virtual Challenge 6 (November 2026)  
**License:** MIT
