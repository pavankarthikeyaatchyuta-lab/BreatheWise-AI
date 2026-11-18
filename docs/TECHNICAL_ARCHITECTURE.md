# Technical Architecture & System Design
## Project: BreatheWise AI

---

## 1. Architectural Philosophy

BreatheWise AI is built on the principle of **Deterministic Core with GenAI Contextual Translation**. 

1. **No AI for Math or Regulatory Decisions**: All CPCB AQI calculations, breakpoint interpolations, passenger-km emissions calculations, and GRAP stage classifications are executed deterministically in TypeScript.
2. **AI as an Empathetic, Grounded Communicator**: Google Gemini is utilized solely to translate complex environmental data and deterministic plan recommendations into compassionate, actionable, and culturally contextualized family advice.
3. **Absolute Transparency on Data Provenance**: Every metric rendered in the UI states whether it is a physical ground-station observation, an atmospheric model forecast (~45 km resolution), or a demonstration dataset.

---

## 2. Component Architecture

```
src/
├── app/
│   ├── layout.tsx              # Root layout with responsive navigation & theme
│   ├── page.tsx                # Main Air Intelligence Dashboard
│   ├── planner/page.tsx        # Smart Daily Routine Planner
│   ├── indoor-coach/page.tsx   # Dynamic Indoor Air Quality Coach
│   ├── alternatives/page.tsx   # Sustainable Alternatives Comparison
│   ├── impact/page.tsx         # Explainable Impact Intelligence & Calculation Proofs
│   ├── community/page.tsx      # Community & School Guidance (CAQM GRAP)
│   ├── assistant/page.tsx      # Grounded Gemini Conversational Assistant
│   ├── settings/page.tsx       # Location preferences & privacy controls
│   └── api/
│       ├── aqi/route.ts        # Air quality provider aggregator & CPCB engine
│       └── chat/route.ts       # Grounded Gemini server-side route
├── components/
│   ├── layout/                 # Navbar, Header, MobileNav, Footer
│   ├── dashboard/              # AQICard, ProvenanceBadge, PollutantGrid, DiurnalChart
│   ├── planner/                # RoutineTimeline, SafeWindowCard, HouseholdConfig
│   ├── coach/                  # DynamicVentilationCard, CookingGuide, CorsiRosenthalCard
│   ├── alternatives/           # CommuteComparator, TradeoffRadar, EmissionTable
│   ├── impact/                 # ThreeTierImpactCard, ProofModal, EmissionFactorReference
│   ├── community/              # GRAPStatusCard, SchoolAdvisoryCard, WhatsAppBulletin
│   └── assistant/              # GroundedChatWindow, ContextInspector, QuickPrompts
├── lib/
│   ├── aqi/
│   │   ├── cpcb-calc.ts        # CPCB 8-pollutant NAQI sub-index math & rules
│   │   ├── open-meteo.ts       # Open-Meteo atmospheric forecast adapter
│   │   ├── openaq.ts           # OpenAQ v3 ground-truth station adapter
│   │   └── demo-data.ts        # Curated Indian winter smog demonstration datasets
│   ├── engine/
│   │   ├── planner-engine.ts   # Diurnal exposure windows & schedule adaptation
│   │   ├── indoor-engine.ts    # Dynamic ventilation & indoor particulate control
│   │   ├── alternatives.ts     # Passenger-km transport comparison & occupancy
│   │   ├── impact-engine.ts    # 3-tier impact calculations (Exposure, Tailpipe, CO2e)
│   │   └── grap-engine.ts      # CAQM statutory rules & regional differentiation
│   ├── ai/
│   │   ├── gemini-client.ts    # Server-side @google/genai SDK integration
│   │   ├── prompt-guard.ts     # Prompt injection detection & sanitization
│   │   ├── schemas.ts          # Zod validation schemas for AI outputs
│   │   └── fallback-ai.ts      # Offline deterministic conversational fallback
│   ├── types/
│   │   ├── aqi.ts              # Data provenance, pollutant readings, CPCB index
│   │   ├── planner.ts          # Routines, vulnerability tags, safe windows
│   │   ├── alternatives.ts     # Modes, pkm, emissions factors
│   │   └── impact.ts           # 3-tier impact models & proof data
│   └── utils/
│       ├── formatters.ts       # Number, date, and unit formatters
│       └── cn.ts               # Tailwind class merger
└── tests/                      # ≥50 Vitest unit, engine, and integration tests
```

---

## 3. Data Flow & Security Boundaries

### 3.1 Environmental Data Pipeline
1. Client requests environmental status for a selected city or truncated coordinate.
2. Server queries OpenAQ for ground-station telemetry. If available and valid, checks timestamps and evaluates CPCB completeness (minimum 3 pollutants, PM2.5/PM10 present, 16h data).
3. Simultaneously queries Open-Meteo for 24-hour hourly forecast curves.
4. If external networks fail, loads high-fidelity curated demonstration profiles for Delhi, Mumbai, Bengaluru, or Kolkata, clearly marked with a `DEMONSTRATION_MODE` badge.
5. All data is normalized with provenance attributes:
   - `type`: `MEASURED_STATION` | `ATMOSPHERIC_MODEL_FORECAST` | `DEMO_RECORD`
   - `source`: Name of station or atmospheric model (e.g. "CPCB Anand Vihar" vs "Open-Meteo / ECMWF CAMS")
   - `resolution`: Spatial (~45 km for model) and temporal (1h / 3h)
   - `freshness`: Timestamp and age in minutes.

### 3.2 AI Grounding Pipeline
1. Client sends conversational query with optional user profile.
2. Server validates request against `prompt-guard.ts` (checks for jailbreak phrases, roleplay escapes, system prompt extraction).
3. Server constructs a grounded prompt injecting verified CPCB data, diurnal curves, and active GRAP stages.
4. Calls `@google/genai` with model `process.env.GEMINI_MODEL || 'gemini-2.5-flash'`.
5. Validates raw response against Zod structured schema (`schemas.ts`). If parsing fails or API returns error/quota exceeded, invokes `fallback-ai.ts` which uses deterministic rules to deliver an accurate response.

---

## 4. Privacy & Data Minimization Strategy

- **No Medical Data Storage**: The application accepts only broad, non-sensitive vulnerability tags (`has_infant_child`, `has_elderly`, `respiratory_sensitivity`).
- **Client-Side Persistence**: User profile preferences reside in browser `localStorage`.
- **Location Precision Truncation**: When browser geolocation is approved by the user, coordinates are rounded to two decimal places ($\approx 1.1\text{ km}$ precision), preventing residential identification.
