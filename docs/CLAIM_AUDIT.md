# Scientific, Regulatory, and Claim Audit
## Project: BreatheWise AI — PromptWars Challenge 6

This document presents a comprehensive, item-by-item audit of all numerical, medical, physiological, regulatory, and traffic claims embedded across BreatheWise AI's user interface, calculation engines, and documentation.

---

## 1. Master Claims Audit Table

| ID | Claim | Source & Date | Geographic Scope | Original Confidence | Action Taken | Current Verified Status & Calibrated Replacement |
|---|---|---|---|---|---|---|
| **A** | "Physical exertion increases minute ventilation (inhaled air volume) by 300% to 500% when walking or cycling near diesel traffic." | Panis et al. (2010) *Exposure to particulate matter in traffic: A comparison of cyclists and car passengers*, *Atmospheric Environment*; Zuurbier et al. (2009). | General Urban Environments | Moderate (Applies to specific cadence & exertion) | **QUALIFIED (Numerical Specificity Removed)** | Removed the fixed `300% to 500%` figure. Calibrated to: *"Physical aerobic exertion substantially increases respiratory minute ventilation (breathing volume per minute) compared to resting passengers. Exercising or walking along heavy diesel traffic corridors during severe morning smog peaks elevates personal particulate deposition in deep alveolar airways."* |
| **B** | "Vehicle engines idling for >10-15 seconds consume more fuel and emit more tailpipe particulates than restarting." | Petroleum Conservation Research Association (PCRA, India, 2021) *Red Light On, Gaadi Off Campaign*; SAE Technical Paper 2013-01-0255; US EPA Clean Cities. | India (Urban Signal Intersections) & Global | High | **RETAINED WITH CITATION** | Retained with explicit source attribution: *"ANTI-IDLING PROTOCOL (PCRA / SAE Benchmark): Petroleum Conservation Research Association (PCRA, India) guidelines demonstrate that modern fuel-injected engines use less fuel and emit substantially lower tailpipe particulates upon restarting than idling for >10-15 seconds. Switch off ignition at traffic signals where countdown timers exceed 15-20 seconds."* |
| **C** | "20-minute school departure delay reduces queuing alongside idling school buses." | Behavioral congestion heuristics; Indian urban school gate traffic dispersion studies (TERI, 2020). | Urban Schools | Moderate | **QUALIFIED AS BEHAVIORAL HEURISTIC** | Disclaimed live GPS traffic tracking: *"Behavioral heuristic: Adjusting departure by 15-20 minutes avoids the peak 15-minute school gate drop-off rush, minimizing student exposure to idling vehicle exhaust fumes (Note: this is a behavioral schedule heuristic, not live GPS traffic tracking)."* |
| **D** | "GRAP Stage I to IV emergency measures (school sports suspension, BS-III petrol ban)." | Commission for Air Quality Management in NCR & Adjoining Areas (CAQM), Statutory Direction No. 77–81 (2023–2024). | Delhi-NCR Only (Statutory); Non-NCR (Advisory) | High (within NCR) | **RETAINED WITH STRICT JURISDICTION BOUNDARY** | Explicitly separated NCR statutory orders from nationwide advisory guidance: When user is outside NCR, UI clearly badges: *"Advisory guidance based on CAQM benchmarks. CAQM GRAP is statutory only in Delhi-NCR; non-NCR cities follow state PCB directives."* |
| **E** | "Ventilate indoor spaces during the afternoon window." | Atmospheric boundary layer diurnal expansion (solar radiative heating expands planetary boundary layer, dispersing surface PM2.5 between 13:00 and 16:00). | Northern Indian Winter Smog | High (Meteorological) | **QUALIFIED AS DYNAMICALLY CONDITIONAL** | Removed fixed window opening. Windows are kept sealed if outdoor PM2.5 $>120\,\mu\text{g/m}^3$. If outdoor levels drop below indoor background proxy, a brief 10–15 min cross-ventilation is suggested. During Severe smog ($>400\text{ AQI}$), windows remain sealed all day. |
| **F** | "DIY Corsi-Rosenthal Box fan filter blueprint." | Dr. Richard Corsi & Jim Rosenthal (2020); UC Davis / EPA testing (2021); ASHRAE Standard 52.2. | Global Indoor Filtration | High | **VERIFIED & RETAINED** | Verified safety: mandates thermally protected / enclosed fan motors (preventing static backpressure overheating), MERV 13+ (or ISO 16890 ePM1 50%+) media, corner taping. Removed unsupported commercial price comparison claims. Disclaimed that mechanical filters do not capture gases without activated carbon. |
| **G** | "Personal Exposure Reduction / Health Impact." | WHO Global Air Quality Guidelines (2021); CPCB Health Breakpoint Reports (2014). | Global & India | High (as exposure proxy) | **RETAINED WITH EXPOSURE PROXY LABEL** | Strictly labeled as **Estimated Exposure-Duration Proxy** (hours shifted away from Severe smog $>300\text{ AQI}$). Prominently disclaims: *"Does not claim a clinically measured reduction in inhaled biological dose or medical risk, which requires personal spirometry and calibrated wearable sensors."* |

---

## 2. In-Depth Claim Investigations

### 2.1 Active Travel Inhaled Dose vs. Exhaust Wake Immersion
- **Scientific Foundation**: Resting minute ventilation ($V_E$) is approximately $6\text{--}8\text{ L/min}$. During brisk cycling ($15\text{--}20\text{ km/h}$) or rapid walking, minute ventilation increases to $20\text{--}40\text{ L/min}$ (Panis et al., 2010). However, the inhaled dose is a function of:
  $$\text{Inhaled Dose} = \int C_{\text{microenvironment}}(t) \times V_E(t) \, dt$$
  Because $C_{\text{microenvironment}}$ varies dramatically between kerbside diesel arterial corridors and off-road green pathways, asserting an invariant "300% to 500% increase in dose" for all walking/cycling scenarios was overly prescriptive.
- **Remediation**: The numerical range was removed from `src/lib/engine/alternatives.ts` and `src/app/alternatives/page.tsx`, replacing it with a qualitative physiological explanation of elevated ventilation rates and roadside plume proximity.

### 2.2 Anti-Idling 10-to-15 Second Rule
- **Scientific Foundation**: The Petroleum Conservation Research Association (PCRA, Ministry of Petroleum & Natural Gas, Govt. of India), alongside SAE International and US EPA studies, determined that fuel-injected internal combustion engines require approximately $0.2\text{ to }0.5\text{ seconds}$ worth of idling fuel to crank and restart.
- **Remediation**: The guidance was qualified in `src/lib/engine/planner-engine.ts`, `src/lib/ai/fallback-ai.ts`, and `src/app/planner/page.tsx` with explicit reference to PCRA and SAE benchmarks.

### 2.3 Traffic Congestion and Queueing Claims
- **Scientific Foundation**: School zones experience intense micro-congestion spikes lasting 15 to 25 minutes during morning drop-off (typically 7:30–8:00 AM) and afternoon dismissal.
- **Remediation**: Added explicit disclaimers that departure recommendations are **behavioral rush-hour avoidance heuristics**, clarifying that BreatheWise AI does not claim to track real-time vehicle GPS feeds.

### 2.4 CPCB NAQI Data Availability vs. Model Forecast Distinction
- **Scientific Foundation**: CPCB NAQI is legally defined by CPCB technical manuals. Open-Meteo provides atmospheric chemical dispersion forecasts (~45 km spatial resolution).
- **Remediation**: When live ground-station data is unavailable, BreatheWise evaluates model concentrations directly through the CPCB breakpoint equations and explicitly badges the output as `Model-Derived Air Quality Category (Estimated via CPCB Breakpoints)` with `type: 'ATMOSPHERIC_MODEL_FORECAST'`. It never combines model forecasts with demonstration station readings or fabricates missing pollutants ($\text{NH}_3, \text{Pb}$).
