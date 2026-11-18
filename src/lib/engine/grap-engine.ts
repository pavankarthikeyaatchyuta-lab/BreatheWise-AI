/**
 * CAQM Graded Response Action Plan (GRAP) Regulatory Engine
 * Strict compliance with Commission for Air Quality Management (NCR & Adjoining Areas)
 * Enforces NCR geographic scope vs Non-NCR advisory guidance.
 */

export type GRAPStage = 'STAGE_I' | 'STAGE_II' | 'STAGE_III' | 'STAGE_IV' | 'NONE';

export interface GRAPActionItem {
  target: 'CITIZEN' | 'RWA' | 'SCHOOL' | 'COMMERCIAL';
  title: string;
  description: string;
  isMandatoryUnderLaw: boolean;
}

export interface GRAPStatus {
  activeStage: GRAPStage;
  stageName: string;
  aqiTriggerRange: string;
  isStatutoryNCR: boolean;
  jurisdictionDisclaimer: string;
  summary: string;
  actionItems: GRAPActionItem[];
}

export function evaluateGRAPStage(aqi: number | null, isNCR: boolean): GRAPStatus {
  if (aqi === null || aqi <= 200) {
    return {
      activeStage: 'NONE',
      stageName: 'Normal Baseline (No GRAP Active)',
      aqiTriggerRange: 'AQI 0 – 200',
      isStatutoryNCR: isNCR,
      jurisdictionDisclaimer: isNCR
        ? 'CAQM statutory GRAP stages are triggered when AQI exceeds 200 in Delhi-NCR.'
        : 'GRAP is a statutory order specific to Delhi-NCR. Local state pollution control board rules apply in your region.',
      summary: 'Air quality is within acceptable or moderate baseline. Continue normal routines with standard eco-friendly practices.',
      actionItems: [
        {
          target: 'CITIZEN',
          title: 'Maintain Vehicle PUC',
          description: 'Ensure Pollution Under Control certification is current.',
          isMandatoryUnderLaw: true,
        },
        {
          target: 'RWA',
          title: 'Compost Garden Waste',
          description: 'Ensure horticulture waste is composted and not burnt.',
          isMandatoryUnderLaw: true,
        },
      ],
    };
  }

  // Stage I: Poor (AQI 201 - 300)
  if (aqi >= 201 && aqi <= 300) {
    return {
      activeStage: 'STAGE_I',
      stageName: 'GRAP Stage I ("Poor")',
      aqiTriggerRange: 'AQI 201 – 300',
      isStatutoryNCR: isNCR,
      jurisdictionDisclaimer: isNCR
        ? 'Statutory CAQM order in effect across Delhi, Gurugram, Faridabad, Ghaziabad, and Gautam Buddh Nagar.'
        : 'Advisory guidance. CAQM GRAP is statutory only in Delhi-NCR; non-NCR cities follow state PCB directives.',
      summary: 'Strict enforcement on dust control, mechanized sweeping, and total ban on open trash/biomass burning.',
      actionItems: [
        {
          target: 'CITIZEN',
          title: 'Avoid Open Combustion & Unnecessary Idling',
          description: 'Turn off vehicle engines at red lights (>15 seconds). Do not burn garden dry leaves or plastic waste.',
          isMandatoryUnderLaw: isNCR,
        },
        {
          target: 'RWA',
          title: 'Anti-Dust Water Sprinkling',
          description: 'Sprinkle water on internal unpaved society roads to suppress resuspension of road dust.',
          isMandatoryUnderLaw: false,
        },
        {
          target: 'SCHOOL',
          title: 'Encourage School Bus Transit',
          description: 'Discourage private car queuing outside gates; mandate strict engine switch-off for waiting vans.',
          isMandatoryUnderLaw: false,
        },
      ],
    };
  }

  // Stage II: Very Poor (AQI 301 - 400)
  if (aqi >= 301 && aqi <= 400) {
    return {
      activeStage: 'STAGE_II',
      stageName: 'GRAP Stage II ("Very Poor")',
      aqiTriggerRange: 'AQI 301 – 400',
      isStatutoryNCR: isNCR,
      jurisdictionDisclaimer: isNCR
        ? 'Statutory CAQM order in effect across Delhi-NCR. Regulates Diesel Generator (DG) set operations.'
        : 'Advisory guidance based on CAQM Stage II benchmarks. CAQM GRAP is statutory only in Delhi-NCR; non-NCR cities follow state PCB directives.',
      summary: 'Regulate diesel generator sets, increase private parking rates to incentivize public transit, and maximize metro/bus frequency.',
      actionItems: [
        {
          target: 'CITIZEN',
          title: 'Shift Commute to Metro or Public Transit',
          description: 'Minimize private ICE vehicle use; utilize electrified metro or CNG buses.',
          isMandatoryUnderLaw: false,
        },
        {
          target: 'RWA',
          title: 'Regulate Diesel Generators & Electric Heaters for Guards',
          description: 'Provide electric room heaters to security staff to prevent open biomass/wood fires during winter nights. Prohibit unessential DG set usage.',
          isMandatoryUnderLaw: isNCR,
        },
        {
          target: 'SCHOOL',
          title: 'Morning Assembly Precaution',
          description: 'Curtail prolonged early-morning outdoor assemblies; move announcements indoors or post-10 AM.',
          isMandatoryUnderLaw: false,
        },
      ],
    };
  }

  // Stage III: Severe (AQI 401 - 450)
  if (aqi >= 401 && aqi <= 450) {
    return {
      activeStage: 'STAGE_III',
      stageName: 'GRAP Stage III ("Severe")',
      aqiTriggerRange: 'AQI 401 – 450',
      isStatutoryNCR: isNCR,
      jurisdictionDisclaimer: isNCR
        ? 'Statutory CAQM order in effect across Delhi-NCR. Heavy legal penalties for non-essential construction and non-compliant vehicles.'
        : 'Severe smog emergency threshold. In non-NCR states, local district collectors issue school/construction orders.',
      summary: 'Strict ban on non-essential construction & demolition, restriction on BS-III petrol and BS-IV diesel LMVs, online primary classes as ordered.',
      actionItems: [
        {
          target: 'CITIZEN',
          title: 'Respect BS-III Petrol & BS-IV Diesel Bans',
          description: 'In NCR, non-compliant older cars face ₹20,000 traffic fines. Use metro or carpooling only.',
          isMandatoryUnderLaw: isNCR,
        },
        {
          target: 'RWA',
          title: 'Halt Non-Essential Construction & Drilling',
          description: 'Cease tile cutting, wall demolition, and excavation across the residential society.',
          isMandatoryUnderLaw: isNCR,
        },
        {
          target: 'SCHOOL',
          title: 'Suspend Outdoor Sports & Physical Education',
          description: 'Move all physical education classes indoors. Follow district magistrate directives regarding junior school class mode.',
          isMandatoryUnderLaw: isNCR,
        },
      ],
    };
  }

  // Stage IV: Severe+ (AQI > 450)
  return {
    activeStage: 'STAGE_IV',
    stageName: 'GRAP Stage IV ("Severe +")',
    aqiTriggerRange: 'AQI > 450',
    isStatutoryNCR: isNCR,
    jurisdictionDisclaimer: isNCR
      ? 'Emergency CAQM order across Delhi-NCR. Complete ban on non-essential heavy diesel trucks and public work-from-home orders.'
      : 'Catastrophic smog episode. State emergency disaster protocols and health advisories apply.',
    summary: 'Public health emergency. Complete ban on medium and heavy diesel goods vehicles entering Delhi; all schools shift online as notified; 50% work-from-home advisory.',
    actionItems: [
      {
        target: 'CITIZEN',
        title: 'Remain Indoors with Sealed Windows',
        description: 'Vulnerable individuals, children, and elderly must remain strictly indoors. Wear N95 respirators if stepping out is unavoidable.',
        isMandatoryUnderLaw: false,
      },
      {
        target: 'RWA',
        title: 'Society Emergency Shielding',
        description: 'Provide N95 masks to sanitation and gatekeeping workers; eliminate all outdoor maintenance work.',
        isMandatoryUnderLaw: false,
      },
      {
        target: 'SCHOOL',
        title: 'Full School Closure / Remote Learning',
        description: 'All physical schooling suspended per government gazette notification.',
        isMandatoryUnderLaw: isNCR,
      },
    ],
  };
}
