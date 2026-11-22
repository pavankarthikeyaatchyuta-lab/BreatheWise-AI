'use client';

import React from 'react';
import { Clock, Leaf, CloudRain } from 'lucide-react';
import { ExplainableImpactResult } from '@/lib/engine/impact-engine';

interface DecoupledMetricCardsProps {
  impact: ExplainableImpactResult;
  hoursShifted: number;
}

export function DecoupledMetricCards({ impact, hoursShifted }: DecoupledMetricCardsProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs" role="region" aria-label="Decoupled Impact Metrics">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: 3 Metric Cards Grid */}
        <div className="w-full lg:flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Impact (Today vs. Baseline)</h2>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200 inline-block mt-0.5">
                Modelled Estimates (ARAI &amp; CEA Database v22.0)
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              14 km commute • Heuristic Schedule
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Metric 1: Exposure Shift */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-100 flex flex-col justify-between hover:border-sky-200 transition-all">
              <div>
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Exposure Window Shift
                </span>
                <div className="text-2xl sm:text-3xl font-black text-sky-950 mt-1">
                  -{hoursShifted} hrs
                </div>
              </div>
              <p className="text-[11px] text-sky-800 mt-3 font-medium">
                Behavioral shift away from peak smog (&gt;300 AQI window)
              </p>
            </div>

            {/* Metric 2: Local PM2.5 Avoided */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between hover:border-emerald-200 transition-all">
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <Leaf className="w-5 h-5" aria-hidden="true" />
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
                  <CloudRain className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  CO₂e Reduction
                </span>
                <div className="text-2xl sm:text-3xl font-black text-indigo-950 mt-1">
                  -{impact.tier3Ghg.netAvoidedCo2eKg} kg
                </div>
              </div>
              <p className="text-[11px] text-indigo-800 mt-3 font-medium">
                ~{(impact.tier3Ghg.netAvoidedCo2eKg * 26).toFixed(1)} kg / month (CEA v22.0 grid factor)
              </p>
            </div>
          </div>
        </div>

        {/* Right: Hands Holding Earth Vector Art */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 shrink-0 relative flex items-center justify-center" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="95" r="55" fill="#dcfce7" opacity="0.6" />
            <circle cx="100" cy="95" r="42" fill="#38bdf8" />
            <path d="M85 70 Q92 65 105 72 Q115 78 120 70 Q125 80 120 90 Q110 92 100 88 Q90 92 82 82 Z" fill="#22c55e" />
            <path d="M90 100 Q100 95 110 102 Q115 115 108 125 Q95 125 88 115 Z" fill="#22c55e" />
            <path d="M70 85 Q78 80 76 95 Q70 100 65 92 Z" fill="#22c55e" />
            <path d="M125 100 Q135 102 138 110 Q130 118 122 110 Z" fill="#22c55e" />
            <path d="M100 54 Q100 42 100 34" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M100 42 Q92 38 88 44 Q90 50 100 46" fill="#16a34a" />
            <path d="M100 38 Q108 34 112 40 Q110 46 100 42" fill="#22c55e" />
            <path d="M55 130 C60 145 75 160 92 165 C96 166 100 162 98 158 C92 145 88 135 85 125 C80 120 65 122 55 130 Z" fill="#fcd34d" opacity="0.9" />
            <path d="M145 130 C140 145 125 160 108 165 C104 166 100 162 102 158 C108 145 112 135 115 125 C120 120 135 122 145 130 Z" fill="#fcd34d" opacity="0.9" />
            <rect x="45" y="142" width="22" height="14" rx="4" fill="#047857" transform="rotate(-30 45 142)" />
            <rect x="135" y="132" width="22" height="14" rx="4" fill="#047857" transform="rotate(30 135 132)" />
            <circle cx="65" cy="60" r="3" fill="#facc15" />
            <circle cx="145" cy="65" r="2.5" fill="#facc15" />
            <circle cx="150" cy="115" r="2" fill="#34d399" />
          </svg>
        </div>
      </div>
    </div>
  );
}
