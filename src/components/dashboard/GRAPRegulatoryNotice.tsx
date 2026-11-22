'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { GRAPStatus } from '@/lib/engine/grap-engine';

export interface GRAPRegulatoryNoticeProps {
  grap: GRAPStatus;
  isNCR: boolean;
  aqi: number;
}

export function GRAPRegulatoryNotice({
  grap,
  isNCR,
}: GRAPRegulatoryNoticeProps) {
  const isSevere = grap.activeStage === 'STAGE_IV' || grap.activeStage === 'STAGE_III';
  const isModerateOrHigher = grap.activeStage !== 'NONE';

  return (
    <div
      className={`rounded-3xl p-6 border transition-all ${
        isSevere
          ? 'bg-rose-50/70 border-rose-200 text-rose-950'
          : isModerateOrHigher
          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
          : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
      }`}
      role="region"
      aria-label="CAQM Graded Response Action Plan Status"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl text-white ${
              isSevere
                ? 'bg-rose-600'
                : isModerateOrHigher
                ? 'bg-amber-600'
                : 'bg-emerald-600'
            }`}
          >
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight">
                CAQM Graded Response Action Plan (GRAP)
              </span>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-full ${
                  isSevere
                    ? 'bg-rose-200 text-rose-900'
                    : isModerateOrHigher
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-emerald-200 text-emerald-900'
                }`}
              >
                {grap.stageName}
              </span>
            </div>
            <p className="text-xs opacity-80 mt-0.5">
              Commission for Air Quality Management (NCR &amp; Adjoining Areas) Statutory Directive
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/70 border border-black/5 shadow-xs shrink-0">
          {isNCR ? 'Statutory Active (Delhi-NCR)' : 'Advisory Benchmark (Non-NCR Metro)'}
        </div>
      </div>

      <p className="text-xs sm:text-sm leading-relaxed mb-4 font-medium opacity-90">
        {grap.summary}
      </p>

      {/* Mandatory Citizens Actions List */}
      <div className="bg-white/80 rounded-2xl p-4 border border-black/5 space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider opacity-75">
          Key Mandated Citizen &amp; Community Directives:
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {grap.actionItems.map((item, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
              <div>
                <span className="font-semibold opacity-95">{item.title}: </span>
                <span className="opacity-80">{item.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
