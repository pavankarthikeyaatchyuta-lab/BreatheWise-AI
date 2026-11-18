'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftRight, 
  Car, 
  Train, 
  Bike, 
  Bus, 
  Footprints, 
  ShieldAlert, 
  ArrowRight,
  TrendingDown,
  Info,
  Check
} from 'lucide-react';
import { TransportMode } from '@/lib/types/alternatives';
import { compareTransportAlternatives, TRANSPORT_FACTORS } from '@/lib/engine/alternatives';

export default function AlternativesPage() {
  const [distanceKm, setDistanceKm] = useState<number>(15);
  const [baselineMode, setBaselineMode] = useState<TransportMode>('SOLO_PETROL_CAR');

  const { baseline, alternatives } = compareTransportAlternatives(distanceKm, baselineMode);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-forest-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <ArrowLeftRight className="w-4 h-4" />
            <span>Transport & Lifestyle Comparator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sustainable Alternatives Switcher
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Evaluate passenger-kilometre (pkm) emissions, direct travel cost, and the critical trade-off between tailpipe emissions and personal smog exposure.
          </p>
        </div>

        <Link
          href="/impact"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-50 text-forest-800 hover:bg-forest-100 font-bold text-xs transition-colors border border-forest-200 shrink-0"
        >
          <span>View Mathematical Impact Proof</span>
          <ArrowRight className="w-4 h-4 text-forest-700" />
        </Link>
      </div>

      {/* Trip Configuration Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex-1 max-w-xs">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            One-Way Commute Distance: <strong className="text-forest-700 text-sm">{distanceKm} km</strong>
          </label>
          <input
            type="range"
            min={2}
            max={45}
            step={1}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-forest-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
            <span>2 km</span>
            <span>20 km</span>
            <span>45 km</span>
          </div>
        </div>

        <div className="flex-1 max-w-sm">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Current Commute Mode (Baseline):
          </label>
          <select
            value={baselineMode}
            onChange={(e) => setBaselineMode(e.target.value as TransportMode)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            <option value="SOLO_PETROL_CAR">Private Petrol Car (Solo)</option>
            <option value="SOLO_DIESEL_CAR">Private Diesel Car (Solo)</option>
            <option value="MOTORCYCLE_125CC">Two-Wheeler (Motorcycle 125cc)</option>
          </select>
        </div>
      </div>

      {/* Baseline Mode Card */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Current Baseline Commute
          </span>
          <h2 className="text-xl font-bold text-white mb-1">{baseline.name}</h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {baseline.exposureVsEmissionsTruth}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0 text-center">
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
            <span className="block text-[10px] uppercase text-slate-400 font-bold">Cost</span>
            <span className="text-lg font-black text-white">₹{baseline.totalCostInr}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
            <span className="block text-[10px] uppercase text-slate-400 font-bold">Duration</span>
            <span className="text-lg font-black text-white">{baseline.durationMinutes}m</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
            <span className="block text-[10px] uppercase text-slate-400 font-bold">CO₂e</span>
            <span className="text-lg font-black text-amber-400">{baseline.co2eKg} kg</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
            <span className="block text-[10px] uppercase text-slate-400 font-bold">Tailpipe PM</span>
            <span className="text-lg font-black text-rose-400">{baseline.tailpipePm25Grams} g</span>
          </div>
        </div>
      </div>

      {/* Alternatives Comparison Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Compare Available Commute Alternatives ({distanceKm} km single trip)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alternatives.map((alt) => {
            const co2Saved = Number((baseline.co2eKg - alt.co2eKg).toFixed(2));
            const costDiff = baseline.totalCostInr - alt.totalCostInr;
            const isCleaner = co2Saved > 0;

            return (
              <div
                key={alt.mode}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-forest-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      alt.exposureRiskLevel === 'LOW'
                        ? 'bg-emerald-100 text-emerald-800'
                        : alt.exposureRiskLevel === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {alt.exposureRiskLevel} Roadside Exposure
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Score: {alt.practicalityScore}/10
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{alt.name}</h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    {alt.exposureVsEmissionsTruth}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Estimated Cost</span>
                      <strong className="text-slate-900 font-black">₹{alt.totalCostInr}</strong>
                      <span className="text-[10px] text-forest-700 block font-semibold">
                        {costDiff > 0 ? `Saves ₹${costDiff}` : `+₹${Math.abs(costDiff)}`}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Travel Time</span>
                      <strong className="text-slate-900 font-black">{alt.durationMinutes} mins</strong>
                      <span className="text-[10px] text-slate-500 block">
                        at {TRANSPORT_FACTORS[alt.mode].averageSpeedKmph} km/h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">CO₂e Difference</span>
                    <span className={`font-black ${isCleaner ? 'text-forest-700' : 'text-slate-700'}`}>
                      {isCleaner ? `Avoids ${co2Saved} kg` : `+${Math.abs(co2Saved)} kg`}
                    </span>
                  </div>

                  <Link
                    href={`/impact?mode=${alt.mode}&dist=${distanceKm}`}
                    className="text-forest-700 hover:text-forest-800 font-bold flex items-center gap-1 text-xs"
                  >
                    <span>View Proof</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Scientific Honesty Panel: Exposure vs Emissions */}
      <div className="p-6 bg-amber-50/70 border border-amber-300 rounded-2xl shadow-xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-amber-950 uppercase tracking-wide">
              The Scientific Exposure vs. Emissions Reality (Crucial Medical Guidance)
            </h3>
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Never assume that lower emissions equals lower personal smog exposure.</strong> While walking or cycling produces zero vehicle emissions, physical aerobic exertion substantially increases respiratory minute ventilation (inhaled air volume per minute) compared to resting passengers.
            </p>
            <p className="text-xs text-amber-900 leading-relaxed">
              Walking along congested diesel corridors during peak winter smog leads to elevated particulate intake unless protected by an N95 respirator. Conversely, riding an electrified rapid transit system (like the Delhi Metro) combines high per-passenger carbon efficiency with a filtered, enclosed cabin that isolates commuters from toxic road-level exhaust wakes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
