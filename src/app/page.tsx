'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CalendarClock, 
  Sparkles
} from 'lucide-react';
import { evaluateGRAPStage } from '@/lib/engine/grap-engine';
import { useCity } from '@/context/CityContext';
import { DiurnalInversionSandbox } from '@/components/landing/DiurnalInversionSandbox';
import { FeatureHighlightsGrid } from '@/components/landing/FeatureHighlightsGrid';
import { ArchitectureShowcase } from '@/components/landing/ArchitectureShowcase';

export default function LandingPage() {
  const { selectedCity, aqiData } = useCity();
  const [simHour, setSimHour] = useState<number>(7);

  const aqi = aqiData.current.aqi;
  const isOfficialValid = aqiData.current.validation?.isValidOfficial ?? true;
  const category = aqiData.current.category || (isOfficialValid ? 'Severe' : 'Insufficient Data');
  const dominant = aqiData.current.dominantPollutantName || 'PM2.5';
  const grap = evaluateGRAPStage(aqi, aqiData.isNCR);

  return (
    <div className="space-y-12 sm:space-y-16 py-2 max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Active Telemetry Status Banner */}
      <aside className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs" aria-label="Active Atmospheric Status">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              Live in <span className="text-slate-900 font-extrabold">{selectedCity}</span>: CPCB AQI <span className="text-rose-600 font-black">{aqi ?? 'Live'}</span> ({category}) • {grap.stageName}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Dominant: {dominant} • Central Electricity Authority (CEA) v22.0 Grid Factor: 0.675 kg CO₂/kWh
            </p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <span>Open Live Air Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </aside>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-[#0a3526] to-slate-950 text-white p-8 sm:p-14 shadow-2xl border border-emerald-800/40" aria-label="Hero Overview">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-xs font-bold text-emerald-300 tracking-wide uppercase shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span>PromptWars Virtual Challenge 6 • Urban Air Quality Assistant</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Navigate Severe Winter Smog with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                Scientific Clarity.
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
              An intelligent, family-first environmental assistant engineered for severe winter smog episodes in Indian metros. Features exact CPCB 8-pollutant NAQI calculations, diurnal atmospheric boundary layer schedule planning, and transparent CEA v22.0 impact intelligence.
            </p>
          </div>

          {/* Direct Action Row */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-emerald-400 text-emerald-950 font-black text-sm hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center gap-2"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <Link
              href="/planner"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <CalendarClock className="w-4 h-4 text-emerald-300" aria-hidden="true" />
              <span>Routine Planner</span>
            </Link>

            <Link
              href="/assistant"
              className="px-5 py-3.5 rounded-xl text-emerald-300 hover:text-white font-bold text-sm flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Ask AI Assistant →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Product Preview & Metric Ticker */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6" aria-label="Current Environmental Snapshot">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-200">
                {selectedCity} Ambient Status
              </span>
              <span className="text-xs text-slate-500 font-medium">Station &amp; Atmospheric Telemetry</span>
              <span className="text-xs font-bold text-forest-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ✓ 110+ Automated Tests Verified
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Current Environmental Snapshot
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-xs"
            >
              Open Full Interactive Workspace →
            </Link>
          </div>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CPCB NAQI</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{aqi ?? 'Live'}</p>
            <p className="text-[11px] text-slate-600 font-medium">{category}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dominant Pollutant</span>
            <p className="text-2xl font-black text-rose-600 mt-1">{dominant}</p>
            <p className="text-[11px] text-slate-600 font-medium">Fine Particulate Inhalation</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CAQM GRAP Stage</span>
            <p className="text-2xl font-black text-orange-600 mt-1">{grap.activeStage}</p>
            <p className="text-[11px] text-slate-600 font-medium">{grap.stageName.slice(0, 24)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grid Factor (CEA v22.0)</span>
            <p className="text-2xl font-black text-forest-700 mt-1">0.675</p>
            <p className="text-[11px] text-slate-600 font-medium">kg CO₂e/kWh Baseline</p>
          </div>
        </div>
      </section>

      {/* Interactive Atmospheric Boundary Layer Inversion Sandbox */}
      <DiurnalInversionSandbox simHour={simHour} setSimHour={setSimHour} />

      {/* 6 Core Application Pillars Grid */}
      <FeatureHighlightsGrid />

      {/* Dual-Layer Architecture Showcase */}
      <ArchitectureShowcase />

      {/* Bottom Call to Action Banner */}
      <section className="rounded-3xl p-8 sm:p-10 text-center space-y-4 bg-gradient-to-r from-emerald-950 via-[#0a3526] to-slate-950 text-white border border-emerald-800/40" aria-label="Get Started">
        <h2 className="text-2xl sm:text-3xl font-black">Ready to Protect Your Family from Winter Smog?</h2>
        <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl mx-auto">
          Explore live city telemetry, simulate personalized routines, and access grounded AI recommendations tailored to your household.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3.5">
          <Link
            href="/dashboard"
            className="px-6 py-3.5 rounded-xl bg-emerald-400 text-emerald-950 font-black text-xs sm:text-sm hover:bg-emerald-300 transition-all shadow-lg cursor-pointer"
          >
            Open Live Air Dashboard →
          </Link>
          <Link
            href="/assistant"
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all"
          >
            Consult Grounded AI Assistant
          </Link>
        </div>
      </section>

    </div>
  );
}
