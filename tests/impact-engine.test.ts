import { describe, it, expect } from 'vitest';
import { calculateExplainableImpact } from '../src/lib/engine/impact-engine';

describe('3-Tier Explainable Impact Engine Suite', () => {
  it('strictly decouples Personal Exposure, Local PM2.5, and GHG CO2e', () => {
    const impact = calculateExplainableImpact(15, 'SOLO_PETROL_CAR', 'DELHI_METRO', 2.5);

    expect(impact.tier1Exposure).toBeDefined();
    expect(impact.tier2LocalPm).toBeDefined();
    expect(impact.tier3Ghg).toBeDefined();
  });

  it('calculates Tier 1 avoided exposure hours without claiming biological dose', () => {
    const impact = calculateExplainableImpact(15, 'SOLO_PETROL_CAR', 'DELHI_METRO', 3.0);

    expect(impact.tier1Exposure.avoidedPeakSmogHours).toBe(3.0);
    expect(impact.tier1Exposure.percentageExposureReductionEstimate).toBe(75);
    expect(impact.tier1Exposure.medicalDisclaimer).toContain('quantifies avoided exposure time');
    expect(impact.tier1Exposure.medicalDisclaimer).toContain('does not claim a clinically measured reduction in inhaled biological dose');
  });

  it('calculates Tier 2 avoided local tailpipe PM2.5 accurately using ARAI factors', () => {
    // 15 km trip from Solo Petrol Car (0.0045 g/km) to Delhi Metro (0.0000 g/km)
    // Avoided = 15 * 0.0045 = 0.0675 g PM2.5
    const impact = calculateExplainableImpact(15, 'SOLO_PETROL_CAR', 'DELHI_METRO');

    expect(impact.tier2LocalPm.avoidedTailpipePm25Grams).toBe(0.0675);
    expect(impact.tier2LocalPm.calculationEquation).toContain('Avoided PM2.5 (g) = 15 km');
    expect(impact.tier2LocalPm.sourceCitation).toContain('ARAI');
  });

  it('calculates Tier 2 avoided PM2.5 for older diesel passenger cars', () => {
    // 15 km from Solo Diesel (0.0500 g/km) to Delhi Metro (0.0000 g/km)
    // Avoided = 15 * 0.0500 = 0.75 g PM2.5
    const impact = calculateExplainableImpact(15, 'SOLO_DIESEL_CAR', 'DELHI_METRO');

    expect(impact.tier2LocalPm.avoidedTailpipePm25Grams).toBe(0.75);
  });

  it('calculates Tier 3 Greenhouse Gas (CO2e) reduction with CEA grid factor', () => {
    // 15 km trip:
    // Solo Petrol Car: 15 * 142g = 2130g = 2.13 kg CO2e
    // Delhi Metro: 15 * 24.5g (CEA v22.0) = 367.5g ~ 0.37 kg CO2e
    // Net avoided = 2.13 - 0.37 = 1.76 kg CO2e
    const impact = calculateExplainableImpact(15, 'SOLO_PETROL_CAR', 'DELHI_METRO');

    expect(impact.tier3Ghg.baselineCo2eKg).toBe(2.13);
    expect(impact.tier3Ghg.adaptedCo2eKg).toBe(0.37);
    expect(impact.tier3Ghg.netAvoidedCo2eKg).toBe(1.76);
    expect(impact.tier3Ghg.constantsUsed.gridFactor).toContain('0.675 kg CO₂/kWh');
    expect(impact.tier3Ghg.constantsUsed.gridFactor).toContain('Version 22.0');
  });

  it('adjusts passenger-km emissions for carpooling (4 passengers)', () => {
    // Carpool of 4 divides 142 g/km by 4 = 35.5 g CO2e/pkm
    // 20 km trip: Baseline solo = 20 * 142g = 2.84 kg; Carpool = 20 * 35.5g = 0.71 kg
    // Net avoided = 2.13 kg
    const impact = calculateExplainableImpact(20, 'SOLO_PETROL_CAR', 'CARPOOL_4P');

    expect(impact.tier3Ghg.baselineCo2eKg).toBe(2.84);
    expect(impact.tier3Ghg.adaptedCo2eKg).toBe(0.71);
    expect(impact.tier3Ghg.netAvoidedCo2eKg).toBe(2.13);
  });

  it('handles zero or negative shift gracefully by clamping to 0', () => {
    const impact = calculateExplainableImpact(10, 'DELHI_METRO', 'SOLO_PETROL_CAR', -1);
    expect(impact.tier1Exposure.avoidedPeakSmogHours).toBe(0);
    expect(impact.tier2LocalPm.avoidedTailpipePm25Grams).toBe(0);
    expect(impact.tier3Ghg.netAvoidedCo2eKg).toBe(0);
  });

  it('provides comprehensive calculation proof modal metadata', () => {
    const impact = calculateExplainableImpact(12, 'SOLO_PETROL_CAR', 'DELHI_METRO');
    const proof = impact.calculationProofModalData;

    expect(proof.assumptions.length).toBeGreaterThan(2);
    expect(proof.formulas.length).toBe(3); // Tier 1, 2, 3 formulas
    expect(proof.citations.some((c) => c.includes('Central Electricity Authority'))).toBe(true);
    expect(proof.citations.some((c) => c.includes('Central Pollution Control Board'))).toBe(true);
  });

  it('never outputs fake or unrounded fractional micro-decimals', () => {
    const impact = calculateExplainableImpact(13.7, 'SOLO_PETROL_CAR', 'DELHI_METRO');
    expect(Number.isFinite(impact.tier3Ghg.netAvoidedCo2eKg)).toBe(true);
    expect(impact.tier3Ghg.netAvoidedCo2eKg.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
  });
});
