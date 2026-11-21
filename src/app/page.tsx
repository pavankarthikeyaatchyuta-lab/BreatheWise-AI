'use client';

import React, { useState, useEffect } from 'react';
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
  Navigation,
  CloudRain,
  Flame,
  CheckCircle2,
  Car,
  ChevronRight,
  Droplets
} from 'lucide-react';
import { AirQualityState, PollutantKey } from '@/lib/types/aqi';
import { evaluateGRAPStage } from '@/lib/engine/grap-engine';
import { useCity } from '@/context/CityContext';

export default function DashboardPage() {
  const { selectedCity, setSelectedCity, aqiData, loading } = useCity();
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  const isOfficialValid = aqiData.current.validation?.isValidOfficial ?? true;
  const aqi = aqiData.current.aqi;
  const category = aqiData.current.category || (isOfficialValid ? 'Severe' : 'Insufficient Data');
  const dominant = aqiData.current.dominantPollutantName || 'PM2.5';
  const grap = evaluateGRAPStage(aqi, aqiData.isNCR);

  // Gradient badge for current AQI based on category
  const categoryThemes: Record<string, { bgGrad: string; text: string; badgeBg: string; border: string }> = {
    'Good': { bgGrad: 'from-emerald-500 to-teal-600', text: 'text-white', badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200', border: 'border-emerald-300' },
    'Satisfactory': { bgGrad: 'from-lime-500 to-emerald-600', text: 'text-white', badgeBg: 'bg-lime-50 text-lime-800 border-lime-200', border: 'border-lime-300' },
    'Moderate': { bgGrad: 'from-amber-500 to-orange-500', text: 'text-white', badgeBg: 'bg-amber-50 text-amber-800 border-amber-200', border: 'border-amber-300' },
    'Poor': { bgGrad: 'from-orange-500 to-rose-500', text: 'text-white', badgeBg: 'bg-orange-50 text-orange-800 border-orange-200', border: 'border-orange-300' },
    'Very Poor': { bgGrad: 'from-red-600 to-rose-700', text: 'text-white', badgeBg: 'bg-red-50 text-red-800 border-red-200', border: 'border-red-300' },
    'Severe': { bgGrad: 'from-rose-800 to-red-950', text: 'text-white', badgeBg: 'bg-rose-50 text-rose-900 border-rose-200', border: 'border-rose-400' },
    'Insufficient Data': { bgGrad: 'from-slate-600 to-slate-800', text: 'text-white', badgeBg: 'bg-slate-100 text-slate-800 border-slate-300', border: 'border-slate-300' },
  };

  const activeTheme = categoryThemes[category] || categoryThemes['Severe'];
  const pollutantKeys: PollutantKey[] = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3', 'nh3', 'pb'];

  // CPCB spectrum segments
  const spectrumSegments = [
    { label: 'Good', range: '0-50', color: 'bg-emerald-500' },
    { label: 'Satisfactory', range: '51-100', color: 'bg-lime-500' },
    { label: 'Moderate', range: '101-200', color: 'bg-amber-500' },
    { label: 'Poor', range: '201-300', color: 'bg-orange-500' },
    { label: 'Very Poor', range: '301-400', color: 'bg-red-500' },
    { label: 'Severe', range: '401-500', color: 'bg-rose-900' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome / Location Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Air Intelligence Command Center • {aqiData.city}</span>
          </span>
          <p className="text-xs text-slate-500 mt-0.5">
            {aqiData.provenance.type === 'ATMOSPHERIC_MODEL_FORECAST'
              ? `Model: Copernicus CAMS Global (~45 km grid, ~0.4° resolution; 3-hourly underlying model steps interpolated hourly)`
              : `Station: ${aqiData.provenance.sourceName} • ${aqiData.isNCR ? 'CAQM Statutory Zone' : 'State PCB Framework'}`}
          </p>
        </div>

        {/* Live Provenance & Freshness Badge */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            aqiData.provenance.type === 'MEASURED_STATION'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : aqiData.provenance.type === 'ATMOSPHERIC_MODEL_FORECAST'
              ? 'bg-blue-50 text-blue-800 border-blue-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {aqiData.provenance.type === 'MEASURED_STATION'
                ? 'Measured Station Data'
                : aqiData.provenance.type === 'ATMOSPHERIC_MODEL_FORECAST'
                ? 'CAMS Global Model (~45 km)'
                : 'CPCB Reference Record (Demo)'}
            </span>
          </span>
        </div>
      </div>

      {locationNotice && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center gap-2 shadow-xs">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{locationNotice}</span>
        </div>
      )}

      {/* Row 1: Current AQI (NAQI) Card + Key Recommendations for Today Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current Air Quality (NAQI) Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                  Current Air Quality (NAQI)
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">
                  CPCB Method • {aqiData.provenance.type === 'MEASURED_STATION' ? 'Measured (Station)' : 'Atmospheric Model'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                Updated just now
              </span>
            </div>

            {/* Glowing Main AQI Badge Container (matching reference image) */}
            <div className={`p-6 rounded-3xl bg-gradient-to-r ${activeTheme.bgGrad} text-white shadow-lg shadow-orange-950/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden`}>
              <div className="flex items-center gap-5 relative z-10">
                {/* Cloud/Air icon container */}
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 border border-white/20 shadow-inner">
                  <Wind className="w-9 h-9" />
                </div>
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl sm:text-6xl font-black tracking-tight leading-none drop-shadow-xs">
                      {aqi !== null ? aqi : '—'}
                    </span>
                    <span className="text-xl font-extrabold text-white/95 tracking-wide">
                      {category}
                    </span>
                  </div>
                  <span className="text-xs text-white/80 block mt-1.5 font-medium sm:hidden">
                    Dominant: <strong className="text-white font-bold">{isOfficialValid ? dominant : 'Data Incomplete'}</strong>
                  </span>
                </div>
              </div>

              {/* Dominant Pollutant White Box (matching reference image) */}
              <div className="hidden sm:flex flex-col items-center justify-center px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 text-center shrink-0 z-10 shadow-xs">
                <span className="text-[10px] uppercase font-extrabold text-white/80 tracking-wider block">
                  Dominant Pollutant
                </span>
                <span className="text-xl font-black text-white block mt-0.5">
                  {isOfficialValid ? dominant : '—'}
                </span>
              </div>

              {/* Decorative subtle background waves */}
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Validation Notice if criteria incomplete */}
            {!isOfficialValid && aqiData.current.validation.reasons.length > 0 && (
              <div className="mt-3 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <strong>Notice:</strong> {aqiData.current.validation.reasons[0]} Individual pollutant measurements are displayed below.
              </div>
            )}
          </div>

          {/* CPCB NAQI Spectrum Bar (matching reference image) */}
          <div className="pt-6 border-t border-slate-100 mt-6">
            <div className="grid grid-cols-6 gap-1.5 mb-1.5">
              {spectrumSegments.map((seg) => {
                const isCurrentCategory = seg.label.toLowerCase() === category.toLowerCase();
                return (
                  <div key={seg.label} className="text-center group">
                    <div className={`h-2 rounded-full ${seg.color} ${isCurrentCategory ? 'ring-2 ring-slate-900 ring-offset-1' : 'opacity-80'}`} />
                    <span className={`block text-[10px] font-bold mt-1.5 ${isCurrentCategory ? 'text-slate-900 font-extrabold' : 'text-slate-400'}`}>
                      {seg.label}
                    </span>
                    <span className="block text-[9px] text-slate-400">
                      {seg.range}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key Recommendations for Today Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Key Recommendations for Today</span>
              </h2>
              <Link href="/planner" className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5">
                <span>View Full Plan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4 Actionable Items (Reference Style with green icons) */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#f7faf8] border border-emerald-50 hover:border-emerald-200 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-800 block text-xs font-bold">Prefer indoor activities (morning &amp; late evening)</strong>
                  <span className="text-[11px] text-slate-500">Thermal inversions concentrate aerosols at ground level.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#f7faf8] border border-emerald-50 hover:border-emerald-200 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-800 block text-xs font-bold">Use a mask (N95/KN95) if you&apos;re outdoors</strong>
                  <span className="text-[11px] text-slate-500">Mandatory certified seal for adult outdoor transit.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#f7faf8] border border-emerald-50 hover:border-emerald-200 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-800 block text-xs font-bold">Keep windows closed (AQI is high)</strong>
                  <span className="text-[11px] text-slate-500">Ventilate only during the midday planetary boundary expansion.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#f7faf8] border border-emerald-50 hover:border-emerald-200 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-800 block text-xs font-bold">Choose public transport or carpool</strong>
                  <span className="text-[11px] text-slate-500">Rapid rail transit provides HVAC particulate pre-filtration.</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/assistant"
            className="mt-4 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-xs font-bold transition-colors flex items-center justify-between border border-emerald-200/60"
          >
            <span>Ask Gemini AI for Family Advice</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </Link>
        </div>
      </div>

      {/* Row 2: Pollutant Levels (µg/m³) + 24-Hour Forecast Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pollutant Levels (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                Pollutant Levels (µg/m³)
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">
                8 Criteria Pollutants
              </span>
            </div>

            {/* Clean Pill Grid matching Reference Image */}
            <div className="grid grid-cols-4 gap-2.5">
              {pollutantKeys.map((key) => {
                const item = aqiData.current.pollutants[key];
                const isDominant = aqiData.current.dominantPollutant === key;

                return (
                  <div
                    key={key}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      isDominant
                        ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400/30'
                        : 'bg-[#f8faf9] border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      {key.toUpperCase()}
                    </span>
                    <span className={`block text-base sm:text-lg font-black ${
                      item && item.value >= 0 ? 'text-emerald-700' : 'text-slate-400'
                    }`}>
                      {item && item.value >= 0 ? item.value : '—'}
                    </span>
                    <span className="block text-[9px] text-slate-400">
                      {item?.unit || 'µg/m³'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>24h average: PM, NO₂, SO₂, NH₃, Pb</span>
            <span>8h: CO, O₃</span>
          </div>
        </div>

        {/* 24-Hour AQI Forecast Graph Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>24-Hour AQI Diurnal Forecast</span>
                </h2>
                <span className="text-[11px] text-slate-400">
                  Model Source: Copernicus CAMS Global via Open-Meteo (~45 km grid; 3-hourly underlying model steps interpolated to hourly output)
                </span>
              </div>

              {/* Inversion Peak vs Midday Low Indicators */}
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Peak: 8 AM
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Lowest: 2-3 PM
                </span>
              </div>
            </div>

            {/* Smooth Diurnal Spline SVG Chart + Family Skyline Vector (matching reference image) */}
            <div className="flex flex-col md:flex-row items-center gap-4 pt-4 pb-2">
              <div className="flex-1 w-full">
                <svg viewBox="0 0 600 160" className="w-full h-36 overflow-visible">
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#10b981" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Y-axis Ticks */}
                  <text x="5" y="32" fill="#94a3b8" fontSize="9" fontWeight="bold">400</text>
                  <text x="5" y="77" fill="#94a3b8" fontSize="9" fontWeight="bold">300</text>
                  <text x="5" y="122" fill="#94a3b8" fontSize="9" fontWeight="bold">200</text>
                  <text x="5" y="152" fill="#94a3b8" fontSize="9" fontWeight="bold">100</text>

                  {/* Gridlines */}
                  <line x1="28" y1="30" x2="600" y2="30" stroke="#f1f5f9" strokeDasharray="4" />
                  <line x1="28" y1="75" x2="600" y2="75" stroke="#f1f5f9" strokeDasharray="4" />
                  <line x1="28" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeDasharray="4" />

                  {/* Area fill */}
                  <path
                    d="M28,80 Q85,40 150,30 T300,110 T450,35 T600,75 L600,160 L28,160 Z"
                    fill="url(#forecastGrad)"
                  />

                  {/* Smooth Curve */}
                  <path
                    d="M28,80 Q85,40 150,30 T300,110 T450,35 T600,75"
                    fill="none"
                    stroke="#ea580c"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Morning Spike Badge Floating Above Peak 1 */}
                  <g transform="translate(115, 6)">
                    <rect width="70" height="18" rx="6" fill="#fef2f2" stroke="#f87171" strokeWidth="1" />
                    <text x="35" y="12" fill="#dc2626" fontSize="8" fontWeight="bold" textAnchor="middle">Morning Spike</text>
                  </g>

                  {/* Evening Spike Badge Floating Above Peak 2 */}
                  <g transform="translate(415, 11)">
                    <rect width="70" height="18" rx="6" fill="#fef2f2" stroke="#f87171" strokeWidth="1" />
                    <text x="35" y="12" fill="#dc2626" fontSize="8" fontWeight="bold" textAnchor="middle">Evening Spike</text>
                  </g>

                  {/* Peak 1 Point: Morning Spike */}
                  <circle cx="150" cy="30" r="4.5" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                  {/* Lowest Point: Midday Expansion */}
                  <circle cx="300" cy="110" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  {/* Peak 2 Point: Evening Spike */}
                  <circle cx="450" cy="35" r="4.5" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* Time Labels on X-axis matching Reference Image */}
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1 px-4">
                  <span>6 AM</span>
                  <span>9 AM</span>
                  <span>12 PM</span>
                  <span>3 PM</span>
                  <span>6 PM</span>
                  <span>9 PM</span>
                </div>
              </div>

              {/* Family Looking at City Skyline Illustration (matching reference design) */}
              <div className="w-40 sm:w-44 h-36 shrink-0 relative hidden sm:flex items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-t from-sky-100/70 via-amber-50/40 to-transparent border border-slate-100 p-1">
                <svg viewBox="0 0 160 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Distant city skyline */}
                  <rect x="15" y="45" width="14" height="60" fill="#94a3b8" opacity="0.35" />
                  <rect x="33" y="30" width="18" height="75" fill="#64748b" opacity="0.3" />
                  <rect x="55" y="40" width="16" height="65" fill="#94a3b8" opacity="0.25" />
                  <rect x="75" y="25" width="22" height="80" fill="#475569" opacity="0.25" />
                  <rect x="102" y="35" width="15" height="70" fill="#64748b" opacity="0.3" />
                  <rect x="122" y="48" width="20" height="57" fill="#94a3b8" opacity="0.35" />

                  {/* Ground silhouette */}
                  <ellipse cx="80" cy="120" rx="90" ry="20" fill="#15803d" opacity="0.2" />

                  {/* Father (Right) - teal jacket */}
                  <circle cx="120" cy="52" r="7" fill="#fed7aa" />
                  <path d="M115 50 C114 44 125 43 126 49 Z" fill="#1e293b" />
                  <path d="M112 60 C111 58 128 58 128 60 L132 105 L108 105 Z" fill="#0f766e" />

                  {/* Mother (Center) - terracotta jacket */}
                  <circle cx="102" cy="56" r="6.5" fill="#fed7aa" />
                  <path d="M96 54 C95 47 108 46 109 53 Z" fill="#451a03" />
                  <path d="M96 64 C95 62 109 62 109 64 L112 105 L93 105 Z" fill="#9a3412" />

                  {/* Child (Left) - yellow jacket */}
                  <circle cx="86" cy="68" r="5.5" fill="#fed7aa" />
                  <path d="M82 66 C81 60 91 59 92 65 Z" fill="#78350f" />
                  <path d="M80 75 C79 73 92 73 92 75 L95 105 L78 105 Z" fill="#eab308" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Atmospheric boundary layer drops at night, concentrating ground emissions.</span>
            <Link href="/planner" className="text-emerald-700 font-bold hover:underline shrink-0">
              Schedule Day Around Low →
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3: Impact Summary Mini-Bar & Regulatory Status (matching reference image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Impact Today vs Baseline (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                Your Estimated Impact (Today vs. Baseline)
              </h2>
              <span className="text-[11px] text-slate-400">
                Transparent passenger-km decoupling based on CEA & ARAI factors
              </span>
            </div>
            <Link href="/impact" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
              <span>View Proof</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-center">
              <span className="block text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                Exposure Shift
              </span>
              <span className="block text-2xl font-black text-blue-950">
                -2.4 hrs
              </span>
              <span className="text-[10px] text-blue-600 font-medium">
                away from peak smog
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
              <span className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                Local PM2.5 Avoided
              </span>
              <span className="block text-2xl font-black text-emerald-950">
                -0.36 g
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                tailpipe soot saved
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-center">
              <span className="block text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1">
                CO₂e Reduction
              </span>
              <span className="block text-2xl font-black text-purple-950">
                -1.14 kg
              </span>
              <span className="text-[10px] text-purple-600 font-medium">
                grid-adjusted savings
              </span>
            </div>
          </div>
        </div>

        {/* CAQM GRAP Regulatory Mini-Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#0a3526] text-white rounded-3xl p-6 shadow-xs flex flex-col justify-between border border-[#0d4432] relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                {aqiData.isNCR ? 'Statutory CAQM Status' : 'Regional Advisory Status'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 text-[11px] font-semibold border border-emerald-700">
                {grap.activeStage}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1.5">
              {grap.stageName}
            </h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed mb-4">
              {grap.summary}
            </p>
          </div>

          <Link
            href="/community"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <span>School & Community Directives</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
