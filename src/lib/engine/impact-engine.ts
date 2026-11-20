/**
 * 3-Tier Explainable Impact Engine
 * Strictly decouples:
 * Tier 1: Personal Exposure Shifts (Time shifted away from severe smog)
 * Tier 2: Local Particulate Emissions Avoided (g tailpipe PM2.5)
 * Tier 3: Greenhouse Gas Lifecycle Reduction (kg CO2e via CEA & ARAI factors)
 * Fully transparent calculation proofs with formulas and citations.
 */

import { ExplainableImpactResult } from '../types/impact';
import { TransportMode } from '../types/alternatives';
import { TRANSPORT_FACTORS } from './alternatives';

export function calculateExplainableImpact(
  distanceKm: number,
  baselineMode: TransportMode,
  adaptedMode: TransportMode,
  hoursShiftedAwayFromPeakSmog: number = 2.5
): ExplainableImpactResult {
  const baseFactor = TRANSPORT_FACTORS[baselineMode];
  const altFactor = TRANSPORT_FACTORS[adaptedMode];

  // Tier 1: Personal Exposure Shift
  // Explicitly note: NOT clinical dose, but ambient exposure duration avoidance
  const exposureHours = Math.max(0, hoursShiftedAwayFromPeakSmog);
  const percentageExposureReduction = Math.min(100, Math.round((exposureHours / 4) * 100)); // normalized to typical 4h peak diurnal smog window

  const tier1Exposure = {
    avoidedPeakSmogHours: exposureHours,
    percentageExposureReductionEstimate: percentageExposureReduction,
    medicalDisclaimer:
      'IMPORTANT SCIENTIFIC NOTICE: This metric quantifies avoided exposure time away from peak ambient winter smog episodes (AQI > 300). It represents an exposure-duration proxy and does not claim a clinically measured reduction in inhaled biological dose or medical risk, which requires personal spirometry and calibrated wearable sensors.',
  };

  // Tier 2: Local Tailpipe Particulate Emissions Avoided
  // Tailpipe PM2.5 in grams = Distance * (EF_base - EF_alt)
  const basePm25Grams = distanceKm * baseFactor.pm25_g_per_pkm;
  const altPm25Grams = distanceKm * altFactor.pm25_g_per_pkm;
  const avoidedPm25Grams = Math.max(0, Number((basePm25Grams - altPm25Grams).toFixed(4)));

  const tier2LocalPm = {
    avoidedTailpipePm25Grams: avoidedPm25Grams,
    calculationEquation: `Avoided PM2.5 (g) = ${distanceKm} km × (${baseFactor.pm25_g_per_pkm} g/pkm [${baseFactor.name}] - ${altFactor.pm25_g_per_pkm} g/pkm [${altFactor.name}])`,
    sourceCitation:
      'ARAI (Automotive Research Association of India) & CPCB BS-VI / BS-IV vehicle emission factor benchmarks.',
  };

  // Tier 3: Greenhouse Gas Lifecycle Reduction (kg CO2e)
  // CO2e kg = Distance * (EF_base - EF_alt) / 1000
  const baselineCo2eKg = Number(((distanceKm * baseFactor.co2e_g_per_pkm) / 1000).toFixed(2));
  const adaptedCo2eKg = Number(((distanceKm * altFactor.co2e_g_per_pkm) / 1000).toFixed(2));
  const netAvoidedCo2eKg = Math.max(0, Number((baselineCo2eKg - adaptedCo2eKg).toFixed(2)));

  const tier3Ghg = {
    baselineCo2eKg,
    adaptedCo2eKg,
    netAvoidedCo2eKg,
    calculationEquation: `Avoided CO₂e (kg) = ${distanceKm} km × (${baseFactor.co2e_g_per_pkm} g CO₂e/pkm - ${altFactor.co2e_g_per_pkm} g CO₂e/pkm) ÷ 1,000`,
    constantsUsed: {
      baselineFactor: `${baseFactor.co2e_g_per_pkm} g CO₂e/passenger-km (${baseFactor.name})`,
      adaptedFactor: `${altFactor.co2e_g_per_pkm} g CO₂e/passenger-km (${altFactor.name})`,
      distance: `${distanceKm} km (one-way journey)`,
      occupancy: `Baseline: ${baseFactor.occupancy} pax | Adapted: ${altFactor.occupancy} pax`,
      gridFactor: '0.716 kg CO₂/kWh (Central Electricity Authority Baseline Database v19 for Indian National Grid, FY 2022-23; CEA Annual Report 2024-25 benchmark: 0.727 tCO₂/MWh for FY 2023-24)',
    },
    sourceCitation:
      'Central Electricity Authority (CEA) CO₂ Baseline Database for Indian Power Sector (v19, 2024, FY 2022-23: 0.716 tCO₂/MWh; FY 2023-24: 0.727 tCO₂/MWh) & ARAI / BEE Fuel Economy Standards.',
  };

  // Calculation Proof Modal Metadata
  const calculationProofModalData = {
    title: 'Transparent Impact Calculation Proof & Scientific Citations',
    methodology:
      'BreatheWise AI enforces strict mathematical decoupling between personal air exposure, local street-level particulate emissions, and global greenhouse gases. We never conflate CO₂ reduction with immediate AQI improvement.',
    assumptions: [
      `Trip Distance: Exactly ${distanceKm} km per single journey.`,
      `Occupancy normalization: Solo car assumes 1 driver (occupancy = 1); Metro assumes high urban peak load factors; Carpool assumes 4 passengers sharing fuel.`,
      `Electricity Grid Factor: Electric Metro and E-Bus lifecycle carbon calculations incorporate the official Indian grid emissions intensity factor (0.716 kg CO₂/kWh from CEA Baseline Database v19 for FY 2022-23; referenced alongside CEA Annual Report 2024-25 benchmark of 0.727 tCO₂/MWh for FY 2023-24) published by the Central Electricity Authority.`,
      `Exposure distinction: Shifted hours represent rescheduling of outdoor activities to periods where ambient PM2.5 drops by at least 35% during afternoon boundary layer expansion.`,
    ],
    formulas: [
      `Tier 1: Avoided Exposure Hours = Sum(Hours scheduled during Severe Smog > 300 AQI) - Sum(Hours rescheduled to Relative Low < 200 AQI)`,
      `Tier 2: Avoided Tailpipe PM2.5 (g) = Distance (km) × [EF_base(g/pkm) - EF_alt(g/pkm)]`,
      `Tier 3: Avoided CO₂e (kg) = Distance (km) × [EF_base(g CO₂e/pkm) - EF_alt(g CO₂e/pkm)] ÷ 1000`,
    ],
    citations: [
      'Central Pollution Control Board (CPCB) — National Air Quality Index Technical Report (NAQI Breakpoints & Averaging Standards).',
      'Central Electricity Authority (CEA) — CO₂ Baseline Database for the Indian Power Sector, Version 19.0 (June 2024, FY 2022-23: 0.716 tCO₂/MWh) and CEA Annual Report 2024-25 (FY 2023-24: 0.727 tCO₂/MWh).',
      'Automotive Research Association of India (ARAI) — Emission Factor Reference Database for Indian Vehicles (BS-IV & BS-VI).',
      'Commission for Air Quality Management in NCR & Adjoining Areas (CAQM) — Statutory Graded Response Action Plan (GRAP) Notifications.',
    ],
  };

  return {
    tier1Exposure,
    tier2LocalPm,
    tier3Ghg,
    calculationProofModalData,
  };
}
