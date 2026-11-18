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
