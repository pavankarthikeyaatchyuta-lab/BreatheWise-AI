# BreatheWise AI — 3-Minute Hackathon Demo Script & Judge Walkthrough
## PromptWars Virtual Challenge 6: Urban Air Quality Assistant

This document provides a structured, high-impact demonstration walkthrough for judges, evaluators, and reviewers exploring BreatheWise AI.

---

## 1. Demo Overview & Elevator Pitch (0:00 – 0:30)

> *"Welcome to BreatheWise AI. Severe winter smog in urban hubs like Delhi-NCR, Mumbai, and Kolkata leaves millions of families overwhelmed by alarming headlines without practical, trustworthy daily guidance. Existing apps are either clunky government portals with broken telemetry, or commercial storefronts trying to sell ₹25,000 air purifiers using foreign US AQI scales.*
>
> *BreatheWise AI is an intelligent, family-first decision-support platform. It bridges statutory CPCB 8-pollutant NAQI data, CAQM GRAP regulations, and atmospheric forecasts into concrete, budget-sensitive daily actions. It tells you when to shift outdoor workouts indoors, how to ventilate without letting smog inside, how to contain kitchen cooking smoke, which commute alternatives minimize personal exposure, and how communities can coordinate collective mitigation—all with 100% mathematical and scientific transparency."*

---

## 2. Walkthrough Flow (0:30 – 2:30)

### Scene 1: Air Intelligence Command Center (`/`)
1. **Show City Selection**:
   - Select **Delhi-NCR** (Severe winter inversion episode) or click **"Use Location"** (demonstrate privacy-conscious geolocation truncation to $\sim 1\text{ km}$ precision).
2. **Highlight Statutory CPCB NAQI Compliance**:
   - Point out the master AQI card ($450$ Severe), dominant pollutant identification ($\text{PM}_{2.5}$), and statutory CPCB health advisory.
3. **Show Provenance & 8-Pollutant Breakdown**:
   - Point out the provenance badge distinguishing ground stations from Open-Meteo's $\sim 45\text{ km}$ atmospheric model.
   - Point out the 8-pollutant grid showing 24h/8h averaging periods ($\text{PM}_{2.5}, \text{PM}_{10}, \text{NO}_2, \text{SO}_2, \text{CO}, \text{O}_3, \text{NH}_3, \text{Pb}$).
4. **Inspect the 24-Hour Diurnal Forecast Curve**:
   - Explain the diurnal temperature inversion spikes (morning 6:00–9:30 AM & evening 19:30–23:00 PM) vs the afternoon solar boundary-layer expansion low (13:00–16:00 PM).

### Scene 2: Smart Daily Routine Planner (`/planner`)
1. **Configure Household Constraints**:
   - Toggle: "Infants / School Children", "Senior Citizens (60+)", and Commute Mode: "Two-Wheeler".
2. **Review Tailored Schedule Timeline**:
   - Note how the morning 6:30 AM jog is automatically shifted to 3:30 PM indoor yoga/aerobics because exercising in winter inversions multiplies inhaled particulate intake.
   - Note the school drop-off recommendation with child-sized N95 mask requirements and anti-idling guidance at signals ($>15\text{s}$ countdown timers).

### Scene 3: Dynamic Indoor Air Quality Coach (`/indoor-coach`)
1. **Highlight the "Zero Fake Sensors" Integrity Policy**:
   - Explain why the app refuses to display fabricated indoor AQI numbers without physical hardware sensors.
2. **Dynamic Window Ventilation Advisor**:
   - Show how the advisor evaluates real outdoor $\text{PM}_{2.5}$ ($>120\,\mu\text{g/m}^3$) and orders windows sealed, identifying only brief midday flushing windows.
3. **Zero-Cost Household Hacks**:
   - Review Indian cooking smog management (tadka, deep frying pre-exhaust 2 mins before, 5 mins after, kitchen door isolation).
   - Review aerodynamic dust resuspension (why wet mopping is mandatory and dry sweeping is prohibited).
4. **Safe DIY Corsi-Rosenthal Blueprint**:
   - Review thermal motor safety (Class B / thermal fuse protection), MERV 13+ filters, corner duct taping, and mechanical filter limitations.

### Scene 4: Sustainable Alternatives & Exposure vs Emissions (`/alternatives`)
1. **Trip Distance Slider**:
   - Set commute to $15\text{ km}$ from Solo Petrol Car to Delhi Metro.
2. **Multi-Dimensional Comparison**:
   - Compare travel time ($50\text{m}$ vs $82\text{m}$ in traffic), direct cost (₹$33$ vs ₹$143$), tailpipe emissions ($0\text{g}$ vs $0.0675\text{g}$), and $\text{CO}_2\text{e}$ ($0.39\text{ kg}$ vs $2.13\text{ kg}$).
3. **The Exposure vs Emissions Reality Panel**:
   - Explain the physiological truth: while walking or cycling produces 0g emissions, physical exertion multiplies respiratory minute ventilation, increasing deep-lung particulate dose along congested diesel corridors. Rapid electric transit provides both clean emissions and an enclosed, filtered cabin.

### Scene 5: Explainable Impact Intelligence (`/impact`)
1. **3 Decoupled Tiers**:
   - Tier 1: Personal Exposure Shift ($2.5\text{ hrs}$ avoided away from Severe smog).
   - Tier 2: Local Tailpipe $\text{PM}_{2.5}$ Avoided ($0.0675\text{ g}$).
   - Tier 3: Lifecycle $\text{CO}_2\text{e}$ Reduction ($1.74\text{ kg}$).
2. **Open the "Calculation Proof Modal"**:
   - Show evaluators the exact equations, occupancy assumptions, and official Central Electricity Authority (CEA v19, $0.716\text{ kg/kWh}$) and ARAI citations.

### Scene 6: Community Hub & Grounded Gemini AI (`/community` & `/assistant`)
1. **Community Hub**:
   - Show statutory CAQM GRAP stage directives (Stages I–IV for NCR) and school PE/assembly rules.
   - Click "Copy WhatsApp Bulletin" to show the clean, one-click shareable bulletin for society noticeboards.
2. **Grounded Gemini AI Assistant**:
   - Demonstrate a query: *"I commute by motorcycle and have twins in elementary school. How should we adapt our morning in Delhi today?"*
   - Show how the AI generates Zod-validated, structured action cards grounded strictly in real CPCB data and deterministic rules without hallucinated claims.

---

## 3. Key Takeaway & Judge Rubric Summary (2:30 – 3:00)

- **Problem Alignment**: 100% direct traceability to Challenge 6 problem statement.
- **Scientific Grounding**: 0 fake sensors, 8-pollutant CPCB compliance, verified CEA/ARAI factors.
- **Code Quality & Testing**: 67 automated Vitest tests, strict TypeScript, zero ESLint errors, clean Next.js 15 production build.
