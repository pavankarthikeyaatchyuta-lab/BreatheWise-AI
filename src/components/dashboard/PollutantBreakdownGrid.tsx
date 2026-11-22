'use client';

import React from 'react';
import { AirQualityState, PollutantKey } from '@/lib/types/aqi';

export interface PollutantBreakdownGridProps {
  pollutantKeys: PollutantKey[];
  aqiData: AirQualityState;
}

export function PollutantBreakdownGrid({
  pollutantKeys,
  aqiData,
}: PollutantBreakdownGridProps) {
  return (
    <div className="space-y-4" role="region" aria-label="CPCB 8-Criteria Pollutants Breakdown">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            CPCB 8-Criteria Pollutants Sub-Index Breakdown
          </h2>
          <p className="text-xs text-slate-500">
            Linear piece-wise breakpoint interpolation per CPCB NAQI guidelines (2014).
          </p>
        </div>
        <div className="text-[11px] font-semibold text-slate-500">
          Statutory 16-Hour Minimum Completeness Rule
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {pollutantKeys.map((key) => {
          const p = aqiData.current.pollutants[key];
          const hasData = Boolean(p && p.value !== null && p.value !== undefined);
          const isDominant = aqiData.current.dominantPollutant === key;
          const subIndex = p?.subIndex ?? null;

          // Color coded sub-index border
          const subColor =
            subIndex === null
              ? 'border-slate-200 bg-white'
              : subIndex <= 50
              ? 'border-emerald-300 bg-emerald-50/40 text-emerald-900'
              : subIndex <= 100
              ? 'border-lime-300 bg-lime-50/40 text-lime-900'
              : subIndex <= 200
              ? 'border-amber-300 bg-amber-50/40 text-amber-900'
              : subIndex <= 300
              ? 'border-orange-300 bg-orange-50/40 text-orange-900'
              : subIndex <= 400
              ? 'border-red-300 bg-red-50/40 text-red-900'
              : 'border-rose-400 bg-rose-50/50 text-rose-950';

          return (
            <div
              key={key}
              className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between ${subColor} ${
                isDominant ? 'ring-2 ring-forest-700 ring-offset-1 shadow-sm' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs tracking-tight uppercase">
                  {key.toUpperCase()}
                </span>
                {isDominant && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-forest-700 text-white">
                    Driver
                  </span>
                )}
              </div>

              <div className="my-2">
                <div className="text-xl sm:text-2xl font-black tracking-tight">
                  {subIndex !== null ? subIndex : '--'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Sub-Index</div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-[10px] space-y-0.5">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Conc:</span>
                  <span className="font-semibold text-slate-800">
                    {hasData ? p.value : '--'}
                  </span>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>Unit:</span>
                  <span>{p?.unit || 'µg/m³'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
