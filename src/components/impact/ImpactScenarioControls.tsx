'use client';

import React from 'react';
import { TransportMode } from '@/lib/types/alternatives';

interface ImpactScenarioControlsProps {
  distanceKm: number;
  setDistanceKm: (dist: number) => void;
  baselineMode: TransportMode;
  setBaselineMode: (mode: TransportMode) => void;
  adaptedMode: TransportMode;
  setAdaptedMode: (mode: TransportMode) => void;
}

export function ImpactScenarioControls({
  distanceKm,
  setDistanceKm,
  baselineMode,
  setBaselineMode,
  adaptedMode,
  setAdaptedMode,
}: ImpactScenarioControlsProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs" role="region" aria-label="Trip Customization Simulator">
      <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
        Simulate Impact by Customizing Your Trip
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
            <label htmlFor="impact-distance-slider">Commute Distance:</label>
            <span className="text-emerald-800 font-extrabold">{distanceKm} km</span>
          </div>
          <input
            id="impact-distance-slider"
            type="range"
            min={3}
            max={35}
            step={1}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0a3526]"
            aria-label="Commute distance in kilometers"
          />
        </div>

        <div>
          <label htmlFor="impact-baseline-mode" className="block text-xs font-bold text-slate-700 mb-2">
            Baseline Mode:
          </label>
          <select
            id="impact-baseline-mode"
            value={baselineMode}
            onChange={(e) => setBaselineMode(e.target.value as TransportMode)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="SOLO_PETROL_CAR">Private Car (Petrol)</option>
            <option value="SOLO_DIESEL_CAR">Private Car (Diesel)</option>
            <option value="MOTORCYCLE_125CC">Two-Wheeler (Motorcycle 125cc)</option>
          </select>
        </div>

        <div>
          <label htmlFor="impact-adapted-mode" className="block text-xs font-bold text-slate-700 mb-2">
            Clean Alternative:
          </label>
          <select
            id="impact-adapted-mode"
            value={adaptedMode}
            onChange={(e) => setAdaptedMode(e.target.value as TransportMode)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="DELHI_METRO">Electric Metro Train</option>
            <option value="ELECTRIC_BUS">AC Electric City Bus</option>
            <option value="CARPOOL_4P">Shared Carpool (4 persons)</option>
            <option value="CNG_BUS">CNG Municipal Bus</option>
          </select>
        </div>
      </div>
    </div>
  );
}
