'use client';

import React from 'react';
import { Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { GRAPStatus, GRAPActionItem } from '@/lib/engine/grap-engine';

interface GRAPCommunityDirectiveProps {
  grap: GRAPStatus;
  onOpenOrderModal: () => void;
}

export function GRAPCommunityDirective({
  grap,
  onOpenOrderModal,
}: GRAPCommunityDirectiveProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden" role="region" aria-label="GRAP Stage Indicator">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              AQI-based GRAP Stage Indicator
            </span>
            <Info className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            CAQM Framework (Advisory)
          </span>
        </div>

        {/* Dynamic Stage Pill & AQI Range */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className={`px-4 py-1.5 rounded-xl font-black text-sm border tracking-wide uppercase ${
              grap.activeStage === 'NONE'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                : grap.activeStage === 'STAGE_I'
                ? 'bg-yellow-100 text-yellow-900 border-yellow-200'
                : grap.activeStage === 'STAGE_II'
                ? 'bg-orange-100 text-orange-900 border-orange-200'
                : 'bg-red-100 text-red-900 border-red-200'
            }`}
          >
            {grap.stageName}
          </span>
          <span className="text-sm font-extrabold text-slate-800">
            AQI Band: {grap.aqiTriggerRange}
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Reflects CPCB AQI threshold bands under the revised CAQM GRAP framework. Statutory invocation orders in Delhi-NCR are formally issued by the CAQM Sub-Committee based on dynamic meteorological forecasting.
        </p>

        {/* Dynamic Key Actions List */}
        <ul className="space-y-2 text-xs text-slate-700 font-medium mb-6">
          {grap.actionItems.map((item: GRAPActionItem, idx: number) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong className="text-slate-900">{item.title}:</strong> {item.description}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {/* Monument Silhouette Vector Art (India Gate & Trees) */}
        <div className="w-full h-32 rounded-2xl bg-gradient-to-t from-amber-50/80 via-orange-50/30 to-transparent border border-amber-100/60 flex items-end justify-center overflow-hidden mb-4 relative" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 360 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="180" cy="30" r="14" fill="#fbbf24" opacity="0.6" />
            <rect x="0" y="105" width="360" height="15" fill="#84cc16" opacity="0.4" />
            <line x1="0" y1="105" x2="360" y2="105" stroke="#65a30d" strokeWidth="2" />
            <ellipse cx="60" cy="85" rx="16" ry="24" fill="#15803d" opacity="0.7" />
            <ellipse cx="85" cy="90" rx="12" ry="18" fill="#16a34a" opacity="0.6" />
            <ellipse cx="38" cy="92" rx="14" ry="18" fill="#166534" opacity="0.8" />
            <ellipse cx="300" cy="85" rx="16" ry="24" fill="#15803d" opacity="0.7" />
            <ellipse cx="275" cy="90" rx="12" ry="18" fill="#16a34a" opacity="0.6" />
            <ellipse cx="322" cy="92" rx="14" ry="18" fill="#166534" opacity="0.8" />
            <g transform="translate(135, 25)">
              <rect x="0" y="75" width="90" height="5" fill="#d97706" />
              <rect x="5" y="70" width="80" height="5" fill="#d97706" />
              <rect x="10" y="65" width="70" height="5" fill="#b45309" />
              <rect x="12" y="18" width="22" height="47" fill="#d97706" />
              <rect x="56" y="18" width="22" height="47" fill="#d97706" />
              <path d="M34 32 C34 22 56 22 56 32 L56 65 L34 65 Z" fill="#fef3c7" />
              <rect x="8" y="10" width="74" height="8" fill="#b45309" />
              <rect x="5" y="6" width="80" height="4" fill="#d97706" />
              <rect x="15" y="0" width="60" height="6" fill="#92400e" />
            </g>
          </svg>
        </div>

        <button
          onClick={onOpenOrderModal}
          className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors border border-emerald-200 flex items-center justify-center gap-1.5"
        >
          <span>View Official Order</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
