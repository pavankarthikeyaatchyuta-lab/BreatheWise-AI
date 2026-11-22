'use client';

import React from 'react';
import { Cpu, Layers, CheckCircle2 } from 'lucide-react';

export function ArchitectureShowcase() {
  return (
    <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6" aria-label="System Architecture">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-forest-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Engineering Architecture
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Dual-Layer Intelligence Model
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Separating natural-language personalization from deterministic mathematical calculations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-forest-700 font-bold text-sm">
            <Cpu className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Layer 1: Grounded Generative AI</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Google Gemini API Orchestration</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>Multilingual interaction in English, Hindi (हिन्दी), and Telugu (తెలుగు)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>Two-stage prompt guardrails rejecting jailbreaks &amp; system prompt extraction</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>Strict runtime Zod input/output schema validation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>7-second timeout coupled with AbortController cancellation</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
            <Layers className="w-4 h-4 text-blue-600" aria-hidden="true" />
            <span>Layer 2: Deterministic Environmental Engine</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">CPCB &amp; Regulatory Math</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
              <span>Piecewise linear interpolation across all 8 criteria pollutants</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
              <span>Continuous midpoint boundary interpolation preventing null gaps</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
              <span>Statutory 16-hour monitored completeness validation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
              <span>Central Electricity Authority (CEA) v22.0 grid factors (0.675 kg CO₂/kWh)</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
