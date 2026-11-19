'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Leaf, 
  CloudRain, 
  FileText, 
  ExternalLink, 
  X, 
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { calculateExplainableImpact } from '@/lib/engine/impact-engine';
import { TransportMode } from '@/lib/types/alternatives';

export default function ImpactPage() {
  const [distanceKm, setDistanceKm] = useState<number>(14);
  const [baselineMode, setBaselineMode] = useState<TransportMode>('SOLO_PETROL_CAR');
  const [adaptedMode, setAdaptedMode] = useState<TransportMode>('DELHI_METRO');
  const [hoursShifted, setHoursShifted] = useState<number>(2.4);
  const [showProofModal, setShowProofModal] = useState<boolean>(false);

  const impact = calculateExplainableImpact(distanceKm, baselineMode, adaptedMode, hoursShifted);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Explainable Impact Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explainable Impact Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Understand the real impact of your daily choices, with transparent calculations.
          </p>
        </div>

        <button
          onClick={() => setShowProofModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors border border-emerald-200 shrink-0 self-start md:self-auto"
        >
          <FileText className="w-4 h-4 text-emerald-700" />
          <span>View Calculation Proof</span>
        </button>
      </div>

      {/* Main Impact Card: 3 Big Metric Columns + Hands Holding Green Earth Graphic */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: 3 Metric Cards Grid */}
          <div className="w-full lg:flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Your Impact (Today vs. Baseline)
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                14 km commute • Adapted schedule
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Metric 1: Exposure Shift */}
              <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-100 flex flex-col justify-between hover:border-sky-200 transition-all">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Exposure Shift
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-sky-950 mt-1">
                    -{hoursShifted} hrs
                  </div>
                </div>
                <p className="text-[11px] text-sky-800 mt-3 font-medium">
                  away from high pollution (&gt;300 AQI)
                </p>
              </div>

              {/* Metric 2: Local PM2.5 Avoided */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between hover:border-emerald-200 transition-all">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Local PM₂.₅ Avoided
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
                    -{impact.tier2LocalPm.avoidedTailpipePm25Grams} g
                  </div>
                </div>
                <p className="text-[11px] text-emerald-800 mt-3 font-medium">
                  ~{(impact.tier2LocalPm.avoidedTailpipePm25Grams * 90).toFixed(0)} g / 3 months in your city
                </p>
              </div>

              {/* Metric 3: CO2e Reduction */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col justify-between hover:border-indigo-200 transition-all">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                    <CloudRain className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    CO₂e Reduction
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-950 mt-1">
                    -{impact.tier3Ghg.netAvoidedCo2eKg} kg
                  </div>
                </div>
                <p className="text-[11px] text-indigo-800 mt-3 font-medium">
                  ~{(impact.tier3Ghg.netAvoidedCo2eKg * 26).toFixed(1)} kg / month (CEA grid factor)
                </p>
              </div>
            </div>
          </div>

          {/* Right: Hands Holding Earth Vector Art */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 shrink-0 relative flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer soft glowing halo */}
              <circle cx="100" cy="95" r="55" fill="#dcfce7" opacity="0.6" />
              
              {/* Earth Globe */}
              <circle cx="100" cy="95" r="42" fill="#38bdf8" />
              {/* Continents */}
              <path d="M85 70 Q92 65 105 72 Q115 78 120 70 Q125 80 120 90 Q110 92 100 88 Q90 92 82 82 Z" fill="#22c55e" />
              <path d="M90 100 Q100 95 110 102 Q115 115 108 125 Q95 125 88 115 Z" fill="#22c55e" />
              <path d="M70 85 Q78 80 76 95 Q70 100 65 92 Z" fill="#22c55e" />
              <path d="M125 100 Q135 102 138 110 Q130 118 122 110 Z" fill="#22c55e" />

              {/* Plant sprouting on top of Earth */}
              <path d="M100 54 Q100 42 100 34" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M100 42 Q92 38 88 44 Q90 50 100 46" fill="#16a34a" />
              <path d="M100 38 Q108 34 112 40 Q110 46 100 42" fill="#22c55e" />

              {/* Caring Cupped Hands underneath */}
              {/* Left Hand */}
              <path d="M55 130 C60 145 75 160 92 165 C96 166 100 162 98 158 C92 145 88 135 85 125 C80 120 65 122 55 130 Z" fill="#fcd34d" opacity="0.9" />
              {/* Right Hand */}
              <path d="M145 130 C140 145 125 160 108 165 C104 166 100 162 102 158 C108 145 112 135 115 125 C120 120 135 122 145 130 Z" fill="#fcd34d" opacity="0.9" />
              {/* Sleeves / Cuffs */}
              <rect x="45" y="142" width="22" height="14" rx="4" fill="#047857" transform="rotate(-30 45 142)" />
              <rect x="135" y="132" width="22" height="14" rx="4" fill="#047857" transform="rotate(30 135 132)" />

              {/* Floating sparkles */}
              <circle cx="65" cy="60" r="3" fill="#facc15" />
              <circle cx="145" cy="65" r="2.5" fill="#facc15" />
              <circle cx="150" cy="115" r="2" fill="#34d399" />
            </svg>
          </div>
        </div>
      </div>

      {/* Calculation Proof Teaser Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              How We Calculate This?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              See the formulas, emission factors and assumptions used for these results.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowProofModal(true)}
          className="px-5 py-2.5 rounded-full bg-[#0a3526] hover:bg-[#0d402f] text-white font-bold text-xs transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <span>View Calculation Proof</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scenario Adjuster */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
          Simulate Impact by Customizing Your Trip
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Commute Distance:</span>
              <span className="text-emerald-800 font-extrabold">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min={3}
              max={35}
              step={1}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0a3526]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Baseline Mode:
            </label>
            <select
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
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Clean Alternative:
            </label>
            <select
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

      {/* Transparent Calculation Proof Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Transparent Calculation Proof
                  </h2>
                  <span className="text-xs text-slate-500">
                    Direct Formulas, Emission Factors &amp; Data Provenance
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowProofModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs text-slate-700">
              {/* Tier 1 Proof */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
                <span className="font-bold text-sky-950 block mb-1 text-sm">
                  Tier 1: Personal Exposure Time Shift (Behavioral Proxy)
                </span>
                <p className="text-sky-900 leading-relaxed mb-2">
                  Shifted <strong>{hoursShifted} hours</strong> of high-exertion outdoor activity away from peak smog hours (&gt;300 AQI) to midday/indoor hours.
                </p>
                <div className="p-3 bg-white/90 rounded-xl font-mono text-[11px] text-slate-800 border border-sky-200">
                  {impact.calculationProofModalData.formulas[0]}
                </div>
                <span className="text-[10px] text-sky-800 mt-2 block">
                  {impact.tier1Exposure.medicalDisclaimer}
                </span>
              </div>

              {/* Tier 2 Proof */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <span className="font-bold text-emerald-950 block mb-1 text-sm">
                  Tier 2: Local Tailpipe PM₂.₅ Avoided
                </span>
                <p className="text-emerald-900 leading-relaxed mb-2">
                  Avoided <strong>{impact.tier2LocalPm.avoidedTailpipePm25Grams} g</strong> of particulate matter in ground-level breathing zone.
                </p>
                <div className="p-3 bg-white/90 rounded-xl font-mono text-[11px] text-slate-800 border border-emerald-200">
                  {impact.tier2LocalPm.calculationEquation}
                </div>
                <div className="mt-2 text-[11px] text-emerald-900">
                  Source: {impact.tier2LocalPm.sourceCitation}
                </div>
              </div>

              {/* Tier 3 Proof */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <span className="font-bold text-indigo-950 block mb-1 text-sm">
                  Tier 3: Greenhouse Gas (CO₂e) Reduction
                </span>
                <p className="text-indigo-900 leading-relaxed mb-2">
                  Avoided <strong>{impact.tier3Ghg.netAvoidedCo2eKg} kg CO₂e</strong> across the power grid and vehicle fleet.
                </p>
                <div className="p-3 bg-white/90 rounded-xl font-mono text-[11px] text-slate-800 border border-indigo-200">
                  {impact.tier3Ghg.calculationEquation}
                </div>
                <div className="mt-2 text-[11px] text-indigo-900 space-y-1">
                  <div>• Baseline factor: {impact.tier3Ghg.constantsUsed.baselineFactor}</div>
                  <div>• Adapted factor: {impact.tier3Ghg.constantsUsed.adaptedFactor}</div>
                  <div>• Grid factor: {impact.tier3Ghg.constantsUsed.gridFactor}</div>
                </div>
              </div>

              {/* Academic & Regulatory Citations */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-2">
                  Official Academic &amp; Regulatory Citations:
                </span>
                <ul className="space-y-1 text-slate-600">
                  {impact.calculationProofModalData.citations.map((cite: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold text-emerald-700">[{i + 1}]</span>
                      <span>{cite}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowProofModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#0a3526] hover:bg-[#0d402f] text-white text-xs font-bold transition-colors"
              >
                Close Proof
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
