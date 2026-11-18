/**
 * Verified Winter Smog Demonstration Profiles
 * Real-world historical telemetry representing typical severe winter episodes
 * across major Indian urban centers. Always clearly badged as DEMO_RECORD.
 */

import { AirQualityState, CPCBResult, DiurnalForecastHour, ProvenanceMetadata } from '../types/aqi';
import { evaluateCPCBNAQI } from './cpcb-calc';

export function getDemoProvenance(city: string, stationName: string): ProvenanceMetadata {
  return {
    type: 'DEMO_RECORD',
    sourceName: `Historical Telemetry — ${stationName}`,
    spatialResolution: 'Station Coordinates (Ground Sensor Reference)',
    temporalResolution: '1-hour continuous monitored average',
    measurementTimestamp: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    isAveraged24h: true,
    monitoredHoursAvailable: 24,
    validPollutantCount: 8,
    attributionUrl: 'https://cpcb.nic.in',
  };
}

/**
 * Delhi Anand Vihar (Severe Winter Smog Episode with Thermal Inversion)
 */
export function getDelhiDemoState(): AirQualityState {
  const prov = getDemoProvenance('Delhi', 'CPCB CAAQMS Anand Vihar');
  
  // High PM2.5, PM10, elevated NO2 from heavy freight, NH3 from agricultural/waste
  const cpcb = evaluateCPCBNAQI(
    {
      pm25: { value: 312, hoursRecorded: 24 }, // Severe
      pm10: { value: 468, hoursRecorded: 24 }, // Severe
      no2: { value: 114, hoursRecorded: 24 },  // Moderate
      so2: { value: 28, hoursRecorded: 24 },   // Good
      co: { value: 2.8, hoursRecorded: 8 },    // Moderate
      o3: { value: 42, hoursRecorded: 8 },     // Good
      nh3: { value: 68, hoursRecorded: 24 },   // Good
      pb: { value: 0.4, hoursRecorded: 24 },   // Good
    },
    prov
  );

  // 24-hour diurnal curve showing classic winter inversion
  // Spikes at 07:00 - 09:00 (shallow boundary layer) and 20:00 - 23:00 (cooling inversion)
  // Relative low at 13:00 - 16:00 (solar heating expands boundary layer)
  const forecast24h: DiurnalForecastHour[] = [
    { time: '00:00', isoTimestamp: 'T00:00:00Z', pm25: 290, pm10: 440, estimatedCategory: 'Very Poor', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '02:00', isoTimestamp: 'T02:00:00Z', pm25: 310, pm10: 460, estimatedCategory: 'Severe', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '04:00', isoTimestamp: 'T04:00:00Z', pm25: 335, pm10: 490, estimatedCategory: 'Severe', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '06:00', isoTimestamp: 'T06:00:00Z', pm25: 380, pm10: 520, estimatedCategory: 'Severe', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '08:00', isoTimestamp: 'T08:00:00Z', pm25: 410, pm10: 540, estimatedCategory: 'Severe', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '10:00', isoTimestamp: 'T10:00:00Z', pm25: 340, pm10: 480, estimatedCategory: 'Severe', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '12:00', isoTimestamp: 'T12:00:00Z', pm25: 240, pm10: 360, estimatedCategory: 'Very Poor', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '14:00', isoTimestamp: 'T14:00:00Z', pm25: 195, pm10: 310, estimatedCategory: 'Very Poor', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '16:00', isoTimestamp: 'T16:00:00Z', pm25: 220, pm10: 340, estimatedCategory: 'Very Poor', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '18:00', isoTimestamp: 'T18:00:00Z', pm25: 290, pm10: 420, estimatedCategory: 'Very Poor', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '20:00', isoTimestamp: 'T20:00:00Z', pm25: 360, pm10: 510, estimatedCategory: 'Severe', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '22:00', isoTimestamp: 'T22:00:00Z', pm25: 340, pm10: 480, estimatedCategory: 'Severe', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
  ];

  return {
    city: 'Delhi-NCR',
    region: 'National Capital Region',
    isNCR: true,
    current: cpcb,
    forecast24h,
    provenance: prov,
  };
}

/**
 * Mumbai Bandra (Coastal / Moderate Smog Profile)
 */
export function getMumbaiDemoState(): AirQualityState {
  const prov = getDemoProvenance('Mumbai', 'MPCB CAAQMS Bandra Kurla Complex');
  
  const cpcb = evaluateCPCBNAQI(
    {
      pm25: { value: 78, hoursRecorded: 24 }, // Moderate
      pm10: { value: 142, hoursRecorded: 24 }, // Moderate
      no2: { value: 65, hoursRecorded: 24 },  // Satisfactory
      so2: { value: 18, hoursRecorded: 24 },  // Good
      co: { value: 1.4, hoursRecorded: 8 },   // Satisfactory
      o3: { value: 36, hoursRecorded: 8 },    // Good
      nh3: { value: 24, hoursRecorded: 24 },  // Good
      pb: { value: 0.1, hoursRecorded: 24 },  // Good
    },
    prov
  );

  const forecast24h: DiurnalForecastHour[] = [
    { time: '06:00', isoTimestamp: 'T06:00:00Z', pm25: 98, pm10: 170, estimatedCategory: 'Moderate', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '10:00', isoTimestamp: 'T10:00:00Z', pm25: 85, pm10: 150, estimatedCategory: 'Moderate', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'MODERATE_OUTDOORS' },
    { time: '14:00', isoTimestamp: 'T14:00:00Z', pm25: 55, pm10: 105, estimatedCategory: 'Satisfactory', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'MODERATE_OUTDOORS' },
    { time: '18:00', isoTimestamp: 'T18:00:00Z', pm25: 82, pm10: 145, estimatedCategory: 'Moderate', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'MODERATE_OUTDOORS' },
    { time: '22:00', isoTimestamp: 'T22:00:00Z', pm25: 92, pm10: 160, estimatedCategory: 'Moderate', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' },
  ];

  return {
    city: 'Mumbai',
    region: 'Maharashtra',
    isNCR: false,
    current: cpcb,
    forecast24h,
    provenance: prov,
  };
}

/**
 * Bengaluru Silk Board (Traffic-Dominated Particulate Corridor)
 */
export function getBengaluruDemoState(): AirQualityState {
  const prov = getDemoProvenance('Bengaluru', 'KSPCB CAAQMS Silk Board');
  
  const cpcb = evaluateCPCBNAQI(
    {
      pm25: { value: 68, hoursRecorded: 24 }, // Moderate
      pm10: { value: 128, hoursRecorded: 24 }, // Moderate
      no2: { value: 88, hoursRecorded: 24 },  // Moderate
      so2: { value: 12, hoursRecorded: 24 },  // Good
      co: { value: 2.2, hoursRecorded: 8 },   // Moderate
      o3: { value: 28, hoursRecorded: 8 },    // Good
      nh3: { value: 16, hoursRecorded: 24 },  // Good
      pb: { value: 0.1, hoursRecorded: 24 },  // Good
    },
    prov
  );

  const forecast24h: DiurnalForecastHour[] = [
    { time: '08:00', isoTimestamp: 'T08:00:00Z', pm25: 92, pm10: 165, estimatedCategory: 'Moderate', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '14:00', isoTimestamp: 'T14:00:00Z', pm25: 45, pm10: 85, estimatedCategory: 'Satisfactory', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'MODERATE_OUTDOORS' },
    { time: '19:00', isoTimestamp: 'T19:00:00Z', pm25: 86, pm10: 155, estimatedCategory: 'Moderate', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' },
  ];

  return {
    city: 'Bengaluru',
    region: 'Karnataka',
    isNCR: false,
    current: cpcb,
    forecast24h,
    provenance: prov,
  };
}

/**
 * Kolkata Victoria Memorial (Gangetic Plain Winter Smog)
 */
export function getKolkataDemoState(): AirQualityState {
  const prov = getDemoProvenance('Kolkata', 'WBPCB CAAQMS Victoria');
  
  const cpcb = evaluateCPCBNAQI(
    {
      pm25: { value: 188, hoursRecorded: 24 }, // Very Poor
      pm10: { value: 295, hoursRecorded: 24 }, // Poor
      no2: { value: 72, hoursRecorded: 24 },   // Satisfactory
      so2: { value: 22, hoursRecorded: 24 },   // Good
      co: { value: 1.8, hoursRecorded: 8 },    // Satisfactory
      o3: { value: 34, hoursRecorded: 8 },     // Good
      nh3: { value: 38, hoursRecorded: 24 },   // Good
      pb: { value: 0.2, hoursRecorded: 24 },   // Good
    },
    prov
  );

  const forecast24h: DiurnalForecastHour[] = [
    { time: '06:00', isoTimestamp: 'T06:00:00Z', pm25: 230, pm10: 340, estimatedCategory: 'Very Poor', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '14:00', isoTimestamp: 'T14:00:00Z', pm25: 135, pm10: 220, estimatedCategory: 'Poor', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '20:00', isoTimestamp: 'T20:00:00Z', pm25: 215, pm10: 320, estimatedCategory: 'Very Poor', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
  ];

  return {
    city: 'Kolkata',
    region: 'West Bengal',
    isNCR: false,
    current: cpcb,
    forecast24h,
    provenance: prov,
  };
}

export const DEMO_CITIES: Record<string, () => AirQualityState> = {
  'Delhi-NCR': getDelhiDemoState,
  'Mumbai': getMumbaiDemoState,
  'Bengaluru': getBengaluruDemoState,
  'Kolkata': getKolkataDemoState,
};
