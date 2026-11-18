/**
 * Sustainable Alternatives & Passenger-Kilometre Types
 */

export type TransportMode = 
  | 'SOLO_PETROL_CAR'
  | 'SOLO_DIESEL_CAR'
  | 'CARPOOL_4P'
  | 'MOTORCYCLE_125CC'
  | 'DELHI_METRO'
  | 'CNG_BUS'
  | 'ELECTRIC_BUS'
  | 'WALKING_CYCLING';

export interface TransportEmissionFactor {
  mode: TransportMode;
  name: string;
  occupancy: number; // Average passenger load
  co2e_g_per_pkm: number; // Grams CO2e per passenger-km
  pm25_g_per_pkm: number; // Grams tailpipe PM2.5 per passenger-km
  estimatedCostPerKmInr: number; // ₹ per km
  averageSpeedKmph: number; // km/h
  exposureRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  exposureExplanation: string;
}

export interface TransportComparisonResult {
  mode: TransportMode;
  name: string;
  distanceKm: number;
  durationMinutes: number;
  totalCostInr: number;
  co2eKg: number;
  tailpipePm25Grams: number;
  exposureRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  practicalityScore: number; // 1-10
  exposureVsEmissionsTruth: string;
}
