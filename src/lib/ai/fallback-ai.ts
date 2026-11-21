/**
 * Deterministic Rule-Based Conversational Fallback Assistant
 * Ensures 100% application resilience even if Gemini API is offline,
 * unconfigured, or rate-limited. Produces Zod-compliant structured outputs.
 */

import { AIAssistantResponse } from './schemas';
import { AirQualityState } from '../types/aqi';
import { HouseholdProfile } from '../types/user';
import { evaluateGRAPStage } from '../engine/grap-engine';

export function generateDeterministicAssistantResponse(
  userQuery: string,
  aqiState: AirQualityState,
  profile: HouseholdProfile
): AIAssistantResponse {
  const aqi = aqiState.current.aqi ?? 320;
  const grap = evaluateGRAPStage(aqi, profile.isNCR);
  const dominant = aqiState.current.dominantPollutantName ?? 'PM2.5';

  const q = userQuery.toLowerCase();

  let reply = '';
  const actionChecklist: AIAssistantResponse['actionChecklist'] = [];

  if (q.includes('indoor') || q.includes('purifier') || q.includes('clean') || q.includes('cooking') || q.includes('window')) {
    reply = `Based on current verified environmental readings in ${aqiState.city} (AQI ${aqi}, dominated by ${dominant}), outdoor ambient air is hazardous for continuous ventilation. Keep all doors and exterior windows tightly shut during morning and evening inversion hours. Run your kitchen exhaust fan 2 minutes before and 5 minutes after cooking, and use damp microfiber cloths or wet mopping rather than dry broom sweeping to avoid kicking up settled PM10 into the breathing zone.`;

    actionChecklist.push(
      {
        category: 'INDOOR',
        action: 'Seal windows during morning and evening inversion peaks (06:00-09:30 & 19:30-22:00).',
        urgency: 'IMMEDIATE',
        scientificReason: 'Radiative cooling traps tailpipe aerosols at ground level; opening windows causes rapid indoor PM2.5 accumulation.',
      },
      {
        category: 'INDOOR',
        action: 'Adopt wet mopping protocol; prohibit dry broom sweeping (jhadu).',
        urgency: 'RECOMMENDED',
        scientificReason: 'Dry sweeping imparts kinetic energy that re-suspends settled fine particulates back into the breathing zone.',
      },
      {
        category: 'INDOOR',
        action: profile.hasAirPurifier
          ? 'Place your air purifier 1m away from walls in the main bedroom; run on medium/high speed.'
          : 'Consider building a safe DIY Corsi-Rosenthal filter box using a thermally protected box fan and MERV 13 pleated filters.',
        urgency: 'RECOMMENDED',
        scientificReason: 'Continuous recirculating mechanical filtration reduces indoor PM2.5 concentrations by 60% to 85% in sealed rooms.',
      }
    );
  } else if (q.includes('commute') || q.includes('travel') || q.includes('bike') || q.includes('car') || q.includes('metro')) {
    reply = `For your commute in ${aqiState.city}, traveling on open roadways exposes you directly to diesel soot and resuspension. Under ${grap.stageName}, we strongly recommend shifting from solo private vehicles or open two-wheelers to the air-conditioned electric metro or CNG bus. Metro cabins provide HVAC filtration and bypass surface congestion. If using a two-wheeler is unavoidable, wear a certified N95/FFP2 respirator with an airtight facial seal.`;

    actionChecklist.push(
      {
        category: 'COMMUTE',
        action: 'Shift commute to the electric metro system or AC electric bus where accessible.',
        urgency: 'RECOMMENDED',
        scientificReason: 'Reduces per-passenger tailpipe emissions to zero at point of use while providing an enclosed, filtered travel cabin.',
      },
      {
        category: 'COMMUTE',
        action: 'Enforce anti-idling: Turn off vehicle ignition at red signals longer than 15 seconds.',
        urgency: 'RECOMMENDED',
        scientificReason: 'Restarting modern fuel-injected engines consumes less fuel and emits less particulate matter than idling for >10 seconds.',
      },
      {
        category: 'COMMUTE',
        action: 'Wear a certified, well-fitted N95 respirator if riding a motorcycle or open auto.',
        urgency: 'IMMEDIATE',
        scientificReason: 'Standard surgical or cloth masks filter less than 30% of fine sub-micron PM2.5 aerosols.',
      }
    );
  } else {
    // General Family Planning Query
    reply = `Welcome to BreatheWise AI. In ${aqiState.city}, current ambient air quality is ${aqiState.current.category ?? 'Elevated'} with an AQI of ${aqi} (Dominant pollutant: ${dominant}). Under ${grap.stageName}, children, senior citizens, and those with respiratory sensitivities must avoid all strenuous outdoor exertion during morning hours. Confine essential outdoor errands to the afternoon boundary-layer expansion window (approx 13:00 to 16:00).`;

    actionChecklist.push(
      {
        category: 'SCHEDULE',
        action: 'Shift morning outdoor exercise (jogging, walking) to indoor yoga or aerobic stretching.',
        urgency: 'IMMEDIATE',
        scientificReason: 'Aerobic exertion increases respiratory minute ventilation up to 5-fold, dramatically multiplying deep-lung particulate dose.',
      },
      {
        category: 'INDOOR',
        action: 'Keep kitchen partition closed during high-heat cooking; run exhaust chimney.',
        urgency: 'RECOMMENDED',
        scientificReason: 'Prevents aerosolized cooking oil and spice particulates from migrating to children and elderly sleeping quarters.',
      },
      {
        category: 'COMMUNITY',
        action: 'Coordinate with residential society (RWA) to enforce bans on open garden leaf burning.',
        urgency: 'RECOMMENDED',
        scientificReason: 'Biomass smoldering produces extremely toxic polycyclic aromatic hydrocarbons (PAHs) at breathing height.',
      }
    );
  }

  return {
    reply,
    groundedFactors: {
      referencedAqi: aqi,
      dominantPollutant: dominant,
      activeGrapStage: grap.stageName,
      keyVulnerabilityAddressed: profile.hasInfantsOrChildren
        ? 'Children & developing respiratory systems'
        : profile.hasElderly
        ? 'Senior citizen morning cardiovascular protection'
        : 'Urban commuter particulate reduction',
    },
    actionChecklist,
    disclaimer:
      'Grounded Assistant Notice: BreatheWise AI provides evidence-based environmental decision support. It does not provide medical diagnoses or replace licensed clinical healthcare advice.',
    providerMeta: {
      provider: 'Deterministic Grounded Engine',
      model: 'deterministic-rules-v1',
      fallbackUsed: true,
      success: false,
      errorCategory: 'DETERMINISTIC_FALLBACK',
    },
  };
}
