# BreatheWise AI
### An Intelligent, Family-First Urban Air Quality and Sustainable Living Assistant
**PromptWars Virtual Challenge 6: Urban Air Quality Assistant**

[![Test Suite](https://img.shields.io/badge/Vitest-86%2F86%20Passing-brightgreen.svg)](#testing-and-verification)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Verified-blue.svg)](#technical-architecture)
[![CPCB Compliance](https://img.shields.io/badge/CPCB%20NAQI-8%20Pollutants%20Verified-emerald.svg)](#1-official-cpcb-8-pollutant-naqi-engine)
[![CAQM GRAP](https://img.shields.io/badge/CAQM%20GRAP-Stages%20I--IV%20Compliant-rose.svg)](#6-community--school-action-hub)
[![Zero Fake Sensors](https://img.shields.io/badge/Scientific%20Integrity-Zero%20Fake%20Sensors-amber.svg)](#3-dynamic-indoor-air-quality-coach)
[![Live Demo](https://img.shields.io/badge/Production%20Deployment-Vercel%20Live-success.svg)](https://breathe-wise-ai-ivxy.vercel.app/)

**Live Application:** [https://breathe-wise-ai-ivxy.vercel.app/](https://breathe-wise-ai-ivxy.vercel.app/)  
**GitHub Repository:** [https://github.com/pavankarthikeyaatchyuta-lab/BreatheWise-AI](https://github.com/pavankarthikeyaatchyuta-lab/BreatheWise-AI)

---

## 1. Problem Statement Alignment

> **Challenge 6 Problem Statement:**
> "Create a GenAI-powered assistant that helps families and communities navigate severe winter smog and urban air pollution. The application should suggest low-emission daily routines, indoor air quality hacks, and sustainable alternatives tailored to their location and lifestyle, while clearly explaining the direct impact of their choices."

BreatheWise AI is built to transform complex environmental data into grounded, trustworthy, and actionable daily family decisions:
1. **Functional GenAI-Powered Assistance**: Grounded Google Gemini layer translating complex data into human actions.
2. **Support for Families and Communities**: Tailored for vulnerable groups (infants, children, elderly, asthmatics) and communities (schools, RWAs).
3. **Severe Winter Smog Focus**: Captures diurnal thermal inversion dynamics (morning and evening boundary layer compression vs afternoon dispersion).
4. **Low-Emission Daily Routine Recommendations**: Timed routines, schedule adaptations, and anti-idling practices.
5. **Indoor Air-Quality Improvements & Sustainable Alternatives**: Kitchen exhaust timing, wet mopping, safe DIY Corsi-Rosenthal filtration, and transit mode switching.
6. **Location & Lifestyle Personalization with Explainable Impact**: 3-tiered impact intelligence (Personal Exposure Shift, Local Tailpipe $\text{PM}_{2.5}$, and $\text{CO}_2\text{e}$ with full mathematical proofs).

---

## 2. Core Modules & Innovations

### 1. Official CPCB 8-Pollutant NAQI Engine
- Evaluates all eight statutory criteria pollutants: $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, $\text{CO}$, $\text{O}_3$, $\text{NH}_3$, $\text{Pb}$.
- Enforces strict statutory averaging periods: 24h average ($\ge 16\text{h}$ monitored data required) for particulates, $\text{NO}_2$, $\text{SO}_2$, $\text{NH}_3$, $\text{Pb}$; 8h for $\text{CO}$ and $\text{O}_3$.
- Requires a minimum of 3 valid pollutants, of which at least one must be $\text{PM}_{2.5}$ or $\text{PM}_{10}$.
- Identifies the dominant pollutant and maps to official CPCB health impact categories.

### 2. Transparent Environmental Data Provenance
- Distinguishes physical ground monitoring station measurements (`MEASURED_STATION`) from atmospheric forecast models (`ATMOSPHERIC_MODEL_FORECAST`).
- Explicitly documents that Open-Meteo Copernicus CAMS data has $\sim 45\text{ km}$ spatial resolution and does not claim false street-level precision.
- Displays data freshness, timestamps, and attribution links.

### 3. Dynamic Indoor Air Quality Coach
- **Zero Fake Sensors Integrity Policy**: Without physical indoor hardware sensors, the application **never displays fabricated indoor AQI numbers**.
- **Dynamic Ventilation Advisor**: Recommends keeping windows sealed during severe outdoor smog ($>120\,\mu\text{g/m}^3$) and identifies midday boundary layer dispersion windows for brief cross-ventilation.
- **Cooking Smog Management**: Specific protocols for Indian cooking (tadka, deep frying) requiring 2-minute pre-exhaust and 5-minute post-exhaust operation with kitchen door isolation.
- **Aerodynamic Dust Dynamics**: Enforces wet mopping over dry broom sweeping (which re-suspends settled coarse and fine particulates for hours).
- **Safe DIY Corsi-Rosenthal Filtration Blueprint**: Specifies thermally protected box fan motors (to prevent fire hazards from static backpressure), MERV 13+ (or ISO 16890 ePM1 50%+) media, corner taping, and gaseous pollutant limitations.

### 4. Sustainable Alternatives & Passenger-Kilometre (pkm) Modeling
- Models 8 transport modes: Solo Petrol Car, Solo Diesel Car, Carpool (4p), Motorcycle 125cc, Delhi Metro, CNG Municipal Bus, Electric Bus, and Walking/Cycling.
- Compares direct trip cost (₹), duration (mins), local tailpipe $\text{PM}_{2.5}$ (g), and lifecycle $\text{CO}_2\text{e}$ (kg).
- **Exposure vs Emissions Honesty**: Warns that walking or cycling on high-traffic diesel corridors during smog peaks increases personal inhaled particulate dose by $300\text{--}500\%$ due to elevated minute ventilation, despite zero tailpipe emissions.

### 5. 3-Tier Explainable Impact Intelligence
- **Tier 1 (Personal Exposure Shift)**: Hours shifted away from peak ambient smog episodes ($>300\text{ AQI}$). Transparently disclaims that this is an exposure-duration proxy, not an unmeasured clinical inhaled dose.
- **Tier 2 (Local Tailpipe Emissions Avoided)**: Grams of $\text{PM}_{2.5}$ avoided at street level calculated via ARAI/CPCB fleet emission factors.
- **Tier 3 (Greenhouse Gas CO2e Reduction)**: Calculated using the Central Electricity Authority (CEA) Indian National Grid emissions factor ($0.716\text{ kg CO}_2\text{/kWh}$) for electric transit and ARAI fuel economy benchmarks.
- **Interactive Calculation Proof Modal**: Discloses all formulas, assumptions, units, and scientific citations.

### 6. Community & School Action Hub
- **Statutory CAQM GRAP Alignment**: Tracks Stages I through IV for Delhi-NCR with specific administrative orders (diesel generator regulations, BS-III petrol/BS-IV diesel vehicle bans, school closures).
- **Non-NCR Geographic Distinction**: Explicitly notes that GRAP is statutory only in Delhi-NCR, providing advisory guidance for other states.
- **One-Click WhatsApp Bulletin**: Generates cleanly formatted daily action summaries for school groups and Resident Welfare Associations (RWAs).

### 7. Grounded Gemini AI Assistant
- Server-side route handler with API key protection (`GEMINI_API_KEY` never touches client).
- Injects validated CPCB data, active GRAP stages, and user constraints into the prompt context.
- Zod schema validation ensures structured, reliable responses.
- Resilient deterministic fallback guarantees 100% functionality even during external API downtime or rate-limits.

---

## 3. Technical Architecture

```
BreatheWise/
├── docs/
│   ├── COMPETITOR_RESEARCH.md       # Full landscape & gap analysis
│   ├── PRODUCT_REQUIREMENTS.md      # Official PRD with FRs and NFRs
│   ├── TECHNICAL_ARCHITECTURE.md    # System design & security boundaries
│   ├── DATA_SOURCES.md              # Data provenance & resolution matrix
│   ├── CALCULATION_METHODOLOGY.md   # Mathematical equations & emission factors
│   └── IMPLEMENTATION_PLAN.md       # Phased roadmap & verification checklist
├── src/
│   ├── app/                         # Next.js 15 App Router pages & API routes
│   │   ├── page.tsx                 # Air Intelligence Dashboard
│   │   ├── planner/page.tsx         # Smart Daily Routine Planner
│   │   ├── indoor-coach/page.tsx    # Dynamic Indoor Air Quality Coach
│   │   ├── alternatives/page.tsx    # Sustainable Alternatives Comparison
│   │   ├── impact/page.tsx          # Explainable Impact Intelligence
│   │   ├── community/page.tsx       # Community & School Guidance (CAQM GRAP)
│   │   ├── assistant/page.tsx       # Grounded Gemini Conversational Assistant
│   │   └── api/
│   │       ├── aqi/route.ts         # Provider aggregator & CPCB engine
│   │       └── chat/route.ts        # Grounded Gemini server-side route
│   ├── components/layout/           # Navbar, Footer, MobileNav
│   ├── lib/
│   │   ├── aqi/                     # cpcb-calc.ts, open-meteo.ts, openaq.ts, demo-data.ts
│   │   ├── engine/                  # planner-engine.ts, indoor-engine.ts, alternatives.ts, impact-engine.ts, grap-engine.ts
│   │   ├── ai/                      # gemini-client.ts, prompt-guard.ts, schemas.ts, fallback-ai.ts
│   │   └── types/                   # aqi.ts, user.ts, planner.ts, alternatives.ts, impact.ts
│   └── tests/                       # 60 automated unit and integration tests
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vitest.config.ts
```

---

## 4. Testing and Verification

BreatheWise AI is backed by **60 automated Vitest unit and integration tests**:

```bash
# Run all automated tests
npm run test

# Run TypeScript strict type-check
npx tsc --noEmit

# Run production build
npm run build
```

### Verified Test Suites:
1. `tests/cpcb-calc.test.ts` (14 tests): CPCB linear sub-index interpolation for all 8 pollutants, breakpoint boundaries, $\ge 3$ pollutants rule, mandatory particulate requirement, 24h averaging with $\ge 16\text{h}$ check, and dominant pollutant resolution.
2. `tests/data-provenance.test.ts` (7 tests): Provenance tagging (`MEASURED_STATION`, `ATMOSPHERIC_MODEL_FORECAST`, `DEMO_RECORD`), $\sim 45\text{ km}$ resolution metadata, diurnal inversion peak and relative low window detection.
3. `tests/grap-regulatory.test.ts` (7 tests): CAQM Stages I to IV evaluation, diesel generator rules, and statutory NCR vs non-NCR advisory distinction.
4. `tests/indoor-coach.test.ts` (7 tests): Zero-sensor disclaimer verification, dynamic ventilation checks, cooking exhaust timing, wet mopping resuspension, and Corsi-Rosenthal motor safety specifications.
5. `tests/impact-engine.test.ts` (9 tests): 3-tier decoupling verification, personal exposure hours, local tailpipe $\text{PM}_{2.5}$ formulas, CEA grid-intensity lifecycle $\text{CO}_2\text{e}$ formulas, and transparent calculation proofs.
6. `tests/alternatives.test.ts` (7 tests): Passenger-km emissions across all 8 modes, occupancy scaling, and exposure vs emissions truth.
7. `tests/prompt-defense.test.ts` (9 tests): Protection against "ignore previous instructions" jailbreaks, "DAN" exploits, system prompt extraction, HTML tag stripping, and Zod fallback generation.

---

## 5. Getting Started & Installation

### Prerequisites
- Node.js 18+ (tested on Node v24.13.0)
- npm 9+

### Setup
```bash
# 1. Clone or navigate to the repository
cd BreatheWise

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for demo/fallback)
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Scientific References & Data Sources
- **Central Pollution Control Board (CPCB)**: *National Air Quality Index (NAQI) Breakpoints & Technical Guidelines*, MoEFCC, Govt. of India.
- **Central Electricity Authority (CEA)**: *CO₂ Baseline Database for the Indian Power Sector*, Version 22.0 (August 2026, Weighted Average for FY 2025–26: 0.675 tCO₂/MWh).
- **Automotive Research Association of India (ARAI)**: *Fleet Emission Factors for Indian Transport Sector*.
- **Commission for Air Quality Management (CAQM)**: *Statutory Graded Response Action Plan (GRAP) for NCR and Adjoining Areas*.
- **Open-Meteo**: *Copernicus Atmosphere Monitoring Service (CAMS) & NOAA Global Forecast System*.
