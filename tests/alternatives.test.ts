import { describe, it, expect } from 'vitest';
import { compareTransportAlternatives, TRANSPORT_FACTORS } from '../src/lib/engine/alternatives';

describe('Sustainable Alternatives & Passenger-Kilometre Engine Suite', () => {
  it('covers all 8 transport modes with verified emission factors', () => {
    const modes = Object.keys(TRANSPORT_FACTORS);
    expect(modes).toHaveLength(8);
    expect(modes).toContain('SOLO_PETROL_CAR');
    expect(modes).toContain('DELHI_METRO');
    expect(modes).toContain('WALKING_CYCLING');
    expect(modes).toContain('MOTORCYCLE_125CC');
  });

  it('correctly compares a 15 km journey from Solo Car to Delhi Metro', () => {
    const comparison = compareTransportAlternatives(15, 'SOLO_PETROL_CAR');
    expect(comparison.baseline.mode).toBe('SOLO_PETROL_CAR');
    expect(comparison.baseline.totalCostInr).toBe(143); // 15 * 9.5 ~ 143
    expect(comparison.baseline.co2eKg).toBe(2.13);

    const metro = comparison.alternatives.find((a) => a.mode === 'DELHI_METRO');
    expect(metro).toBeDefined();
    expect(metro!.co2eKg).toBe(0.39);
    expect(metro!.exposureRiskLevel).toBe('LOW');
  });

  it('articulates exposure vs emissions honesty for walking/cycling', () => {
    const comparison = compareTransportAlternatives(5, 'SOLO_PETROL_CAR');
    const walk = comparison.alternatives.find((a) => a.mode === 'WALKING_CYCLING');

    expect(walk).toBeDefined();
    expect(walk!.co2eKg).toBe(0);
    expect(walk!.tailpipePm25Grams).toBe(0);
    expect(walk!.exposureRiskLevel).toBe('VERY_HIGH');
    expect(walk!.exposureVsEmissionsTruth).toContain('highest personal inhaled smog dose');
  });

  it('identifies motorcycle as VERY_HIGH exposure risk due to open wake immersion', () => {
    const comparison = compareTransportAlternatives(10, 'SOLO_PETROL_CAR');
    const moto = comparison.alternatives.find((a) => a.mode === 'MOTORCYCLE_125CC');

    expect(moto).toBeDefined();
    expect(moto!.exposureRiskLevel).toBe('VERY_HIGH');
    expect(moto!.exposureVsEmissionsTruth).toContain('exposes rider directly');
  });

  it('calculates travel duration based on realistic urban speeds', () => {
    // 30 km trip
    // Delhi Metro at 36 km/h -> 50 minutes
    // Solo car at 22 km/h -> 82 minutes
    const comparison = compareTransportAlternatives(30, 'SOLO_PETROL_CAR');
    const metro = comparison.alternatives.find((a) => a.mode === 'DELHI_METRO')!;

    expect(metro.durationMinutes).toBe(50);
    expect(comparison.baseline.durationMinutes).toBe(82);
  });

  it('assigns high practicality score to rapid transit and carpooling', () => {
    const comparison = compareTransportAlternatives(15, 'SOLO_PETROL_CAR');
    const metro = comparison.alternatives.find((a) => a.mode === 'DELHI_METRO')!;
    const carpool = comparison.alternatives.find((a) => a.mode === 'CARPOOL_4P')!;

    expect(metro.practicalityScore).toBeGreaterThanOrEqual(8);
    expect(carpool.practicalityScore).toBeGreaterThanOrEqual(8);
  });

  it('penalizes walking/cycling practicality for long urban commutes (>5 km)', () => {
    const comparison = compareTransportAlternatives(12, 'SOLO_PETROL_CAR');
    const walk = comparison.alternatives.find((a) => a.mode === 'WALKING_CYCLING')!;

    expect(walk.practicalityScore).toBeLessThan(5);
  });
});
