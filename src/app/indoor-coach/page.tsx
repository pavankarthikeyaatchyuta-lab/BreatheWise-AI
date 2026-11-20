'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
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
  ArrowRight,
  Info,
  Check,
  X
} from 'lucide-react';
import { evaluateIndoorGuidance } from '@/lib/engine/indoor-engine';
import { useCity } from '@/context/CityContext';

type CategoryFilter = 'ALL' | 'VENTILATION' | 'COOKING' | 'CLEANING' | 'DIY_FILTER';

export default function IndoorCoachPage() {
  const { aqiData: aqiState } = useCity();
  const currentPm25 = aqiState.current.pollutants.pm25?.value ?? 102;
  const currentAqi = aqiState.current.aqi ?? 176;

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [hasPartition, setHasPartition] = useState(true);
  const [hasExhaust, setHasExhaust] = useState(true);
  const [hasPurifier, setHasPurifier] = useState(false);
  const [showDiyModal, setShowDiyModal] = useState(false);

  const guidance = evaluateIndoorGuidance(
    currentPm25,
    currentAqi,
    { start: '14:00', end: '16:00' },
    hasPartition,
    hasExhaust,
    hasPurifier
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Indoor Air Quality Coach</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Indoor Air Quality Coach
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Practical, evidence-based ways to keep your home&apos;s air cleaner.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(['VENTILATION', 'COOKING', 'CLEANING', 'DIY_FILTER'] as const).map((cat) => {
            const labels: Record<typeof cat, string> = {
              VENTILATION: 'Ventilation',
              COOKING: 'Cooking',
              CLEANING: 'Cleaning',
              DIY_FILTER: 'DIY Filter',
            };
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? 'ALL' : cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-[#0a3526] text-white shadow-xs' 
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {labels[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mandatory Zero-Sensor Scientific Integrity Banner */}
      <div className="p-4 bg-amber-50/90 border border-amber-300/80 rounded-2xl flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed">
          <strong className="block font-bold text-amber-900 mb-0.5">
            Zero Fake Sensors Integrity Policy
          </strong>
          {guidance.zeroSensorDisclaimer}
        </div>
      </div>

      {/* Main Grid: Living Room Visual Card + Interactive Guidance Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Living Room Illustration & Facility Customizer (4 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Living Room Card with Illustration */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs overflow-hidden flex flex-col justify-between relative group">
            <div className="relative w-full h-56 rounded-2xl bg-gradient-to-b from-amber-50/60 via-emerald-50/30 to-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
              {/* Cozy Room Vector Illustration */}
              <svg className="w-full h-full" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Sunlight / Window Rays */}
                <path d="M40 20 L160 200 L110 200 L20 20 Z" fill="#fef08a" opacity="0.3" />
                
                {/* Window Frame */}
                <rect x="25" y="25" width="80" height="110" rx="8" fill="#ffffff" stroke="#94a3b8" strokeWidth="3" />
                <rect x="30" y="30" width="32" height="48" rx="4" fill="#bae6fd" opacity="0.6" />
                <rect x="68" y="30" width="32" height="48" rx="4" fill="#bae6fd" opacity="0.6" />
                <rect x="30" y="82" width="32" height="48" rx="4" fill="#bae6fd" opacity="0.6" />
                <rect x="68" y="82" width="32" height="48" rx="4" fill="#bae6fd" opacity="0.6" />
                {/* Sun rays through window */}
                <line x1="45" y1="50" x2="55" y2="60" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

                {/* Floor line */}
                <line x1="0" y1="180" x2="320" y2="180" stroke="#cbd5e1" strokeWidth="2" />

                {/* Air Purifier on floor */}
                <rect x="75" y="135" width="36" height="50" rx="6" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
                {/* Air vents */}
                <line x1="82" y1="145" x2="104" y2="145" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="82" y1="150" x2="104" y2="150" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="82" y1="155" x2="104" y2="155" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                {/* Power led */}
                <circle cx="93" cy="168" r="2.5" fill="#10b981" />
                {/* Clean air stream lines coming out of purifier */}
                <path d="M85 130 C80 115 88 105 82 95" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
                <path d="M93 128 C90 110 98 100 93 85" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
                <path d="M101 130 C106 115 98 105 104 95" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />

                {/* Potted Indoor Plant (Fiddle Leaf Fig / Snake Plant) */}
                <ellipse cx="145" cy="180" rx="14" ry="4" fill="#94a3b8" opacity="0.3" />
                <path d="M136 155 L154 155 L151 180 L139 180 Z" fill="#d97706" />
                {/* Stems & Leaves */}
                <path d="M145 155 Q135 135 128 120" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
                <path d="M145 155 Q145 130 145 110" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
                <path d="M145 155 Q155 135 162 120" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
                {/* Broad green leaves */}
                <ellipse cx="126" cy="116" rx="10" ry="14" fill="#22c55e" transform="rotate(-25 126 116)" />
                <ellipse cx="145" cy="106" rx="10" ry="15" fill="#16a34a" />
                <ellipse cx="164" cy="116" rx="10" ry="14" fill="#22c55e" transform="rotate(25 164 116)" />
                <ellipse cx="134" cy="136" rx="8" ry="12" fill="#15803d" transform="rotate(-30 134 136)" />
                <ellipse cx="156" cy="136" rx="8" ry="12" fill="#15803d" transform="rotate(30 156 136)" />

                {/* Minimalist Cozy Sofa in background */}
                <rect x="185" y="140" width="115" height="40" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
                <rect x="190" y="125" width="105" height="25" rx="6" fill="#cbd5e1" />
                <rect x="195" y="148" width="22" height="18" rx="4" fill="#10b981" opacity="0.4" />
                <rect x="225" y="148" width="22" height="18" rx="4" fill="#f59e0b" opacity="0.4" />

                {/* Clean Air Quality Floating Shield badge */}
                <g transform="translate(240, 25)">
                  <rect width="65" height="34" rx="17" fill="#ffffff" stroke="#e2e8f0" />
                  <circle cx="16" cy="17" r="8" fill="#dcfce7" />
                  <path d="M13 17 L15 19 L19 14" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="28" y="17" fill="#0f172a" fontSize="8" fontWeight="bold">CLEAN</text>
                  <text x="28" y="25" fill="#16a34a" fontSize="7" fontWeight="bold">SPACE</text>
                </g>
              </svg>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-slate-900">
                Home Sanctuary Protection
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                During severe winter smog, indoor particulate accumulation can equal outdoor levels if procedural ventilation and cooking seals are neglected.
              </p>
            </div>

            {/* Live Facility Toggles */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Your Home Facilities
              </span>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <span className="flex items-center gap-2">
                  <DoorClosed className="w-4 h-4 text-emerald-600" />
                  <span>Kitchen Door Partition</span>
                </span>
                <input
                  type="checkbox"
                  checked={hasPartition}
                  onChange={(e) => setHasPartition(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <span className="flex items-center gap-2">
                  <Fan className="w-4 h-4 text-emerald-600" />
                  <span>Kitchen Exhaust Fan Installed</span>
                </span>
                <input
                  type="checkbox"
                  checked={hasExhaust}
                  onChange={(e) => setHasExhaust(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <span className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-emerald-600" />
                  <span>Commercial HEPA Purifier</span>
                </span>
                <input
                  type="checkbox"
                  checked={hasPurifier}
                  onChange={(e) => setHasPurifier(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: The 4 Key Action Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: Window Ventilation Advisor */}
          {(activeCategory === 'ALL' || activeCategory === 'VENTILATION') && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-emerald-300 transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Window Ventilation Advisor
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Outdoor PM2.5: {currentPm25} µg/m³
                    </span>
                  </div>
                </div>

                <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase shrink-0 ${
                  guidance.ventilationAdvisor.canVentilateNow
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}>
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
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <span>Keep windows closed when ambient AQI &gt; 120 or during heavy traffic hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <span>Use brief cross-ventilation only when outdoor air is comparatively better.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
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
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Cooking Smog Control
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Tadka, oil sputtering & deep frying protocol
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
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-700 shrink-0" />
                  <span>{guidance.cookingProtocols.exhaustTiming}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-700 shrink-0" />
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
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Dust &amp; Cleaning
                    </h3>
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
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Microfiber damp flat mop
                </span>
                <span className="px-3 py-1 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 font-semibold flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-600" />
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
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    DIY Air Filter (Corsi-Rosenthal)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-md leading-relaxed">
                    A cost-effective, thermally safe option to reduce indoor particulates by combining a box fan with MERV 13 filters.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDiyModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-center"
              >
                <span>Guide</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Corsi-Rosenthal Blueprint Modal */}
      {showDiyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {guidance.diyFilterGuide.title}
                  </h2>
                  <span className="text-xs text-slate-500">
                    Safety-First Low-Cost Air Purification Blueprint
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDiyModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs text-slate-700">
              {/* Motor Safety */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="font-bold text-amber-950 flex items-center gap-1.5 mb-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Fan Motor Safety Requirements (Mandatory)
                </span>
                <ul className="space-y-1.5 text-amber-900">
                  {guidance.diyFilterGuide.safetyPrerequisites.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filter Media Specifications */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-2 text-sm">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Filter Media Specifications
                </span>
                <ul className="space-y-1.5">
                  {guidance.diyFilterGuide.filterSpecifications.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assembly Checklist */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-2 text-sm">
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  Airtight Step-by-Step Assembly
                </span>
                <ul className="space-y-1.5">
                  {guidance.diyFilterGuide.assemblyChecklist.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold text-emerald-700">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scientific Limitations */}
              <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  Scientific Limitations &amp; Honesty:
                </span>
                <ul className="space-y-1 text-slate-600">
                  {guidance.diyFilterGuide.limitations.map((lim, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-slate-200/80 font-semibold text-slate-800">
                  Maintenance Schedule: {guidance.diyFilterGuide.maintenanceSchedule}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDiyModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#0a3526] hover:bg-[#0d402f] text-white text-xs font-bold transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
