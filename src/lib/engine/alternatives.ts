/**
 * Sustainable Alternatives Comparison Engine
 * Grounded in passenger-kilometre (pkm) metrics, occupancy adjustments,
 * and scientific exposure vs emissions trade-off honesty.
 */

import { TransportMode, TransportEmissionFactor, TransportComparisonResult } from '../types/alternatives';

export const TRANSPORT_FACTORS: Record<TransportMode, TransportEmissionFactor> = {
  SOLO_PETROL_CAR: {
    mode: 'SOLO_PETROL_CAR',
    name: 'Private Petrol Car (Solo Commute)',
    occupancy: 1,
    co2e_g_per_pkm: 142, // ARAI / BEE baseline (142 g/km / 1 person)
    pm25_g_per_pkm: 0.0045, // BS-VI fleet average
    estimatedCostPerKmInr: 9.5, // Fuel + routine maintenance
    averageSpeedKmph: 22,
    exposureRiskLevel: 'MODERATE',
    exposureExplanation: 'Vehicle cabin filter offers partial protection from outdoor particulates, but idling in traffic jams concentrates fine aerosols. Driver generates high local emissions and traffic congestion.',
  },
  SOLO_DIESEL_CAR: {
    mode: 'SOLO_DIESEL_CAR',
    name: 'Private Diesel Car (Solo Commute)',
    occupancy: 1,
    co2e_g_per_pkm: 155,
    pm25_g_per_pkm: 0.0500, // Older/BS-IV fleet average
    estimatedCostPerKmInr: 8.0,
    averageSpeedKmph: 22,
    exposureRiskLevel: 'MODERATE',
    exposureExplanation: 'Moderate cabin shielding; high NOx and tailpipe particulate emissions that exacerbate urban smog for pedestrians and cyclists.',
  },
  CARPOOL_4P: {
    mode: 'CARPOOL_4P',
    name: 'Shared Carpool (4 Co-workers / Neighbors)',
    occupancy: 4,
    co2e_g_per_pkm: 35.5, // 142 / 4 passengers
    pm25_g_per_pkm: 0.0011, // 0.0045 / 4
    estimatedCostPerKmInr: 2.5, // Split 4 ways
    averageSpeedKmph: 20,
    exposureRiskLevel: 'MODERATE',
    exposureExplanation: 'Reduces per-passenger congestion by 75% while keeping private vehicle cabin comfort. Excellent practical middle ground.',
  },
  MOTORCYCLE_125CC: {
    mode: 'MOTORCYCLE_125CC',
    name: 'Two-Wheeler (Motorcycle / Scooter)',
    occupancy: 1,
    co2e_g_per_pkm: 48,
    pm25_g_per_pkm: 0.0120, // 2-wheeler tailpipe PM2.5
    estimatedCostPerKmInr: 2.4,
    averageSpeedKmph: 28,
    exposureRiskLevel: 'VERY_HIGH',
    exposureExplanation: 'EXPOSURE ALERT: Direct immersion in roadway exhaust wake, diesel soot from trucks/buses, and tire brake wear. Requires certified N95/FFP2 respirator during winter smog.',
  },
  DELHI_METRO: {
    mode: 'DELHI_METRO',
    name: 'Electric Rapid Metro (DMRC / Urban Rail)',
    occupancy: 1000, // Average passenger loading
    co2e_g_per_pkm: 24.5, // CEA Version 22.0 factor 0.675 kg/kWh × 0.0363 kWh/pkm specific energy = 24.5 g CO2e/pkm
    pm25_g_per_pkm: 0.0000, // Zero tailpipe emissions
    estimatedCostPerKmInr: 2.2,
    averageSpeedKmph: 36,
    exposureRiskLevel: 'LOW',
    exposureExplanation: 'RECOMMENDED SMOG SHIELD: Underground and elevated air-conditioned train coaches feature multi-stage HVAC particulate pre-filters and avoid ground-level traffic emissions.',
  },
  CNG_BUS: {
    mode: 'CNG_BUS',
    name: 'Municipal City Bus (CNG)',
    occupancy: 40,
    co2e_g_per_pkm: 32, // 1280 g/vehicle-km / 40 pax
    pm25_g_per_pkm: 0.000375, // 0.015 g/vehicle-km / 40 pax
    estimatedCostPerKmInr: 1.5,
    averageSpeedKmph: 16,
    exposureRiskLevel: 'MODERATE',
    exposureExplanation: 'Low cost and low carbon per passenger; in non-AC buses with open windows, passenger exposure reflects outdoor roadway air.',
  },
  ELECTRIC_BUS: {
    mode: 'ELECTRIC_BUS',
    name: 'Electric Low-Floor City Bus (AC)',
    occupancy: 40,
    co2e_g_per_pkm: 27, // CEA Version 22.0 factor 0.675 kg/kWh × 0.040 kWh/pkm = 27 g CO2e/pkm
    pm25_g_per_pkm: 0.0000, // Zero tailpipe
    estimatedCostPerKmInr: 1.8,
    averageSpeedKmph: 17,
    exposureRiskLevel: 'LOW',
    exposureExplanation: 'Zero tailpipe emissions at point of use; sealed AC cabin provides particulate filtration while keeping transit highly affordable.',
  },
  WALKING_CYCLING: {
    mode: 'WALKING_CYCLING',
    name: 'Active Commute (Walking / Bicycle)',
    occupancy: 1,
    co2e_g_per_pkm: 0,
    pm25_g_per_pkm: 0.0000,
    estimatedCostPerKmInr: 0,
    averageSpeedKmph: 12,
    exposureRiskLevel: 'VERY_HIGH',
    exposureExplanation: 'PHYSIOLOGICAL EXPOSURE NOTICE: Zero vehicle emissions generated; however, physical aerobic exertion substantially increases respiratory minute ventilation (breathing volume per minute) compared to resting vehicle passengers. Exercising or walking along heavy diesel traffic corridors during severe morning smog peaks elevates personal particulate deposition in deep alveolar airways.',
  },
};

/**
 * Compare all transport modes for a given distance
 */
export function compareTransportAlternatives(
  distanceKm: number,
  baselineMode: TransportMode = 'SOLO_PETROL_CAR'
): {
  baseline: TransportComparisonResult;
  alternatives: TransportComparisonResult[];
} {
  const modes: TransportMode[] = [
    'SOLO_PETROL_CAR',
    'SOLO_DIESEL_CAR',
    'CARPOOL_4P',
    'MOTORCYCLE_125CC',
    'DELHI_METRO',
    'CNG_BUS',
    'ELECTRIC_BUS',
    'WALKING_CYCLING',
  ];

  const results: TransportComparisonResult[] = modes.map((mode) => {
    const factor = TRANSPORT_FACTORS[mode];
    const durationMinutes = Math.round((distanceKm / factor.averageSpeedKmph) * 60);
    const totalCostInr = Math.round(distanceKm * factor.estimatedCostPerKmInr);
    const co2eKg = Number(((distanceKm * factor.co2e_g_per_pkm) / 1000).toFixed(2));
    const tailpipePm25Grams = Number((distanceKm * factor.pm25_g_per_pkm).toFixed(4));

    // Practicality score (1-10) based on speed, cost, and comfort
    let practicality = 7;
    if (mode === 'DELHI_METRO') practicality = 9;
    if (mode === 'CARPOOL_4P') practicality = 8;
    if (mode === 'SOLO_PETROL_CAR') practicality = 8;
    if (mode === 'WALKING_CYCLING' && distanceKm > 5) practicality = 3;
    if (mode === 'CNG_BUS') practicality = 6;

    let exposureVsEmissionsTruth = '';
    if (mode === 'WALKING_CYCLING') {
      exposureVsEmissionsTruth = 'Generates 0g emissions, but creates highest personal inhaled smog dose due to elevated breathing rates along roadways.';
    } else if (mode === 'DELHI_METRO') {
      exposureVsEmissionsTruth = 'Optimal combination: 82% less CO2e than a solo car, zero tailpipe emissions, and filtered underground/AC cabin protection.';
    } else if (mode === 'MOTORCYCLE_125CC') {
      exposureVsEmissionsTruth = 'Relatively low CO2e, but exposes rider directly to toxic vehicle wakes without any physical barrier.';
    } else {
      exposureVsEmissionsTruth = `Generates ${co2eKg} kg CO2e; exposure risk is ${factor.exposureRiskLevel}.`;
    }

    return {
      mode,
      name: factor.name,
      distanceKm,
      durationMinutes,
      totalCostInr,
      co2eKg,
      tailpipePm25Grams,
      exposureRiskLevel: factor.exposureRiskLevel,
      practicalityScore: practicality,
      exposureVsEmissionsTruth,
    };
  });

  const baseline = results.find((r) => r.mode === baselineMode) || results[0];
  const alternatives = results.filter((r) => r.mode !== baselineMode);

  return {
    baseline,
    alternatives,
  };
}
