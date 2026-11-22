/**
 * Dynamic Indoor Air Quality Coach Engine
 * Grounded in scientific indoor environmental health principles:
 * - Dynamic ventilation based on outdoor pollution curves (no static window openings)
 * - Zero fake indoor sensors banner
 * - Cooking smoke containment (tadka, deep frying)
 * - Wet mopping vs dry sweeping dust dynamics
 * - Safe Corsi-Rosenthal DIY box filter specifications & thermal motor safety
 */

export interface IndoorGuidanceResult {
  zeroSensorDisclaimer: string;
  ventilationAdvisor: {
    canVentilateNow: boolean;
    recommendedAction: 'KEEP_WINDOWS_SEALED' | 'SHORT_CONTROLLED_VENTILATION' | 'CROSS_VENTILATE_FREELY';
    explanation: string;
    safestVentilationWindowToday?: string;
  };
  cookingProtocols: {
    title: string;
    rules: string[];
    exhaustTiming: string;
    partitionAdvice: string;
  };
  dustMitigation: {
    cleaningMethod: 'WET_MOPPING_ONLY' | 'DAMP_MICROFIBER';
    prohibitedActions: string[];
    resuspensionExplanation: string;
  };
  diyFilterGuide: {
    title: string;
    safetyPrerequisites: string[];
    filterSpecifications: string[];
    assemblyChecklist: string[];
    limitations: string[];
    maintenanceSchedule: string;
  };
  purifierGuidance?: {
    cadrRequirementM3h: number;
    placementAdvice: string;
    filterCareProtocol: string;
  };
}

export function evaluateIndoorGuidance(
  outdoorPm25: number | null,
  outdoorAqi: number | null,
  relativeLowWindow: { start: string; end: string } | null,
  hasKitchenPartition: boolean,
  hasExhaustFan: boolean,
  hasPurifier: boolean
): IndoorGuidanceResult {
  // 1. Dynamic Ventilation Determination
  let canVentilateNow = false;
  let recommendedAction: 'KEEP_WINDOWS_SEALED' | 'SHORT_CONTROLLED_VENTILATION' | 'CROSS_VENTILATE_FREELY' = 'KEEP_WINDOWS_SEALED';
  let explanation = '';

  if (outdoorPm25 === null) {
    canVentilateNow = false;
    recommendedAction = 'SHORT_CONTROLLED_VENTILATION';
    explanation = 'Outdoor particulate telemetry currently unavailable for this location. Observe local ambient conditions: if smoky or hazy, keep exterior windows sealed. Rely on kitchen exhaust and wet mopping for indoor particle reduction.';
  } else if (outdoorPm25 > 120 || (outdoorAqi !== null && outdoorAqi > 250)) {
    canVentilateNow = false;
    recommendedAction = 'KEEP_WINDOWS_SEALED';
    explanation = `Application Behavioral Heuristic (Practical particulate-protection rule derived from CPCB 24-hour Poor-to-Very Poor boundary of 121 µg/m³; intended to guide household ventilation during severe smog episodes rather than an official statutory medical standard): Outdoor ambient PM2.5 is currently ${Math.round(outdoorPm25)} µg/m³. Keep all exterior windows, doors, and balcony vents tightly closed. Opening windows will flood indoor living spaces with fine particulates.`;
  } else if (outdoorPm25 > 60 || (outdoorAqi !== null && outdoorAqi > 100)) {
    canVentilateNow = false;
    recommendedAction = 'SHORT_CONTROLLED_VENTILATION';
    explanation = `Application Behavioral Heuristic (Derived from CPCB 24-hour Satisfactory-to-Moderate boundary of 60 µg/m³): Outdoor air is moderately polluted (${Math.round(outdoorPm25)} µg/m³). Avoid continuous open windows. If CO₂ buildup or stuffiness occurs, allow a brief 10-minute controlled cross-ventilation during the afternoon relative low, then reseal.`;
  } else {
    canVentilateNow = true;
    recommendedAction = 'CROSS_VENTILATE_FREELY';
    explanation = `Outdoor air quality is currently favorable (${Math.round(outdoorPm25)} µg/m³). Open windows on opposing sides of the home to flush out accumulated indoor CO₂ and cooking VOCs.`;
  }

  // 2. Cooking Smog Protocols
  const cookingRules = [
    'Turn on the kitchen exhaust fan or chimney at least 2 minutes prior to heating oil or spices (tadka/chhonk).',
    'Keep the exhaust fan operating for a full 5 to 7 minutes after stove burners are extinguished to evacuate lingering ultra-fine oil particulates.',
    'Use lids on frying pans and cookware whenever feasible to suppress aerosolized oil splatter.',
  ];

  if (!hasExhaustFan) {
    cookingRules.push('CRITICAL: Since your kitchen lacks a powered exhaust fan, crack the external kitchen window slightly while keeping internal kitchen doors shut to prevent smoke migration into living/sleeping quarters.');
  }

  const partitionAdvice = hasKitchenPartition
    ? 'Keep the kitchen door closed during all cooking activities to isolate high-concentration cooking PM2.5 away from bedrooms and living areas.'
    : 'Without an internal kitchen door, cooking smoke disperses throughout the home. Consider hanging a heavy tension-rod curtain across the kitchen doorway during peak winter smog as an effective low-cost particulate barrier.';

  // 3. Dust Mitigation & Cleaning
  const dustMitigation = {
    cleaningMethod: 'WET_MOPPING_ONLY' as const,
    prohibitedActions: [
      'DO NOT use traditional dry broom sweeping (jhadu). Sweeping aerates settled coarse dust (PM10) and fine particulates into the breathing zone for 2 to 4 hours.',
      'DO NOT use feather dusters or dry rags on furniture surfaces.',
      'AVOID dry vacuum cleaners without HEPA exhaust filters, as unsealed vacuums blow fine PM2.5 out through their rear vents.',
    ],
    resuspensionExplanation: 'Aerodynamic resuspension: Mechanical sweeping imparts kinetic energy to settled dust particles. While large particles settle quickly, PM2.5 particles remain suspended in ambient indoor air indefinitely without wet capture.',
  };

  // 4. Safe DIY Corsi-Rosenthal Box Filtration Blueprint
  const diyFilterGuide = {
    title: 'Corsi-Rosenthal Box / Fan Filter Blueprint (Safe DIY Engineering)',
    safetyPrerequisites: [
      'MOTOR SAFETY: Must use a box fan with a thermally protected motor (Class B insulation or built-in thermal fuse). Do not use unrated, exposed-motor, or ultra-cheap plastic fans that can overheat under continuous static backpressure.',
      'ELECTRICAL INTEGRITY: Keep electrical cords and switches free from strain, moisture, and dust accumulation.',
    ],
    filterSpecifications: [
      'FILTER MEDIA: Use 4 or 5 pleated furnace/HVAC filters rated minimum MERV 13 (or ISO 16890 ePM1 50%+). Filters rated lower (MERV 8 or fiberglass) fail to capture fine PM2.5 smog particles.',
      'FILTER THICKNESS: 2-inch or 4-inch deep pleats are strongly preferred over 1-inch filters, as deeper pleats provide lower air resistance and longer operating lifespan.',
    ],
    assemblyChecklist: [
      'Create a cube using 4 filters with arrow indicators pointing INWARD toward the center of the box.',
      'Tape all bottom and corner seams completely airtight using heavy-duty duct tape or HVAC foil tape to prevent particulate bypass.',
      'Place the box fan on top blowing UPWARD, and secure with airtight perimeter taping.',
      'Install a cardboard shroud over the front face of the fan (covering the outer 10-15% of blade tips) to prevent vortex air backflow at blade edges.',
    ],
    limitations: [
      'PARTICULATES ONLY: Mechanical HEPA/MERV 13 filters capture solid aerosols (PM2.5, PM10, pollen, smoke ash). They DO NOT remove gaseous pollutants (CO, NO2, ozone, or cooking volatile organic compounds) unless a dedicated activated carbon stage is added.',
      'AIR QUALITY MEASUREMENT: Remember that operating a DIY or commercial filter does not equate to measuring air quality; physical indoor sensors are required for quantitative indoor verification.',
    ],
    maintenanceSchedule: 'Vacuum external pleated surfaces gently once a month to remove coarse lint; replace all pleated filters after 3 to 6 months of heavy winter smog use.',
  };

  // 5. Purifier Guidance
  const purifierGuidance = hasPurifier
    ? {
        cadrRequirementM3h: 300, // Standard 200 sq ft room at 5 ACH
        placementAdvice: 'Place the air purifier at least 1 meter away from walls and corners, elevated 30 cm off the floor if possible, directly in the breathing zone of the sleeping area. Keep all bedroom windows and doors closed while running.',
        filterCareProtocol: 'Rinse or vacuum the pre-filter mesh every 2 weeks. Never wash the pleated true-HEPA filter with water, as moisture permanently ruins electrostatic fiber charge and collapses the pore structure.',
      }
    : undefined;

  return {
    zeroSensorDisclaimer: 'NOTICE: BreatheWise AI does not display unverified or fabricated indoor AQI numbers. Without physical indoor sensors, indoor air quality cannot be measured. This module provides evidence-based procedural guidance to minimize indoor particulate accumulation.',
    ventilationAdvisor: {
      canVentilateNow,
      recommendedAction,
      explanation,
      safestVentilationWindowToday: relativeLowWindow ? `${relativeLowWindow.start} to ${relativeLowWindow.end}` : undefined,
    },
    cookingProtocols: {
      title: 'Kitchen & Cooking Smog Protocol (Tadka & Deep Frying)',
      rules: cookingRules,
      exhaustTiming: 'Pre-exhaust 2 mins before; post-exhaust 5-7 mins after cooking.',
      partitionAdvice,
    },
    dustMitigation,
    diyFilterGuide,
    purifierGuidance,
  };
}
