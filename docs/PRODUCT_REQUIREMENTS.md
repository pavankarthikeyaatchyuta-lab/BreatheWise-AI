# Product Requirements Document (PRD)
## Project: BreatheWise AI
### PromptWars Virtual Challenge 6: Urban Air Quality Assistant

---

## 1. Executive Summary & Problem Statement

**Challenge 6 Problem Statement:**
> "Create a GenAI-powered assistant that helps families and communities navigate severe winter smog and urban air pollution. The application should suggest low-emission daily routines, indoor air quality hacks, and sustainable alternatives tailored to their location and lifestyle, while clearly explaining the direct impact of their choices."

BreatheWise AI is engineered around six non-negotiable pillars:
1. **Functional GenAI-Powered Assistance**: Grounded Gemini AI integration translating complex data into human actions.
2. **Support for Families and Communities**: Tailored for vulnerable groups (children, elderly, asthmatics) and community groups (RWAs, schools).
3. **Severe Winter Smog & Pollution Focus**: Tailored to thermal inversion episodes, diurnal boundary layer shifts, and regional mitigation.
4. **Low-Emission Daily Routine Recommendations**: Timed routines, commute shifts, and anti-idling practices.
5. **Indoor Air-Quality Improvements & Sustainable Alternatives**: Practical kitchen exhaust protocols, wet mopping, safe DIY Corsi-Rosenthal boxes, transit switching.
6. **Location & Lifestyle Personalization with Explainable Impact**: 3-tiered impact intelligence (Personal Exposure Hours, Local Particulate Avoidance, and GHG CO2e).

---

## 2. User Personas & Scenarios

### Persona 1: Sunita (Urban Parent in Delhi-NCR)
- **Profile**: Working mother of a 6-year-old child and caregiver to a 68-year-old father with mild chronic bronchitis.
- **Pain Points**: Confused by news headlines; doesn't know if morning school bus drop-off is dangerous; cannot afford a ₹25,000 purifier for every bedroom.
- **Needs**: Safe commute windows, morning routine shifts, cooking smoke containment during meal prep, school sports advice.

### Persona 2: Rohit (Two-Wheeler Daily Commuter in Bengaluru/Pune)
- **Profile**: 26-year-old IT professional commuting 16 km each way on a 125cc motorcycle.
- **Pain Points**: Suffers from throat irritation; sits in heavy traffic jams with diesel buses idling directly ahead; wants to know if switching to the metro or carpooling makes economic and health sense.
- **Needs**: Commute comparison, exposure vs emissions honesty, route timing advice.

### Persona 3: Ananya (RWA Secretary / Apartment Society Organizer in Mumbai)
- **Profile**: Volunteer managing a 200-flat residential apartment complex.
- **Pain Points**: Needs actionable society notices regarding diesel generator usage, guard cabin heating during winter nights, and dust suppression during garden trimming.
- **Needs**: Simple, printable, WhatsApp-friendly community bulletins without unnecessary social media bloat.

---

## 3. Functional Requirements & Specifications

### 3.1 Module A: Air Intelligence
- **FR-A1**: Location selection via manual city picker (covering all major Indian metros and tier-2 hubs) and opt-in browser geolocation (truncated to ~1 km for privacy).
- **FR-A2**: CPCB NAQI calculation engine implementing all 8 criteria pollutants with 24h/8h averaging periods, $\ge 16\text{h}$ data completeness, and the $\ge 3\text{ pollutants}$ requirement.
- **FR-A3**: Strict data provenance separation: `MEASURED_STATION` vs `ATMOSPHERIC_MODEL_FORECAST (~45 km resolution)` vs `DEMONSTRATION_MODE`.
- **FR-A4**: 24-hour diurnal forecast trend graph detailing morning thermal inversion spikes vs afternoon boundary layer dispersion.
- **FR-A5**: Real-time pollutant breakdown ($\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, $\text{CO}$, $\text{O}_3$, $\text{NH}_3$, $\text{Pb}$) with WHO and CPCB guideline references.

### 3.2 Module B: Smart Daily Routine Planner
- **FR-B1**: Context intake: vulnerable household members (children, elderly, respiratory sensitivity), primary commute mode, work schedule.
- **FR-B2**: Relative Diurnal Exposure Evaluator: Identifies relative daily low-smog periods without falsely declaring any severe winter window as "100% safe".
- **FR-B3**: Concrete schedule substitutions: e.g., shift morning outdoor exercise to indoor stretching/yoga; adjust commute departure times by 20 minutes to avoid gridlock idling peaks.
- **FR-B4**: Anti-idling guidance for school pickups and signal stops.

### 3.3 Module C: Indoor Air Quality Coach
- **FR-C1**: Strict zero-sensor integrity: banners that indoor readings require physical sensors and provides procedural guidance.
- **FR-C2**: Dynamic ventilation advisor: cross-references outdoor PM2.5 and forecast confidence before recommending window opening.
- **FR-C3**: Cooking emission protocols: pre-exhaust fan activation (2 mins prior to tadka/deep frying), kitchen partition closing.
- **FR-C4**: Dust suppression: wet mopping protocol vs dry broom sweeping.
- **FR-C5**: Safe DIY Corsi-Rosenthal Box specifications: thermally protected motor requirements, MERV 13+ (ePM1 50%+) filter ratings, corner gasket sealing, and maintenance schedules.

### 3.4 Module D: Sustainable Alternatives
- **FR-D1**: Journey comparator: Solo ICE car vs Metro vs Carpooling vs Electric Bus vs Walking/Cycling.
- **FR-D2**: Multi-criteria trade-off evaluation: travel time, direct financial cost (₹), roadside particulate exposure, and tailpipe emissions.
- **FR-D3**: Exposure vs emissions truth: explicit warnings that walking/cycling along congested diesel corridors during smog peaks increases inhaled dose despite zero vehicle emissions.

### 3.5 Module E: Explainable Impact Intelligence
- **FR-E1**: Separation into 3 distinct tiers:
  - *Tier 1 (Personal Exposure)*: Hours shifted away from Severe smog ($>300\text{ AQI}$).
  - *Tier 2 (Local Emissions Avoided)*: Grams of tailpipe $\text{PM}_{2.5}$ avoided based on ARAI factors.
  - *Tier 3 (Greenhouse Gas CO2e)*: Transparent calculation based on CEA grid intensity ($0.716\text{ kg CO}_2\text{e/kWh}$) and vehicle occupancy.
- **FR-E2**: "View Calculation Proof" interactive modal displaying exact formulas, variables, and scientific sources.

### 3.6 Module F: Community & Institutional Mode
- **FR-F1**: Statutory CAQM GRAP tracking for Delhi-NCR, with advisory guidance for non-NCR locations.
- **FR-F2**: School outdoor assembly and physical education recommendations during elevated pollution.
- **FR-F3**: One-click shareable bulletin generator for WhatsApp and residential noticeboards.

### 3.7 Module G: Grounded Gemini AI Assistant
- **FR-G1**: Grounded system prompt injecting live CPCB data, diurnal curves, and user constraints.
- **FR-G2**: Server-side `@google/genai` handler with configurable model (`process.env.GEMINI_MODEL || 'gemini-2.5-flash'`).
- **FR-G3**: Strict anti-hallucination rules prohibiting invention of AQI numbers or medical diagnostic claims.
- **FR-G4**: Zod schema validation on structured AI outputs.
- **FR-G5**: Deterministic rule-based fallback when offline or when no API key is provided.

---

## 4. Non-Functional & Security Requirements
- **Security**: No client-side exposure of `GEMINI_API_KEY` or `OPENAQ_API_KEY`. Server-side route handlers only.
- **Privacy**: No personal medical records collected; vulnerability tags stored locally; location coordinates truncated to ~1 km.
- **Reliability & Availability**: Deterministic fallback for all core algorithms ensures 100% functionality even during complete external API outages.
- **Performance**: Initial page load $<1.5\text{s}$, responsive interaction $<100\text{ms}$.
- **Accessibility**: Semantic HTML5, WCAG 2.1 AA compliant contrast ratios, full keyboard navigability.
- **Testing**: Target $\ge 50$ automated Vitest tests passing with 0 errors.
