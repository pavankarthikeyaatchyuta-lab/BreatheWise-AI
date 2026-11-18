import { describe, it, expect } from 'vitest';
import { evaluateIndoorGuidance } from '../src/lib/engine/indoor-engine';

describe('Dynamic Indoor Air Quality Coach Suite', () => {
  it('includes strict zero-sensor disclaimer banner on all evaluations', () => {
    const guidance = evaluateIndoorGuidance(180, 360, { start: '13:00', end: '16:00' }, true, true, false);
    expect(guidance.zeroSensorDisclaimer).toContain('does not display unverified or fabricated indoor AQI');
    expect(guidance.zeroSensorDisclaimer).toContain('Without physical indoor sensors, indoor air quality cannot be measured');
  });

  it('mandates KEEP_WINDOWS_SEALED when outdoor PM2.5 is severe (>120 µg/m³)', () => {
    const guidance = evaluateIndoorGuidance(210, 410, { start: '13:00', end: '16:00' }, true, true, false);
    expect(guidance.ventilationAdvisor.canVentilateNow).toBe(false);
    expect(guidance.ventilationAdvisor.recommendedAction).toBe('KEEP_WINDOWS_SEALED');
    expect(guidance.ventilationAdvisor.explanation).toContain('Keep all exterior windows, doors, and balcony vents tightly closed');
  });

  it('permits CROSS_VENTILATE_FREELY when outdoor air quality is favorable (<60 µg/m³)', () => {
    const guidance = evaluateIndoorGuidance(35, 65, { start: '13:00', end: '16:00' }, true, true, false);
    expect(guidance.ventilationAdvisor.canVentilateNow).toBe(true);
    expect(guidance.ventilationAdvisor.recommendedAction).toBe('CROSS_VENTILATE_FREELY');
  });

  it('advises SHORT_CONTROLLED_VENTILATION during moderate outdoor levels (60-120 µg/m³)', () => {
    const guidance = evaluateIndoorGuidance(85, 160, { start: '13:00', end: '16:00' }, true, true, false);
    expect(guidance.ventilationAdvisor.canVentilateNow).toBe(false);
    expect(guidance.ventilationAdvisor.recommendedAction).toBe('SHORT_CONTROLLED_VENTILATION');
  });

  it('enforces cooking smoke pre-exhaust and post-exhaust duration rules', () => {
    const guidance = evaluateIndoorGuidance(150, 320, null, true, true, false);
    expect(guidance.cookingProtocols.rules.some((r) => r.includes('2 minutes prior'))).toBe(true);
    expect(guidance.cookingProtocols.rules.some((r) => r.includes('5 to 7 minutes after'))).toBe(true);
    expect(guidance.cookingProtocols.partitionAdvice).toContain('Keep the kitchen door closed');
  });

  it('enforces wet mopping and explains aerodynamic particulate resuspension', () => {
    const guidance = evaluateIndoorGuidance(150, 320, null, true, true, false);
    expect(guidance.dustMitigation.cleaningMethod).toBe('WET_MOPPING_ONLY');
    expect(guidance.dustMitigation.prohibitedActions.some((a) => a.includes('dry broom sweeping'))).toBe(true);
    expect(guidance.dustMitigation.resuspensionExplanation).toContain('Aerodynamic resuspension');
  });

  it('specifies safe DIY Corsi-Rosenthal fan motor requirements and limitations', () => {
    const guidance = evaluateIndoorGuidance(150, 320, null, true, true, false);
    expect(guidance.diyFilterGuide.safetyPrerequisites.some((p) => p.includes('thermally protected motor'))).toBe(true);
    expect(guidance.diyFilterGuide.filterSpecifications.some((s) => s.includes('MERV 13'))).toBe(true);
    expect(guidance.diyFilterGuide.limitations.some((l) => l.includes('DO NOT remove gaseous pollutants'))).toBe(true);
  });
});
