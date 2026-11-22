'use client';

import React from 'react';
import { FileText, X } from 'lucide-react';
import { ExplainableImpactResult } from '@/lib/engine/impact-engine';

interface FormulaProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  impact: ExplainableImpactResult;
  hoursShifted: number;
}

export function FormulaProofModal({
  isOpen,
  onClose,
  impact,
  hoursShifted,
}: FormulaProofModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proof-modal-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="proof-modal-title" className="text-lg font-bold text-slate-900">
                Transparent Calculation Proof
              </h2>
              <span className="text-xs text-slate-500">
                Direct Formulas, Emission Factors &amp; Data Provenance
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close calculation proof modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
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
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0a3526] hover:bg-[#0d402f] text-white text-xs font-bold transition-colors"
          >
            Close Proof
          </button>
        </div>
      </div>
    </div>
  );
}
