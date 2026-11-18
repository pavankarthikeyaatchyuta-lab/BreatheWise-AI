# Implementation Plan & Execution Checklist
## Project: BreatheWise AI
### PromptWars Virtual Challenge 6

---

## 1. Work Breakdown & Task Checklist

### Phase 0: Research, Architecture & Methodology (Completed)
- [x] Workspace inspection (empty root, node v24.13.0, npm v11.21.0, git v2.53.0).
- [x] Competitor research & gap analysis (`docs/COMPETITOR_RESEARCH.md`).
- [x] Product requirements document (`docs/PRODUCT_REQUIREMENTS.md`).
- [x] Technical architecture specification (`docs/TECHNICAL_ARCHITECTURE.md`).
- [x] Data sources & provenance matrix (`docs/DATA_SOURCES.md`).
- [x] Calculation methodology & emission factor documentation (`docs/CALCULATION_METHODOLOGY.md`).
- [x] Implementation plan & verification roadmap (`docs/IMPLEMENTATION_PLAN.md`).

### Phase 1: Foundation & Project Scaffolding
- [ ] Initialize Next.js 15 project with TypeScript, Tailwind CSS, ESLint.
- [ ] Install dependencies: `lucide-react`, `zod`, `@google/genai`, `clsx`, `tailwind-merge`.
- [ ] Configure Vitest and `@testing-library/react` testing environment.
- [ ] Set up environment configuration (`.env.example`).
- [ ] Create core type definitions (`src/lib/types/`).
- [ ] Build shared UI layout (Navbar, Header with live status, Footer).

### Phase 2: Deterministic Business Engines & Calculation Suite
- [ ] Implement CPCB 8-pollutant calculation engine (`src/lib/aqi/cpcb-calc.ts`):
  - Linear sub-index interpolation for all 8 pollutants.
  - Averaging period enforcement (24h with $\ge 16\text{h}$ check, 8h).
  - Validation: $\ge 3$ pollutants and mandatory PM2.5/PM10 requirement.
  - Dominant pollutant resolution.
- [ ] Implement Data Providers (`src/lib/aqi/`):
  - Open-Meteo atmospheric forecast adapter (~45 km resolution metadata).
  - OpenAQ v3 ground-station adapter.
  - Demonstration winter smog datasets (Delhi, Mumbai, Bengaluru, Kolkata).
- [ ] Implement Constraint & Routine Planner Engine (`src/lib/engine/planner-engine.ts`):
  - Diurnal smog curve analysis.
  - Relative exposure window detector.
  - Vulnerability profile adaptation.
- [ ] Implement Dynamic Indoor Coach Engine (`src/lib/engine/indoor-engine.ts`):
  - Dynamic ventilation logic based on outdoor PM2.5.
  - Cooking exhaust protocols.
  - Safe Corsi-Rosenthal DIY box fan specifications.
- [ ] Implement Sustainable Alternatives Engine (`src/lib/engine/alternatives.ts`):
  - Passenger-km transport comparison.
  - Occupancy adjustments.
  - Exposure vs emissions trade-off evaluation.
- [ ] Implement 3-Tier Explainable Impact Engine (`src/lib/engine/impact-engine.ts`):
  - Tier 1: Personal exposure hours shifted.
  - Tier 2: Local tailpipe PM2.5 avoided (g).
  - Tier 3: GHG CO2e reduction (kg) with CEA/ARAI constants.
  - Calculation proof generator.
- [ ] Implement CAQM GRAP Regulatory Engine (`src/lib/engine/grap-engine.ts`):
  - NCR vs Non-NCR distinction.
  - Stage I to IV criteria and actions.

### Phase 3: Comprehensive Automated Testing (Target $\ge 50$ Tests)
- [ ] `tests/cpcb-calc.test.ts` (14 tests for all 8 pollutants, 16h requirement, $\ge 3$ pollutants rule, edge cases).
- [ ] `tests/data-provenance.test.ts` (6 tests for provenance tagging, timestamps, stale data, fallback).
- [ ] `tests/grap-regulatory.test.ts` (6 tests for CAQM NCR stages vs non-NCR advisory).
- [ ] `tests/indoor-coach.test.ts` (6 tests for dynamic ventilation, cooking smoke, Corsi-Rosenthal safety).
- [ ] `tests/impact-engine.test.ts` (8 tests for 3-tier calculations, pkm, occupancy, CEA grid factors).
- [ ] `tests/alternatives.test.ts` (6 tests for mode switching, trade-off radar, exposure honesty).
- [ ] `tests/prompt-defense.test.ts` (6 tests for injection prevention, sanitization, schema validation).
- [ ] Verify 100% test pass rate with Vitest.

### Phase 4: UI Modules & Responsive Experience
- [ ] Build Air Intelligence Dashboard (`src/app/page.tsx`):
  - CPCB AQI card with dominant pollutant and health category.
  - Provenance & Freshness badge.
  - 8-pollutant breakdown grid.
  - 24-hour diurnal forecast trend graph.
- [ ] Build Smart Daily Routine Planner (`src/app/planner/page.tsx`):
  - Household vulnerability selector.
  - Interactive routine timeline with before/after adaptation.
  - Relative diurnal low window visualizer.
- [ ] Build Dynamic Indoor Air Coach (`src/app/indoor-coach/page.tsx`):
  - Zero-sensor integrity banner.
  - Dynamic ventilation recommendation card.
  - Cooking smoke mitigation guide.
  - Safe Corsi-Rosenthal DIY box filter step-by-step blueprint.
- [ ] Build Sustainable Alternatives Switcher (`src/app/alternatives/page.tsx`):
  - Commute mode comparator.
  - Multi-dimensional trade-off matrix.
  - Inhaled exposure vs vehicle emissions honesty panel.
- [ ] Build Explainable Impact Intelligence (`src/app/impact/page.tsx`):
  - 3-tier impact summary card.
  - Interactive "View Calculation Proof" modal with formulas and citations.
- [ ] Build Community & School Mode (`src/app/community/page.tsx`):
  - Statutory CAQM GRAP tracker.
  - School morning sports & assembly advisory.
  - One-click copyable WhatsApp bulletin for RWAs.

### Phase 5: Grounded Gemini AI Assistant
- [ ] Implement server-side route handler (`src/app/api/chat/route.ts`).
- [ ] Implement prompt injection sanitization (`src/lib/ai/prompt-guard.ts`).
- [ ] Implement grounded context builder injecting verified CPCB data and planner rules.
- [ ] Integrate `@google/genai` with configurable model and server-side secret handling.
- [ ] Implement Zod structured schema validation.
- [ ] Implement deterministic offline fallback conversational agent.
- [ ] Build Assistant UI page (`src/app/assistant/page.tsx`) with grounded context inspector.

### Phase 6: Verification, Production Build & Submission Documentation
- [ ] Run full automated test suite (`npm run test`).
- [ ] Run TypeScript strict type-check (`npx tsc --noEmit`).
- [ ] Run ESLint check (`npm run lint`).
- [ ] Verify production build (`npm run build`).
- [ ] Author comprehensive `README.md` with architecture, data sources, and demo walkthrough.
- [ ] Create walkthrough artifact.
