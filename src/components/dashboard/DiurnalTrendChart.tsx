'use client';

import React from 'react';
import { Clock, TrendingDown, Info } from 'lucide-react';
import { DiurnalForecastHour } from '@/lib/types/aqi';

export interface DiurnalTrendChartProps {
  hasForecast: boolean;
  forecastList: DiurnalForecastHour[];
  yCeiling: number;
  peakForecast: { time: string; pm25: number };
  lowForecast: { time: string; pm25: number };
  chartPoints: Array<{ x: number; y: number; time: string; pm25: number; isPeakSmogWindow?: boolean; isRelativeLowWindow?: boolean }>;
  curvePath: string;
  forecastSourceLabel: string;
}

export function DiurnalTrendChart({
  hasForecast,
  forecastList,
  yCeiling,
  peakForecast,
  lowForecast,
  chartPoints,
  curvePath,
  forecastSourceLabel,
}: DiurnalTrendChartProps) {
  return (
    <div
      className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5"
      role="region"
      aria-label="24-Hour Diurnal Boundary Layer Trend"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-forest-700">
              <Clock className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              24-Hour Diurnal Inversion & Surface PM2.5 Curve
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Hourly particulate concentration mapped against atmospheric boundary layer dynamics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-semibold border border-rose-200">
            Peak: {peakForecast.time} ({peakForecast.pm25} µg/m³)
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            Low: {lowForecast.time} ({lowForecast.pm25} µg/m³)
          </span>
        </div>
      </div>

      {/* SVG Curve Container */}
      <div className="relative w-full overflow-x-auto pb-2">
        <svg
          viewBox="0 0 600 170"
          className="w-full h-44 sm:h-52 overflow-visible select-none"
          role="img"
          aria-label="Diurnal particulate curve visualization across 24 hours"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e11d48" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="25%" stopColor="#f43f5e" />
              <stop offset="55%" stopColor="#059669" />
              <stop offset="85%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="32" y1="25" x2="575" y2="25" stroke="#f1f5f9" strokeDasharray="3 3" />
          <text x="12" y="28" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            {yCeiling}
          </text>

          <line x1="32" y1="85" x2="575" y2="85" stroke="#f1f5f9" strokeDasharray="3 3" />
          <text x="12" y="88" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            {Math.round(yCeiling / 2)}
          </text>

          <line x1="32" y1="145" x2="575" y2="145" stroke="#e2e8f0" />
          <text x="12" y="148" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            0
          </text>

          {/* Shaded Inversion Zones */}
          <rect x="32" y="15" width="130" height="130" fill="#f43f5e" fillOpacity="0.05" rx="6" />
          <text x="40" y="24" fill="#e11d48" fontSize="8.5" fontWeight="bold">
            Morning Inversion (06-10h)
          </text>

          <rect x="420" y="15" width="155" height="130" fill="#f43f5e" fillOpacity="0.05" rx="6" />
          <text x="426" y="24" fill="#e11d48" fontSize="8.5" fontWeight="bold">
            Evening Nocturnal Trap (19-23h)
          </text>

          {/* Area fill under curve */}
          {curvePath && chartPoints.length > 0 && (
            <path
              d={`${curvePath} L ${chartPoints[chartPoints.length - 1].x.toFixed(1)},145 L ${chartPoints[0].x.toFixed(1)},145 Z`}
              fill="url(#curveGradient)"
            />
          )}

          {/* Spline curve stroke */}
          {curvePath && (
            <path
              d={curvePath}
              fill="none"
              stroke="url(#strokeGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Data Points */}
          {chartPoints.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={i % 3 === 0 ? 3.5 : 2}
                fill={pt.isPeakSmogWindow ? '#e11d48' : pt.isRelativeLowWindow ? '#10b981' : '#f59e0b'}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {i % 4 === 0 && (
                <text
                  x={pt.x}
                  y="162"
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="9.5"
                  fontWeight="500"
                >
                  {pt.time}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Atmospheric Boundary Layer Insight */}
      <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <span className="font-bold">Atmospheric Physics Note: </span>
          <span className="text-emerald-900/90 leading-relaxed">
            Surface PM2.5 follows a classic diurnal bimodal distribution. Radiative nocturnal cooling collapses the planetary boundary layer to &lt;200m in winter mornings, trapping emissions. In the afternoon (13:00–16:00), solar heating expands the mixing height to &gt;1000m, yielding a relative dilution window.
          </span>
          <div className="text-[10px] text-emerald-800/80 pt-1 font-mono">{forecastSourceLabel}</div>
        </div>
      </div>
    </div>
  );
}
