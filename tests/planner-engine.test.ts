import { describe, it, expect } from 'vitest';
import { generateDailyPlan } from '../src/lib/engine/planner-engine';
import { getDelhiDemoState } from '../src/lib/aqi/demo-data';
import { HouseholdProfile, DEFAULT_HOUSEHOLD_PROFILE } from '../src/lib/types/user';

describe('Daily Routine Planner Engine Suite', () => {
  const delhiState = getDelhiDemoState();

  it('generates a complete daily plan with all required fields', () => {
    const plan = generateDailyPlan(DEFAULT_HOUSEHOLD_PROFILE, delhiState);

    expect(plan).toHaveProperty('date');
    expect(plan).toHaveProperty('overallAdvisory');
    expect(plan).toHaveProperty('relativeLowWindow');
    expect(plan).toHaveProperty('peakSmogWindows');
    expect(plan).toHaveProperty('activities');
    expect(plan).toHaveProperty('vehicleIdlingWarning');
    expect(plan).toHaveProperty('vulnerabilitySpecificAlerts');
    expect(plan.activities.length).toBeGreaterThanOrEqual(4);
    expect(plan.peakSmogWindows.length).toBe(2);
  });

  it('identifies relative midday low window based on boundary layer expansion', () => {
    const plan = generateDailyPlan(DEFAULT_HOUSEHOLD_PROFILE, delhiState);
    expect(plan.relativeLowWindow.start).toBeDefined();
    expect(plan.relativeLowWindow.end).toBeDefined();
    expect(plan.relativeLowWindow.advisory).toBeTruthy();
  });

  it('shifts morning cardio indoors during severe air pollution', () => {
    const sensitiveProfile: HouseholdProfile = {
      ...DEFAULT_HOUSEHOLD_PROFILE,
      hasInfantsOrChildren: true,
      hasRespiratorySensitivity: true,
      hasElderly: true,
    };

    const plan = generateDailyPlan(sensitiveProfile, delhiState);
    const morningWorkout = plan.activities.find((a) => a.type === 'OUTDOOR_EXERCISE');
    expect(morningWorkout).toBeDefined();
    expect(morningWorkout?.adaptedLocation).toBe('INDOOR');
    expect(morningWorkout?.protectionRequired).toBe('AVOID_ACTIVITY');
    expect(morningWorkout?.reasonForChange).toContain('respiratory minute ventilation');
  });

  it('generates targeted vulnerability alerts for infants, asthmatics, and seniors', () => {
    const sensitiveProfile: HouseholdProfile = {
      ...DEFAULT_HOUSEHOLD_PROFILE,
      hasInfantsOrChildren: true,
      hasRespiratorySensitivity: true,
      hasElderly: true,
    };

    const plan = generateDailyPlan(sensitiveProfile, delhiState);
    expect(plan.vulnerabilitySpecificAlerts.length).toBe(3);
    expect(plan.vulnerabilitySpecificAlerts.some((a) => a.includes('CHILD HEALTH ADVISORY'))).toBe(true);
    expect(plan.vulnerabilitySpecificAlerts.some((a) => a.includes('SENIOR CITIZEN ADVISORY'))).toBe(true);
    expect(plan.vulnerabilitySpecificAlerts.some((a) => a.includes('RESPIRATORY / ASTHMA SENSITIVITY'))).toBe(true);
  });

  it('provides PCRA anti-idling guidance for traffic queues and school drop-offs', () => {
    const plan = generateDailyPlan(DEFAULT_HOUSEHOLD_PROFILE, delhiState);
    expect(plan.vehicleIdlingWarning).toContain('ANTI-IDLING PROTOCOL');
    expect(plan.vehicleIdlingWarning).toContain('PCRA');

    const schoolDrop = plan.activities.find((a) => a.type === 'SCHOOL_COMMUTE');
    expect(schoolDrop).toBeDefined();
    expect(schoolDrop?.reasonForChange).toContain('curbside vehicle idling');
  });

  it('adapts overall advisory based on AQI severity level', () => {
    const moderateState = {
      ...delhiState,
      current: {
        ...delhiState.current,
        aqi: 150,
        category: 'Moderate' as const,
      },
    };

    const planModerate = generateDailyPlan(DEFAULT_HOUSEHOLD_PROFILE, moderateState);
    expect(planModerate.overallAdvisory).toContain('MODERATE');

    const planSevere = generateDailyPlan(DEFAULT_HOUSEHOLD_PROFILE, delhiState);
    expect(planSevere.overallAdvisory).toContain('SEVERE');
  });
});
