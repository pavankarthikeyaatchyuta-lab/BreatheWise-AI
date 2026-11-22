'use client';

import React from 'react';
import { 
  Users, 
  Baby, 
  UserCheck, 
  HeartPulse, 
  Train, 
  Edit3 
} from 'lucide-react';
import { HouseholdProfile } from '@/lib/types/user';

interface PlannerFamilyBarProps {
  profile: HouseholdProfile;
  updateProfile: (partial: Partial<HouseholdProfile>) => void;
  showConfig: boolean;
  setShowConfig: (show: boolean) => void;
}

export function PlannerFamilyBar({
  profile,
  updateProfile,
  showConfig,
  setShowConfig,
}: PlannerFamilyBarProps) {
  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            Your Family Profile:
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            <Users className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span>2 Adults</span>
          </span>
          {profile.hasInfantsOrChildren && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
              <Baby className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              <span>1 Child (6-12 yrs)</span>
            </span>
          )}
          {profile.hasElderly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200/60">
              <UserCheck className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
              <span>1 Elderly (60+ yrs)</span>
            </span>
          )}
          {profile.hasRespiratorySensitivity && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/60">
              <HeartPulse className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
              <span>Asthma Sensitivity</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            <Train className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            <span>Commute: {profile.primaryCommuteMode.replace('_', ' ')} ({profile.commuteDistanceKm} km)</span>
          </span>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-1.5 text-xs font-bold text-forest-700 hover:text-forest-800 px-3 py-1 rounded-full hover:bg-emerald-50 transition-colors"
          aria-expanded={showConfig}
          aria-label={showConfig ? 'Close Family Profile Customizer' : 'Edit Family Profile Customizer'}
        >
          <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{showConfig ? 'Close Profile' : 'Edit Profile'}</span>
        </button>
      </div>

      {showConfig && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm animate-in fade-in duration-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Customize Family Constraints (Stored Locally • Non-Medical)
            </h3>
            <span className="text-[11px] text-slate-400">Updates deterministic engine in real-time</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <label
              htmlFor="planner-children"
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                profile.hasInfantsOrChildren ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <input
                id="planner-children"
                type="checkbox"
                checked={profile.hasInfantsOrChildren}
                onChange={(e) => updateProfile({ hasInfantsOrChildren: e.target.checked })}
                className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Children in Home</span>
                <span className="text-[11px] text-slate-500">Adapts school timing &amp; sports</span>
              </div>
            </label>

            <label
              htmlFor="planner-elderly"
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                profile.hasElderly ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <input
                id="planner-elderly"
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

            <label
              htmlFor="planner-respiratory"
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                profile.hasRespiratorySensitivity ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <input
                id="planner-respiratory"
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
              <label htmlFor="commute-mode-select" className="text-xs font-bold text-slate-900 block mb-1">
                Commute Mode
              </label>
              <select
                id="commute-mode-select"
                value={profile.primaryCommuteMode}
                onChange={(e) => updateProfile({ primaryCommuteMode: e.target.value as HouseholdProfile['primaryCommuteMode'] })}
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
    </>
  );
}
