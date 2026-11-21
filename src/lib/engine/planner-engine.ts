/**
 * Smart Daily Routine Planner Engine
 * Translates diurnal atmospheric pollution curves into tailored family schedules:
 * - Adapts morning outdoor exercise to indoor routines
 * - Protects vulnerable household members (infants, elderly, asthmatics)
 * - Anti-idling guidance for school drop-offs and commutes
 * - Avoids universal "safe" guarantees; uses relative exposure minimization
 */

import { AirQualityState, DiurnalForecastHour } from '../types/aqi';
import { HouseholdProfile } from '../types/user';
import { DailySchedulePlan, PlannedActivity } from '../types/planner';

export function generateDailyPlan(
  profile: HouseholdProfile,
  aqiState: AirQualityState
): DailySchedulePlan {
  const currentAqi = aqiState.current.aqi ?? 250;
  const isSevere = currentAqi > 400;
  const isVeryPoor = currentAqi > 300;

  // Identify Diurnal Windows from forecast
  const peakHours = aqiState.forecast24h.filter((h) => h.isPeakSmogWindow);
  const relativeLowHours = aqiState.forecast24h.filter((h) => h.isRelativeLowWindow);

  const relativeLowWindow = {
    start: relativeLowHours.length > 0 ? relativeLowHours[0].time : '13:00',
    end: relativeLowHours.length > 0 ? relativeLowHours[relativeLowHours.length - 1].time : '16:00',
    advisory:
      isSevere
        ? 'NOTE: Even during the midday relative dip, pollution remains in the Very Poor / Severe range. Outdoor activity should still be minimized, especially for children and senior citizens.'
        : 'Favorable relative window: Atmospheric boundary layer expansion provides lower surface PM2.5. Best window for essential outdoor errands.',
  };

  const peakSmogWindows = [
    {
      start: '06:00',
      end: '09:30',
      description: 'Morning Shallow Boundary Layer Inversion: Radiative cooling traps ground-level tailpipe and biomass smoke. High particulate concentration.',
    },
    {
      start: '19:30',
      end: '23:00',
      description: 'Evening Inversion & Traffic Dispersal: Nighttime atmospheric cooling drops the mixing height, concentrating evening rush-hour emissions.',
    },
  ];

  // Adapt Schedule Activities
  const activities: PlannedActivity[] = [
    {
      id: 'act-1',
      type: 'OUTDOOR_EXERCISE',
      title: 'Morning Fitness / Jogging',
      originalTime: '06:30',
      durationMinutes: 45,
      isOutdoor: true,
      adaptedTime: '15:30',
      adaptedLocation: isVeryPoor ? 'INDOOR' : 'OUTDOOR_PROTECTED',
      reasonForChange: isVeryPoor
        ? 'Morning inversion elevates ambient PM2.5 by 40-70%. Aerobic exercise increases tidal breathing volume 4x, pulling toxic particulates into deep alveolar tissue. Shifted to indoor yoga/aerobics.'
        : 'Moved closer to afternoon relative low window to minimize inhalation risk.',
      protectionRequired: isVeryPoor ? 'AVOID_ACTIVITY' : 'NONE',
      estimatedAQIAtOriginalTime: 380,
      estimatedAQIAtAdaptedTime: 185,
    },
    {
      id: 'act-2',
      type: 'SCHOOL_COMMUTE',
      title: 'School Drop-off / Bus Pickup',
      originalTime: '07:45',
      durationMinutes: 25,
      isOutdoor: true,
      adaptedTime: '08:05',
      adaptedLocation: 'OUTDOOR_PROTECTED',
      reasonForChange:
        'Behavioral scheduling heuristic: Adjusting departure by 15-20 minutes is intended to help reduce exposure to concentrated curbside vehicle idling queues during peak drop-off windows (behavioral heuristic, not live GPS tracking). Prioritize minimizing outdoor exposure time and shifting activities indoors; masks designed for adults do not achieve reliable facial seals on pediatric anatomy and must not be relied upon as a substitute for exposure reduction.',
      protectionRequired: profile.hasInfantsOrChildren ? 'REDUCE_EXPOSURE' : 'NONE',
      estimatedAQIAtOriginalTime: 395,
      estimatedAQIAtAdaptedTime: 340,
    },
    {
      id: 'act-3',
      type: 'WORK_COMMUTE',
      title: `Daily Work Commute (${profile.primaryCommuteMode.replace('_', ' ')})`,
      originalTime: profile.commuteDepartureTime,
      durationMinutes: Math.round(profile.commuteDistanceKm * 2.5),
      isOutdoor: profile.primaryCommuteMode === 'TWO_WHEELER' || profile.primaryCommuteMode === 'OPEN_AUTO',
      adaptedTime: profile.commuteDepartureTime,
      adaptedLocation: 'OUTDOOR_PROTECTED',
      reasonForChange:
        profile.primaryCommuteMode === 'TWO_WHEELER'
          ? 'Two-wheeler riders experience direct roadside exhaust wake and tire resuspension. Wear a tightly fitted N95 mask and close helmet visor completely.'
          : 'Keep car windows closed with AC set to internal recirculation mode (recirculate cabin air rather than drawing fresh diesel exhaust).',
      protectionRequired:
        profile.primaryCommuteMode === 'TWO_WHEELER' || profile.primaryCommuteMode === 'OPEN_AUTO'
          ? 'N95_RESPIRATOR'
          : 'NONE',
      estimatedAQIAtOriginalTime: 350,
      estimatedAQIAtAdaptedTime: 350,
    },
    {
      id: 'act-4',
      type: 'VENTILATION',
      title: 'Household Fresh Air Flushing',
      originalTime: '08:00',
      durationMinutes: 20,
      isOutdoor: false,
      adaptedTime: relativeLowWindow.start,
      adaptedLocation: 'DELAYED',
      reasonForChange:
        'Opening windows during 8:00 AM morning smog traps hazardous PM2.5 inside sleeping areas. Postponed to the afternoon relative low window.',
      protectionRequired: 'NONE',
      estimatedAQIAtOriginalTime: 400,
      estimatedAQIAtAdaptedTime: 200,
    },
  ];

  // Vulnerability Alerts
  const vulnerabilitySpecificAlerts: string[] = [];
  if (profile.hasInfantsOrChildren) {
    vulnerabilitySpecificAlerts.push(
      'CHILD HEALTH ADVISORY: Children breathe more air per kilogram of body weight than adults and have developing airway linings. Cancel outdoor sports training and playground sessions during AQI > 300.'
    );
  }
  if (profile.hasElderly) {
    vulnerabilitySpecificAlerts.push(
      'SENIOR CITIZEN ADVISORY: Cancel early morning garden walks (typically between 5:30 AM and 8:30 AM). Keep indoor humidity balanced and follow your clinician-approved personal healthcare action plan.'
    );
  }
  if (profile.hasRespiratorySensitivity) {
    vulnerabilitySpecificAlerts.push(
      'RESPIRATORY / ASTHMA SENSITIVITY: Follow your existing clinician-approved asthma action plan. Ensure indoor particulate levels are minimized via wet mopping; avoid agarbatti, mosquito coils, and room freshener aerosols.'
    );
  }

  const vehicleIdlingWarning =
    'ANTI-IDLING PROTOCOL (PCRA / SAE Benchmark): Petroleum Conservation Research Association (PCRA, India) guidelines demonstrate that modern fuel-injected engines use less fuel and emit substantially lower tailpipe particulates upon restarting than idling for >10-15 seconds. Switch off ignition at traffic signals where countdown timers exceed 15-20 seconds.';

  const overallAdvisory = isSevere
    ? 'SEVERE SMOG EPISODE ACTIVE: The entire diurnal cycle is elevated. Eliminate non-essential outdoor travel. All outdoor aerobic activities should be moved indoors.'
    : isVeryPoor
    ? 'VERY POOR AIR QUALITY: Significant boundary layer inversion in morning and evening. Confine outdoor activities to the afternoon relative low window.'
    : 'MODERATE SMOG CYCLE: Standard precautions advised. Vulnerable groups should avoid strenuous outdoor exertion during peak traffic hours.';

  return {
    date: new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }),
    overallAdvisory,
    relativeLowWindow,
    peakSmogWindows,
    activities,
    vehicleIdlingWarning,
    vulnerabilitySpecificAlerts,
  };
}
