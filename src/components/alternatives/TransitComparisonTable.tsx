'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Car, 
  Train, 
  Bus, 
  Bike, 
  Users, 
  ArrowRight, 
  Info 
} from 'lucide-react';
import { TransportComparisonResult } from '@/lib/types/alternatives';

const CITY_TRANSIT_NAMES: Record<string, string> = {
  'Delhi-NCR': 'Delhi Metro (DMRC Network)',
  'Hyderabad': 'Hyderabad Metro Rail (HMR)',
  'Mumbai': 'Mumbai Metro / Suburban Rail',
  'Bengaluru': 'Namma Metro (BMRCL)',
  'Kolkata': 'Kolkata Metro Network',
  'Pune': 'Pune Metro Rail',
  'Chennai': 'Chennai Metro Rail (CMRL)',
  'Lucknow': 'Lucknow Metro (UPMRC)',
  'Patna': 'Patna Metro Rail (Priority Section: Malahi Pakri – ISBT; Under Construction)',
};

interface TransitComparisonTableProps {
  baseline: TransportComparisonResult;
  alternatives: TransportComparisonResult[];
  distanceKm: number;
  selectedCity: string;
}

export function TransitComparisonTable({
  baseline,
  alternatives,
  distanceKm,
  selectedCity,
}: TransitComparisonTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs overflow-hidden" role="region" aria-label="Transit Alternatives Comparison">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Compare Alternatives (per day)</h3>
          <span className="text-xs text-slate-400">
            Calculated for {distanceKm * 2} km total daily commute based on ARAI emission factors &amp; CEA grid factor
          </span>
        </div>
        <Link
          href="/impact"
          className="text-xs font-bold text-forest-700 hover:text-forest-800 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Full Mathematical Proof</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Mode</th>
              <th className="py-3 px-3">Travel Time</th>
              <th className="py-3 px-3">Cost (₹/day)</th>
              <th className="py-3 px-3">Local PM₂.₅ (g/day)</th>
              <th className="py-3 px-3">CO₂e (kg/day)</th>
              <th className="py-3 px-3">Exposure Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Current Mode Row */}
            <tr className="bg-slate-50/80 font-medium">
              <td className="py-3.5 px-3">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-slate-700" aria-hidden="true" />
                  <span className="font-bold text-slate-900">
                    {baseline.name} <span className="text-[10px] text-slate-400 font-normal">(Current)</span>
                  </span>
                </div>
              </td>
              <td className="py-3.5 px-3 text-slate-700">{baseline.durationMinutes * 2} min</td>
              <td className="py-3.5 px-3 text-slate-900 font-bold">₹{baseline.totalCostInr * 2}</td>
              <td className="py-3.5 px-3 text-rose-600 font-bold">{(baseline.tailpipePm25Grams * 2).toFixed(2)}</td>
              <td className="py-3.5 px-3 text-amber-700 font-bold">{(baseline.co2eKg * 2).toFixed(2)}</td>
              <td className="py-3.5 px-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 uppercase">
                  High (Cabin Leakage)
                </span>
              </td>
            </tr>

            {/* Alternative Rows */}
            {alternatives.map((alt) => {
              const roundTripCost = alt.totalCostInr * 2;
              const roundTripPm = (alt.tailpipePm25Grams * 2).toFixed(2);
              const roundTripCo2 = (alt.co2eKg * 2).toFixed(2);
              const roundTripTime = alt.durationMinutes * 2;

              return (
                <tr key={alt.mode} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      {alt.mode.includes('METRO') ? (
                        <Train className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                      ) : alt.mode.includes('BUS') ? (
                        <Bus className="w-4 h-4 text-blue-600" aria-hidden="true" />
                      ) : alt.mode.includes('CYCLE') ? (
                        <Bike className="w-4 h-4 text-orange-600" aria-hidden="true" />
                      ) : (
                        <Users className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                      )}
                      <span className="font-bold text-slate-800">
                        {alt.mode === 'DELHI_METRO'
                          ? CITY_TRANSIT_NAMES[selectedCity] || 'Electric Rapid Metro'
                          : alt.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">{roundTripTime} min</td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">₹{roundTripCost}</td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-700">{roundTripPm}</td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-700">{roundTripCo2}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        alt.exposureRiskLevel === 'LOW'
                          ? 'bg-emerald-100 text-emerald-800'
                          : alt.exposureRiskLevel === 'MODERATE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {alt.exposureRiskLevel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-slate-400 font-medium mt-2">
        *Lower emissions, but avoid during high-AQI hours and heavy traffic.
      </div>

      {/* Patna Metro Status Advisory */}
      {selectedCity === 'Patna' && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong>Patna Metro Rail Operational Notice:</strong> Only the designated priority section (Malahi Pakri – New ISBT) is under active phased commissioning. The full city-wide network (Corridors 1 &amp; 2) remains under construction; verify station-level operational status before planning your commute.
          </div>
        </div>
      )}

      {/* Exposure vs Emissions Honesty Notice */}
      <div className="mt-5 p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-xs text-emerald-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <strong>*Exposure vs. Emissions Honesty:</strong> While walking and cycling have zero tailpipe emissions, active physical exertion increases your minute ventilation (breathing rate) by 2-4× directly in roadside exhaust plumes. During severe winter smog, taking electrified mass transit (Metro or Electric Bus) is the safest choice to protect both your lungs and urban air.
        </div>
      </div>
    </div>
  );
}
