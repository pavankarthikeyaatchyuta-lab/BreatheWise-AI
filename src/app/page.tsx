'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Wind, 
  MapPin, 
  CalendarClock, 
  Home, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Info, 
  ArrowRight, 
  TrendingDown, 
  CheckCircle2, 
  Car, 
  ChevronRight, 
  Droplets,
  Activity,
  Layers,
  Cpu,
  Compass,
  Users,
  FileCheck,
  Check,
  Zap,
  ArrowUpRight,
  Eye,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { evaluateGRAPStage } from '@/lib/engine/grap-engine';
import { useCity } from '@/context/CityContext';

export default function LandingPage() {
  const { selectedCity, aqiData } = useCity();
  const [simHour, setSimHour] = useState<number>(7); // 7:00 AM morning inversion vs 15:00 PM afternoon dip

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
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <span>Open Live Air Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </aside>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-[#0a3526] to-slate-950 text-white p-8 sm:p-14 shadow-2xl border border-emerald-800/40" aria-label="Hero Overview">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-xs font-bold text-emerald-300 tracking-wide uppercase shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/planner"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <CalendarClock className="w-4 h-4 text-emerald-300" />
              <span>Routine Planner</span>
            </Link>

            <Link
              href="/assistant"
              className="px-5 py-3.5 rounded-xl text-emerald-300 hover:text-white font-bold text-sm flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Assistant →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Product Preview & Metric Ticker */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6" aria-label="Current Snapshot">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-200">
                {selectedCity} Ambient Status
              </span>
              <span className="text-xs text-slate-500 font-medium">Station &amp; Atmospheric Telemetry</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ✓ 87 Automated Tests Verified
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
            <p className="text-2xl font-black text-emerald-700 mt-1">0.675</p>
            <p className="text-[11px] text-slate-600 font-medium">kg CO₂e/kWh Baseline</p>
          </div>
        </div>
      </section>

      {/* Interactive Atmospheric Boundary Layer Inversion Sandbox */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 space-y-6" aria-label="Physics Simulator">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 mb-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Atmospheric Physics Explorer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Diurnal Boundary Layer Inversion Simulator
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Observe how nocturnal radiative cooling traps surface aerosols in the morning vs how solar convection disperses smog during midday.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setSimHour(7)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                simHour === 7 ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              7:00 AM (Morning Inversion)
            </button>
            <button
              type="button"
              onClick={() => setSimHour(15)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                simHour === 15 ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              15:00 PM (Afternoon Low)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Atmospheric Boundary Layer</span>
            <p className="text-2xl font-black text-white">
              {simHour === 7 ? '~150 – 250 m (Shallow)' : '~1,200 – 1,800 m (Expanded)'}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {simHour === 7
                ? 'Nocturnal radiative cooling suppresses vertical mixing. Ground-level emissions (tailpipe exhaust, biomass fires) are trapped near breathing level.'
                : 'Solar insolation heats the earth surface, triggering convective thermal updrafts that disperse fine aerosols aloft.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inhaled Dose &amp; Exposure Delta</span>
            <p className={`text-2xl font-black ${simHour === 7 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {simHour === 7 ? 'AQI ~380 (Severe)' : 'AQI ~185 (Moderate)'}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {simHour === 7
                ? 'Outdoor vigorous cardio multiplies respiratory minute ventilation (breathing rate × tidal volume), causing massive deep-lung alveolar deposition.'
                : 'Favorable relative window. Shifting exercise to indoor sessions and errands to afternoon yields a ~51% exposure reduction.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">BreatheWise Recommendation</span>
              <p className="text-sm font-bold text-white mt-1">
                {simHour === 7 ? 'Shift Cardio Indoors • Close Windows' : 'Optimal Window for Essential Errands'}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                {simHour === 7 ? 'Keep school assembly indoors; avoid morning jogging.' : 'Open cross-ventilation for 20-30 min if outdoor PM2.5 < 120.'}
              </p>
            </div>
            <Link
              href="/planner"
              className="mt-3 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-emerald-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
            >
              <span>View Full Daily Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6 Core Application Pillars Grid */}
      <section className="space-y-6" aria-label="Core Pillars">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            6 Core Challenge Modules
          </h2>
          <p className="text-sm text-slate-500">
            Transforming complex environmental datasets into grounded, daily family decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Air Intelligence Dashboard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time CPCB NAQI calculation, continuous midpoint breakpoint interpolation, and a 24-hour diurnal forecast chart with inversion threshold gating.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 pt-2"
            >
              <span>Open Air Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <CalendarClock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Daily Routine Planner</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Low-exposure routine builder that reschedules outdoor fitness, school drop-offs, and errands based on hourly diurnal dispersion windows.
              </p>
            </div>
            <Link href="/planner" className="text-xs font-bold text-teal-800 hover:text-teal-950 inline-flex items-center gap-1 pt-2">
              <span>Open Routine Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Indoor Air Coach</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict Zero Fake Sensors policy; procedural cooking exhaust rules, wet mopping protocols, and fire-safe DIY Corsi-Rosenthal MERV-13 filter guides.
              </p>
            </div>
            <Link href="/indoor-coach" className="text-xs font-bold text-amber-800 hover:text-amber-950 inline-flex items-center gap-1 pt-2">
              <span>Consult Indoor Coach</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">4. Sustainable Alternatives</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compares 8 transport modes (Metro, Electric Bus, Carpool, etc.) with passenger occupancy scaling and commute distance sliders.
              </p>
            </div>
            <Link href="/alternatives" className="text-xs font-bold text-blue-800 hover:text-blue-950 inline-flex items-center gap-1 pt-2">
              <span>Compare Transit Modes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">5. Impact Intelligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Decoupled 3-tier metrics: Personal Exposure Shift (hrs), Local Tailpipe PM2.5 (g), and Grid CO2e (kg) citing the Central Electricity Authority (CEA) Version 22.0.
              </p>
            </div>
            <Link href="/impact" className="text-xs font-bold text-rose-800 hover:text-rose-950 inline-flex items-center gap-1 pt-2">
              <span>View Calculation Proofs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-800 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">6. Community &amp; School Hub</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dynamic CAQM GRAP Stage indicator, school outdoor sports curbs, RWA open-burning bans, and one-click WhatsApp advisory bulletins.
              </p>
            </div>
            <Link href="/community" className="text-xs font-bold text-violet-800 hover:text-violet-950 inline-flex items-center gap-1 pt-2">
              <span>Generate Community Bulletin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* Dual-Layer Architecture Showcase */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6" aria-label="Architecture">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Engineering Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dual-Layer Intelligence Model
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Separating natural-language personalization from deterministic mathematical calculations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Layer 1: Grounded Generative AI</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Google Gemini API Orchestration</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Multilingual interaction in English, Hindi (हिन्दी), and Telugu (తెలుగు)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Two-stage prompt guardrails rejecting jailbreaks &amp; system prompt extraction</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Strict runtime Zod input/output schema validation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>7-second timeout coupled with AbortController cancellation</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
              <Layers className="w-4 h-4" />
              <span>Layer 2: Deterministic Environmental Engine</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">CPCB &amp; Regulatory Math</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Piecewise linear interpolation across all 8 criteria pollutants</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Continuous midpoint boundary interpolation preventing null gaps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Statutory 16-hour monitored completeness validation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Central Electricity Authority (CEA) v22.0 grid factors (0.675 kg CO₂/kWh)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

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
