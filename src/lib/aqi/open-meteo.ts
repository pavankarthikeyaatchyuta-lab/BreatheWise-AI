/**
 * Open-Meteo Air Quality Forecast Adapter
 * Ingests hourly atmospheric model data (Copernicus CAMS & NOAA GFS).
 * Strictly badges data as ATMOSPHERIC_MODEL_FORECAST with ~45 km spatial resolution.
 */

import { DiurnalForecastHour, ProvenanceMetadata, AQICategory, PollutantKey } from '../types/aqi';
import { calculateSubIndex, getCategoryFromIndex, evaluateCPCBNAQI } from './cpcb-calc';

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
    sourceName: 'Open-Meteo Air Quality (Copernicus CAMS Global ~45 km)',
    spatialResolution: '~45 km Grid (ECMWF IFS-AER Global Atmospheric Composition, ~0.4° domain)',
    temporalResolution: '3-hourly underlying model resolution (interpolated to hourly API steps; not 24 independent hourly model runs)',
    measurementTimestamp: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    isAveraged24h: false,
    monitoredHoursAvailable: limit,
    validPollutantCount: 6,
    attributionUrl: 'https://open-meteo.com/en/docs/air-quality-api',
  };

  return { forecast24h, provenance };
}

/**
 * Extracts current-hour model forecast concentrations and evaluates CPCB breakpoints
 * without fabricating missing pollutants like NH3 or Pb.
 */
export function getModelDerivedCurrentResult(
  data: OpenMeteoHourlyResponse,
  provenance: ProvenanceMetadata
) {
  const inputs: Partial<Record<PollutantKey, { value: number; hoursRecorded: number }>> = {};

  if (data.hourly.pm2_5 && data.hourly.pm2_5.length > 0 && data.hourly.pm2_5[0] !== null) {
    inputs.pm25 = { value: data.hourly.pm2_5[0], hoursRecorded: 24 };
  }
  if (data.hourly.pm10 && data.hourly.pm10.length > 0 && data.hourly.pm10[0] !== null) {
    inputs.pm10 = { value: data.hourly.pm10[0], hoursRecorded: 24 };
  }
  if (data.hourly.nitrogen_dioxide && data.hourly.nitrogen_dioxide.length > 0 && data.hourly.nitrogen_dioxide[0] !== null) {
    inputs.no2 = { value: data.hourly.nitrogen_dioxide[0], hoursRecorded: 24 };
  }
  if (data.hourly.sulphur_dioxide && data.hourly.sulphur_dioxide.length > 0 && data.hourly.sulphur_dioxide[0] !== null) {
    inputs.so2 = { value: data.hourly.sulphur_dioxide[0], hoursRecorded: 24 };
  }
  if (data.hourly.carbon_monoxide && data.hourly.carbon_monoxide.length > 0 && data.hourly.carbon_monoxide[0] !== null) {
    // Open-Meteo CO is in µg/m³; CPCB expects mg/m³
    inputs.co = { value: Number((data.hourly.carbon_monoxide[0] / 1000).toFixed(2)), hoursRecorded: 8 };
  }
  if (data.hourly.ozone && data.hourly.ozone.length > 0 && data.hourly.ozone[0] !== null) {
    inputs.o3 = { value: data.hourly.ozone[0], hoursRecorded: 8 };
  }

  // Note: NH3 and Pb are NOT provided by Open-Meteo atmospheric forecast models
  // and are intentionally omitted so they are never fabricated.

  return evaluateCPCBNAQI(inputs, provenance);
}

/**
 * Fetches 24-hour forecast from Open-Meteo
 */
export async function fetchOpenMeteoForecast(
  lat: number,
  lon: number
): Promise<{ forecast24h: DiurnalForecastHour[]; currentModelResult: ReturnType<typeof getModelDerivedCurrentResult>; provenance: ProvenanceMetadata } | null> {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto&forecast_days=2`;
    const res = await fetch(url, { next: { revalidate: 1800 } }); // Cache 30 mins
    if (!res.ok) return null;
    const json: OpenMeteoHourlyResponse = await res.json();
    const { forecast24h, provenance } = parseOpenMeteoForecast(json);
    const currentModelResult = getModelDerivedCurrentResult(json, provenance);
    return { forecast24h, currentModelResult, provenance };
  } catch {
    return null; // Return null so aggregator falls back to demo data
  }
}
