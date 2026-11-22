'use client';

import React from 'react';
import { TransportMode } from '@/lib/types/alternatives';

interface CommuteFilterControlsProps {
  distanceKm: number;
  setDistanceKm: (dist: number) => void;
  baselineMode: TransportMode;
  setBaselineMode: (mode: TransportMode) => void;
  passengers: number;
  setPassengers: (passengers: number) => void;
}

export function CommuteFilterControls({
  distanceKm,
  setDistanceKm,
  baselineMode,
  setBaselineMode,
  passengers,
  setPassengers,
}: CommuteFilterControlsProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      {/* Distance Slider (5 cols) */}
      <div className="md:col-span-5">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="commute-distance-slider" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            One-Way Distance
          </label>
          <span className="text-sm font-extrabold text-forest-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {distanceKm} km
          </span>
        </div>
        <input
          id="commute-distance-slider"
          type="range"
          min={2}
          max={40}
          step={1}
          value={distanceKm}
          onChange={(e) => setDistanceKm(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0a3526]"
          aria-label="One-way commute distance in kilometers"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
          <span>2 km</span>
          <span>20 km</span>
          <span>40 km</span>
        </div>
      </div>

      {/* Baseline Mode (4 cols) */}
      <div className="md:col-span-4">
        <label htmlFor="baseline-mode-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Current Commute Mode
        </label>
        <select
          id="baseline-mode-select"
          value={baselineMode}
          onChange={(e) => setBaselineMode(e.target.value as TransportMode)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
        >
          <option value="SOLO_PETROL_CAR">Private Car (Petrol)</option>
          <option value="SOLO_DIESEL_CAR">Private Car (Diesel)</option>
          <option value="MOTORCYCLE_125CC">Two-Wheeler (Motorcycle 125cc)</option>
        </select>
      </div>

      {/* Passengers Counter (3 cols) */}
      <div className="md:col-span-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Passengers
        </label>
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-1.5 justify-between">
          <button
            type="button"
            onClick={() => setPassengers(Math.max(1, passengers - 1))}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 flex items-center justify-center transition-colors"
            aria-label="Decrease passenger count"
          >
            -
          </button>
          <span className="text-xs font-extrabold text-slate-800" aria-live="polite">
            {passengers}
          </span>
          <button
            type="button"
            onClick={() => setPassengers(Math.min(5, passengers + 1))}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 flex items-center justify-center transition-colors"
            aria-label="Increase passenger count"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
