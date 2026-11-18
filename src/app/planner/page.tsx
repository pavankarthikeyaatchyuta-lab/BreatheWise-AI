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
  CheckCircle2
} from 'lucide-react';
import { HouseholdProfile, DEFAULT_HOUSEHOLD_PROFILE } from '@/lib/types/user';
import { generateDailyPlan } from '@/lib/engine/planner-engine';
import { getDelhiDemoState } from '@/lib/aqi/demo-data';

export default function PlannerPage() {
  const [profile, setProfile] = useState<HouseholdProfile>(DEFAULT_HOUSEHOLD_PROFILE);
  const aqiState = getDelhiDemoState();
  const plan = generateDailyPlan(profile, aqiState);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-forest-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <CalendarClock className="w-4 h-4" />
            <span>Decision Support Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Smart Daily Routine Planner
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Personalized schedule adaptation based on diurnal boundary-layer shifts and your household&apos;s lifestyle constraints.
          </p>
        </div>

        <Link
          href="/assistant"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-xs transition-colors border border-purple-200 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Ask AI to Fine-tune Schedule</span>
        </Link>
      </div>

      {/* Profile & Constraints Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Household Profile & Vulnerability Constraints
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          All settings are optional and stored locally in your browser. No sensitive medical diagnoses are collected.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Vulnerability Checkbox 1 */}
          <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
            profile.hasInfantsOrChildren ? 'border-forest-500 bg-forest-50/50' : 'border-slate-200 bg-slate-50'
          }`}>
            <input
              type="checkbox"
              checked={profile.hasInfantsOrChildren}
              onChange={(e) => setProfile({ ...profile, hasInfantsOrChildren: e.target.checked })}
              className="mt-1 rounded text-forest-600 focus:ring-forest-500"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-forest-700" />
                Infants / School Children
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Adapts school drop-off and cancels morning outdoor sports.
              </p>
            </div>
          </label>

          {/* Vulnerability Checkbox 2 */}
          <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
            profile.hasElderly ? 'border-forest-500 bg-forest-50/50' : 'border-slate-200 bg-slate-50'
          }`}>
            <input
              type="checkbox"
              checked={profile.hasElderly}
              onChange={(e) => setProfile({ ...profile, hasElderly: e.target.checked })}
              className="mt-1 rounded text-forest-600 focus:ring-forest-500"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-forest-700" />
                Senior Citizens (60+)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Reschedules early morning walks to prevent cold-air cardiovascular strain.
              </p>
            </div>
          </label>

          {/* Vulnerability Checkbox 3 */}
          <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
            profile.hasRespiratorySensitivity ? 'border-forest-500 bg-forest-50/50' : 'border-slate-200 bg-slate-50'
          }`}>
            <input
              type="checkbox"
              checked={profile.hasRespiratorySensitivity}
              onChange={(e) => setProfile({ ...profile, hasRespiratorySensitivity: e.target.checked })}
              className="mt-1 rounded text-forest-600 focus:ring-forest-500"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-forest-700" />
                Asthma / Allergy Sensitivity
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Triggers indoor wet mopping alerts and inhaler access reminders.
              </p>
            </div>
          </label>

          {/* Commute Mode Selector */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-900 mb-1">Primary Commute Mode</span>
            <select
              value={profile.primaryCommuteMode}
              onChange={(e) => setProfile({ ...profile, primaryCommuteMode: e.target.value as any })}
              className="bg-white border border-slate-300 text-xs rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="TWO_WHEELER">Two-Wheeler (Motorcycle/Scooter)</option>
              <option value="OPEN_AUTO">Open Auto-Rickshaw</option>
              <option value="NON_AC_BUS">Non-AC Municipal Bus</option>
              <option value="AC_METRO">AC Electric Metro Train</option>
              <option value="SOLO_CAR">Private Car (Solo)</option>
              <option value="CARPOOL">Shared Carpool</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1">
              Distance: {profile.commuteDistanceKm} km each way
            </span>
          </div>
        </div>
      </div>

      {/* Advisory Banner & Relative Diurnal Low Alert */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>Smog Inversion Advisory for {aqiState.city}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{plan.overallAdvisory}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {plan.relativeLowWindow.advisory}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Peak Smog Windows: <strong>06:00-09:30 & 19:30-23:00</strong></span>
            <span className="text-emerald-400 font-semibold">Relative Low: {plan.relativeLowWindow.start} - {plan.relativeLowWindow.end}</span>
          </div>
        </div>

        {/* Anti-Idling Card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col justify-between text-emerald-950">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Anti-Idling Protocol</span>
            </span>
            <p className="text-xs leading-relaxed text-emerald-900">
              {plan.vehicleIdlingWarning}
            </p>
          </div>
          <div className="mt-4 text-[11px] font-medium text-emerald-700 bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-200/60">
            Restarting uses less fuel than idling for &gt;10 seconds.
          </div>
        </div>
      </div>

      {/* Vulnerability Alerts (if any triggered) */}
      {plan.vulnerabilitySpecificAlerts.length > 0 && (
        <div className="space-y-2">
          {plan.vulnerabilitySpecificAlerts.map((alert, idx) => (
            <div key={idx} className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{alert}</span>
            </div>
          ))}
        </div>
      )}

      {/* Adapted Daily Schedule Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Tailored Daily Schedule Adaptation
            </h2>
            <p className="text-xs text-slate-500">
              Comparing standard daily routines against exposure-minimized schedules.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
            {plan.date}
          </span>
        </div>

        <div className="space-y-4">
          {plan.activities.map((act) => (
            <div
              key={act.id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900">{act.title}</span>
                  {act.protectionRequired === 'N95_RESPIRATOR' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase tracking-wide">
                      N95 Required
                    </span>
                  )}
                  {act.adaptedLocation === 'INDOOR' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                      Shifted Indoor
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  {act.reasonForChange}
                </p>
              </div>

              {/* Time Adaptation Pill */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Original</span>
                  <span className="text-xs font-bold text-slate-500 line-through">{act.originalTime}</span>
                </div>
                <div className="text-forest-600 font-bold">→</div>
                <div className="text-left bg-white px-3 py-1.5 rounded-lg border border-forest-200 shadow-2xs">
                  <span className="block text-[10px] uppercase tracking-wider text-forest-700 font-bold">Adapted</span>
                  <span className="text-sm font-black text-forest-900">{act.adaptedTime || act.originalTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA to Alternatives */}
      <div className="p-6 bg-gradient-to-r from-forest-800 to-emerald-700 rounded-2xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Need a Lower-Emission Commute?</h3>
          <p className="text-xs text-forest-100 mt-0.5">
            Compare solo driving vs electric metro vs carpooling with passenger-km CO₂e and exposure trade-offs.
          </p>
        </div>
        <Link
          href="/alternatives"
          className="px-5 py-2.5 rounded-xl bg-white text-forest-900 font-bold text-xs hover:bg-forest-50 transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
        >
          <span>Compare Commutes</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
