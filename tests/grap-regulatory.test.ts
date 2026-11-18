import { describe, it, expect } from 'vitest';
import { evaluateGRAPStage } from '../src/lib/engine/grap-engine';

describe('CAQM GRAP & Regional Regulatory Suite', () => {
  it('identifies baseline normal when AQI is 200 or below', () => {
    const status = evaluateGRAPStage(140, true);
    expect(status.activeStage).toBe('NONE');
    expect(status.stageName).toContain('Normal Baseline');
  });

  it('triggers GRAP Stage I ("Poor") when AQI is between 201 and 300', () => {
    const status = evaluateGRAPStage(260, true);
    expect(status.activeStage).toBe('STAGE_I');
    expect(status.stageName).toContain('Stage I');
    expect(status.actionItems.some((a) => a.title.includes('Anti-Idling') || a.title.includes('Dust'))).toBe(true);
  });

  it('triggers GRAP Stage II ("Very Poor") when AQI is between 301 and 400', () => {
    const status = evaluateGRAPStage(365, true);
    expect(status.activeStage).toBe('STAGE_II');
    expect(status.stageName).toContain('Stage II');
    expect(status.actionItems.some((a) => a.title.includes('Diesel Generator'))).toBe(true);
  });

  it('triggers GRAP Stage III ("Severe") when AQI is between 401 and 450', () => {
    const status = evaluateGRAPStage(425, true);
    expect(status.activeStage).toBe('STAGE_III');
    expect(status.stageName).toContain('Stage III');
    expect(status.actionItems.some((a) => a.title.includes('BS-III') || a.title.includes('Construction'))).toBe(true);
  });

  it('triggers GRAP Stage IV ("Severe +") when AQI exceeds 450', () => {
    const status = evaluateGRAPStage(485, true);
    expect(status.activeStage).toBe('STAGE_IV');
    expect(status.stageName).toContain('Stage IV');
    expect(status.actionItems.some((a) => a.title.includes('School Closure') || a.title.includes('Sealed'))).toBe(true);
  });

  it('differentiates statutory NCR legal orders from non-NCR advisory guidance', () => {
    const ncrStatus = evaluateGRAPStage(350, true);
    const nonNcrStatus = evaluateGRAPStage(350, false);

    expect(ncrStatus.isStatutoryNCR).toBe(true);
    expect(ncrStatus.jurisdictionDisclaimer).toContain('Statutory CAQM order');

    expect(nonNcrStatus.isStatutoryNCR).toBe(false);
    expect(nonNcrStatus.jurisdictionDisclaimer).toContain('Advisory guidance');
    expect(nonNcrStatus.jurisdictionDisclaimer).toContain('statutory only in Delhi-NCR');
  });

  it('handles null AQI gracefully by returning normal baseline status', () => {
    const status = evaluateGRAPStage(null, false);
    expect(status.activeStage).toBe('NONE');
    expect(status.actionItems.length).toBeGreaterThan(0);
  });
});
