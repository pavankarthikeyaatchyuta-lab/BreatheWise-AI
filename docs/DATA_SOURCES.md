# Data Sources & Integration Strategy
## Project: BreatheWise AI

---

## 1. Primary Data Sources

| Provider | Data Type | Coverage | Spatial & Temporal Resolution | License / Cost | Attribution Requirement | Integration Strategy |
|---|---|---|---|---|---|---|
| **CPCB / CAAQMS via OpenAQ** | Ground-truth ambient measurements (PM2.5, PM10, NO2, SO2, CO, O3, NH3, Pb) | Major Indian urban stations | Physical station coordinates; 1-hour reporting | Open Data / CC BY 4.0; OpenAQ v3 API key required | "Data provided by OpenAQ / CPCB" | Primary source for measured station data. Validates 16h data completeness and 3-pollutant rule before computing official CPCB NAQI. |
| **Open-Meteo Air Quality API** | Hourly atmospheric forecast (PM2.5, PM10, NO2, SO2, CO, Ozone) | Global | ~45 km spatial resolution (CAMS global model) / 1-hour forecast intervals | Free for non-commercial & educational use (CC BY 4.0) | "Weather & air quality data by Open-Meteo.com" | Primary source for 24-hour diurnal forecasts and inversion curve detection. Explicitly badged as an atmospheric model. |
| **Curated Demonstration Dataset** | Ground-truth historical winter smog profiles (Delhi Anand Vihar, Mumbai Bandra, Bengaluru Silk Board, Kolkata Victoria) | 4 benchmark Indian metros | Station-level; hourly 24h winter smog profiles | Internal curated reference dataset | "Demonstration & Verification Profile" | Zero-downtime fallback when external APIs are unreachable or offline. Always clearly labeled as Demonstration Mode. |

---

## 2. Provenance & Transparency Specification

Every environmental data point ingested into BreatheWise AI must carry an explicit `ProvenanceMetadata` object:

```typescript
export interface ProvenanceMetadata {
  type: 'MEASURED_STATION' | 'ATMOSPHERIC_MODEL_FORECAST' | 'DEMO_RECORD';
  sourceName: string;            // e.g. "CPCB - Anand Vihar, Delhi" or "Open-Meteo ECMWF/CAMS"
  spatialResolution: string;      // e.g. "Station Coordinate (Point)" or "~45 km Grid"
  temporalResolution: string;     // e.g. "1-hour average" or "3-hour forecast step"
  measurementTimestamp: string;   // ISO 8601 timestamp of measurement/model run
  fetchedAt: string;              // ISO 8601 timestamp of API call
  isAveraged24h: boolean;         // True if meeting 16h minimum
  validPollutantCount: number;    // Count of valid monitored pollutants
  attributionUrl: string;         // Public link to data provider
}
```

---

## 3. Handling Incomplete or Missing Data

1. **Station Data Missing or Incomplete**:
   - If fewer than 3 pollutants are available, or neither PM2.5 nor PM10 is reported:
     - The application **refuses to calculate an official CPCB AQI**.
     - It displays the individual pollutant concentrations (e.g. "PM2.5: $184\,\mu\text{g/m}^3$") with an explicit notice: *"Insufficient pollutant coverage to calculate statutory CPCB AQI (requires $\ge 3$ pollutants including PM2.5/PM10)."*
2. **Stale Data Detection**:
   - If the latest recorded observation from a station is older than 4 hours, a prominent "Stale Data Warning" appears with the exact age of the reading.
   - Readings older than 24 hours are excluded from live calculations and automatically trigger a fallback to the atmospheric model or demonstration dataset.
3. **No Interpolation Without Disclosure**:
   - The application never secretly interpolates or synthesizes missing pollutant values. Any mathematical gap-filling must be explicitly disclosed to the user.
