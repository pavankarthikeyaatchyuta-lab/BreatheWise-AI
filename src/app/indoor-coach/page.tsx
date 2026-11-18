'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  Wind, 
  ShieldAlert, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  DoorClosed, 
  Fan,
  Layers,
  ArrowRight
} from 'lucide-react';
import { evaluateIndoorGuidance } from '@/lib/engine/indoor-engine';
import { getDelhiDemoState } from '@/lib/aqi/demo-data';

export default function IndoorCoachPage() {
  const aqiState = getDelhiDemoState();
  const currentPm25 = aqiState.current.pollutants.pm25?.value ?? 312;
  const currentAqi = aqiState.current.aqi ?? 450;

  const [hasPartition, setHasPartition] = useState(true);
  const [hasExhaust, setHasExhaust] = useState(true);
  const [hasPurifier, setHasPurifier] = useState(false);

  const guidance = evaluateIndoorGuidance(
    currentPm25,
    currentAqi,
    { start: '13:00', end: '16:00' },
    hasPartition,
    hasExhaust,
    hasPurifier
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-forest-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <Home className="w-4 h-4" />
            <span>Household Air Guidance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dynamic Indoor Air Quality Coach
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Practical, evidence-grounded procedural hacks to drastically cut indoor particulate exposure without expensive commercial equipment.
          </p>
        </div>

        <Link
          href="/assistant"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-xs transition-colors border border-purple-200 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Ask AI Indoor Advice</span>
        </Link>
      </div>

      {/* Mandatory Zero-Sensor Scientific Integrity Banner */}
      <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-2xl flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed">
          <strong className="block font-bold text-amber-900 mb-0.5">
            Zero Fake Sensors Integrity Policy
          </strong>
          {guidance.zeroSensorDisclaimer}
        </div>
      </div>

      {/* Home Facility Configuration Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Customize for Your Home Facilities:
        </span>
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasPartition}
              onChange={(e) => setHasPartition(e.target.checked)}
              className="rounded text-forest-600 focus:ring-forest-500"
            />
            <span>Kitchen Door Partition Exists</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasExhaust}
              onChange={(e) => setHasExhaust(e.target.checked)}
              className="rounded text-forest-600 focus:ring-forest-500"
            />
            <span>Powered Kitchen Exhaust Fan Installed</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasPurifier}
              onChange={(e) => setHasPurifier(e.target.checked)}
              className="rounded text-forest-600 focus:ring-forest-500"
            />
            <span>Commercial HEPA Purifier Available</span>
          </label>
        </div>
      </div>

      {/* Dynamic Ventilation Advisor Card */}
      <div className={`p-6 rounded-2xl border shadow-xs transition-all ${
        guidance.ventilationAdvisor.canVentilateNow
          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
          : 'bg-rose-50/70 border-rose-200 text-rose-950'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
            <Wind className="w-4 h-4" />
            <span>Dynamic Window Ventilation Advisor</span>
          </span>
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase ${
            guidance.ventilationAdvisor.canVentilateNow
              ? 'bg-emerald-200 text-emerald-900'
              : 'bg-rose-200 text-rose-900'
          }`}>
            {guidance.ventilationAdvisor.recommendedAction.replace(/_/g, ' ')}
          </span>
        </div>

        <p className="text-sm font-medium leading-relaxed mb-4">
          {guidance.ventilationAdvisor.explanation}
        </p>

        {guidance.ventilationAdvisor.safestVentilationWindowToday && (
          <div className="p-3 bg-white/80 rounded-xl border border-rose-200/60 text-xs flex items-center justify-between">
            <span className="font-semibold text-slate-800">
              Midday Boundary Layer Flushing Window:
            </span>
            <span className="font-extrabold text-forest-700">
              {guidance.ventilationAdvisor.safestVentilationWindowToday} (Max 10-15 mins)
            </span>
          </div>
        )}
      </div>

      {/* 2-Column: Cooking Smog Protocols & Dust Resuspension */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cooking Smog Management */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4" />
              <span>{guidance.cookingProtocols.title}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Tadka, Spice Sputtering & Deep Frying Shield
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Heating mustard/vegetable oils above smoke points generates high concentrations of ultra-fine sub-micron aerosols (PM0.1 to PM2.5) that stay suspended for hours.
            </p>

            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-950 mb-4">
              ⏱ Timing Rule: {guidance.cookingProtocols.exhaustTiming}
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              {guidance.cookingProtocols.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600 flex items-start gap-2">
            <DoorClosed className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
            <span>{guidance.cookingProtocols.partitionAdvice}</span>
          </div>
        </div>

        {/* Dust Resuspension & Cleaning Dynamics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-forest-700 uppercase tracking-wider mb-2">
              <Wind className="w-4 h-4" />
              <span>Aerodynamic Dust Resuspension</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Wet Mopping Protocol vs Dry Broom Sweeping
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              {guidance.dustMitigation.resuspensionExplanation}
            </p>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl mb-4">
              <span className="text-xs font-bold text-rose-900 block mb-2">
                Prohibited Cleaning Actions During Winter Smog:
              </span>
              <ul className="space-y-1.5 text-xs text-rose-800">
                {guidance.dustMitigation.prohibitedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold">✕</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-600">
            <strong>Optimal Habit:</strong> Use a micro-fiber damp flat mop with water and a few drops of mild soap twice daily.
          </div>
        </div>
      </div>

      {/* Safe DIY Corsi-Rosenthal Box Blueprint Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-600">
              Low-Cost Household Engineering
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {guidance.diyFilterGuide.title}
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
            Safe DIY Protocol
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Motor Safety & Filter Specs */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                <Fan className="w-4 h-4 text-forest-600" />
                Motor Safety Prerequisites
              </span>
              <ul className="space-y-2 text-xs text-slate-700">
                {guidance.diyFilterGuide.safetyPrerequisites.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                <Layers className="w-4 h-4 text-forest-600" />
                Filter Media Standards
              </span>
              <ul className="space-y-2 text-xs text-slate-700">
                {guidance.diyFilterGuide.filterSpecifications.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Assembly Checklist & Limitations */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                <Wrench className="w-4 h-4 text-forest-600" />
                Airtight Assembly Checklist
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {guidance.diyFilterGuide.assemblyChecklist.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-forest-700">{i + 1}.</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Performance Limitations (Honesty Policy)
              </span>
              <ul className="space-y-1.5 text-xs text-amber-900">
                {guidance.diyFilterGuide.limitations.map((l, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-center justify-between">
          <span>
            <strong>Maintenance Schedule:</strong> {guidance.diyFilterGuide.maintenanceSchedule}
          </span>
          <Link href="/impact" className="text-forest-700 font-bold hover:underline shrink-0">
            View Emissions Savings →
          </Link>
        </div>
      </div>
    </div>
  );
}
