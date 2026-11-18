'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  ShieldCheck, 
  Clock, 
  Leaf, 
  FileText, 
  ExternalLink, 
  X, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { calculateExplainableImpact } from '@/lib/engine/impact-engine';
import { TransportMode } from '@/lib/types/alternatives';

export default function ImpactPage() {
  const [distanceKm, setDistanceKm] = useState<number>(15);
  const [baselineMode, setBaselineMode] = useState<TransportMode>('SOLO_PETROL_CAR');
  const [adaptedMode, setAdaptedMode] = useState<TransportMode>('DELHI_METRO');
  const [hoursShifted, setHoursShifted] = useState<number>(2.5);
  const [showProofModal, setShowProofModal] = useState<boolean>(false);

  const impact = calculateExplainableImpact(distanceKm, baselineMode, adaptedMode, hoursShifted);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-forest-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Core Differentiator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explainable Impact Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Transparent mathematical decoupling of Personal Exposure, Local Tailpipe Particulates, and Greenhouse Gas (CO₂e) emissions.
          </p>
        </div>

        <button
          onClick={() => setShowProofModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs transition-colors shadow-xs shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>View Calculation Proof & Citations</span>
        </button>
      </div>

      {/* Scenario Adjuster Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Trip Distance: <strong className="text-forest-700">{distanceKm} km</strong>
          </label>
          <input
            type="range"
            min={3}
            max={40}
            step={1}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-forest-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Baseline Mode:
          </label>
          <select
            value={baselineMode}
            onChange={(e) => setBaselineMode(e.target.value as TransportMode)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            <option value="SOLO_PETROL_CAR">Solo Petrol Car</option>
            <option value="SOLO_DIESEL_CAR">Solo Diesel Car</option>
            <option value="MOTORCYCLE_125CC">Two-Wheeler Motorcycle</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Adapted Alternative:
          </label>
          <select
            value={adaptedMode}
            onChange={(e) => setAdaptedMode(e.target.value as TransportMode)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            <option value="DELHI_METRO">Electric Metro Train</option>
            <option value="ELECTRIC_BUS">AC Electric City Bus</option>
            <option value="CARPOOL_4P">Shared Carpool (4p)</option>
            <option value="CNG_BUS">CNG Municipal Bus</option>
          </select>
        </div>
      </div>

      {/* 3-Tier Impact Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: Personal Exposure Shift */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tier 1 Impact</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                Exposure Proxy
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Personal Exposure Shift
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Rescheduling daily outdoor errands from morning/evening thermal inversions to afternoon boundary-layer dispersion.
            </p>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 mb-4 text-center">
              <span className="block text-4xl font-black text-blue-900 mb-0.5">
                {impact.tier1Exposure.avoidedPeakSmogHours} hrs
              </span>
              <span className="text-xs font-semibold text-blue-800">
                Shifted away from Severe Smog (&gt;300 AQI)
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-normal">
            <strong>Scientific Caveat:</strong> {impact.tier1Exposure.medicalDisclaimer}
          </div>
        </div>

        {/* Tier 2: Local Tailpipe PM2.5 Avoided */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tier 2 Impact</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">
                Street-Level Particulate
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Local Tailpipe PM2.5 Avoided
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Fine toxic soot directly prevented from polluting neighborhood breathing zones along your route.
            </p>

            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 mb-4 text-center">
              <span className="block text-4xl font-black text-rose-900 mb-0.5">
                {impact.tier2LocalPm.avoidedTailpipePm25Grams} g
              </span>
              <span className="text-xs font-semibold text-rose-800">
                Tailpipe PM2.5 Prevented Locally
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-normal">
            <strong>Formula:</strong> {impact.tier2LocalPm.calculationEquation}
          </div>
        </div>

        {/* Tier 3: Greenhouse Gas Lifecycle Reduction */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tier 3 Impact</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                Global Climate
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Greenhouse Gas Reduction
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Avoided lifecycle carbon dioxide equivalent based on passenger-km and CEA Indian grid emissions factor.
            </p>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 mb-4 text-center">
              <span className="block text-4xl font-black text-emerald-900 mb-0.5">
                {impact.tier3Ghg.netAvoidedCo2eKg} kg
              </span>
              <span className="text-xs font-semibold text-emerald-800">
                CO₂e Lifecycle Savings per Journey
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-normal">
            <strong>Grid Constant:</strong> {impact.tier3Ghg.constantsUsed.gridFactor}
          </div>
        </div>
      </div>

      {/* Transparent Calculation Proof Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-forest-600" />
                <span>{impact.calculationProofModalData.title}</span>
              </h3>
              <button
                onClick={() => setShowProofModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 pt-4 text-xs text-slate-700">
              <div>
                <strong className="block text-slate-900 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Methodology & Mathematical Decoupling:
                </strong>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {impact.calculationProofModalData.methodology}
                </p>
              </div>

              <div>
                <strong className="block text-slate-900 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Calculation Formulas:
                </strong>
                <ul className="space-y-1.5 font-mono text-[11px] bg-slate-900 text-emerald-300 p-3 rounded-xl">
                  {impact.calculationProofModalData.formulas.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="block text-slate-900 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Key Assumptions:
                </strong>
                <ul className="space-y-1.5 list-disc pl-4 leading-relaxed">
                  {impact.calculationProofModalData.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="block text-slate-900 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Traceable Scientific Citations:
                </strong>
                <ul className="space-y-1.5 leading-relaxed text-slate-600">
                  {impact.calculationProofModalData.citations.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-forest-600 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowProofModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
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
