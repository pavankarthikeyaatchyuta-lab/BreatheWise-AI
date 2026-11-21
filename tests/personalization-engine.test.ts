/**
 * Personalization & Evaluator Scenario Verification Tests
 * Proves that different household profiles receive materially different
 * recommendations under identical environmental conditions without inventing
 * differing AQI thresholds.
 */

import { describe, it, expect } from 'vitest';
import { generateDailyPlan } from '../src/lib/engine/planner-engine';
import { EVALUATOR_SCENARIOS, DEFAULT_HOUSEHOLD_PROFILE, HouseholdProfile } from '../src/lib/types/user';
import { getDelhiDemoState, getHyderabadDemoState } from '../src/lib/aqi/demo-data';

describe('Personalization & Evaluator Scenario Verification', () => {
  const severeDelhiState = getDelhiDemoState();
  const poorHyderabadState = getHyderabadDemoState();

  it('guarantees identical environmental baseline for all profiles in the same test run', () => {
    expect(severeDelhiState.current.aqi).toBe(425);
    expect(severeDelhiState.current.category).toBe('Severe');
    expect(poorHyderabadState.current.aqi).toBe(239);
    expect(poorHyderabadState.current.category).toBe('Poor');
  });

  describe('Scenario 1: Working Commuter Profile', () => {
    const commuterProfile = EVALUATOR_SCENARIOS.WORKING_COMMUTER.profile;
    const plan = generateDailyPlan(commuterProfile, severeDelhiState);

    it('tailors commute activity to private car cabin recirculation', () => {
      const commuteAct = plan.activities.find((a) => a.type === 'WORK_COMMUTE');
      expect(commuteAct).toBeDefined();
      expect(commuteAct?.title).toContain('SOLO CAR');
      expect(commuteAct?.reasonForChange).toContain('internal recirculation mode');
      // In-cabin AC recirculation protects from direct road wake without requiring outdoor N95 inside vehicle
      expect(commuteAct?.protectionRequired).toBe('NONE');
    });

    it('does not generate pediatric or elderly advisories when no dependents exist', () => {
      const hasChildAlert = plan.vulnerabilitySpecificAlerts.some((a) => a.includes('CHILD HEALTH ADVISORY'));
      const hasElderlyAlert = plan.vulnerabilitySpecificAlerts.some((a) => a.includes('SENIOR CITIZEN ADVISORY'));
      expect(hasChildAlert).toBe(false);
      expect(hasElderlyAlert).toBe(false);
    });

    it('includes PCRA anti-idling fuel & emission guidance', () => {
      expect(plan.vehicleIdlingWarning).toContain('Petroleum Conservation Research Association (PCRA, India)');
      expect(plan.vehicleIdlingWarning).toContain('10-15 seconds');
    });
  });

  describe('Scenario 2: Family with School Child (Zero Purifiers)', () => {
    const childProfile = EVALUATOR_SCENARIOS.FAMILY_WITH_CHILD.profile;
    const plan = generateDailyPlan(childProfile, severeDelhiState);

    it('mandates pediatric N95 respirator for school transit on two-wheeler', () => {
      const schoolAct = plan.activities.find((a) => a.type === 'SCHOOL_COMMUTE');
      expect(schoolAct).toBeDefined();
      expect(schoolAct?.protectionRequired).toBe('N95_RESPIRATOR');
      expect(schoolAct?.reasonForChange).toContain('child-sized N95 respirator');
    });

    it('triggers explicit Child Health Advisory grounded in higher ventilation rates per kg', () => {
      const childAlert = plan.vulnerabilitySpecificAlerts.find((a) => a.includes('CHILD HEALTH ADVISORY'));
      expect(childAlert).toBeDefined();
      expect(childAlert).toContain('Children breathe more air per kilogram of body weight');
      expect(childAlert).toContain('Cancel outdoor sports training');
    });

    it('requires N95 respirator for two-wheeler work commute', () => {
      const commuteAct = plan.activities.find((a) => a.type === 'WORK_COMMUTE');
      expect(commuteAct?.protectionRequired).toBe('N95_RESPIRATOR');
      expect(commuteAct?.reasonForChange).toContain('Two-wheeler riders experience direct roadside exhaust wake');
    });
  });

  describe('Scenario 3: Senior Citizen Household with Respiratory Sensitivity', () => {
    const seniorProfile = EVALUATOR_SCENARIOS.SENIOR_HOUSEHOLD.profile;
    const plan = generateDailyPlan(seniorProfile, severeDelhiState);

    it('triggers Senior Citizen early morning walk cancellation alert', () => {
      const seniorAlert = plan.vulnerabilitySpecificAlerts.find((a) => a.includes('SENIOR CITIZEN ADVISORY'));
      expect(seniorAlert).toBeDefined();
      expect(seniorAlert).toContain('Cancel early morning garden walks');
      expect(seniorAlert).toContain('prescribed cardiac/respiratory medications');
    });

    it('triggers Respiratory & Asthma sensitivity alerts for damp mopping and inhaler readiness', () => {
      const asthmaAlert = plan.vulnerabilitySpecificAlerts.find((a) => a.includes('RESPIRATORY / ASTHMA SENSITIVITY'));
      expect(asthmaAlert).toBeDefined();
      expect(asthmaAlert).toContain('rescue inhalers accessible');
      expect(asthmaAlert).toContain('wet mopping; avoid agarbatti');
    });

    it('shifts morning exercise indoors due to boundary layer inversion risk', () => {
      const exerciseAct = plan.activities.find((a) => a.type === 'OUTDOOR_EXERCISE');
      expect(exerciseAct?.adaptedLocation).toBe('INDOOR');
      expect(exerciseAct?.protectionRequired).toBe('AVOID_ACTIVITY');
    });
  });

  describe('Material Difference Proof Across All Profiles Under Identical Ambient Air Quality', () => {
    it('produces distinct alert counts and recommendation content under identical AQI 425', () => {
      const planCommuter = generateDailyPlan(EVALUATOR_SCENARIOS.WORKING_COMMUTER.profile, severeDelhiState);
      const planChild = generateDailyPlan(EVALUATOR_SCENARIOS.FAMILY_WITH_CHILD.profile, severeDelhiState);
      const planSenior = generateDailyPlan(EVALUATOR_SCENARIOS.SENIOR_HOUSEHOLD.profile, severeDelhiState);

      // Working commuter has 0 vulnerability alerts
      expect(planCommuter.vulnerabilitySpecificAlerts.length).toBe(0);

      // Family with child has 1 vulnerability alert (Child)
      expect(planChild.vulnerabilitySpecificAlerts.length).toBe(1);
      expect(planChild.vulnerabilitySpecificAlerts[0]).toContain('CHILD HEALTH');

      // Senior + Asthma has 2 vulnerability alerts (Senior + Asthma)
      expect(planSenior.vulnerabilitySpecificAlerts.length).toBe(2);
      expect(planSenior.vulnerabilitySpecificAlerts[0]).toContain('SENIOR CITIZEN');
      expect(planSenior.vulnerabilitySpecificAlerts[1]).toContain('RESPIRATORY / ASTHMA');

      // Commute protection differs: Solo car is NONE, Two-wheeler is N95_RESPIRATOR
      const commuterCommute = planCommuter.activities.find((a) => a.type === 'WORK_COMMUTE');
      const childCommute = planChild.activities.find((a) => a.type === 'WORK_COMMUTE');
      expect(commuterCommute?.protectionRequired).toBe('NONE');
      expect(childCommute?.protectionRequired).toBe('N95_RESPIRATOR');
    });

    it('maintains regulatory thresholds universally regardless of demographic profile', () => {
      // The diurnal relative low window is identical for all profiles under the same ambient state
      const planA = generateDailyPlan(EVALUATOR_SCENARIOS.WORKING_COMMUTER.profile, poorHyderabadState);
      const planB = generateDailyPlan(EVALUATOR_SCENARIOS.SENIOR_HOUSEHOLD.profile, poorHyderabadState);

      expect(planA.relativeLowWindow.start).toBe(planB.relativeLowWindow.start);
      expect(planA.relativeLowWindow.end).toBe(planB.relativeLowWindow.end);
      expect(planA.overallAdvisory).toBe(planB.overallAdvisory);
    });
  });
});
