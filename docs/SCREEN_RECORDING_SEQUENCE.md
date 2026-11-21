# BreatheWise AI — Screen Recording Sequence & Checklist

**Project:** BreatheWise AI — Urban Air Quality & Sustainable Living Assistant  
**Challenge:** PromptWars Virtual Challenge 6  
**Format:** Full HD 1080p (60fps recommended) Screen Capture  

---

## 1. Pre-Recording Setup Checklist
- [x] Application running locally on `http://localhost:3000` or deployed Vercel link.
- [x] Browser zoomed to 100% at 1920x1080 resolution.
- [x] Browser developer console closed or clean (no red errors).
- [x] Initial selected city set to **Delhi-NCR** (AQI 425 Severe) to highlight high-smog features.
- [x] Test terminal ready to showcase Vitest 84/84 tests passing.

---

## 2. Step-by-Step Screen Sequence

### Scene 1: Platform Overview (0:00 – 0:25)
- **Starting URL:** `http://localhost:3000`
- **Visual Focus:**
  - Header with greeting: *"Good Morning, Pavan!"*
  - CPCB NAQI Gauge showing **425 Severe** in vibrant orange-red with pulsing indicator.
  - 8 Criteria Pollutants card: PM2.5 (312), PM10 (480), NO2 (88), SO2 (24), CO (2.8), O3 (45), NH3 (35), Pb (0.8).
  - Provenance Pill: `CPCB Anand Vihar (CAAQMS)` with `DEMO_RECORD` explicit badge.
  - 24-Hour Diurnal AQI Forecast chart with Morning and Evening Inversion spikes clearly indicated.

### Scene 2: Evaluator Demo Mode & Multilingual Switcher (0:25 – 0:50)
- **Interactive Action:**
  - Click the **"Evaluator Demo Scenarios"** button in the header.
  - Point mouse to the 3 scenarios:
    1. Working Professional & Daily Commuter
    2. Family with School Child (Zero Purifiers)
    3. Senior Citizen Household with Outdoor Walk Preference
  - Select **Scenario 2: Family with School Child (Zero Purifiers)**.
  - Show the amber-green banner slide in: *"Evaluator Scenario Family with School Child (Zero Purifiers): Commute: Two-Wheeler (6 km) • Children: Yes • Elderly: No • Zero Purifier"*.
  - Click the Language buttons: Click **"తె"** to show Telugu navigation (*డ్యాష్‌బోర్డ్, రోజువారీ ప్రణాళిక*), click **"हि"** to show Hindi (*डैशबोर्ड, दैनिक दिनचर्या प्लानर*), then switch back to **"EN"**.

### Scene 3: Smart Daily Routine Planner (0:50 – 1:20)
- **Navigate to:** `http://localhost:3000/planner`
- **Visual Focus:**
  - Date and Family Profile Bar showing **1 Child (6-12 yrs)** and **Commute: Two-Wheeler**.
  - Optimized Daily Plan:
    - 6:30 AM: Morning Fitness moved indoors (`AVOID_ACTIVITY`).
    - 8:05 AM: School Commute shifted by 20 minutes to prevent student exposure to idling vehicle wakes (`N95_RESPIRATOR` required).
    - 1:00 PM: Afternoon Boundary Layer expansion window for fresh air flush.
  - Child Health Advisory box: *"Children breathe more air per kilogram of body weight than adults..."*
  - Anti-Idling PCRA guideline warning box.

### Scene 4: Indoor Air Quality Coach & Houseplant Fact-Check (1:20 – 1:50)
- **Navigate to:** `http://localhost:3000/indoor-coach`
- **Visual Focus:**
  - Window Ventilation Advisor card showing *"Not Recommended"* (Keep windows sealed during 312 µg/m³ PM2.5).
  - Cooking Smog Control card: Kitchen exhaust fan usage and partition closure.
  - Click **"Guide"** on the DIY Air Filter card to open the **Corsi-Rosenthal Box Blueprint modal**.
  - Scroll through the box fan safety prerequisites (thermal fuse, motor rating) and MERV 13 specs. Close modal.
  - Scroll down to the amber card: **"Scientific Fact-Check: Can Indoor Houseplants Filter PM2.5 Smog?"** highlighting the limitation of the 1989 NASA study and affirming mechanical filtration as the only proven particulate removal method.

### Scene 5: Sustainable Alternatives & Impact Intelligence (1:50 – 2:20)
- **Navigate to:** `http://localhost:3000/alternatives`
  - Adjust commute slider to 14 km.
  - Compare Solo Petrol Car vs Delhi Metro vs CNG Bus.
  - Show cost savings, PM2.5 tailpipe reduction, and CO2e savings.
- **Navigate to:** `http://localhost:3000/impact`
  - Show decoupled 3-tier metrics:
    1. Exposure Shift: -2.5 hours away from high pollution (>300 AQI).
    2. Local PM2.5 Avoided: -0.36 g/day (tailpipe mass).
    3. CO2e Reduction: -1.14 kg/day (GHG).
  - Click **"View Calculation Proof"** to reveal modal with ARAI emission factors and CEA Baseline Database v19 grid intensity (0.716 kg CO2/kWh).

### Scene 6: Grounded AI Assistant (2:20 – 2:50)
- **Navigate to:** `http://localhost:3000/assistant`
- **Visual Focus:**
  - Grounding indicator showing *Delhi-NCR: AQI 425 • PM2.5 • Scenario: Child Protection*.
  - Click prompt chip: *"Is it safe for my child to play outside this evening?"*
  - Display streamed/loaded structured response from Gemini:
    - Authoritative guidance addressing pediatric airway vulnerability.
    - Grounded Factors: AQI 425, GRAP Stage III.
    - Action checklist categorized into SCHEDULE, INDOOR, and COMMUNITY.
    - Prominent clinical disclaimer.

### Scene 7: Wrap-up & Engineering Rigor (2:50 – 3:00)
- **Show Terminal:**
  - Split screen or brief cut to terminal showing:
    - `npm run test -- --run` -> **10 passed (10), 84 passed (84)**.
    - `npm run lint` -> **No ESLint warnings or errors**.
    - `npx tsc --noEmit` -> **0 errors**.
    - `npm run build` -> **12/12 routes static and dynamic**.
- End on clean BreatheWise AI brand logo.
