/**
 * Routine Planner & Constraints Types
 */

import { AQICategory } from './aqi';

export type ActivityType = 'OUTDOOR_EXERCISE' | 'SCHOOL_COMMUTE' | 'WORK_COMMUTE' | 'ERRANDS' | 'INDOOR_CHORES' | 'VENTILATION';

export interface PlannedActivity {
  id: string;
  type: ActivityType;
  title: string;
  originalTime: string; // "06:30"
  durationMinutes: number;
  isOutdoor: boolean;
  adaptedTime?: string; // "14:00"
  adaptedLocation?: 'INDOOR' | 'OUTDOOR_PROTECTED' | 'DELAYED';
  reasonForChange?: string;
  protectionRequired?: 'N95_RESPIRATOR' | 'NONE' | 'AVOID_ACTIVITY';
  estimatedAQIAtOriginalTime?: number;
  estimatedAQIAtAdaptedTime?: number;
}

export interface DailySchedulePlan {
  date: string;
  overallAdvisory: string;
  relativeLowWindow: {
    start: string;
    end: string;
    advisory: string;
  };
  peakSmogWindows: Array<{
    start: string;
    end: string;
    description: string;
  }>;
  activities: PlannedActivity[];
  vehicleIdlingWarning: string;
  vulnerabilitySpecificAlerts: string[];
}
