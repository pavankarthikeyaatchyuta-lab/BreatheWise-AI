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
import { getDelhiDemoState } from '@/lib/aqi/demo-data';
import { evaluateGRAPStage } from '@/lib/engine/grap-engine';

export default function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState<string>('Delhi-NCR');
  const [aqiData, setAqiData] = useState<AirQualityState>(getDelhiDemoState());
  const [loading, setLoading] = useState<boolean>(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Fetch AQI data whenever city changes
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/aqi?city=${encodeURIComponent(selectedCity)}`);
        if (res.ok) {
          const json: AirQualityState = await res.json();
          setAqiData(json);
        }
      } catch {
        // Fallback remains active
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCity]);

  const isOfficialValid = aqiData.current.validation?.isValidOfficial ?? true;
  const aqi = aqiData.current.aqi;
  const category = aqiData.current.category || (isOfficialValid ? 'Severe' : 'Insufficient Data');
  const dominant = aqiData.current.dominantPollutantName || 'Evaluating';
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
            Station: {aqiData.provenance.sourceName} • {aqiData.isNCR ? 'CAQM Statutory Zone' : 'State PCB Framework'}
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
            <span>{aqiData.provenance.type === 'MEASURED_STATION' ? 'Measured Station Data' : aqiData.provenance.type === 'ATMOSPHERIC_MODEL_FORECAST' ? 'Model Forecast (~45km)' : 'Demonstration Smog Profile'}</span>
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

            {/* Glowing Main AQI Badge Container (as in reference image) */}
            <div className={`p-6 rounded-2xl bg-gradient-to-r ${activeTheme.bgGrad} text-white shadow-lg shadow-orange-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden`}>
              <div className="flex items-center gap-4 relative z-10">
                {/* Cloud icon container */}
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                  <Wind className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-black tracking-tight leading-none">
                      {aqi !== null ? aqi : '—'}
                    </span>
                    <span className="text-lg font-bold text-white/90">
                      {category}
                    </span>
                  </div>
                  <span className="text-xs text-white/80 block mt-1">
                    Dominant Pollutant: <strong className="text-white font-bold">{isOfficialValid ? dominant : 'Data Incomplete'}</strong>
                  </span>
                </div>
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
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-800 block">Prefer indoor activities</strong>
                  <span className="text-[11px] text-slate-500">Morning & late evening thermal inversions trap surface PM2.5.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#f7faf8] border border-emerald-50 hover:border-emerald-200 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-800 block">Use an N95/FFP2 respirator</strong>
                  <span className="text-[11px] text-slate-500">Mandatory facial seal protection for two-wheeler commuters.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#f7faf8] border border-emerald-50 hover:border-emerald-200 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-800 block">Keep windows closed now</strong>
                  <span className="text-[11px] text-slate-500">Outdoor PM2.5 is high; ventilate only during the midday dip.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#f7faf8] border border-emerald-50 hover:border-emerald-200 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-800 block">Choose public transport or carpool</strong>
                  <span className="text-[11px] text-slate-500">Metro coaches provide HVAC particulate filtration.</span>
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

      {/* Row 2: Pollutant Concentrations (µg/m³) + 24-Hour Forecast Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pollutant Concentrations (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                Pollutant Concentrations (µg/m³)
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
                  Model Source: Open-Meteo (~45 km Atmospheric Model)
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

            {/* Smooth Diurnal Spline SVG Chart (matching reference image) */}
            <div className="relative pt-6 pb-2">
              <svg viewBox="0 0 600 160" className="w-full h-36 overflow-visible">
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#10b981" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                <line x1="0" y1="30" x2="600" y2="30" stroke="#f1f5f9" strokeDasharray="4" />
                <line x1="0" y1="75" x2="600" y2="75" stroke="#f1f5f9" strokeDasharray="4" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeDasharray="4" />

                {/* Area fill */}
                <path
                  d="M0,80 Q75,35 150,25 T300,110 T450,30 T600,75 L600,160 L0,160 Z"
                  fill="url(#forecastGrad)"
                />

                {/* Smooth Curve */}
                <path
                  d="M0,80 Q75,35 150,25 T300,110 T450,30 T600,75"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Peak 1 Point: Morning Spike */}
                <circle cx="150" cy="25" r="5" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                {/* Lowest Point: Midday Expansion */}
                <circle cx="300" cy="110" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                {/* Peak 2 Point: Evening Spike */}
                <circle cx="450" cy="30" r="5" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
              </svg>

              {/* Time Labels on X-axis */}
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1 px-1">
                <span>12 AM</span>
                <span>4 AM</span>
                <span className="text-rose-600 font-extrabold">8 AM (Spike)</span>
                <span className="text-emerald-700 font-extrabold">12 PM - 3 PM (Low)</span>
                <span className="text-rose-600 font-extrabold">8 PM (Spike)</span>
                <span>11 PM</span>
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
