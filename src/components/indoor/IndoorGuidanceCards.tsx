'use client';

import React from 'react';
import { 
  Wind, 
  Flame, 
  Sparkles, 
  Wrench, 
  Info, 
  CheckCircle2, 
  Check, 
  X, 
  ArrowRight 
} from 'lucide-react';
import { IndoorGuidanceResult } from '@/lib/engine/indoor-engine';

export type CategoryFilter = 'ALL' | 'VENTILATION' | 'COOKING' | 'CLEANING' | 'DIY_FILTER';

interface IndoorGuidanceCardsProps {
  activeCategory: CategoryFilter;
  guidance: IndoorGuidanceResult;
  currentPm25: number | null;
  onOpenDiyModal: () => void;
}

export function IndoorGuidanceCards({
  activeCategory,
  guidance,
  currentPm25,
  onOpenDiyModal,
}: IndoorGuidanceCardsProps) {
  return (
    <div className="space-y-4" role="region" aria-label="Indoor Action Protocols">
      {/* Card 1: Window Ventilation Advisor */}
      {(activeCategory === 'ALL' || activeCategory === 'VENTILATION') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <Wind className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Window Ventilation Advisor</h3>
                <span className="text-[11px] text-slate-400">
                  Outdoor PM2.5: {currentPm25 !== null ? `${currentPm25} µg/m³` : 'Station Sync'}
                </span>
              </div>
            </div>

            <span
              className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase shrink-0 ${
                guidance.ventilationAdvisor.canVentilateNow
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              {guidance.ventilationAdvisor.recommendedAction === 'KEEP_WINDOWS_SEALED'
                ? 'Not Recommended'
                : 'Conditional Window Open'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 mb-3 text-xs text-slate-700 leading-relaxed font-medium">
            <strong>Based on today&apos;s outdoor air quality:</strong>{' '}
            {guidance.ventilationAdvisor.safestVentilationWindowToday
              ? `Open windows for 10-15 min around ${guidance.ventilationAdvisor.safestVentilationWindowToday} (boundary layer mixing window: AQI lower than morning/evening peaks).`
              : 'Keep windows strictly sealed today as outdoor air quality is consistently hazardous.'}
          </div>

          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" aria-hidden="true" />
              <span>
                <strong>Application Behavioral Heuristic:</strong> Keep windows closed when outdoor PM2.5 &gt; 120 µg/m³ (derived from CPCB Poor-to-Very Poor boundary) or during heavy traffic peaks. Note: This window-sealing threshold is an application-level household guideline, not an official statutory standard.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" aria-hidden="true" />
              <span>Use brief cross-ventilation only when outdoor air is comparatively better.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" aria-hidden="true" />
              <span>Combine with kitchen exhaust fans while cooking to expel indoor aerosols.</span>
            </li>
          </ul>
        </div>
      )}

      {/* Card 2: Cooking Smog Control */}
      {(activeCategory === 'ALL' || activeCategory === 'COOKING') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                <Flame className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Cooking Smog Control</h3>
                <span className="text-[11px] text-slate-400">
                  Tadka, oil sputtering &amp; deep frying protocol
                </span>
              </div>
            </div>

            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
              High Impact
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mt-2 mb-3">
            Use exhaust <strong>5 min before &amp; after cooking</strong>. Reduce indoor particulate accumulation by up to <strong>40%</strong>.
          </p>

          <div className="p-3 bg-orange-50/70 border border-orange-200/60 rounded-2xl text-xs space-y-1.5 text-orange-950 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-700 shrink-0" aria-hidden="true" />
              <span>{guidance.cookingProtocols.exhaustTiming}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-700 shrink-0" aria-hidden="true" />
              <span>{guidance.cookingProtocols.partitionAdvice}</span>
            </div>
          </div>
        </div>
      )}

      {/* Card 3: Dust & Cleaning */}
      {(activeCategory === 'ALL' || activeCategory === 'CLEANING') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Dust &amp; Cleaning</h3>
                <span className="text-[11px] text-slate-400">
                  Aerodynamic dust resuspension control
                </span>
              </div>
            </div>

            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full uppercase bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
              Medium
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mt-2 mb-3">
            <strong>Use wet mopping, avoid dry broom sweeping.</strong> Dry sweeping sends settled PM10 and PM2.5 back into your breathing zone for 2-4 hours.
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              Microfiber damp flat mop
            </span>
            <span className="px-3 py-1 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 font-semibold flex items-center gap-1.5">
              <X className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
              Zero dry broom during smog
            </span>
          </div>
        </div>
      )}

      {/* Card 4: DIY Air Filter (Corsi-Rosenthal) */}
      {(activeCategory === 'ALL' || activeCategory === 'DIY_FILTER') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
              <Wrench className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">DIY Air Filter (Corsi-Rosenthal)</h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-md leading-relaxed">
                A cost-effective, thermally safe option to reduce indoor particulates by combining a box fan with MERV 13 filters.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenDiyModal}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-center"
            aria-label="Open DIY Air Filter Guide"
          >
            <span>Guide</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Card 5: Scientific Fact-Check */}
      <div className="bg-amber-50/60 rounded-3xl border border-amber-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5 text-xs text-slate-700">
            <h3 className="text-sm font-bold text-slate-900">
              Scientific Fact-Check: Can Houseplants Purify Indoor Air?
            </h3>
            <p className="leading-relaxed font-semibold text-slate-800">
              No evidence shows that a reasonable number of ordinary houseplants removes significant quantities of pollutants in homes and offices. Do not rely on plants as a substitute for source control or filtration.
            </p>
            <p className="leading-relaxed text-slate-600">
              The common claim originates from the 1989 NASA Clean Air study, which tested volatile organic compounds (VOCs) inside sealed 1-m³ chambers. In typical living spaces with natural air exchange, potted houseplants have negligible impact on PM2.5 or PM10 particulate levels.
            </p>
            <p className="leading-relaxed text-amber-950 font-medium">
              <strong>Practical Rule:</strong> Effective particulate protection requires source control (such as kitchen exhaust fans and partitions) and verified high Clean Air Delivery Rate (CADR) mechanical filtration (certified HEPA or DIY Corsi-Rosenthal boxes).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
