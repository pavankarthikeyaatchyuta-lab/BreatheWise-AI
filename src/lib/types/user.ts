/**
 * User and Household Context Types
 * Non-medical, privacy-first vulnerability categories
 */

export interface HouseholdProfile {
  city: string;
  isNCR: boolean;
  latitude?: number;  // Optional, truncated to ~0.01 deg
  longitude?: number; // Optional, truncated to ~0.01 deg
  // Non-medical vulnerability flags (all optional)
  hasInfantsOrChildren: boolean;
  hasElderly: boolean;
  hasRespiratorySensitivity: boolean;
  hasPregnantMember: boolean;
  
  // Lifestyle context
  primaryCommuteMode: 'TWO_WHEELER' | 'OPEN_AUTO' | 'NON_AC_BUS' | 'AC_METRO' | 'SOLO_CAR' | 'CARPOOL';
  commuteDistanceKm: number;
  commuteDepartureTime: string; // "08:30"
  
  // Home facilities
  hasKitchenPartition: boolean;
  hasKitchenExhaustFan: boolean;
  hasAirPurifier: boolean;
  purifierCount: number;
}

export const DEFAULT_HOUSEHOLD_PROFILE: HouseholdProfile = {
  city: "Delhi-NCR",
  isNCR: true,
  hasInfantsOrChildren: true,
  hasElderly: true,
  hasRespiratorySensitivity: false,
  hasPregnantMember: false,
  primaryCommuteMode: "TWO_WHEELER",
  commuteDistanceKm: 12,
  commuteDepartureTime: "08:30",
  hasKitchenPartition: true,
  hasKitchenExhaustFan: true,
  hasAirPurifier: false,
  purifierCount: 0,
};

export type EvaluatorScenarioId = 'WORKING_COMMUTER' | 'FAMILY_WITH_CHILD' | 'SENIOR_HOUSEHOLD';

export interface EvaluatorScenario {
  id: EvaluatorScenarioId;
  title: string;
  badge: string;
  icon: string;
  summary: string;
  targetFocus: string;
  profile: HouseholdProfile;
}

export const EVALUATOR_SCENARIOS: Record<EvaluatorScenarioId, EvaluatorScenario> = {
  WORKING_COMMUTER: {
    id: 'WORKING_COMMUTER',
    title: 'Working Professional & Daily Commuter',
    badge: 'Commuter Mode',
    icon: 'Briefcase',
    summary: 'Solo car commuter traveling 14 km during rush hours with no vulnerable dependents.',
    targetFocus: 'Rush-hour tailpipe exposure reduction, in-cabin AC recirculation, and shift to metro/carpooling.',
    profile: {
      city: 'Delhi-NCR',
      isNCR: true,
      hasInfantsOrChildren: false,
      hasElderly: false,
      hasRespiratorySensitivity: false,
      hasPregnantMember: false,
      primaryCommuteMode: 'SOLO_CAR',
      commuteDistanceKm: 14,
      commuteDepartureTime: '08:30',
      hasKitchenPartition: true,
      hasKitchenExhaustFan: true,
      hasAirPurifier: false,
      purifierCount: 0,
    },
  },
  FAMILY_WITH_CHILD: {
    id: 'FAMILY_WITH_CHILD',
    title: 'Family with School Child (Zero Purifiers)',
    badge: 'Child Protection',
    icon: 'GraduationCap',
    summary: 'Household with a school-going child, 2-wheeler commute, and zero expensive air-purification equipment.',
    targetFocus: 'School gate idling avoidance heuristic, minimizing pediatric outdoor exposure, kitchen partition, and wet mopping protocols.',
    profile: {
      city: 'Delhi-NCR',
      isNCR: true,
      hasInfantsOrChildren: true,
      hasElderly: false,
      hasRespiratorySensitivity: false,
      hasPregnantMember: false,
      primaryCommuteMode: 'TWO_WHEELER',
      commuteDistanceKm: 6,
      commuteDepartureTime: '07:45',
      hasKitchenPartition: false,
      hasKitchenExhaustFan: true,
      hasAirPurifier: false,
      purifierCount: 0,
    },
  },
  SENIOR_HOUSEHOLD: {
    id: 'SENIOR_HOUSEHOLD',
    title: 'Senior Citizens & Sensitive Household',
    badge: 'Senior & Health',
    icon: 'HeartHandshake',
    summary: 'Elderly family members with respiratory sensitivities who love outdoor morning exercise.',
    targetFocus: 'Winter inversion morning walk hazard alert, shifting exercise indoors, and clinician-approved asthma plan adherence.',
    profile: {
      city: 'Delhi-NCR',
      isNCR: true,
      hasInfantsOrChildren: false,
      hasElderly: true,
      hasRespiratorySensitivity: true,
      hasPregnantMember: false,
      primaryCommuteMode: 'AC_METRO',
      commuteDistanceKm: 4,
      commuteDepartureTime: '10:30',
      hasKitchenPartition: true,
      hasKitchenExhaustFan: true,
      hasAirPurifier: true,
      purifierCount: 1,
    },
  },
};
