/**
 * Official Indian Central Pollution Control Board (CPCB) NAQI Engine
 * Implements all 8 criteria pollutants according to statutory guidelines:
 * - PM2.5, PM10, NO2, SO2, NH3, Pb (24-hour average, requires >= 16h valid data)
 * - CO, O3 (8-hour average, requires >= 6h valid data)
 * - Requires minimum 3 pollutants, at least one of which MUST be PM2.5 or PM10
 */

import { PollutantKey, AQICategory, PollutantReading, CPCBResult, ProvenanceMetadata } from '../types/aqi';

export interface BreakpointRange {
  bLo: number;
  bHi: number;
  iLo: number;
  iHi: number;
  category: AQICategory;
}

// Statutory CPCB Breakpoint Tables
export const CPCB_BREAKPOINTS: Record<PollutantKey, BreakpointRange[]> = {
  pm25: [
    { bLo: 0, bHi: 30, iLo: 0, iHi: 50, category: 'Good' },
    { bLo: 31, bHi: 60, iLo: 51, iHi: 100, category: 'Satisfactory' },
    { bLo: 61, bHi: 90, iLo: 101, iHi: 200, category: 'Moderate' },
    { bLo: 91, bHi: 120, iLo: 201, iHi: 300, category: 'Poor' },
    { bLo: 121, bHi: 250, iLo: 301, iHi: 400, category: 'Very Poor' },
    { bLo: 251, bHi: 500, iLo: 401, iHi: 500, category: 'Severe' },
  ],
  pm10: [
    { bLo: 0, bHi: 50, iLo: 0, iHi: 50, category: 'Good' },
    { bLo: 51, bHi: 100, iLo: 51, iHi: 100, category: 'Satisfactory' },
    { bLo: 101, bHi: 250, iLo: 101, iHi: 200, category: 'Moderate' },
    { bLo: 251, bHi: 350, iLo: 201, iHi: 300, category: 'Poor' },
    { bLo: 351, bHi: 430, iLo: 301, iHi: 400, category: 'Very Poor' },
    { bLo: 431, bHi: 600, iLo: 401, iHi: 500, category: 'Severe' },
  ],
  no2: [
    { bLo: 0, bHi: 40, iLo: 0, iHi: 50, category: 'Good' },
    { bLo: 41, bHi: 80, iLo: 51, iHi: 100, category: 'Satisfactory' },
    { bLo: 81, bHi: 180, iLo: 101, iHi: 200, category: 'Moderate' },
    { bLo: 181, bHi: 280, iLo: 201, iHi: 300, category: 'Poor' },
    { bLo: 281, bHi: 400, iLo: 301, iHi: 400, category: 'Very Poor' },
    { bLo: 401, bHi: 800, iLo: 401, iHi: 500, category: 'Severe' },
  ],
  so2: [
    { bLo: 0, bHi: 40, iLo: 0, iHi: 50, category: 'Good' },
    { bLo: 41, bHi: 80, iLo: 51, iHi: 100, category: 'Satisfactory' },
    { bLo: 81, bHi: 380, iLo: 101, iHi: 200, category: 'Moderate' },
    { bLo: 381, bHi: 800, iLo: 201, iHi: 300, category: 'Poor' },
    { bLo: 801, bHi: 1600, iLo: 301, iHi: 400, category: 'Very Poor' },
    { bLo: 1601, bHi: 2400, iLo: 401, iHi: 500, category: 'Severe' },
  ],
  co: [
    { bLo: 0, bHi: 1.0, iLo: 0, iHi: 50, category: 'Good' },
    { bLo: 1.1, bHi: 2.0, iLo: 51, iHi: 100, category: 'Satisfactory' },
    { bLo: 2.1, bHi: 10.0, iLo: 101, iHi: 200, category: 'Moderate' },
    { bLo: 10.1, bHi: 17.0, iLo: 201, iHi: 300, category: 'Poor' },
    { bLo: 17.1, bHi: 34.0, iLo: 301, iHi: 400, category: 'Very Poor' },
    { bLo: 34.1, bHi: 50.0, iLo: 401, iHi: 500, category: 'Severe' },
  ],
  o3: [
    { bLo: 0, bHi: 50, iLo: 0, iHi: 50, category: 'Good' },
    { bLo: 51, bHi: 100, iLo: 51, iHi: 100, category: 'Satisfactory' },
    { bLo: 101, bHi: 168, iLo: 101, iHi: 200, category: 'Moderate' },
    { bLo: 169, bHi: 208, iLo: 201, iHi: 300, category: 'Poor' },
    { bLo: 209, bHi: 748, iLo: 301, iHi: 400, category: 'Very Poor' },
    { bLo: 749, bHi: 1000, iLo: 401, iHi: 500, category: 'Severe' },
  ],
  nh3: [
    { bLo: 0, bHi: 200, iLo: 0, iHi: 50, category: 'Good' },
    { bLo: 201, bHi: 400, iLo: 51, iHi: 100, category: 'Satisfactory' },
    { bLo: 401, bHi: 800, iLo: 101, iHi: 200, category: 'Moderate' },
    { bLo: 801, bHi: 1200, iLo: 201, iHi: 300, category: 'Poor' },
    { bLo: 1201, bHi: 1800, iLo: 301, iHi: 400, category: 'Very Poor' },
    { bLo: 1801, bHi: 2400, iLo: 401, iHi: 500, category: 'Severe' },
  ],
  pb: [
    { bLo: 0, bHi: 0.5, iLo: 0, iHi: 50, category: 'Good' },
    { bLo: 0.6, bHi: 1.0, iLo: 51, iHi: 100, category: 'Satisfactory' },
    { bLo: 1.1, bHi: 2.0, iLo: 101, iHi: 200, category: 'Moderate' },
    { bLo: 2.1, bHi: 3.0, iLo: 201, iHi: 300, category: 'Poor' },
    { bLo: 3.1, bHi: 3.5, iLo: 301, iHi: 400, category: 'Very Poor' },
    { bLo: 3.6, bHi: 5.0, iLo: 401, iHi: 500, category: 'Severe' },
  ],
};

export const POLLUTANT_NAMES: Record<PollutantKey, string> = {
  pm25: 'PM2.5 (Fine Particulate Matter)',
  pm10: 'PM10 (Coarse Particulate Matter)',
  no2: 'Nitrogen Dioxide (NO₂)',
  so2: 'Sulphur Dioxide (SO₂)',
  co: 'Carbon Monoxide (CO)',
  o3: 'Ozone (O₃)',
  nh3: 'Ammonia (NH₃)',
  pb: 'Lead (Pb)',
};

export const POLLUTANT_UNITS: Record<PollutantKey, string> = {
  pm25: 'µg/m³',
  pm10: 'µg/m³',
  no2: 'µg/m³',
  so2: 'µg/m³',
  co: 'mg/m³',
  o3: 'µg/m³',
  nh3: 'µg/m³',
  pb: 'µg/m³',
};

/**
 * Calculates a single pollutant sub-index using CPCB linear interpolation formula
 */
export function calculateSubIndex(key: PollutantKey, concentration: number): number | null {
  if (concentration < 0 || isNaN(concentration)) return null;

  const breakpoints = CPCB_BREAKPOINTS[key];
  if (!breakpoints) return null;

  for (const bp of breakpoints) {
    if (concentration >= bp.bLo && concentration <= bp.bHi) {
      const subIndex = bp.iLo + ((bp.iHi - bp.iLo) / (bp.bHi - bp.bLo)) * (concentration - bp.bLo);
      return Math.round(subIndex);
    }
  }

  // Concentration exceeds highest breakpoint (Off-scale Severe)
  const highest = breakpoints[breakpoints.length - 1];
  if (concentration > highest.bHi) {
    return 500;
  }

  return null;
}

/**
 * Determines AQI category from calculated index value
 */
export function getCategoryFromIndex(index: number): AQICategory {
  if (index <= 50) return 'Good';
  if (index <= 100) return 'Satisfactory';
  if (index <= 200) return 'Moderate';
  if (index <= 300) return 'Poor';
  if (index <= 400) return 'Very Poor';
  return 'Severe';
}

export interface RawPollutantInput {
  value: number;
  hoursRecorded?: number; // Defaults to 24h or 8h
}

/**
 * Master CPCB NAQI Evaluation Engine
 * Validates:
 * 1. Minimum 3 valid pollutants
 * 2. At least one must be PM2.5 or PM10
 * 3. 24h averaging requires >= 16h recorded data
 * 4. 8h averaging requires >= 6h recorded data
 */
export function evaluateCPCBNAQI(
  inputs: Partial<Record<PollutantKey, RawPollutantInput>>,
  provenance: ProvenanceMetadata
): CPCBResult {
  const pollutants = {} as Record<PollutantKey, PollutantReading>;
  const subIndices = {} as Record<PollutantKey, number | null>;
  const reasons: string[] = [];

  let validSubIndicesCount = 0;
  let hasValidParticulate = false;
  let hasHoursDeficiency = false;

  const allKeys: PollutantKey[] = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3', 'nh3', 'pb'];

  for (const key of allKeys) {
    const input = inputs[key];
    const is8h = key === 'co' || key === 'o3';
    const minHours = is8h ? 6 : 16;
    const hours = input?.hoursRecorded ?? (is8h ? 8 : 24);

    if (input !== undefined && input.value >= 0) {
      // Check data completeness requirement
      if (hours < minHours) {
        hasHoursDeficiency = true;
        reasons.push(
          `${key.toUpperCase()} has only ${hours}h of data (minimum ${minHours}h required for valid ${is8h ? '8h' : '24h'} averaging).`
        );
        pollutants[key] = {
          key,
          name: POLLUTANT_NAMES[key],
          value: input.value,
          unit: POLLUTANT_UNITS[key],
          averagingHours: is8h ? 8 : 24,
          subIndex: null,
          category: null,
          minHoursRequired: minHours,
          hoursRecorded: hours,
        };
        subIndices[key] = null;
      } else {
        const subIndex = calculateSubIndex(key, input.value);
        const category = subIndex !== null ? getCategoryFromIndex(subIndex) : null;
        
        pollutants[key] = {
          key,
          name: POLLUTANT_NAMES[key],
          value: input.value,
          unit: POLLUTANT_UNITS[key],
          averagingHours: is8h ? 8 : 24,
          subIndex,
          category,
          minHoursRequired: minHours,
          hoursRecorded: hours,
        };
        subIndices[key] = subIndex;

        if (subIndex !== null) {
          validSubIndicesCount++;
          if (key === 'pm25' || key === 'pm10') {
            hasValidParticulate = true;
          }
        }
      }
    } else {
      pollutants[key] = {
        key,
        name: POLLUTANT_NAMES[key],
        value: -1,
        unit: POLLUTANT_UNITS[key],
        averagingHours: is8h ? 8 : 24,
        subIndex: null,
        category: null,
        minHoursRequired: minHours,
        hoursRecorded: 0,
      };
      subIndices[key] = null;
    }
  }

  // Statutory Validation Checks
  if (validSubIndicesCount < 3) {
    reasons.push(
      `Insufficient pollutant coverage: Only ${validSubIndicesCount} valid pollutant sub-indices available (CPCB requires at least 3).`
    );
  }

  if (!hasValidParticulate) {
    reasons.push(
      `Missing mandatory particulate matter: CPCB requires either PM2.5 or PM10 with >=16h valid data to calculate official NAQI.`
    );
  }

  const isValidOfficial = validSubIndicesCount >= 3 && hasValidParticulate && !hasHoursDeficiency;

  // Determine Max Sub-Index & Dominant Pollutant
  let maxIndex: number | null = null;
  let dominantKey: PollutantKey | null = null;

  for (const key of allKeys) {
    const sub = subIndices[key];
    if (sub !== null) {
      if (maxIndex === null || sub > maxIndex) {
        maxIndex = sub;
        dominantKey = key;
      }
    }
  }

  return {
    aqi: isValidOfficial ? maxIndex : null,
    category: isValidOfficial && maxIndex !== null ? getCategoryFromIndex(maxIndex) : null,
    dominantPollutant: isValidOfficial ? dominantKey : null,
    dominantPollutantName: isValidOfficial && dominantKey ? POLLUTANT_NAMES[dominantKey] : null,
    subIndices,
    pollutants,
    validation: {
      isValidOfficial,
      hasParticulate: hasValidParticulate,
      pollutantCount: validSubIndicesCount,
      hasMinimumHours: !hasHoursDeficiency,
      reasons,
    },
    provenance,
  };
}
