'use client';

import React from 'react';
import { Activity, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface DiurnalInversionSandboxProps {
  simHour: number;
  setSimHour: (hour: number) => void;
}

export function DiurnalInversionSandbox({
  simHour,
  setSimHour,
}: DiurnalInversionSandboxProps) {
  const isInversion = simHour < 10 || simHour >= 19;
  const mixingHeight = isInversion
    ? Math.round(150 + ((simHour < 10 ? simHour : 24 - simHour) * 15))
    : Math.round(850 + (15 - Math.abs(14 - simHour)) * 30);
  const relativeDispersion = isInversion ? 'Severe Particulate Trapping' : 'Thermal Convective Dilution';

  return (
    <section
      className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 space-y-6"
      aria-label="Diurnal Physics Simulator"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 mb-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>Atmospheric Physics Explorer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Diurnal Boundary Layer Inversion Simulator
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Observe how nocturnal radiative cooling traps surface aerosols in the morning vs how solar convection disperses smog during midday.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setSimHour(7)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              simHour === 7 ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            aria-pressed={simHour === 7}
          >
            07:00 AM (Inversion)
          </button>
          <button
            type="button"
            onClick={() => setSimHour(14)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              simHour === 14 ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            aria-pressed={simHour === 14}
          >
            14:00 PM (Midday Dip)
          </button>
        </div>
      </div>

      {/* Simulator Display & Interactive Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <label htmlFor="hour-slider" className="text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Simulated Time of Day: {simHour.toString().padStart(2, '0')}:00 hrs</span>
              </label>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                isInversion ? 'bg-rose-900/60 text-rose-300 border border-rose-700/50' : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
              }`}>
                {isInversion ? 'Thermal Inversion Active' : 'Boundary Layer Expansion'}
              </span>
            </div>

            <input
              id="hour-slider"
              type="range"
              min="0"
              max="23"
              value={simHour}
              onChange={(e) => setSimHour(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Adjust hour of day to simulate boundary layer changes"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>00:00 (Midnight)</span>
              <span>07:00 (Morning Peak)</span>
              <span>14:00 (Afternoon Dip)</span>
              <span>21:00 (Night Inversion)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              {isInversion ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              )}
              <h3 className="text-xs font-bold text-white tracking-wide">
                {isInversion
                  ? 'Severe Surface Particulate Trapping (Shallow Mixing Height)'
                  : 'Atmospheric Boundary Layer Deepening (Midday Relative Low)'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isInversion
                ? 'Ground surface cools faster than the air above, creating a temperature inversion layer. Particulate matter from vehicular emissions and biomass cannot rise and disperses horizontally at nose-level.'
                : 'Solar irradiation heats the ground, creating vertical thermal convective currents. The planetary boundary layer expands up to ~1000m, yielding maximum vertical dilution of aerosols.'}
            </p>
          </div>
        </div>

        {/* Visual Mixing Height Atmospheric Column */}
        <div className="lg:col-span-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between h-56 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs z-10">
            <span className="font-bold text-slate-400">Atmospheric Column</span>
            <span className="font-mono text-emerald-400 text-xs">PBL Height: ~{mixingHeight}m</span>
          </div>

          <div className="relative w-full h-32 my-auto bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800 flex flex-col justify-end">
            <div
              className={`w-full transition-all duration-300 flex items-center justify-center text-[11px] font-bold ${
                isInversion
                  ? 'bg-gradient-to-t from-rose-900/80 to-rose-700/40 text-rose-200'
                  : 'bg-gradient-to-t from-emerald-900/80 to-teal-700/30 text-emerald-200'
              }`}
              style={{ height: `${Math.min(Math.max((mixingHeight / 1100) * 100, 15), 100)}%` }}
            >
              <span>{isInversion ? 'Trap Zone (<250m)' : 'Convection Zone (>800m)'}</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex justify-between items-center z-10 pt-1">
            <span>Status: {relativeDispersion}</span>
            <span className="font-semibold text-slate-300">Ground Surface Level (0m)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
