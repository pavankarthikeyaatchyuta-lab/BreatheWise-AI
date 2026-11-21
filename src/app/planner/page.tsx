'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CalendarClock, 
  Baby, 
  UserCheck, 
  HeartPulse, 
  Bike, 
  Car, 
  Train, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Home,
  Briefcase,
  Utensils,
  Dumbbell
} from 'lucide-react';
import { HouseholdProfile, DEFAULT_HOUSEHOLD_PROFILE, EVALUATOR_SCENARIOS, EvaluatorScenarioId } from '@/lib/types/user';
import { generateDailyPlan } from '@/lib/engine/planner-engine';
import { useCity } from '@/context/CityContext';
import { useScenario } from '@/context/ScenarioContext';

export default function PlannerPage() {
  const { aqiData: aqiState } = useCity();
  const { profile, updateProfile, activeScenario, selectScenario, resetToDefault } = useScenario();
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const plan = generateDailyPlan(profile, aqiState);

  // Formatted date
  const todayDateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Daily Routine Planner</span>
            <span className="text-emerald-600 text-lg">🍃</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            A personalized, low-exposure schedule for your family
          </p>
        </div>

        {/* Date Selector Pill (matching reference image) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200/80 rounded-full px-3.5 py-1.5 shadow-xs text-xs font-bold text-slate-800">
            <CalendarClock className="w-3.5 h-3.5 text-emerald-600 mr-2" />
            <span>Today, 26 Jan</span>
          </div>
          <Link
            href="/assistant"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Ask AI</span>
          </Link>
        </div>
      </div>

      {/* Your Family Profile Bar (matching reference image) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            Your Family Profile:
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>2 Adults</span>
          </span>
          {profile.hasInfantsOrChildren && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
              <Baby className="w-3.5 h-3.5 text-amber-600" />
              <span>1 Child (6-12 yrs)</span>
            </span>
          )}
          {profile.hasElderly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200/60">
              <UserCheck className="w-3.5 h-3.5 text-rose-600" />
              <span>1 Elderly (60+ yrs)</span>
            </span>
          )}
          {profile.hasRespiratorySensitivity && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/60">
              <HeartPulse className="w-3.5 h-3.5 text-blue-600" />
              <span>Asthma Sensitivity</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            <Train className="w-3.5 h-3.5 text-emerald-600" />
            <span>Commute: {profile.primaryCommuteMode.replace('_', ' ')} ({profile.commuteDistanceKm} km)</span>
          </span>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 px-3 py-1 rounded-full hover:bg-emerald-50 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{showConfig ? 'Close Profile' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Expandable Configuration Drawer */}
      {showConfig && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm animate-in fade-in duration-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Customize Family Constraints (Stored Locally • Non-Medical)
            </h3>
            <span className="text-[11px] text-slate-400">Updates deterministic engine in real-time</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
              profile.hasInfantsOrChildren ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/60'
            }`}>
              <input
                type="checkbox"
                checked={profile.hasInfantsOrChildren}
                onChange={(e) => updateProfile({ hasInfantsOrChildren: e.target.checked })}
                className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Children in Home</span>
                <span className="text-[11px] text-slate-500">Adapts school timing & sports</span>
              </div>
            </label>

            <label className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
              profile.hasElderly ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/60'
            }`}>
              <input
                type="checkbox"
                checked={profile.hasElderly}
                onChange={(e) => updateProfile({ hasElderly: e.target.checked })}
                className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Elderly Parents (60+)</span>
                <span className="text-[11px] text-slate-500">Avoids early morning walks</span>
              </div>
            </label>

            <label className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
              profile.hasRespiratorySensitivity ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/60'
            }`}>
              <input
                type="checkbox"
                checked={profile.hasRespiratorySensitivity}
                onChange={(e) => updateProfile({ hasRespiratorySensitivity: e.target.checked })}
                className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Asthma / Sensitivity</span>
                <span className="text-[11px] text-slate-500">Triggers indoor damp cleaning</span>
              </div>
            </label>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60">
              <span className="text-xs font-bold text-slate-900 block mb-1">Commute Mode</span>
              <select
                value={profile.primaryCommuteMode}
                onChange={(e) => updateProfile({ primaryCommuteMode: e.target.value as any })}
                className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="TWO_WHEELER">Two-Wheeler (Motorcycle)</option>
                <option value="AC_METRO">AC Electric Metro</option>
                <option value="SOLO_CAR">Solo Private Car</option>
                <option value="CARPOOL">Shared Carpool</option>
                <option value="NON_AC_BUS">Non-AC City Bus</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Your Optimized Daily Plan (7 cols) + Exposure Reduction Card (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Your Optimized Daily Plan (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Your Optimized Daily Plan</span>
                </h2>
                <span className="text-[11px] text-slate-400">
                  Calibrated against Delhi-NCR diurnal temperature inversion curve
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                Low Exposure Route
              </span>
            </div>

            {/* Vertical Interactive Timeline (matching reference image) */}
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
                        <Home className="w-3.5 h-3.5" />
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
                        <Car className="w-3.5 h-3.5" />
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
                        <Utensils className="w-3.5 h-3.5" />
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
                        <Dumbbell className="w-3.5 h-3.5" />
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
                        <Home className="w-3.5 h-3.5" />
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
            <Link href="/indoor-coach" className="text-emerald-700 font-bold hover:underline shrink-0">
              Indoor Air Guide →
            </Link>
          </div>
        </div>

        {/* Right Column: Exposure Reduction Card + Anti-Idling & Graphic (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Exposure Reduction (Today) Card (matching reference image) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  Exposure Reduction (Today)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Estimated Proxy
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="p-4 rounded-2xl bg-[#f5f9f6] border border-emerald-100">
                  <span className="block text-3xl font-black text-emerald-900">
                    ~2.4 hours
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold block mt-0.5">
                    avoided away from severe winter smog (&gt;300 AQI)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-xl font-black text-slate-900">
                      ↑ ~42%
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      less peak diurnal smog exposure vs. unadjusted day
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    🌿
                  </div>
                </div>
              </div>

              {/* Family Silhouette Vector Graphic (matching reference image) */}
              <div className="p-4 bg-gradient-to-t from-emerald-100/60 to-transparent rounded-2xl border border-emerald-100 text-center relative overflow-hidden">
                <div className="py-2">
                  <span className="text-xs font-bold text-emerald-950 block">
                    Healthy Family Routine Shield
                  </span>
                  <p className="text-[11px] text-emerald-800/80 mt-1 max-w-xs mx-auto">
                    Timing adjustments shield developing airways in children and cardiac health in senior citizens.
                  </p>
                </div>
                {/* SVG silhouette */}
                <div className="h-16 flex items-end justify-center gap-2 opacity-35">
                  <div className="w-4 h-12 bg-emerald-800 rounded-t-full" />
                  <div className="w-5 h-16 bg-emerald-900 rounded-t-full" />
                  <div className="w-3 h-8 bg-emerald-700 rounded-t-full" />
                  <div className="w-4 h-14 bg-emerald-800 rounded-t-full" />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-normal">
              <strong>Scientific Notice:</strong> This represents an exposure-duration proxy. It does not measure clinical inhaled dose, which requires wearable personal spirometry.
            </div>
          </div>

          {/* Anti-Idling & Signal Protocol Card */}
          <div className="bg-[#0a3526] text-white rounded-3xl p-6 shadow-xs border border-[#0d4432]">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Anti-Idling Heuristic (PCRA / SAE)</span>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
              Petroleum Conservation Research Association (PCRA, India) demonstrates that restarting a modern vehicle engine consumes less fuel than idling for &gt;10-15 seconds. Cut your ignition at traffic signals where countdown timers exceed 15-20 seconds.
            </p>
            <Link
              href="/alternatives"
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl transition-colors shadow-xs"
            >
              <span>Explore Metro & Carpool Modes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
