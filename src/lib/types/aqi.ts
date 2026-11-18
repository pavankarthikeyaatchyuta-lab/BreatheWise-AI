/**
 * Air Quality and CPCB NAQI Type Definitions
 * Supporting all 8 criteria pollutants with strict provenance metadata
 */

export type PollutantKey = 'pm25' | 'pm10' | 'no2' | 'so2' | 'co' | 'o3' | 'nh3' | 'pb';

export type AQICategory = 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';

export type ProvenanceType = 'MEASURED_STATION' | 'ATMOSPHERIC_MODEL_FORECAST' | 'DEMO_RECORD';

export interface ProvenanceMetadata {
  type: ProvenanceType;
  sourceName: string;           // e.g. "CPCB Anand Vihar (CAAQMS)" or "Open-Meteo ECMWF/CAMS"
  spatialResolution: string;     // e.g. "Physical Station Coordinates" or "~45 km Global Grid"
  temporalResolution: string;    // e.g. "1-hour continuous" or "3-hour model step"
  measurementTimestamp: string;  // ISO string
  fetchedAt: string;             // ISO string
  isAveraged24h: boolean;        // True if meeting 16-hour completeness rule
  monitoredHoursAvailable: number; // e.g. 18 hours
  validPollutantCount: number;
  attributionUrl: string;
}

export interface PollutantReading {
  key: PollutantKey;
  name: string;
  value: number;
  unit: string; // 'µg/m³' or 'mg/m³'
  averagingHours: 8 | 24;
  subIndex: number | null;
  category: AQICategory | null;
  minHoursRequired: number;
  hoursRecorded: number;
}

export interface CPCBValidationStatus {
  isValidOfficial: boolean;
  hasParticulate: boolean; // Must have PM2.5 or PM10
  pollutantCount: number;  // Must be >= 3
  hasMinimumHours: boolean; // >= 16h for 24h average
  reasons: string[];
}

export interface CPCBResult {
  aqi: number | null;
  category: AQICategory | null;
  dominantPollutant: PollutantKey | null;
  dominantPollutantName: string | null;
  subIndices: Record<PollutantKey, number | null>;
  pollutants: Record<PollutantKey, PollutantReading>;
  validation: CPCBValidationStatus;
  provenance: ProvenanceMetadata;
}

export interface DiurnalForecastHour {
  time: string;           // e.g. "06:00"
  isoTimestamp: string;
  pm25: number;
  pm10: number;
  estimatedCategory: AQICategory;
  isPeakSmogWindow: boolean; // Morning inversion 6-9 AM or Evening 7-10 PM
  isRelativeLowWindow: boolean; // Midday boundary layer dispersion 1-4 PM
  activityRecommendation: 'AVOID_OUTDOORS' | 'RESTRICT_VULNERABLE' | 'MODERATE_OUTDOORS';
}

export interface AirQualityState {
  city: string;
  region: string;
  isNCR: boolean; // Important for statutory CAQM GRAP
  current: CPCBResult;
  forecast24h: DiurnalForecastHour[];
  provenance: ProvenanceMetadata;
}
