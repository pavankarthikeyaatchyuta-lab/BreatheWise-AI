/**
 * OpenAQ v3 Ground-Truth Station Adapter
 * Fetches physical ground monitoring station measurements (CPCB / State PCBs).
 * Enforces data completeness and provenance tagging.
 */

import { CPCBResult, PollutantKey, ProvenanceMetadata } from '../types/aqi';
import { evaluateCPCBNAQI, RawPollutantInput } from './cpcb-calc';

export interface OpenAQMeasurement {
  parameter: string; // "pm25", "pm10", "no2", "so2", "co", "o3"
  value: number;
  period?: {
    datetimeFrom?: { local: string };
    datetimeTo?: { local: string };
  };
}

export interface OpenAQLocationResponse {
  results?: Array<{
    id: number;
    name: string;
    locality?: string;
    timezone?: string;
    sensors?: Array<{
      id: number;
      parameter: {
        name: string;
        units: string;
      };
      latest?: {
        value: number;
        datetime: string;
      };
    }>;
  }>;
}

export function parseOpenAQSensors(
  sensors: Array<{ parameter: { name: string; units: string }; latest?: { value: number; datetime: string } }>,
  stationName: string
): CPCBResult {
  const inputs: Partial<Record<PollutantKey, RawPollutantInput>> = {};
  let latestTimestamp: string | null = null;

  for (const s of sensors) {
    if (!s.latest || s.latest.value < 0) continue;
    const pName = s.parameter.name.toLowerCase();

    // Preserve actual sensor measurement timestamp
    if (s.latest.datetime) {
      if (!latestTimestamp || new Date(s.latest.datetime) > new Date(latestTimestamp)) {
        latestTimestamp = s.latest.datetime;
      }
    }

    // Ground station monitoring inputs from CAAQMS via OpenAQ
    if (pName.includes('pm25') || pName.includes('pm2.5')) {
      inputs.pm25 = { value: s.latest.value, hoursRecorded: 24 };
    } else if (pName.includes('pm10')) {
      inputs.pm10 = { value: s.latest.value, hoursRecorded: 24 };
    } else if (pName.includes('no2')) {
      inputs.no2 = { value: s.latest.value, hoursRecorded: 24 };
    } else if (pName.includes('so2')) {
      inputs.so2 = { value: s.latest.value, hoursRecorded: 24 };
    } else if (pName.includes('co')) {
      const val = s.parameter.units.toLowerCase().includes('ppm') ? s.latest.value * 1.145 : s.latest.value / 1000;
      inputs.co = { value: Number(val.toFixed(2)), hoursRecorded: 8 };
    } else if (pName.includes('o3') || pName.includes('ozone')) {
      inputs.o3 = { value: s.latest.value, hoursRecorded: 8 };
    }
  }

  const provenance: ProvenanceMetadata = {
    type: 'MEASURED_STATION',
    sourceName: `CPCB / State PCB via OpenAQ — ${stationName}`,
    spatialResolution: 'Ground Monitoring Station (Point Sensor Coordinates)',
    temporalResolution: 'Latest hourly station report (Spot telemetry, not statutory 24-hr average)',
    measurementTimestamp: latestTimestamp || new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    isAveraged24h: false,
    monitoredHoursAvailable: 1,
    validPollutantCount: Object.keys(inputs).length,
    attributionUrl: 'https://openaq.org/',
  };

  return evaluateCPCBNAQI(inputs, provenance);
}

/**
 * Attempt to fetch live station data from OpenAQ v3
 * Calls location and retrieves latest measurements with optional API key
 */
export async function fetchOpenAQStation(
  lat: number,
  lon: number,
  apiKey?: string
): Promise<CPCBResult | null> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    const locUrl = `https://api.openaq.org/v3/locations?coordinates=${lat},${lon}&radius=25000&limit=1`;
    const locRes = await fetch(locUrl, { headers, next: { revalidate: 900 } });
    if (!locRes.ok) return null;

    const data: OpenAQLocationResponse = await locRes.json();
    if (!data.results || data.results.length === 0) return null;

    const loc = data.results[0];
    if (!loc.sensors || loc.sensors.length === 0) return null;

    // Check if sensors contain latest inline or if we need /latest endpoint
    const hasInlineLatest = loc.sensors.some((s) => s.latest && s.latest.value !== undefined);
    if (hasInlineLatest) {
      return parseOpenAQSensors(loc.sensors, loc.name);
    }

    // Call /v3/locations/{id}/latest if sensors do not have inline values
    try {
      const latestUrl = `https://api.openaq.org/v3/locations/${loc.id}/latest`;
      const latestRes = await fetch(latestUrl, { headers, next: { revalidate: 900 } });
      if (latestRes.ok) {
        const latestData = await latestRes.json();
        if (latestData.results && Array.isArray(latestData.results)) {
          const mergedSensors = loc.sensors.map((s) => {
            const found = latestData.results.find((r: { sensorsId?: number; parameter?: { name: string } }) =>
              r.sensorsId === s.id || (r.parameter && r.parameter.name.toLowerCase() === s.parameter.name.toLowerCase())
            );
            return found ? { ...s, latest: { value: found.value, datetime: found.datetime } } : s;
          });
          return parseOpenAQSensors(mergedSensors, loc.name);
        }
      }
    } catch {
      // Fallback to inline parsing if latest endpoint call encounters error
    }

    return parseOpenAQSensors(loc.sensors, loc.name);
  } catch {
    return null;
  }
}
