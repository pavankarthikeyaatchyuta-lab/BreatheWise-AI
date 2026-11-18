import { describe, it, expect } from 'vitest';
import { parseOpenMeteoForecast } from '../src/lib/aqi/open-meteo';
import { getDelhiDemoState, getMumbaiDemoState } from '../src/lib/aqi/demo-data';

describe('Data Provenance & Open-Meteo Parser Suite', () => {
  it('correctly badges atmospheric forecast data with ~45 km resolution', () => {
    const mockOpenMeteoData = {
      latitude: 28.65,
      longitude: 77.30,
      timezone: 'Asia/Kolkata',
      hourly: {
        time: ['2026-11-18T06:00', '2026-11-18T07:00', '2026-11-18T14:00'],
        pm2_5: [180, 220, 95],
        pm10: [290, 340, 160],
      },
    };

    const parsed = parseOpenMeteoForecast(mockOpenMeteoData);

    expect(parsed.provenance.type).toBe('ATMOSPHERIC_MODEL_FORECAST');
    expect(parsed.provenance.spatialResolution).toContain('~45 km');
    expect(parsed.provenance.isAveraged24h).toBe(false);
    expect(parsed.forecast24h.length).toBe(3);
  });

  it('correctly identifies diurnal inversion peak smog windows (06:00 - 09:00)', () => {
    const mockData = {
      latitude: 28.65,
      longitude: 77.30,
      timezone: 'Asia/Kolkata',
      hourly: {
        time: ['2026-11-18T08:00', '2026-11-18T14:00', '2026-11-18T21:00'],
        pm2_5: [210, 80, 240],
        pm10: [320, 140, 360],
      },
    };

    const parsed = parseOpenMeteoForecast(mockData);
    const morningHour = parsed.forecast24h[0];
    const middayHour = parsed.forecast24h[1];
    const eveningHour = parsed.forecast24h[2];

    expect(morningHour.isPeakSmogWindow).toBe(true);
    expect(middayHour.isPeakSmogWindow).toBe(false);
    expect(middayHour.isRelativeLowWindow).toBe(true);
    expect(eveningHour.isPeakSmogWindow).toBe(true);
  });

  it('correctly maps estimated categories from model PM2.5 concentrations', () => {
    const mockData = {
      latitude: 28.65,
      longitude: 77.30,
      timezone: 'Asia/Kolkata',
      hourly: {
        time: ['2026-11-18T08:00'],
        pm2_5: [320], // Severe (>250)
        pm10: [480],
      },
    };

    const parsed = parseOpenMeteoForecast(mockData);
    expect(parsed.forecast24h[0].estimatedCategory).toBe('Severe');
    expect(parsed.forecast24h[0].activityRecommendation).toBe('AVOID_OUTDOORS');
  });

  it('badges demonstration datasets honestly as DEMO_RECORD', () => {
    const delhi = getDelhiDemoState();
    expect(delhi.provenance.type).toBe('DEMO_RECORD');
    expect(delhi.provenance.sourceName).toContain('Historical Telemetry');
    expect(delhi.city).toBe('Delhi-NCR');
    expect(delhi.isNCR).toBe(true);
  });

  it('demonstration data contains complete 24-hour diurnal profile', () => {
    const delhi = getDelhiDemoState();
    expect(delhi.forecast24h.length).toBe(12);
    expect(delhi.current.aqi).toBeGreaterThan(400); // Severe winter episode
    expect(delhi.current.category).toBe('Severe');
  });

  it('differentiates regional smog levels between Delhi and Mumbai', () => {
    const delhi = getDelhiDemoState();
    const mumbai = getMumbaiDemoState();

    expect(delhi.current.aqi).toBeGreaterThan(mumbai.current.aqi!);
    expect(delhi.isNCR).toBe(true);
    expect(mumbai.isNCR).toBe(false);
  });

  it('handles empty or malformed Open-Meteo inputs gracefully without crashing', () => {
    const emptyData = {
      latitude: 0,
      longitude: 0,
      timezone: 'UTC',
      hourly: {
        time: [],
      },
    };

    const parsed = parseOpenMeteoForecast(emptyData);
    expect(parsed.forecast24h).toEqual([]);
    expect(parsed.provenance.monitoredHoursAvailable).toBe(0);
  });
});
