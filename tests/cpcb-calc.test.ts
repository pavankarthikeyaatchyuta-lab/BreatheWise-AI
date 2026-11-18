import { describe, it, expect } from 'vitest';
import {
  calculateSubIndex,
  getCategoryFromIndex,
  evaluateCPCBNAQI,
} from '../src/lib/aqi/cpcb-calc';
import { ProvenanceMetadata } from '../src/lib/types/aqi';

const mockProvenance: ProvenanceMetadata = {
  type: 'MEASURED_STATION',
  sourceName: 'Test CAAQMS Station',
  spatialResolution: 'Station Coordinates',
  temporalResolution: '1-hour continuous',
  measurementTimestamp: new Date().toISOString(),
  fetchedAt: new Date().toISOString(),
  isAveraged24h: true,
  monitoredHoursAvailable: 24,
  validPollutantCount: 8,
  attributionUrl: 'https://cpcb.nic.in',
};

describe('CPCB 8-Pollutant NAQI Calculation Suite', () => {
  it('correctly calculates PM2.5 sub-index across breakpoints', () => {
    expect(calculateSubIndex('pm25', 15)).toBe(25); // Good (0-30 -> 0-50)
    expect(calculateSubIndex('pm25', 45)).toBe(75); // Satisfactory (31-60 -> 51-100)
    expect(calculateSubIndex('pm25', 75)).toBe(149); // Moderate (61-90 -> 101-200) exact interpolation
    expect(calculateSubIndex('pm25', 105)).toBe(249); // Poor (91-120 -> 201-300) exact interpolation
    expect(calculateSubIndex('pm25', 185)).toBe(350); // Very Poor (121-250 -> 301-400)
    expect(calculateSubIndex('pm25', 375)).toBe(450); // Severe (251-500 -> 401-500)
  });

  it('correctly calculates PM10 sub-index', () => {
    expect(calculateSubIndex('pm10', 25)).toBe(25); // Good
    expect(calculateSubIndex('pm10', 75)).toBe(75); // Satisfactory
    expect(calculateSubIndex('pm10', 175)).toBe(150); // Moderate
  });

  it('correctly calculates NO2 sub-index', () => {
    expect(calculateSubIndex('no2', 20)).toBe(25); // Good
    expect(calculateSubIndex('no2', 60)).toBe(75); // Satisfactory
    expect(calculateSubIndex('no2', 130)).toBe(150); // Moderate exact interpolation
  });

  it('correctly calculates SO2 sub-index', () => {
    expect(calculateSubIndex('so2', 20)).toBe(25); // Good
    expect(calculateSubIndex('so2', 60)).toBe(75); // Satisfactory
  });

  it('correctly calculates CO sub-index (8h average in mg/m³)', () => {
    expect(calculateSubIndex('co', 0.5)).toBe(25); // Good
    expect(calculateSubIndex('co', 1.5)).toBe(73); // Satisfactory
    expect(calculateSubIndex('co', 5.0)).toBe(137); // Moderate
  });

  it('correctly calculates O3 sub-index (8h average)', () => {
    expect(calculateSubIndex('o3', 25)).toBe(25); // Good
    expect(calculateSubIndex('o3', 75)).toBe(75); // Satisfactory
  });

  it('correctly calculates NH3 sub-index', () => {
    expect(calculateSubIndex('nh3', 100)).toBe(25); // Good
    expect(calculateSubIndex('nh3', 300)).toBe(75); // Satisfactory
  });

  it('correctly calculates Pb (Lead) sub-index', () => {
    expect(calculateSubIndex('pb', 0.25)).toBe(25); // Good
    expect(calculateSubIndex('pb', 0.8)).toBe(76); // Satisfactory
  });

  it('clamps off-scale pollutant concentrations to 500 max index', () => {
    expect(calculateSubIndex('pm25', 650)).toBe(500);
    expect(calculateSubIndex('pm10', 800)).toBe(500);
  });

  it('maps calculated index values to accurate CPCB categories', () => {
    expect(getCategoryFromIndex(35)).toBe('Good');
    expect(getCategoryFromIndex(85)).toBe('Satisfactory');
    expect(getCategoryFromIndex(160)).toBe('Moderate');
    expect(getCategoryFromIndex(250)).toBe('Poor');
    expect(getCategoryFromIndex(350)).toBe('Very Poor');
    expect(getCategoryFromIndex(450)).toBe('Severe');
  });

  it('identifies dominant pollutant and overall AQI accurately', () => {
    const result = evaluateCPCBNAQI(
      {
        pm25: { value: 185, hoursRecorded: 24 }, // SubIndex ~350 (Very Poor)
        pm10: { value: 120, hoursRecorded: 24 }, // SubIndex ~114 (Moderate)
        no2: { value: 40, hoursRecorded: 24 },   // SubIndex ~50 (Good)
      },
      mockProvenance
    );

    expect(result.validation.isValidOfficial).toBe(true);
    expect(result.aqi).toBe(350);
    expect(result.category).toBe('Very Poor');
    expect(result.dominantPollutant).toBe('pm25');
  });

  it('strictly enforces the minimum 3 pollutants rule', () => {
    // Only 2 pollutants provided (PM2.5 and PM10)
    const result = evaluateCPCBNAQI(
      {
        pm25: { value: 80, hoursRecorded: 24 },
        pm10: { value: 120, hoursRecorded: 24 },
      },
      mockProvenance
    );

    expect(result.validation.isValidOfficial).toBe(false);
    expect(result.aqi).toBeNull();
    expect(result.category).toBeNull();
    expect(result.validation.reasons.some((r) => r.includes('Only 2 valid pollutant'))).toBe(true);
  });

  it('strictly enforces the mandatory particulate matter requirement', () => {
    // 3 pollutants provided, but neither PM2.5 nor PM10
    const result = evaluateCPCBNAQI(
      {
        no2: { value: 60, hoursRecorded: 24 },
        so2: { value: 30, hoursRecorded: 24 },
        co: { value: 1.2, hoursRecorded: 8 },
      },
      mockProvenance
    );

    expect(result.validation.isValidOfficial).toBe(false);
    expect(result.aqi).toBeNull();
    expect(result.validation.reasons.some((r) => r.includes('Missing mandatory particulate'))).toBe(true);
  });

  it('rejects 24-hour calculation when recorded hours are below 16h minimum', () => {
    const result = evaluateCPCBNAQI(
      {
        pm25: { value: 95, hoursRecorded: 12 }, // < 16 hours!
        pm10: { value: 140, hoursRecorded: 24 },
        no2: { value: 50, hoursRecorded: 24 },
      },
      mockProvenance
    );

    expect(result.validation.isValidOfficial).toBe(false);
    expect(result.validation.hasMinimumHours).toBe(false);
    expect(result.validation.reasons.some((r) => r.includes('only 12h of data'))).toBe(true);
  });
});
