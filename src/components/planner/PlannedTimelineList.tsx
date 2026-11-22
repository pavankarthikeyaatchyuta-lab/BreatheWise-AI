'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Home, 
  Car, 
  Utensils, 
  Dumbbell 
} from 'lucide-react';
import { HouseholdProfile } from '@/lib/types/user';

interface PlannedTimelineListProps {
  profile: HouseholdProfile;
}

export function PlannedTimelineList({ profile }: PlannedTimelineListProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between" role="region" aria-label="Optimized Daily Schedule Timeline">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>Your Optimized Daily Plan</span>
            </h2>
            <span className="text-[11px] text-slate-400">
              Calibrated against diurnal boundary layer temperature inversion curve
            </span>
          </div>
          <span className="text-xs font-bold text-forest-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            Low Exposure Route
          </span>
        </div>

        {/* Vertical Interactive Timeline */}
        <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200/80">
          {/* Item 1: 7:00 AM */}
          <div className="relative group">
            <div className="absolute -left-7 top-1.5 w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center text-white text-[10px] font-bold">
              ✓
            </div>
            <div className="bg-[#f8faf9] p-4 rounded-2xl border border-slate-100 group-hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                    7:00 AM
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Home className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <strong className="text-xs text-slate-900 font-bold">At Home</strong>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Indoor Shield
                </span>
              </div>
              <p className="text-xs text-slate-700 font-semibold mb-1">
                Keep windows closed • Use exhaust while cooking
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Avoid outdoor cardio workouts (AQI elevated during morning ground inversion). Run kitchen exhaust 2 min prior to cooking.
              </p>
            </div>
          </div>

          {/* Item 2: 8:30 AM */}
          <div className="relative group">
            <div className="absolute -left-7 top-1.5 w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center text-white text-[10px] font-bold">
              ✓
            </div>
            <div className="bg-[#f8faf9] p-4 rounded-2xl border border-slate-100 group-hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                    8:30 AM
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Car className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <strong className="text-xs text-slate-900 font-bold">School Commute</strong>
                </div>
                {profile.primaryCommuteMode === 'TWO_WHEELER' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    N95 Required
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 font-semibold mb-1">
                Leave 15–20 min earlier • Prefer less congested route
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Behavioral scheduling heuristic: Shift departure to avoid peak school idling jams. Prioritize closed vehicle transit or rapid metro for children (adult masks do not achieve pediatric seal).
              </p>
            </div>
          </div>

          {/* Item 3: 12:30 PM */}
          <div className="relative group">
            <div className="absolute -left-7 top-1.5 w-6 h-6 rounded-full bg-amber-400 ring-4 ring-amber-100 flex items-center justify-center text-white text-[10px] font-bold">
              ✓
            </div>
            <div className="bg-[#f8faf9] p-4 rounded-2xl border border-slate-100 group-hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold">
                    12:30 PM
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Utensils className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <strong className="text-xs text-slate-900 font-bold">Lunch &amp; Break</strong>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Diurnal Window
                </span>
              </div>
              <p className="text-xs text-slate-700 font-semibold mb-1">
                Good time to step out • AQI ~132 (Moderate)
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Boundary layer expansion dilutes ground pollution. Best relative diurnal window for essential errands and brief controlled 10-minute home cross-ventilation.
              </p>
            </div>
          </div>

          {/* Item 4: 4:30 PM */}
          <div className="relative group">
            <div className="absolute -left-7 top-1.5 w-6 h-6 rounded-full bg-orange-400 ring-4 ring-orange-100 flex items-center justify-center text-white text-[10px] font-bold">
              ✓
            </div>
            <div className="bg-[#f8faf9] p-4 rounded-2xl border border-slate-100 group-hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 text-[11px] font-extrabold">
                    4:30 PM
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                    <Dumbbell className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <strong className="text-xs text-slate-900 font-bold">Evening Activity</strong>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Indoor Exercise
                </span>
              </div>
              <p className="text-xs text-slate-700 font-semibold mb-1">
                Do indoor exercise today • AQI ~176 (Moderate)
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Evening inversion commences by 5:30 PM. Keep exercise indoors (yoga, core, or stationary workouts) to protect alveolar airways from early evening aerosol accumulation.
              </p>
            </div>
          </div>

          {/* Item 5: 8:00 PM */}
          <div className="relative group">
            <div className="absolute -left-7 top-1.5 w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center text-white text-[10px] font-bold">
              ✓
            </div>
            <div className="bg-[#f8faf9] p-4 rounded-2xl border border-slate-100 group-hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                    8:00 PM
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Home className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <strong className="text-xs text-slate-900 font-bold">At Home</strong>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Sealed Windows
                </span>
              </div>
              <p className="text-xs text-slate-700 font-semibold mb-1">
                Ventilate briefly (if AQI &lt; 120) • Keep indoor air clean
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Keep windows tightly shut if outdoor PM2.5 is high. Run kitchen chimney during dinner preparation and isolate kitchen doors from bedroom quarters.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <span>Anti-idling rule: Switch off ignition at signals &gt;15s (PCRA benchmark).</span>
        <Link href="/indoor-coach" className="text-forest-700 font-bold hover:underline shrink-0">
          Indoor Air Guide →
        </Link>
      </div>
    </div>
  );
}
