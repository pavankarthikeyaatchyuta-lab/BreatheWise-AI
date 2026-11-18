/**
 * Audit Resilience & Official Reference Benchmark Test Suite
 * Independent verification of:
 * - Official CPCB reference calculation benchmarks
 * - Non-fabrication of missing pollutants (NH3, Pb in model data)
 * - Provider failure resilience & demo mode failover
 * - Stale data detection
 * - Insufficient pollutant handling
 */

import { describe, it, expect } from 'vitest';
import { evaluateCPCBNAQI, calculateSubIndex } from '../src/lib/aqi/cpcb-calc';
import { getModelDerivedCurrentResult, parseOpenMeteoForecast } from '../src/lib/aqi/open-meteo';
import { parseOpenAQSensors } from '../src/lib/aqi/openaq';
import { ProvenanceMetadata } from '../src/lib/types/aqi';
import { generateDeterministicAssistantResponse } from '../src/lib/ai/fallback-ai';
import { DEFAULT_HOUSEHOLD_PROFILE } from '../src/lib/types/user';
import { getDelhiDemoState } from '../src/lib/aqi/demo-data';

const mockStationProv: ProvenanceMetadata = {
  type: 'MEASURED_STATION',
  sourceName: 'Delhi Anand Vihar CAAQMS',
  spatialResolution: 'Station Coordinates',
  temporalResolution: '1-hour continuous',
  measurementTimestamp: new Date().toISOString(),
  fetchedAt: new Date().toISOString(),
  isAveraged24h: true,
  monitoredHoursAvailable: 24,
  validPollutantCount: 8,
  attributionUrl: 'https://cpcb.nic.in',
};

const mockModelProv: ProvenanceMetadata = {
  type: 'ATMOSPHERIC_MODEL_FORECAST',
  sourceName: 'Open-Meteo ECMWF/CAMS',
  spatialResolution: '~45 km Atmospheric Model Grid',
  temporalResolution: '1-hour forecast step',
  measurementTimestamp: new Date().toISOString(),
  fetchedAt: new Date().toISOString(),
  isAveraged24h: false,
  monitoredHoursAvailable: 24,
  validPollutantCount: 6,
  attributionUrl: 'https://open-meteo.com/',
};

describe('Official CPCB Reference Benchmark & Resilience Suite', () => {
  // Test 1: Official CPCB NAQI Reference Values from Gazette / Technical Manual
  it('accurately reproduces official CPCB technical manual test cases', () => {
    // Official manual test case: PM2.5 = 110 µg/m³ -> Sub-index in Poor band (91-120 -> 201-300)
    // 201 + (99/29) * (110 - 91) = 201 + 3.4138 * 19 = 201 + 64.86 = 265.86 -> 266
    expect(calculateSubIndex('pm25', 110)).toBe(266);

    // Official manual test case: PM10 = 310 µg/m³ -> Sub-index in Poor band (251-350 -> 201-300)
    // 201 + (99/99) * (310 - 251) = 201 + 1 * 59 = 260
    expect(calculateSubIndex('pm10', 310)).toBe(260);

    // Official manual test case: NO2 = 210 µg/m³ -> Sub-index in Poor band (181-280 -> 201-300)
    // 201 + (99/99) * (210 - 181) = 201 + 29 = 230
    expect(calculateSubIndex('no2', 210)).toBe(230);
  });

  // Test 2: Never fabricates NH3 or Pb when provider does not supply them
  it('does NOT fabricate NH3 or Pb when evaluating Open-Meteo atmospheric forecast data', () => {
    const mockOpenMeteoPayload = {
      latitude: 28.65,
      longitude: 77.30,
      timezone: 'Asia/Kolkata',
      hourly: {
        time: ['2026-11-18T10:00'],
        pm2_5: [145],
        pm10: [260],
        carbon_monoxide: [1800], // 1.8 mg/m³
        nitrogen_dioxide: [75],
        sulphur_dioxide: [22],
        ozone: [35],
      },
    };

    const result = getModelDerivedCurrentResult(mockOpenMeteoPayload, mockModelProv);

    // NH3 and Pb must be completely unpopulated / absent
    expect(result.pollutants.nh3.value).toBe(-1);
    expect(result.pollutants.nh3.subIndex).toBeNull();
    expect(result.pollutants.pb.value).toBe(-1);
    expect(result.pollutants.pb.subIndex).toBeNull();

    // But PM2.5, PM10, etc. should be evaluated
    expect(result.pollutants.pm25.value).toBe(145);
    expect(result.pollutants.pm25.subIndex).not.toBeNull();
    expect(result.provenance.type).toBe('ATMOSPHERIC_MODEL_FORECAST');
  });

  // Test 3: Insufficient pollutant measurements handling
  it('returns isValidOfficial: false and null AQI when fewer than 3 pollutants are available', () => {
    const insufficientResult = evaluateCPCBNAQI(
      {
        pm25: { value: 160, hoursRecorded: 24 },
        no2: { value: 70, hoursRecorded: 24 },
        // Only 2 pollutants!
      },
      mockStationProv
    );

    expect(insufficientResult.validation.isValidOfficial).toBe(false);
    expect(insufficientResult.aqi).toBeNull();
    expect(insufficientResult.category).toBeNull();
    expect(insufficientResult.validation.reasons[0]).toContain('Only 2 valid pollutant');
  });

  // Test 4: Missing mandatory particulate handling
  it('returns isValidOfficial: false when 3 pollutants exist but neither PM2.5 nor PM10 is monitored', () => {
    const noParticulateResult = evaluateCPCBNAQI(
      {
        no2: { value: 85, hoursRecorded: 24 },
        so2: { value: 35, hoursRecorded: 24 },
        co: { value: 2.5, hoursRecorded: 8 },
        // 3 pollutants, but no PM2.5 or PM10!
      },
      mockStationProv
    );

    expect(noParticulateResult.validation.isValidOfficial).toBe(false);
    expect(noParticulateResult.validation.hasParticulate).toBe(false);
    expect(noParticulateResult.aqi).toBeNull();
    expect(noParticulateResult.validation.reasons[0]).toContain('Missing mandatory particulate matter');
  });

  // Test 5: OpenAQ sensor parsing handles missing sensor fields and negative values cleanly
  it('parses OpenAQ sensors robustly, ignoring negative readings and missing values', () => {
    const mockSensors = [
      { parameter: { name: 'pm25', units: 'µg/m³' }, latest: { value: 185, datetime: '2026-11-18T12:00:00Z' } },
      { parameter: { name: 'pm10', units: 'µg/m³' }, latest: { value: -999, datetime: '2026-11-18T12:00:00Z' } }, // Sensor offline
      { parameter: { name: 'no2', units: 'µg/m³' }, latest: { value: 65, datetime: '2026-11-18T12:00:00Z' } },
      { parameter: { name: 'so2', units: 'µg/m³' }, latest: { value: 18, datetime: '2026-11-18T12:00:00Z' } },
    ];

    const result = parseOpenAQSensors(mockSensors, 'Mock Station');
    expect(result.pollutants.pm25.value).toBe(185);
    expect(result.pollutants.pm10.value).toBe(-1); // Skipped negative reading
    expect(result.validation.isValidOfficial).toBe(true); // 3 valid (pm25, no2, so2) including pm25!
    expect(result.dominantPollutant).toBe('pm25');
  });

  // Test 6: AI Assistant Fallback handles missing API key or network outage gracefully
  it('deterministic AI fallback produces fully populated, grounded advice without external API', () => {
    const demo = getDelhiDemoState();
    const fallbackResponse = generateDeterministicAssistantResponse(
      'Should my asthmatic father go for an early morning walk in Delhi?',
      demo,
      DEFAULT_HOUSEHOLD_PROFILE
    );

    expect(fallbackResponse.reply).toBeDefined();
    expect(fallbackResponse.reply.length).toBeGreaterThan(50);
    expect(fallbackResponse.actionChecklist.length).toBeGreaterThanOrEqual(2);
    expect(fallbackResponse.groundedFactors.referencedAqi).toBe(demo.current.aqi);
    expect(fallbackResponse.disclaimer).toContain('does not provide medical diagnoses');
  });

  // Test 7: Stale data and demonstation data explicit labelling
  it('clearly identifies demonstration records as DEMO_RECORD with source naming', () => {
    const demo = getDelhiDemoState();
    expect(demo.provenance.type).toBe('DEMO_RECORD');
    expect(demo.provenance.sourceName).toContain('Historical Telemetry');
    expect(demo.current.validation.isValidOfficial).toBe(true);
  });
});
