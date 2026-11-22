'use client';

import React, { useState } from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { calculateExplainableImpact } from '@/lib/engine/impact-engine';
import { TransportMode } from '@/lib/types/alternatives';
import { DecoupledMetricCards } from '@/components/impact/DecoupledMetricCards';
import { ImpactScenarioControls } from '@/components/impact/ImpactScenarioControls';
import { FormulaProofModal } from '@/components/impact/FormulaProofModal';

export default function ImpactPage() {
  const [distanceKm, setDistanceKm] = useState<number>(14);
  const [baselineMode, setBaselineMode] = useState<TransportMode>('SOLO_PETROL_CAR');
  const [adaptedMode, setAdaptedMode] = useState<TransportMode>('DELHI_METRO');
  const [hoursShifted] = useState<number>(2.4);
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
            Impact Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            See the real impact of your choices, with transparent calculations
          </p>
        </div>

        <button
          onClick={() => setShowProofModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors border border-emerald-200 shrink-0 self-start md:self-auto"
        >
          <FileText className="w-4 h-4 text-emerald-700" aria-hidden="true" />
          <span>View Calculation Proof</span>
        </button>
      </div>

      {/* Main Impact Card: 3 Decoupled Metric Columns + Vector Graphic */}
      <DecoupledMetricCards impact={impact} hoursShifted={hoursShifted} />

      {/* Calculation Proof Teaser Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
            <FileText className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">How We Calculate This?</h3>
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
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Scenario Adjuster */}
      <ImpactScenarioControls
        distanceKm={distanceKm}
        setDistanceKm={setDistanceKm}
        baselineMode={baselineMode}
        setBaselineMode={setBaselineMode}
        adaptedMode={adaptedMode}
        setAdaptedMode={setAdaptedMode}
      />

      {/* Transparent Calculation Proof Modal */}
      <FormulaProofModal
        isOpen={showProofModal}
        onClose={() => setShowProofModal(false)}
        impact={impact}
        hoursShifted={hoursShifted}
      />
    </div>
  );
}
