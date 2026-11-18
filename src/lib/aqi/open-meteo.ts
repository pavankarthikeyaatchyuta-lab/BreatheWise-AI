/**
 * Open-Meteo Air Quality Forecast Adapter
 * Ingests hourly atmospheric model data (Copernicus CAMS & NOAA GFS).
 * Strictly badges data as ATMOSPHERIC_MODEL_FORECAST with ~45 km spatial resolution.
 */

import { DiurnalForecastHour, ProvenanceMetadata, AQICategory, PollutantKey } from '../types/aqi';
import { calculateSubIndex, getCategoryFromIndex } from './cpcb-calc';

export interface OpenMeteoHourlyResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: {
    time: string[];
    pm10?: number[];
    pm2_5?: number[];
    carbon_monoxide?: number[];
    nitrogen_dioxide?: number[];
    sulphur_dioxide?: number[];
    ozone?: number[];
  };
}

export function parseOpenMeteoForecast(
  data: OpenMeteoHourlyResponse
): {
  forecast24h: DiurnalForecastHour[];
  provenance: ProvenanceMetadata;
} {
  const times = data.hourly.time || [];
  const pm25List = data.hourly.pm2_5 || [];
  const pm10List = data.hourly.pm10 || [];

  // Take the next 24 hourly steps
  const forecast24h: DiurnalForecastHour[] = [];
  const limit = Math.min(24, times.length);

  for (let i = 0; i < limit; i++) {
    const rawTime = times[i];
    const dateObj = new Date(rawTime);
    const hourNum = dateObj.getHours();
    const timeStr = `${hourNum.toString().padStart(2, '0')}:00`;

    const pm25 = pm25List[i] ?? 0;
    const pm10 = pm10List[i] ?? 0;

    // Estimate category using CPCB PM2.5 breakpoint
    const subIndex = calculateSubIndex('pm25', pm25) ?? 100;
    const estimatedCategory = getCategoryFromIndex(subIndex);

    // Diurnal inversion flags
    const isPeakSmog = (hourNum >= 6 && hourNum <= 9) || (hourNum >= 19 && hourNum <= 22);
    const isRelativeLow = hourNum >= 13 && hourNum <= 16;

    let activityRecommendation: 'AVOID_OUTDOORS' | 'RESTRICT_VULNERABLE' | 'MODERATE_OUTDOORS' = 'MODERATE_OUTDOORS';
    if (estimatedCategory === 'Severe') {
      activityRecommendation = 'AVOID_OUTDOORS';
    } else if (estimatedCategory === 'Very Poor' || estimatedCategory === 'Poor') {
      activityRecommendation = isRelativeLow ? 'RESTRICT_VULNERABLE' : 'AVOID_OUTDOORS';
    }

    forecast24h.push({
      time: timeStr,
      isoTimestamp: rawTime,
      pm25: Math.round(pm25),
      pm10: Math.round(pm10),
      estimatedCategory,
      isPeakSmogWindow: isPeakSmog,
      isRelativeLowWindow: isRelativeLow,
      activityRecommendation,
    });
  }

  const provenance: ProvenanceMetadata = {
    type: 'ATMOSPHERIC_MODEL_FORECAST',
    sourceName: 'Open-Meteo Air Quality (Copernicus CAMS & NOAA GFS)',
    spatialResolution: '~45 km Atmospheric Model Grid (Not Street-Level)',
    temporalResolution: '1-hour forecast step',
    measurementTimestamp: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    isAveraged24h: false,
    monitoredHoursAvailable: limit,
    validPollutantCount: 6,
    attributionUrl: 'https://open-meteo.com/',
  };

  return { forecast24h, provenance };
}

/**
 * Fetches 24-hour forecast from Open-Meteo
 */
export async function fetchOpenMeteoForecast(
  lat: number,
  lon: number
): Promise<{ forecast24h: DiurnalForecastHour[]; provenance: ProvenanceMetadata } | null> {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air_quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto&forecast_days=2`;
    const res = await fetch(url, { next: { revalidate: 1800 } }); // Cache 30 mins
    if (!res.ok) return null;
    const json: OpenMeteoHourlyResponse = await res.json();
    return parseOpenMeteoForecast(json);
  } catch {
    return null; // Return null so aggregator falls back to demo data
  }
}
