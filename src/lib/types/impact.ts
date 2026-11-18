/**
 * 3-Tier Explainable Impact Types & Calculation Proofs
 */

export interface Tier1PersonalExposureImpact {
  avoidedPeakSmogHours: number; // Hours shifted away from AQI > 300
  percentageExposureReductionEstimate: number; // e.g. 65% duration reduction
  medicalDisclaimer: string;
}

export interface Tier2LocalTailpipeImpact {
  avoidedTailpipePm25Grams: number;
  calculationEquation: string;
  sourceCitation: string;
}

export interface Tier3GreenhouseGasImpact {
  baselineCo2eKg: number;
  adaptedCo2eKg: number;
  netAvoidedCo2eKg: number;
  calculationEquation: string;
  constantsUsed: {
    baselineFactor: string;
    adaptedFactor: string;
    distance: string;
    occupancy: string;
    gridFactor: string;
  };
  sourceCitation: string;
}

export interface ExplainableImpactResult {
  tier1Exposure: Tier1PersonalExposureImpact;
  tier2LocalPm: Tier2LocalTailpipeImpact;
  tier3Ghg: Tier3GreenhouseGasImpact;
  calculationProofModalData: {
    title: string;
    methodology: string;
    assumptions: string[];
    formulas: string[];
    citations: string[];
  };
}
