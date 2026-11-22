'use client';

import React from 'react';

export function ExposureReductionCard() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Exposure Reduction (Today)</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Estimated Proxy
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-2xl bg-[#f5f9f6] border border-emerald-100">
            <span className="block text-3xl font-black text-emerald-900">~2.4 hours</span>
            <span className="text-xs text-forest-700 font-semibold block mt-0.5">
              avoided away from severe winter smog (&gt;300 AQI)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="block text-xl font-black text-slate-900">↑ ~42%</span>
              <span className="text-xs text-slate-500 font-medium">
                less peak diurnal smog exposure vs. unadjusted day
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-forest-700 flex items-center justify-center font-bold text-sm">
              🌿
            </div>
          </div>
        </div>

        {/* Family Silhouette Vector Graphic */}
        <div className="p-4 bg-gradient-to-t from-emerald-100/60 to-transparent rounded-2xl border border-emerald-100 text-center relative overflow-hidden">
          <div className="py-2">
            <span className="text-xs font-bold text-emerald-950 block">
              Healthy Family Routine Shield
            </span>
            <p className="text-[11px] text-emerald-800/80 mt-1 max-w-xs mx-auto">
              Timing adjustments shield developing airways in children and cardiac health in senior citizens.
            </p>
          </div>
          <div className="h-16 flex items-end justify-center gap-2 opacity-35" aria-hidden="true">
            <div className="w-4 h-12 bg-emerald-800 rounded-t-full" />
            <div className="w-5 h-16 bg-emerald-900 rounded-t-full" />
            <div className="w-3 h-8 bg-emerald-700 rounded-t-full" />
            <div className="w-4 h-14 bg-emerald-800 rounded-t-full" />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-normal">
        <strong>Scientific Notice:</strong> This represents an exposure-duration proxy. It does not measure clinical inhaled dose, which requires wearable personal spirometry.
      </div>
    </div>
  );
}
