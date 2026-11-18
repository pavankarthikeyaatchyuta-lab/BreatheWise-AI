# Competitor Research & Product Gap Analysis
## Project: BreatheWise AI — Urban Air Quality & Sustainable Living Assistant

This document analyzes the existing digital air-quality ecosystem, user journeys, data sources, strengths, limitations, and opportunities for differentiation for BreatheWise AI, specifically within the Indian urban smog context.

---

## 1. Competitive Landscape Analysis

| Product | Primary Purpose | Strengths | Critical Limitations | Data Sources | Gaps Addressed by BreatheWise AI |
|---|---|---|---|---|---|
| **CPCB SAMEER** | Official Indian statutory AQI reporting and citizen complaint filing. | Direct regulatory authority; official Indian National Air Quality Index (NAQI) sub-indices; statutory Graded Response Action Plan (GRAP) alerts. | Clunky UX, frequent station telemetry dropouts, static data with no predictive routine planning, zero indoor guidance, no explainable impact calculations. | CAAQMS (Continuous Ambient Air Quality Monitoring Stations) across India. | Transforms statutory CPCB NAQI into proactive, family-aware daily action schedules and dynamic indoor coaching. |
| **IQAir AirVisual** | Global commercial AQI dashboard and forecast platform. | Sleek global UI, 7-day atmospheric forecasts, extensive city coverage, global pollution rankings. | Commercial bias aggressively driving high-cost consumer purifier sales; uses US AQI rather than Indian CPCB NAQI; treats modelled forecasts as live readings in small towns; no commute or budget-sensitive alternatives. | Proprietary IoT sensor network + satellite/model data. | Zero-cost and low-cost indoor interventions (damp mopping, ventilation timing, safe DIY Corsi-Rosenthal boxes) rather than commercial hardware upselling; strict CPCB 8-pollutant calculations. |
| **Airveda** | Indian air quality monitoring and commercial purification. | Tuned to Indian urban conditions; PM2.5/PM10 monitors; local customer support. | Requires purchasing proprietary ₹8,000–₹25,000 hardware; software is a companion app for hardware owners; lacks community/school coordination tools. | Proprietary Airveda monitors + public CPCB data. | Accessible to all households regardless of whether they own a physical sensor or purifier. Does not fabricate indoor readings. |
| **Plume Labs (AccuWeather)** | Personal pollution exposure and wearable monitor integration. | Clean visual UI; personal exposure tracking; UV and pollen data; street-level dispersion modelling. | Focuses primarily on European/US urban contexts; subscription/commercial hardware tie-in; lacks Indian transport alternatives (metro vs 2-wheeler) and Indian indoor cooking context. | European Copernicus CAMS models + proprietary Flow wearable sensors. | Dedicated Indian lifestyle integration: Indian cooking (tadka/spices), two-wheeler exposure reality, RWA/school coordination. |
| **Google Air Quality API** | Universal developer air quality infrastructure. | Global 500m resolution; multi-pollutant breakdown; developer-friendly REST endpoints. | Developer API only, not an end-user decision support app; requires Google Cloud credit card billing; does not provide personalized daily family planning. | Satellite, meteorological models, government stations. | User-facing, family-centric decision intelligence with zero mandatory paid cloud dependencies. |
| **Open-Meteo Air Quality API** | Open environmental forecast API. | Free for non-commercial/academic use; global coverage; hourly PM2.5, PM10, NO2, SO2, CO, O3 forecasts; no API key barrier. | Atmospheric model resolution (~45 km for global CAMS) cannot provide street-level or micro-station precision; no built-in CPCB NAQI formula; no actionable advice. | Copernicus Atmosphere Monitoring Service (CAMS) & NOAA GFS. | Bridges open atmospheric forecasts into grounded, CPCB-calibrated hourly action windows with transparent provenance badges. |
| **OpenAQ** | Global open physical air quality data repository. | Open-source; collects physical ground-truth station measurements from governments and research networks worldwide. | Raw telemetry data with sporadic coverage, missing pollutants, varying averaging periods; requires developer integration and v3 API key. | Government environmental agencies (CPCB, US Embassies, State PCBs). | Ingests ground-station measurements, enforces strict CPCB averaging and pollutant completeness checks, and falls back gracefully when stations go offline. |

---

## 2. Official Indian Air-Pollution Health Advisories & Standards

### 2.1 CPCB National Air Quality Index (NAQI) Standard
- Governed by CPCB (Ministry of Environment, Forest and Climate Change, Govt. of India).
- Standard covers **8 criteria pollutants**:
  1. $\text{PM}_{2.5}$ (24-hour average)
  2. $\text{PM}_{10}$ (24-hour average)
  3. $\text{NO}_2$ (24-hour average)
  4. $\text{SO}_2$ (24-hour average)
  5. $\text{CO}$ (8-hour average)
  6. $\text{O}_3$ (8-hour average)
  7. $\text{NH}_3$ (24-hour average)
  8. $\text{Pb}$ (Lead, 24-hour average)
- **Mathematical Calculation Rule**:
  - Sub-index $I_p$ calculated via linear piecewise interpolation between health breakpoints.
  - Overall $\text{AQI} = \max(I_1, I_2, \dots, I_k)$.
  - **Statutory Data Sufficiency Rule**: Minimum of **3 pollutants** must be monitored, of which at least one **must be $\text{PM}_{2.5}$ or $\text{PM}_{10}$**.
  - **Averaging Rule**: Requires at least **16 hours** of valid hourly observations to calculate a 24-hour sub-index.
  - *Never report an incomplete sub-index as an official CPCB AQI.*

### 2.2 CAQM Graded Response Action Plan (GRAP) for Delhi-NCR
- Enacted by the Commission for Air Quality Management (CAQM) in National Capital Region and Adjoining Areas:
  - **Stage I ('Poor', AQI 201–300)**: Mechanical sweeping, water sprinkling on unpaved roads, anti-dust enforcement at construction sites, no open trash burning.
  - **Stage II ('Very Poor', AQI 301–400)**: Regulate diesel generator (DG) sets, increase parking fees to discourage private vehicles, augment CNG/electric bus and metro services.
  - **Stage III ('Severe', AQI 401–450)**: Strict ban on non-essential construction and demolition, ban on plying of BS-III petrol and BS-IV diesel LMVs (cars) in NCR, shift primary school classes online.
  - **Stage IV ('Severe+', AQI > 450)**: Complete ban on non-essential truck entry into Delhi, closure of educational institutions, 50% public/private sector work-from-home advisory.
- *Crucial Regulatory Truth*: GRAP is statutory **only in Delhi-NCR**. Other Indian cities (Mumbai, Kolkata, Patna) have separate state PCB frameworks. BreatheWise AI avoids asserting NCR GRAP emergency bans outside NCR.

---

## 3. BreatheWise AI Core Differentiators

1. **Family & Vulnerability Aware Daily Scheduling**: Rather than saying "Air is Unhealthy", BreatheWise evaluates whether you have school-age children, elderly parents, or commute on a two-wheeler, suggesting relative diurnal lows (e.g. 1:00 PM – 3:30 PM) for unavoidable errands and shifting morning exercise indoors.
2. **Transparent Data Provenance**: Badges `MEASURED_STATION` vs `ATMOSPHERIC_MODEL_FORECAST (~45 km resolution)`, disclosing fetch timestamps and data freshness.
3. **Dynamic & Zero-Cost Indoor Coaching**: Focuses on high-impact zero-cost habits (kitchen exhaust during tadka/frying, wet mopping instead of dry broom sweeping, ventilation timing) and safe DIY Corsi-Rosenthal filtration specs. Does not fake indoor AQI measurements.
4. **3-Tiered Explainable Impact**:
   - Tier 1: Personal exposure shift (hours away from peak smog).
   - Tier 2: Avoided local tailpipe emissions ($\text{g PM}_{2.5}/\text{pkm}$).
   - Tier 3: Transparent GHG reduction ($\text{kg CO}_2\text{e}$) grounded in India CEA grid factors and ARAI fleet numbers, accompanied by a calculation proof modal.
5. **Community & School Toolkits**: Ready-to-share WhatsApp bulletins and RWA action cards for collective anti-idling, dust suppression, and school sports adjustments.
