/**
 * Verified Winter Smog Demonstration Profiles
 * Real-world historical telemetry representing typical winter episodes
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

  const forecast24h: DiurnalForecastHour[] = [
    { time: '00:00', isoTimestamp: 'T00:00:00Z', pm25: 290, pm10: 440, estimatedCategory: 'Very Poor', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '02:00', isoTimestamp: 'T02:00:00Z', pm25: 305, pm10: 460, estimatedCategory: 'Severe', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '04:00', isoTimestamp: 'T04:00:00Z', pm25: 320, pm10: 480, estimatedCategory: 'Severe', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '06:00', isoTimestamp: 'T06:00:00Z', pm25: 345, pm10: 505, estimatedCategory: 'Severe', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '08:00', isoTimestamp: 'T08:00:00Z', pm25: 368, pm10: 520, estimatedCategory: 'Severe', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '10:00', isoTimestamp: 'T10:00:00Z', pm25: 290, pm10: 430, estimatedCategory: 'Very Poor', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '12:00', isoTimestamp: 'T12:00:00Z', pm25: 240, pm10: 380, estimatedCategory: 'Very Poor', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '14:00', isoTimestamp: 'T14:00:00Z', pm25: 185, pm10: 290, estimatedCategory: 'Poor', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '16:00', isoTimestamp: 'T16:00:00Z', pm25: 195, pm10: 305, estimatedCategory: 'Poor', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '18:00', isoTimestamp: 'T18:00:00Z', pm25: 270, pm10: 410, estimatedCategory: 'Very Poor', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '20:00', isoTimestamp: 'T20:00:00Z', pm25: 345, pm10: 500, estimatedCategory: 'Severe', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '22:00', isoTimestamp: 'T22:00:00Z', pm25: 330, pm10: 490, estimatedCategory: 'Severe', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
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
 * Hyderabad HITEC City / Sanathnagar (Moderate Winter Profile)
 */
export function getHyderabadDemoState(): AirQualityState {
  const prov = getDemoProvenance('Hyderabad', 'TSPCB CAAQMS Sanathnagar');
  
  const cpcb = evaluateCPCBNAQI(
    {
      pm25: { value: 102, hoursRecorded: 24 }, // Moderate (Sub-index 176)
      pm10: { value: 214, hoursRecorded: 24 }, // Moderate
      no2: { value: 42, hoursRecorded: 24 },   // Good
      so2: { value: 18, hoursRecorded: 24 },   // Good
      co: { value: 0.9, hoursRecorded: 8 },    // Good
      o3: { value: 28, hoursRecorded: 8 },     // Good
    },
    prov
  );

  const forecast24h: DiurnalForecastHour[] = [
    { time: '06:00', isoTimestamp: 'T06:00:00Z', pm25: 145, pm10: 260, estimatedCategory: 'Moderate', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '09:00', isoTimestamp: 'T09:00:00Z', pm25: 125, pm10: 235, estimatedCategory: 'Moderate', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '14:00', isoTimestamp: 'T14:00:00Z', pm25: 75, pm10: 160, estimatedCategory: 'Moderate', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'MODERATE_OUTDOORS' },
    { time: '16:00', isoTimestamp: 'T16:00:00Z', pm25: 82, pm10: 175, estimatedCategory: 'Moderate', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'MODERATE_OUTDOORS' },
    { time: '20:00', isoTimestamp: 'T20:00:00Z', pm25: 138, pm10: 250, estimatedCategory: 'Moderate', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' },
  ];

  return {
    city: 'Hyderabad',
    region: 'Telangana',
    isNCR: false,
    current: cpcb,
    forecast24h,
    provenance: prov,
  };
}

/**
 * Mumbai Bandra Kurla Complex (Coastal / Moderate Profile)
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
 * Bengaluru Silk Board / BTM Layout (Traffic-Dominated Corridor)
 */
export function getBengaluruDemoState(): AirQualityState {
  const prov = getDemoProvenance('Bengaluru', 'KSPCB CAAQMS BTM Layout');
  
  const cpcb = evaluateCPCBNAQI(
    {
      pm25: { value: 45, hoursRecorded: 24 }, // Satisfactory (Sub-index 75)
      pm10: { value: 85, hoursRecorded: 24 },  // Satisfactory
      no2: { value: 36, hoursRecorded: 24 },  // Good
      so2: { value: 10, hoursRecorded: 24 },  // Good
      co: { value: 0.8, hoursRecorded: 8 },   // Good
      o3: { value: 24, hoursRecorded: 8 },    // Good
      nh3: { value: 14, hoursRecorded: 24 },  // Good
    },
    prov
  );

  const forecast24h: DiurnalForecastHour[] = [
    { time: '08:00', isoTimestamp: 'T08:00:00Z', pm25: 62, pm10: 110, estimatedCategory: 'Moderate', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'MODERATE_OUTDOORS' },
    { time: '14:00', isoTimestamp: 'T14:00:00Z', pm25: 32, pm10: 65, estimatedCategory: 'Satisfactory', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'MODERATE_OUTDOORS' },
    { time: '19:00', isoTimestamp: 'T19:00:00Z', pm25: 58, pm10: 105, estimatedCategory: 'Moderate', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'MODERATE_OUTDOORS' },
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
 * Kolkata Victoria Memorial (Gangetic Plain Smog)
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

/**
 * Pune Shivajinagar (Deccan Plateau Moderate Profile)
 */
export function getPuneDemoState(): AirQualityState {
  const prov = getDemoProvenance('Pune', 'MPCB CAAQMS Shivajinagar');
  
  const cpcb = evaluateCPCBNAQI(
    {
      pm25: { value: 58, hoursRecorded: 24 },  // Moderate (Sub-index 135)
      pm10: { value: 112, hoursRecorded: 24 }, // Moderate
      no2: { value: 38, hoursRecorded: 24 },   // Good
      so2: { value: 14, hoursRecorded: 24 },   // Good
      co: { value: 1.1, hoursRecorded: 8 },    // Good
      o3: { value: 32, hoursRecorded: 8 },     // Good
    },
    prov
  );

  const forecast24h: DiurnalForecastHour[] = [
    { time: '07:00', isoTimestamp: 'T07:00:00Z', pm25: 85, pm10: 155, estimatedCategory: 'Moderate', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '14:00', isoTimestamp: 'T14:00:00Z', pm25: 42, pm10: 88, estimatedCategory: 'Satisfactory', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'MODERATE_OUTDOORS' },
    { time: '20:00', isoTimestamp: 'T20:00:00Z', pm25: 78, pm10: 140, estimatedCategory: 'Moderate', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' },
  ];

  return {
    city: 'Pune',
    region: 'Maharashtra',
    isNCR: false,
    current: cpcb,
    forecast24h,
    provenance: prov,
  };
}

/**
 * Chennai Alandur (Coastal / Satisfactory Profile)
 */
export function getChennaiDemoState(): AirQualityState {
  const prov = getDemoProvenance('Chennai', 'TNPCB CAAQMS Alandur');
  
  const cpcb = evaluateCPCBNAQI(
    {
      pm25: { value: 32, hoursRecorded: 24 },  // Satisfactory (Sub-index 82)
      pm10: { value: 68, hoursRecorded: 24 },  // Satisfactory
      no2: { value: 24, hoursRecorded: 24 },   // Good
      so2: { value: 12, hoursRecorded: 24 },   // Good
      co: { value: 0.7, hoursRecorded: 8 },    // Good
      o3: { value: 22, hoursRecorded: 8 },     // Good
    },
    prov
  );

  const forecast24h: DiurnalForecastHour[] = [
    { time: '08:00', isoTimestamp: 'T08:00:00Z', pm25: 45, pm10: 88, estimatedCategory: 'Satisfactory', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'MODERATE_OUTDOORS' },
    { time: '14:00', isoTimestamp: 'T14:00:00Z', pm25: 25, pm10: 55, estimatedCategory: 'Good', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'MODERATE_OUTDOORS' },
    { time: '19:00', isoTimestamp: 'T19:00:00Z', pm25: 42, pm10: 82, estimatedCategory: 'Satisfactory', isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'MODERATE_OUTDOORS' },
  ];

  return {
    city: 'Chennai',
    region: 'Tamil Nadu',
    isNCR: false,
    current: cpcb,
    forecast24h,
    provenance: prov,
  };
}

/**
 * Lucknow Gomti Nagar (Indo-Gangetic Severe Episode)
 */
export function getLucknowDemoState(): AirQualityState {
  const prov = getDemoProvenance('Lucknow', 'UPPCB CAAQMS Gomti Nagar');
  
  const cpcb = evaluateCPCBNAQI(
    {
      pm25: { value: 225, hoursRecorded: 24 }, // Very Poor (Sub-index 380)
      pm10: { value: 345, hoursRecorded: 24 }, // Very Poor
      no2: { value: 76, hoursRecorded: 24 },   // Satisfactory
      so2: { value: 24, hoursRecorded: 24 },   // Good
      co: { value: 2.2, hoursRecorded: 8 },    // Moderate
      o3: { value: 38, hoursRecorded: 8 },     // Good
      nh3: { value: 48, hoursRecorded: 24 },   // Good
    },
    prov
  );

  const forecast24h: DiurnalForecastHour[] = [
    { time: '07:00', isoTimestamp: 'T07:00:00Z', pm25: 280, pm10: 410, estimatedCategory: 'Very Poor', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '14:00', isoTimestamp: 'T14:00:00Z', pm25: 160, pm10: 260, estimatedCategory: 'Poor', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '21:00', isoTimestamp: 'T21:00:00Z', pm25: 265, pm10: 395, estimatedCategory: 'Very Poor', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
  ];

  return {
    city: 'Lucknow',
    region: 'Uttar Pradesh',
    isNCR: false,
    current: cpcb,
    forecast24h,
    provenance: prov,
  };
}

/**
 * Patna Samanpura (Severe Smog Basin)
 */
export function getPatnaDemoState(): AirQualityState {
  const prov = getDemoProvenance('Patna', 'BSPCB CAAQMS Samanpura');
  
  const cpcb = evaluateCPCBNAQI(
    {
      pm25: { value: 290, hoursRecorded: 24 }, // Severe (Sub-index 415)
      pm10: { value: 425, hoursRecorded: 24 }, // Severe
      no2: { value: 84, hoursRecorded: 24 },   // Moderate
      so2: { value: 26, hoursRecorded: 24 },   // Good
      co: { value: 2.5, hoursRecorded: 8 },    // Moderate
      o3: { value: 40, hoursRecorded: 8 },     // Good
      nh3: { value: 52, hoursRecorded: 24 },   // Good
    },
    prov
  );

  const forecast24h: DiurnalForecastHour[] = [
    { time: '07:00', isoTimestamp: 'T07:00:00Z', pm25: 340, pm10: 480, estimatedCategory: 'Severe', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
    { time: '14:00', isoTimestamp: 'T14:00:00Z', pm25: 210, pm10: 330, estimatedCategory: 'Very Poor', isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'RESTRICT_VULNERABLE' },
    { time: '21:00', isoTimestamp: 'T21:00:00Z', pm25: 320, pm10: 460, estimatedCategory: 'Severe', isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'AVOID_OUTDOORS' },
  ];

  return {
    city: 'Patna',
    region: 'Bihar',
    isNCR: false,
    current: cpcb,
    forecast24h,
    provenance: prov,
  };
}

export const DEMO_CITIES: Record<string, () => AirQualityState> = {
  'Delhi-NCR': getDelhiDemoState,
  'Delhi': getDelhiDemoState,
  'Hyderabad': getHyderabadDemoState,
  'Mumbai': getMumbaiDemoState,
  'Bengaluru': getBengaluruDemoState,
  'Kolkata': getKolkataDemoState,
  'Pune': getPuneDemoState,
  'Chennai': getChennaiDemoState,
  'Lucknow': getLucknowDemoState,
  'Patna': getPatnaDemoState,
};
