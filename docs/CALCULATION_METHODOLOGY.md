# Calculation Methodology & Scientific Grounding
## Project: BreatheWise AI

---

## 1. Official CPCB 8-Pollutant NAQI Calculation Methodology

The Indian National Air Quality Index (NAQI) established by the Central Pollution Control Board (Ministry of Environment, Forest and Climate Change) evaluates up to eight criteria pollutants.

### 1.1 Mathematical Formula
For any pollutant concentration $C_p$, the sub-index $I_p$ is calculated by identifying the corresponding concentration breakpoint band $[B_{lo}, B_{hi}]$ and index breakpoint band $[I_{lo}, I_{hi}]$:

$$I_p = I_{lo} + \frac{I_{hi} - I_{lo}}{B_{hi} - B_{lo}} \times (C_p - B_{lo})$$

The overall AQI is the maximum of the calculated sub-indices:
$$\text{AQI} = \max(I_1, I_2, \dots, I_k)$$
The pollutant with the highest sub-index is designated as the **Dominant Pollutant**.

### 1.2 Official CPCB Health Breakpoints Table

| Category | AQI Range | $\text{PM}_{2.5}\,(24\text{h})$ | $\text{PM}_{10}\,(24\text{h})$ | $\text{NO}_2\,(24\text{h})$ | $\text{SO}_2\,(24\text{h})$ | $\text{CO}\,(8\text{h})$ | $\text{O}_3\,(8\text{h})$ | $\text{NH}_3\,(24\text{h})$ | $\text{Pb}\,(24\text{h})$ |
|---|---|---|---|---|---|---|---|---|---|
| **Good** | 0 – 50 | 0 – 30 | 0 – 50 | 0 – 40 | 0 – 40 | 0 – 1.0 | 0 – 50 | 0 – 200 | 0 – 0.5 |
| **Satisfactory** | 51 – 100 | 31 – 60 | 51 – 100 | 41 – 80 | 41 – 80 | 1.1 – 2.0 | 51 – 100 | 201 – 400 | 0.6 – 1.0 |
| **Moderate** | 101 – 200 | 61 – 90 | 101 – 250 | 81 – 180 | 81 – 380 | 2.1 – 10.0 | 101 – 168 | 401 – 800 | 1.1 – 2.0 |
| **Poor** | 201 – 300 | 91 – 120 | 251 – 350 | 181 – 280 | 381 – 800 | 10.1 – 17.0 | 169 – 208 | 801 – 1200 | 2.1 – 3.0 |
| **Very Poor** | 301 – 400 | 121 – 250 | 351 – 430 | 281 – 400 | 801 – 1600 | 17.1 – 34.0 | 209 – 748 | 1201 – 1800 | 3.1 – 3.5 |
| **Severe** | 401 – 500 | $250+$ | $430+$ | $400+$ | $1600+$ | $34.0+$ | $748+$ | $1800+$ | $3.5+$ |

*Units*: CO in $\text{mg/m}^3$; all other pollutants in $\mu\text{g/m}^3$.

### 1.3 Strict CPCB Validity Rules
1. **Minimum Pollutant Rule**: At least 3 pollutants must be monitored.
2. **Mandatory Particulate Rule**: Either $\text{PM}_{2.5}$ or $\text{PM}_{10}$ must be among the monitored pollutants.
3. **Minimum Observation Period**: A 24-hour sub-index requires at least 16 hourly readings ($66.7\%$ data completeness).
4. If any rule is violated, the application returns `INSUFFICIENT_DATA` and does not claim to present an official CPCB AQI.

---

## 2. 3-Tier Explainable Impact Calculations

BreatheWise AI explicitly decouples:
1. Personal Exposure Proxies
2. Local Particulate Emissions
3. Greenhouse Gas (CO2e) Lifecycle Emissions

### 2.1 Tier 1: Personal Exposure Shift (Hours Shifted)
- **Concept**: Measures the reduction in exposure duration during elevated pollution windows.
- **Formula**:
  $$\Delta t_{\text{severe}} = t_{\text{baseline severe hours}} - t_{\text{adapted severe hours}}$$
- **Scientific Caveat**: The application explains: *"This metric quantifies avoided exposure hours during peak ambient smog (AQI $>300$). It does not claim a measured reduction in inhaled biological dose or clinical risk without individual spirometry and wearable sensor measurements."*

### 2.2 Tier 2: Local Tailpipe Particulate Emissions Avoided
- **Concept**: Particulate matter ($\text{PM}_{2.5}$) directly avoided at the local urban street level.
- **Formula**:
  $$\text{Tailpipe PM}_{2.5}\text{ Avoided (g)} = \text{Distance (km)} \times \left( \frac{\text{EF}_{\text{baseline PM2.5}}}{\text{Occupancy}_{\text{baseline}}} - \frac{\text{EF}_{\text{alt PM2.5}}}{\text{Occupancy}_{\text{alt}}} \right)$$
- **Emission Factors (ARAI / CPCB Fleet Averages for India)**:
  - Petrol Passenger Car (BS-VI): $0.0045\text{ g PM}_{2.5}/\text{km}$
  - Diesel Passenger Car (BS-IV): $0.0500\text{ g PM}_{2.5}/\text{km}$
  - Two-Wheeler (Motorcycle 125cc): $0.0120\text{ g PM}_{2.5}/\text{km}$
  - CNG City Bus: $0.0150\text{ g PM}_{2.5}/\text{vehicle-km}$ (average occupancy: 40 passengers $\implies 0.000375\text{ g/pkm}$)
  - Electric Metro / Train: $0.0000\text{ g tailpipe PM}_{2.5}/\text{pkm}$ (zero tailpipe)

### 2.3 Tier 3: Greenhouse Gas Lifecycle Reduction (kg CO2e)
- **Formula**:
  $$\Delta \text{CO}_2\text{e (kg)} = \text{Distance (km)} \times \left( \text{EF}_{\text{baseline, pkm}} - \text{EF}_{\text{alt, pkm}} \right) \div 1000$$
- **Validated Passenger-Kilometre Emission Factors (India Context)**:
  - Solo Petrol Car (Occupancy 1): $142\text{ g CO}_2\text{e/pkm}$ (ARAI / BEE baseline)
  - Solo Diesel Car (Occupancy 1): $155\text{ g CO}_2\text{e/pkm}$
  - Carpool (Petrol Car, 4 passengers): $35.5\text{ g CO}_2\text{e/pkm}$
  - Two-Wheeler (Motorcycle, 1 rider): $48\text{ g CO}_2\text{e/pkm}$
  - Delhi Metro (DMRC Grid Baseline): $24.5\text{ g CO}_2\text{e/pkm}$ (historically $26\text{ g}$ under v19)
    *(Derived from official Central Electricity Authority CO₂ Baseline Database Version 22.0, August 2026: Weighted Average grid factor of $0.675\text{ tCO}_2\text{/MWh}$ [$0.675\text{ kg CO}_2\text{/kWh}$] for FY 2025–26 including renewable generation and captive injection, adjusted for cross-border electricity transfers. Compared against historical v19 FY 2022–23: $0.716\text{ kg/kWh}$ and FY 2023–24: $0.727\text{ kg/kWh}$, allocated across high commuter load factors)*
  - Electric Bus (Charging from Indian Grid): $28\text{ g CO}_2\text{e/pkm}$
  - Walking / Cycling: $0\text{ g CO}_2\text{e/pkm}$

---

## 3. Exposure vs. Emissions Honesty Matrix

A central scientific differentiator in BreatheWise AI is communicating the trade-off between **environmental emissions** and **personal inhaled exposure**:

| Mode | Local Tailpipe Emissions | CO2e Impact | Roadside Smog Exposure Risk | Recommendation Context |
|---|---|---|---|---|
| **Walking / Cycling** | Zero | Zero | **High** during winter morning peak (heavy diesel exhaust, respiratory exertion increases inhaled volume by $3\times$ to $5\times$). | Advise only during afternoon relative diurnal lows or on interior park/residential streets with N95 mask. Discourage along major arterial corridors during Severe smog. |
| **Open Two-Wheeler / Auto** | Moderate | Low | **High** (direct exposure to vehicular wake and dust re-suspension). | Wear well-fitted N95/FFP2 respirator; adjust departure time to avoid signal idling jams. |
| **Air-Conditioned Metro** | Zero tailpipe | Very Low | **Low** (underground/elevated stations with HVAC particulate pre-filtration). | **Recommended baseline** for commuters during Severe smog episodes. |
| **Private AC Car** | High | High | **Moderate** (cabin filter provides partial protection, but driver contributes heavily to local urban smog and congestion). | Promote carpooling or shifting to rapid transit. |
