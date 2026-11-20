# BREATHEWISE AI — OFFICIAL DEMO & PRESENTATION SCRIPT
**Competition:** PromptWars Virtual Challenge 6 — Urban Air Quality Assistant  
**Target Audience:** Hackathon Evaluators, Technical Judges, Product Architects  
**Target Duration:** 5 to 7 Minutes  

---

## 0. Introduction & Pitch (30 Seconds)

> "Good morning, evaluators. During winter in North and Central India, over 250 million families face severe smog episodes with AQI regularly exceeding 400. Yet most air quality apps today simply show a scary red number and tell you to 'stay indoors' — which is impossible for working parents, commuters, and school children.
> 
> We built **BreatheWise AI** to bridge the gap between environmental raw data and practical daily family decisions. It is grounded in the official CPCB 8-pollutant NAQI standard, statutory CAQM GRAP directives, and transparent passenger-kilometre physics."

---

## Act 1: The Executive Command Dashboard (`/`) — (60 Seconds)

**Action on Screen:** Open `http://localhost:3000/` (or production URL).

**Talking Points:**
1. **Official CPCB NAQI Compliance**:
   - Point to the large glowing score card (**NAQI 176 / 425**).
   - "Notice the provenance badge: we clearly distinguish between physical ground-truth monitoring stations and 45-km atmospheric model forecasts. We never label model estimates as official station readings."
2. **CPCB 8-Pollutant Spectrum**:
   - Point to the pollutant pills: PM2.5, PM10, NO2, SO2, CO, O3, NH3, and Pb.
   - "When physical monitoring data for NH3 or lead is unavailable, we display a clean dash. We never hallucinate or invent fake sensor values."
3. **24-Hour Diurnal Inversion Spline**:
   - Point to the smooth forecast curve showing the morning peak (8:00 AM) and evening peak (8:00 PM).
   - "Instead of a generic flat line, we model the diurnal boundary layer inversion. Notice how air quality improves temporarily between 1:00 PM and 4:00 PM when solar heating expands the mixing layer. That is the exact window our Smart Daily Planner optimizes for."

---

## Act 2: Smart Daily Routine Planner (`/planner`) — (60 Seconds)

**Action on Screen:** Click **Daily Planner** in the sidebar.

**Talking Points:**
1. **Family Profile Awareness**:
   - Point to the profile pills: `2 Adults`, `1 Child (6-12 yrs)`, `1 Elderly (60+ yrs)`, `Commute: Metro (14 km)`.
   - "BreatheWise AI personalizes guidance based on specific vulnerability profiles. Elderly family members and asthmatic children receive earlier warnings and strict activity adjustments."
2. **Vertical Schedule Timeline**:
   - Scroll through the timeline:
     - `6:30 AM`: Outdoor jog rescheduled to indoor mobility workout (avoiding morning thermal inversion).
     - `8:00 AM`: Commute adapted via electric Metro with anti-idling practices.
     - `1:00 PM`: Fresh air break during the midday boundary layer mixing window.
     - `8:30 PM`: Controlled indoor air protocol while cooking dinner.
3. **Exposure Reduction Card**:
   - Point to **-2.4 hours** avoided exposure and **42% less peak exposure**.
   - "We strictly label this as an *ambient exposure-duration proxy*, never falsely claiming to measure clinical inhaled dose."

---

## Act 3: Indoor Air Quality Coach (`/indoor-coach`) — (60 Seconds)

**Action on Screen:** Click **Indoor Coach** in the sidebar.

**Talking Points:**
1. **Zero Fake Sensors Integrity Policy**:
   - Point to the amber integrity banner.
   - "We enforce a zero-fake-sensor policy. Phones do not have physical particle spectrometers. We provide evidence-based procedural protocols rather than inventing indoor numbers."
2. **Living Room Sanctuary & Ventilation Advisor**:
   - Highlight the interactive facility toggles (Kitchen door partition, Exhaust fan, Purifier).
   - Show the dynamic window ventilation status: "Not Recommended" or "Conditional: 2:00–4:00 PM only".
3. **Cooking Smog & Cleaning Dynamics**:
   - Point to the Tadka protocol: running exhaust 5 minutes before and after cooking cuts indoor particulate spikes by up to 40%.
   - Explain wet microfiber mopping versus dry broom sweeping to avoid aerodynamic dust resuspension.
4. **Corsi-Rosenthal Box Blueprint**:
   - Click **"Guide →"** to open the modal.
   - Show thermal fan motor safety specifications, MERV 13 filter standards, and airtight duct tape assembly instructions.

---

## Act 4: Sustainable Alternatives Switcher (`/alternatives`) — (60 Seconds)

**Action on Screen:** Click **Alternatives** in the sidebar.

**Talking Points:**
1. **The Commute Comparator**:
   - Move the distance slider to 14 km. Change passengers to 3.
   - Walk through the table: Private Car vs Carpool vs Delhi Metro vs CNG Bus vs Cycling.
2. **The Exposure vs. Emissions Honesty Paradox**:
   - Call attention to the green asterisk note:
   - "Here is a critical scientific insight most apps miss: Cycling and walking are zero-emission, but during severe winter smog, physical exertion increases minute ventilation by 2 to 4 times directly in roadside tailpipe plumes. BreatheWise recommends electrified mass transit (Metro) during severe smog to protect both personal health and urban air quality."

---

## Act 5: Explainable Impact Intelligence (`/impact`) — (60 Seconds)

**Action on Screen:** Click **Impact Intelligence** in the sidebar.

**Talking Points:**
1. **3-Tier Decoupled Impact**:
   - Point to the three metric cards:
     1. **Exposure Shift**: `-2.4 hrs` away from $>300\text{ AQI}$ smog.
     2. **Local PM2.5 Avoided**: `-0.86 g` at ground-level breathing zone.
     3. **CO2e Reduction**: `-1.32 kg` across the lifecycle.
2. **The Transparent Calculation Proof**:
   - Click **"View Calculation Proof"** to open the modal.
   - Show the exact formulas:
     - Tier 2 uses Automotive Research Association of India (ARAI) fleet factors.
     - Tier 3 uses the Central Electricity Authority (CEA) Baseline Database v19 grid factor ($0.716\text{ kg CO}_2/\text{kWh}$) alongside the CEA Annual Report 2024-25 reference ($0.727\text{ tCO}_2/\text{MWh}$).
     - "We provide full mathematical proof so our numbers are completely verifiable."

---

## Act 6: Community Hub & Grounded AI Assistant (`/community` & `/assistant`) — (60 Seconds)

**Action on Screen:**
1. Open **Community Hub**:
   - Show CAQM GRAP Stage II status and India Gate artwork.
   - Click **"Share on WhatsApp"** to demonstrate one-click community bulletin distribution.
2. Open **AI Assistant**:
   - Point to the grounded context badge (`Hyderabad: AQI 176`).
   - Click prompt chip: *"Is it safe for my child to play outside this evening?"*
   - Show structured recommendations, indoor activity suggestions, and pediatrician medical disclaimers.
   - Highlight the **Deterministic Offline Fallback Engine** that guarantees 100% availability even without an internet connection or API quota.

---

## Closing Summary (20 Seconds)

> "BreatheWise AI is built to be practical, family-first, scientifically trustworthy, and production-ready today. Thank you, and we welcome your questions!"
