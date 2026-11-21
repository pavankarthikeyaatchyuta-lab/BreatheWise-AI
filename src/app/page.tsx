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

  // Dynamic 24-Hour Diurnal Forecast Engine
  const forecastList = aqiData.forecast24h && aqiData.forecast24h.length > 0 ? aqiData.forecast24h : [
    { time: '06:00', pm25: 65, pm10: 110, estimatedCategory: 'Satisfactory' as const, isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' as const, isoTimestamp: '' },
    { time: '09:00', pm25: 55, pm10: 95, estimatedCategory: 'Satisfactory' as const, isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' as const, isoTimestamp: '' },
    { time: '12:00', pm25: 42, pm10: 75, estimatedCategory: 'Good' as const, isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'MODERATE_OUTDOORS' as const, isoTimestamp: '' },
    { time: '15:00', pm25: 38, pm10: 68, estimatedCategory: 'Good' as const, isPeakSmogWindow: false, isRelativeLowWindow: true, activityRecommendation: 'MODERATE_OUTDOORS' as const, isoTimestamp: '' },
    { time: '18:00', pm25: 58, pm10: 102, estimatedCategory: 'Satisfactory' as const, isPeakSmogWindow: false, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' as const, isoTimestamp: '' },
    { time: '21:00', pm25: 72, pm10: 125, estimatedCategory: 'Satisfactory' as const, isPeakSmogWindow: true, isRelativeLowWindow: false, activityRecommendation: 'RESTRICT_VULNERABLE' as const, isoTimestamp: '' },
  ];

  const maxForecastPm = Math.max(...forecastList.map((f) => f.pm25), 50);
  const yCeiling = maxForecastPm > 300 ? 400 : maxForecastPm > 200 ? 300 : maxForecastPm > 100 ? 200 : 100;

  let peakForecast = forecastList[0];
  let lowForecast = forecastList[0];
  forecastList.forEach((f) => {
    if (f.pm25 > peakForecast.pm25) peakForecast = f;
    if (f.pm25 < lowForecast.pm25) lowForecast = f;
  });

  // Calculate coordinates for SVG: viewBox 0 0 600 160
  // Left: 32, Right: 575 (width 543)
  // Baseline: 145, Top: 25 (height 120)
  const chartPoints = forecastList.map((f, idx) => {
    const x = 32 + (idx / Math.max(forecastList.length - 1, 1)) * 543;
    const ratio = Math.min(Math.max(f.pm25 / yCeiling, 0.05), 0.95);
    const y = 145 - ratio * 120;
    return { x, y, ...f };
  });

  // Smooth spline curve
  let curvePath = '';
  if (chartPoints.length > 0) {
    curvePath = `M ${chartPoints[0].x.toFixed(1)},${chartPoints[0].y.toFixed(1)}`;
    for (let i = 0; i < chartPoints.length - 1; i++) {
      const p0 = chartPoints[i];
      const p1 = chartPoints[i + 1];
      const mx = (p0.x + p1.x) / 2;
      curvePath += ` C ${mx.toFixed(1)},${p0.y.toFixed(1)} ${mx.toFixed(1)},${p1.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
    }
  }

  const lastPoint = chartPoints[chartPoints.length - 1] || { x: 575, y: 145 };
  const firstPoint = chartPoints[0] || { x: 32, y: 145 };
  const areaPath = curvePath ? `${curvePath} L ${lastPoint.x.toFixed(1)},150 L ${firstPoint.x.toFixed(1)},150 Z` : '';

  // Find morning peak (between 6:00 and 11:00) and evening peak (between 17:00 and 22:00)
  const morningCandidates = chartPoints.filter((p) => {
    const hr = parseInt(p.time.split(':')[0], 10);
    return hr >= 6 && hr <= 11;
  });
  const morningPeak =
    morningCandidates.length > 0
      ? morningCandidates.reduce((max, p) => (p.pm25 > max.pm25 ? p : max), morningCandidates[0])
      : null;

  const eveningCandidates = chartPoints.filter((p) => {
    const hr = parseInt(p.time.split(':')[0], 10);
    return hr >= 17 && hr <= 22;
  });
  const eveningPeak =
    eveningCandidates.length > 0
      ? eveningCandidates.reduce((max, p) => (p.pm25 > max.pm25 ? p : max), eveningCandidates[0])
      : null;

  // Dynamic recommendations based on current AQI category
  const dynamicRecommendations = React.useMemo(() => {
    if (category === 'Good' || category === 'Satisfactory') {
      return [
        { icon: Home, title: 'Ideal for outdoor walks and children outdoor play' },
        { icon: ShieldCheck, title: 'No mask required for general population' },
        { icon: Wind, title: 'Open windows for natural fresh air ventilation' },
        { icon: Car, title: 'Great day to walk, cycle, or use public transit' },
      ];
    }
    if (category === 'Moderate') {
      return [
        { icon: Home, title: 'Prefer indoor activities (morning & late evening)' },
        { icon: ShieldCheck, title: 'Sensitive groups should use a mask outdoors' },
        { icon: Wind, title: 'Keep windows closed (AQI is elevated)' },
        { icon: Car, title: 'Choose public transport or carpool' },
      ];
    }
    // Poor, Very Poor, Severe
    return [
      { icon: Home, title: 'Prefer indoor activities (morning & late evening)' },
      { icon: ShieldCheck, title: "Use a mask (N95/KN95) if you're outdoors" },
      { icon: Wind, title: 'Keep windows closed (AQI is high)' },
      { icon: Car, title: 'Choose public transport or carpool' },
    ];
  }, [category]);

  // Dynamic stroke color based on peak severity
  const strokeColor =
    peakForecast.pm25 > 250
      ? '#dc2626'
      : peakForecast.pm25 > 120
      ? '#ea580c'
      : peakForecast.pm25 > 60
      ? '#f59e0b'
      : '#10b981';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
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
              <div className="hidden sm:flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 text-center shrink-0 z-10 shadow-xs min-w-[130px] max-w-[170px]">
                <span className="text-[10px] uppercase font-extrabold text-white/80 tracking-wider block">
                  Dominant Pollutant
                </span>
                <span className="text-lg sm:text-xl font-black text-white block mt-0.5 leading-tight">
                  {aqiData.current.dominantPollutant?.toUpperCase() || (dominant.startsWith('PM2.5') ? 'PM2.5' : dominant)}
                </span>
                <span className="text-[10px] text-white/80 font-medium block truncate max-w-[150px]">
                  {dominant.includes('(') ? dominant.split('(')[1].replace(')', '') : 'Criteria Particulate'}
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

            {/* 4 Actionable Items (Dynamically aligned with AQI category) */}
            <div className="space-y-3">
              {dynamicRecommendations.map((rec, i) => {
                const Icon = rec.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[#f7faf8] border border-emerald-50 hover:border-emerald-200 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <strong className="text-slate-800 text-xs font-bold leading-snug">{rec.title}</strong>
                  </div>
                );
              })}
            </div>
          </div>
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
                  Peak: {peakForecast.time} ({Math.round(peakForecast.pm25)} µg/m³)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Lowest: {lowForecast.time} ({Math.round(lowForecast.pm25)} µg/m³)
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
                      <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
                      <stop offset="60%" stopColor="#10b981" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Dynamic Y-axis Ticks */}
                  <text x="5" y="28" fill="#94a3b8" fontSize="9" fontWeight="bold">{yCeiling}</text>
                  <text x="5" y="68" fill="#94a3b8" fontSize="9" fontWeight="bold">{Math.round(yCeiling * 0.75)}</text>
                  <text x="5" y="108" fill="#94a3b8" fontSize="9" fontWeight="bold">{Math.round(yCeiling * 0.5)}</text>
                  <text x="5" y="148" fill="#94a3b8" fontSize="9" fontWeight="bold">{Math.round(yCeiling * 0.25)}</text>

                  {/* Gridlines */}
                  <line x1="28" y1="25" x2="590" y2="25" stroke="#f1f5f9" strokeDasharray="4" />
                  <line x1="28" y1="65" x2="590" y2="65" stroke="#f1f5f9" strokeDasharray="4" />
                  <line x1="28" y1="105" x2="590" y2="105" stroke="#f1f5f9" strokeDasharray="4" />
                  <line x1="28" y1="145" x2="590" y2="145" stroke="#f1f5f9" strokeDasharray="4" />

                  {/* Dynamic Area fill */}
                  {areaPath && <path d={areaPath} fill="url(#forecastGrad)" />}

                  {/* Dynamic Smooth Curve */}
                  {curvePath && (
                    <path
                      d={curvePath}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Morning Spike Badge Floating Above Morning Peak (only when real spike occurs) */}
                  {morningPeak && morningPeak.pm25 >= 80 && morningPeak.pm25 > lowForecast.pm25 * 1.2 && (
                    <g transform={`translate(${Math.max(morningPeak.x - 35, 32)}, ${Math.max(morningPeak.y - 24, 6)})`}>
                      <rect width="70" height="18" rx="6" fill="#fef2f2" stroke="#f87171" strokeWidth="1" />
                      <text x="35" y="12" fill="#dc2626" fontSize="8" fontWeight="bold" textAnchor="middle">Morning Spike</text>
                    </g>
                  )}

                  {/* Evening Spike Badge Floating Above Evening Peak (only when real spike occurs) */}
                  {eveningPeak && eveningPeak.pm25 >= 80 && eveningPeak.pm25 > lowForecast.pm25 * 1.2 && (
                    <g transform={`translate(${Math.min(eveningPeak.x - 35, 500)}, ${Math.max(eveningPeak.y - 24, 6)})`}>
                      <rect width="70" height="18" rx="6" fill="#fef2f2" stroke="#f87171" strokeWidth="1" />
                      <text x="35" y="12" fill="#dc2626" fontSize="8" fontWeight="bold" textAnchor="middle">Evening Spike</text>
                    </g>
                  )}

                  {/* Dynamic Circles on Peak & Low Points */}
                  {morningPeak && (
                    <circle cx={morningPeak.x} cy={morningPeak.y} r="4.5" fill={strokeColor} stroke="#ffffff" strokeWidth="2" />
                  )}
                  {lowForecast && (
                    <circle
                      cx={chartPoints.find((p) => p.time === lowForecast.time)?.x ?? 300}
                      cy={chartPoints.find((p) => p.time === lowForecast.time)?.y ?? 110}
                      r="4.5"
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  )}
                  {eveningPeak && (
                    <circle cx={eveningPeak.x} cy={eveningPeak.y} r="4.5" fill={strokeColor} stroke="#ffffff" strokeWidth="2" />
                  )}
                </svg>

                {/* Dynamic Time Labels on X-axis */}
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1 px-4">
                  {chartPoints.length >= 6
                    ? [0, 1, 2, 3, 4, 5].map((idx) => {
                        const ptIdx = Math.floor((idx / 5) * (chartPoints.length - 1));
                        return <span key={idx}>{chartPoints[ptIdx]?.time || ''}</span>;
                      })
                    : ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'].map((t) => <span key={t}>{t}</span>)}
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

        </div>
      </div>
    </div>
  );
}
