/**
 * Air Quality Provider Aggregator Route
 * GET /api/aqi?city=Delhi-NCR&lat=28.65&lon=77.30
 * Combines:
 * - OpenAQ ground station data (if available)
 * - Open-Meteo atmospheric forecast model (~45 km resolution)
 * - Verified demonstration winter smog dataset fallback
 */

import { NextRequest, NextResponse } from 'next/server';
import { DEMO_CITIES, getDelhiDemoState } from '@/lib/aqi/demo-data';
import { fetchOpenMeteoForecast } from '@/lib/aqi/open-meteo';
import { fetchOpenAQStation } from '@/lib/aqi/openaq';
import { AirQualityState } from '@/lib/types/aqi';

// Reference coordinates for major Indian metros
const CITY_COORDINATES: Record<string, { lat: number; lon: number; isNCR: boolean; region: string }> = {
  'Delhi-NCR': { lat: 28.65, lon: 77.30, isNCR: true, region: 'National Capital Region' },
  'Mumbai': { lat: 19.07, lon: 72.87, isNCR: false, region: 'Maharashtra' },
  'Bengaluru': { lat: 12.97, lon: 77.59, isNCR: false, region: 'Karnataka' },
  'Kolkata': { lat: 22.57, lon: 88.36, isNCR: false, region: 'West Bengal' },
  'Pune': { lat: 18.52, lon: 73.85, isNCR: false, region: 'Maharashtra' },
  'Hyderabad': { lat: 17.38, lon: 78.48, isNCR: false, region: 'Telangana' },
  'Chennai': { lat: 13.08, lon: 80.27, isNCR: false, region: 'Tamil Nadu' },
  'Lucknow': { lat: 26.84, lon: 80.94, isNCR: false, region: 'Uttar Pradesh' },
  'Patna': { lat: 25.59, lon: 85.13, isNCR: false, region: 'Bihar' },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'Delhi-NCR';
  const cityInfo = CITY_COORDINATES[city] || CITY_COORDINATES['Delhi-NCR'];
  const customLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
  const customLon = searchParams.get('lon') ? parseFloat(searchParams.get('lon')!) : null;

  // Enforce privacy-by-design coordinate truncation to 2 decimal places (~1.1 km neighborhood scale)
  const rawLat = customLat ?? cityInfo.lat;
  const rawLon = customLon ?? cityInfo.lon;
  const lat = Number(rawLat.toFixed(2));
  const lon = Number(rawLon.toFixed(2));
  const isNCR = cityInfo.isNCR;

  // Execute external telemetry requests in parallel
  const [forecastOutcome, stationOutcome] = await Promise.allSettled([
    fetchOpenMeteoForecast(lat, lon),
    fetchOpenAQStation(lat, lon, process.env.OPENAQ_API_KEY),
  ]);

  const forecastResult = forecastOutcome.status === 'fulfilled' ? forecastOutcome.value : null;
  const stationResult = stationOutcome.status === 'fulfilled' ? stationOutcome.value : null;

  // Determine whether station result provides sufficient data
  const isStationUsable = stationResult && stationResult.validation.hasParticulate && stationResult.validation.pollutantCount >= 2;

  // Case 1: Both station and forecast available
  if (isStationUsable && forecastResult) {
    const liveState: AirQualityState = {
      city,
      region: cityInfo.region,
      isNCR,
      current: stationResult,
      forecast24h: forecastResult.forecast24h,
      provenance: stationResult.provenance,
    };
    return NextResponse.json(liveState);
  }

  // Case 2: Only station data available (preserve physical station data, pair with demo forecast curve)
  if (isStationUsable) {
    const fallbackDemo = (DEMO_CITIES[city] || getDelhiDemoState)();
    const stationState: AirQualityState = {
      city,
      region: cityInfo.region,
      isNCR,
      current: stationResult,
      forecast24h: fallbackDemo.forecast24h,
      provenance: stationResult.provenance,
    };
    return NextResponse.json(stationState);
  }

  // Case 3: Atmospheric forecast model available (Copernicus CAMS ~45 km)
  if (forecastResult) {
    const modelDerivedState: AirQualityState = {
      city,
      region: cityInfo.region,
      isNCR,
      current: forecastResult.currentModelResult,
      forecast24h: forecastResult.forecast24h,
      provenance: forecastResult.provenance,
    };
    return NextResponse.json(modelDerivedState);
  }

  // Case 4: Complete offline fallback to verified historical demonstration dataset
  const demoFn = DEMO_CITIES[city] || getDelhiDemoState;
  const demoState = demoFn();
  return NextResponse.json(demoState);
}
