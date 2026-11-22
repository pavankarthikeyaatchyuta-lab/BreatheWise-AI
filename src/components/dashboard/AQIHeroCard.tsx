'use client';

import React from 'react';
import { Wind, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AirQualityState } from '@/lib/types/aqi';

export interface AQIHeroCardProps {
  aqi: number;
  category: string;
  dominant: string;
  isOfficialValid: boolean;
  activeTheme: { bgGrad: string; text: string; badgeBg: string; border: string };
  spectrumSegments: { label: string; range: string; color: string }[];
  aqiData: AirQualityState;
}

const HEALTH_STATEMENTS: Record<string, string> = {
  Good: 'Minimal impact. Air quality is ideal for all outdoor activities.',
  Satisfactory: 'Minor breathing discomfort to sensitive people.',
  Moderate: 'Breathing discomfort to the people with lungs, asthma and heart diseases.',
  Poor: 'Breathing discomfort to most people on prolonged outdoor exposure.',
  'Very Poor': 'Respiratory illness on prolonged exposure. Severe effect on vulnerable populations.',
  Severe: 'Severe respiratory impact on healthy individuals; serious health impacts on people with existing lung or heart diseases.',
  'Insufficient Data': 'Station reporting incomplete telemetry. Displaying atmospheric model estimations.',
};

export function AQIHeroCard({
  aqi,
  category,
  dominant,
  isOfficialValid,
  activeTheme,
  spectrumSegments,
  aqiData,
}: AQIHeroCardProps) {
  const healthStatement = HEALTH_STATEMENTS[category] || HEALTH_STATEMENTS['Severe'];

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${activeTheme.bgGrad} text-white shadow-xl relative overflow-hidden transition-all duration-300`}
      role="region"
      aria-label="Current Air Quality Index Overview"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/20">
              <Wind className="w-3.5 h-3.5" aria-hidden="true" />
              CPCB NAQI 2014 Standard
            </span>
            {isOfficialValid ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                Statutory Criteria Met (3+ pollutants, PM included)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/30 text-amber-200 border border-amber-400/30">
                <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                Model Estimate (Ground Station Incomplete)
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-4">
            <div
              className="text-6xl sm:text-7xl font-black tracking-tight"
              aria-live="polite"
              aria-atomic="true"
            >
              {aqi > 0 ? aqi : '--'}
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {category}
              </div>
              <p className="text-xs sm:text-sm text-white/80 font-medium">
                Dominant Criteria Driver:{' '}
                <span className="font-bold underline decoration-white/40">{dominant}</span>
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed">
            {healthStatement}
          </p>
        </div>

        {/* Station Telemetry Badges */}
        <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 min-w-[240px]">
          <div className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">
            Telemetry Provenance
          </div>
          <div className="text-xs space-y-1.5 text-white/90">
            <div className="flex justify-between items-center py-0.5 border-b border-white/10">
              <span className="text-white/60">Source</span>
              <span className="font-semibold text-right truncate max-w-[140px]">
                {aqiData.provenance.sourceName}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/10">
              <span className="text-white/60">Type</span>
              <span className="font-mono text-[11px] bg-white/10 px-1.5 py-0.5 rounded">
                {aqiData.provenance.type}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/10">
              <span className="text-white/60">Monitored</span>
              <span className="font-bold text-emerald-300">
                {aqiData.current.validation?.pollutantCount ?? 0} / 8 Pollutants
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-white/60">16h Completeness</span>
              <span className="font-semibold text-white/95">CPCB Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* CPCB Spectrum Scale Bar */}
      <div className="mt-6 pt-4 border-t border-white/15">
        <div className="text-[11px] font-medium text-white/75 mb-2 flex items-center justify-between">
          <span>CPCB NAQI Standard Band Continuum (0 to 500+)</span>
          <span className="font-bold">{category}</span>
        </div>
        <div
          className="grid grid-cols-6 gap-1 h-2 rounded-full overflow-hidden bg-black/20 p-0.5"
          role="meter"
          aria-valuenow={aqi}
          aria-valuemin={0}
          aria-valuemax={500}
          aria-label="CPCB NAQI Spectrum Meter"
        >
          {spectrumSegments.map((seg) => (
            <div
              key={seg.label}
              className={`${seg.color} rounded-sm transition-opacity ${
                category === seg.label ? 'ring-2 ring-white ring-offset-1 scale-y-125' : 'opacity-60'
              }`}
              title={`${seg.label} (${seg.range})`}
            />
          ))}
        </div>
        <div className="grid grid-cols-6 gap-1 text-[9px] text-white/60 mt-1 text-center font-mono">
          <span>0-50</span>
          <span>51-100</span>
          <span>101-200</span>
          <span>201-300</span>
          <span>301-400</span>
          <span>401-500</span>
        </div>
      </div>
    </div>
  );
}
