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
  Navigation, 
  CloudRain, 
  Flame, 
  CheckCircle2, 
  Car, 
  ChevronRight, 
  Droplets,
  ArrowLeft
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
  const hasForecast = Boolean(aqiData.forecast24h && aqiData.forecast24h.length > 0);
  const forecastList = hasForecast ? aqiData.forecast24h : [];

  const maxForecastPm = forecastList.length > 0 ? Math.max(...forecastList.map((f) => f.pm25), 50) : 100;
  const yCeiling = maxForecastPm > 300 ? 400 : maxForecastPm > 200 ? 300 : maxForecastPm > 100 ? 200 : 100;

  let peakForecast = forecastList[0] || { time: '--:--', pm25: 0 };
  let lowForecast = forecastList[0] || { time: '--:--', pm25: 0 };
  forecastList.forEach((f) => {
    if (f.pm25 > peakForecast.pm25) peakForecast = f;
    if (f.pm25 < lowForecast.pm25) lowForecast = f;
  });

  const forecastSourceLabel = !hasForecast
    ? 'Forecast Telemetry Unavailable for this coordinate'
    : aqiData.provenance.type === 'ATMOSPHERIC_MODEL_FORECAST'
    ? 'Model Source: Copernicus CAMS Global via Open-Meteo (~45 km grid; 3-hourly underlying model steps interpolated to hourly output)'
    : aqiData.provenance.type === 'DEMO_RECORD'
    ? 'Dataset Source: Historical Winter Smog Reference Profile (Demo Scenario)'
    : `Station Telemetry: ${aqiData.provenance.sourceName}`;

  // SVG chart points calculation
  const chartPoints = forecastList.map((f, idx) => {
    const x = 32 + (idx / Math.max(forecastList.length - 1, 1)) * 543;
    const ratio = Math.min(Math.max(f.pm25 / yCeiling, 0.05), 0.95);
    const y = 145 - ratio * 120;
    return { x, y, ...f };
  });

  let curvePath = '';
  if (chartPoints.length > 0) {
    curvePath = `M ${chartPoints[0].x.toFixed(1)},${chartPoints[0].y.toFixed(1)}`;
    for (let i = 0; i < chartPoints.length - 1; i++) {
      const p0 = chartPoints[i];
      const p1 = chartPoints[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      curvePath += ` C ${cpX.toFixed(1)},${p0.y.toFixed(1)} ${cpX.toFixed(1)},${p1.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
    }
  }

  const fillAreaPath = chartPoints.length > 0
    ? `${curvePath} L ${chartPoints[chartPoints.length - 1].x.toFixed(1)},145 L ${chartPoints[0].x.toFixed(1)},145 Z`
    : '';

  const morningPeak = chartPoints.find((p) => p.time.startsWith('07') || p.time.startsWith('08') || p.time.startsWith('09'));
  const afternoonDip = chartPoints.find((p) => p.time.startsWith('14') || p.time.startsWith('15'));
  const eveningPeak = chartPoints.find((p) => p.time.startsWith('20') || p.time.startsWith('21'));

  const strokeColor = category === 'Good' || category === 'Satisfactory' 
    ? '#10b981' 
    : category === 'Moderate' 
    ? '#f59e0b' 
    : category === 'Poor' 
    ? '#f97316' 
    : '#e11d48';

  const gradientStartColor = strokeColor;
  const gradientStopColor = strokeColor;

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelectedCity('Delhi-NCR');
        setLocationNotice(`Located at ${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E. Mapped to nearest atmospheric reference.`);
      },
      () => {
        setLocationNotice('Location permission denied. Showing selected metro default.');
      }
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Back to Platform Overview Pill */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Platform Overview &amp; Showcase</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-500">Live Telemetry Workspace</span>
        </div>
      </div>

      {/* Top Header & City Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-time Urban Air Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Air Intelligence Dashboard</span>
            <span className="text-emerald-600 text-lg">🍃</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Statutory CPCB NAQI calculation with hourly diurnal atmospheric boundary layer dynamics.
          </p>
        </div>

        {/* City selector & Location notice */}
        <div className="flex flex-col sm:items-end gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUseMyLocation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
              title="Detect current location"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Use My Location</span>
            </button>
          </div>
          {locationNotice && (
            <span className="text-[11px] text-slate-500 italic max-w-xs text-right">
              {locationNotice}
            </span>
          )}
        </div>
      </div>

      {/* Main 2-Column Grid: Left Column Hero AQI & Pollutant Breakdown | Right Column 24h Diurnal Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Hero AQI & Pollutants (7 cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          
          {/* Hero CPCB NAQI Card */}
          <div className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${activeTheme.bgGrad} ${activeTheme.text} shadow-lg relative overflow-hidden`}>
            <div className="relative z-10 flex flex-col justify-between h-full">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 opacity-80" />
                  <span className="font-bold text-sm tracking-wide">{selectedCity}</span>
                  {aqiData.isNCR && (
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-white/20 tracking-wider">
                      Delhi-NCR (CAQM Zone)
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium opacity-80">
                  {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Large AQI Display */}
              <div className="my-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl sm:text-7xl font-black tracking-tighter">
                    {aqi !== null ? aqi : '--'}
                  </span>
                  <span className="text-xl font-bold tracking-tight opacity-90 uppercase">
                    NAQI • {category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm mt-1 opacity-90 max-w-md">
                  Dominant Pollutant: <span className="font-extrabold underline">{dominant}</span>. High particulate concentrations present elevated pulmonary risk.
                </p>
              </div>

              {/* Spectrum Meter Bar */}
              <div className="space-y-1.5 pt-2 border-t border-white/20">
                <div className="flex justify-between text-[11px] font-bold opacity-80">
                  <span>0 Good</span>
                  <span>100 Mod</span>
                  <span>200 Poor</span>
                  <span>300 V.Poor</span>
                  <span>400+ Severe</span>
                </div>
                <div className="h-2 w-full rounded-full bg-black/20 flex overflow-hidden p-0.5 gap-0.5">
                  {spectrumSegments.map((seg, idx) => (
                    <div
                      key={idx}
                      className={`h-full flex-1 rounded-xs ${seg.color} ${category === seg.label ? 'ring-2 ring-white scale-y-125' : 'opacity-60'}`}
                      title={`${seg.label}: ${seg.range}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Criteria Pollutants 8-Grid */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Wind className="w-4 h-4 text-emerald-600" />
                <span>8 CPCB Criteria Pollutants</span>
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                {aqiData.current.validation?.pollutantCount || 6}/8 Parameters Monitored
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {pollutantKeys.map((key) => {
                const p = aqiData.current.pollutants[key];
                const isDominant = key === aqiData.current.dominantPollutant;
                const hasValue = p && p.value >= 0;

                return (
                  <div
                    key={key}
                    className={`p-3 rounded-2xl border transition-all ${
                      isDominant
                        ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-200'
                        : 'bg-slate-50/70 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="uppercase text-slate-600">{key.toUpperCase()}</span>
                      {isDominant && (
                        <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider">
                          Dominant
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-lg font-extrabold text-slate-900">
                        {hasValue ? p.value : '—'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {p?.unit || 'µg/m³'}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500 flex justify-between items-center">
                      <span>Sub-Index:</span>
                      <span className="font-bold text-slate-800">
                        {p?.subIndex !== null && p?.subIndex !== undefined ? p.subIndex : '—'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic 24h Diurnal Curve & Protective Guidance (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* Diurnal Forecast Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    24h Diurnal Smog Dynamics
                  </span>
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Boundary Layer Shifts
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                {forecastSourceLabel}
              </p>

              {/* Forecast SVG Chart */}
              <div className="w-full relative bg-slate-50/80 rounded-2xl border border-slate-100 p-3 pt-6 mb-4">
                <svg viewBox="0 0 600 160" className="w-full h-36 overflow-visible" aria-label="Diurnal AQI Forecast Chart">
                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0.35" />
                      <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid guide lines */}
                  <line x1="32" y1="25" x2="575" y2="25" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="32" y1="85" x2="575" y2="85" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="32" y1="145" x2="575" y2="145" stroke="#cbd5e1" strokeWidth="1" />

                  {/* Shaded Area fill */}
                  {fillAreaPath && <path d={fillAreaPath} fill="url(#curveGradient)" />}

                  {/* Main Trendline Spline */}
                  {curvePath && (
                    <path d={curvePath} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                  )}

                  {/* Morning Peak Marker */}
                  {morningPeak && (
                    <circle cx={morningPeak.x} cy={morningPeak.y} r="4.5" fill={strokeColor} stroke="#ffffff" strokeWidth="2" />
                  )}

                  {/* Afternoon Dip Marker */}
                  {afternoonDip && (
                    <circle cx={afternoonDip.x} cy={afternoonDip.y} r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  )}

                  {/* Evening Peak Marker */}
                  {eveningPeak && (
                    <circle cx={eveningPeak.x} cy={eveningPeak.y} r="4.5" fill={strokeColor} stroke="#ffffff" strokeWidth="2" />
                  )}
                </svg>

                {/* Dynamic Time Labels */}
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1 px-4">
                  {chartPoints.length >= 6
                    ? [0, 1, 2, 3, 4, 5].map((idx) => {
                        const ptIdx = Math.floor((idx / 5) * (chartPoints.length - 1));
                        return <span key={idx}>{chartPoints[ptIdx]?.time || ''}</span>;
                      })
                    : ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'].map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>

              {/* Actionable Insights derived from curve */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-emerald-900">Optimal Outdoor Window: 13:00 – 16:00</span>
                    <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                      Solar thermal convection deepens the planetary boundary layer, providing lower particulate exposure for essential errands.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-rose-900">Morning Inversion Alert: 06:00 – 09:30</span>
                    <p className="text-[11px] text-rose-800 leading-relaxed mt-0.5">
                      Shallow nocturnal inversion traps vehicular exhaust and biomass smoke. Strictly avoid outdoor aerobic workouts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links to Planner & Assistant */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <Link
                href="/planner"
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-colors"
              >
                Plan Family Routine →
              </Link>
              <Link
                href="/assistant"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs text-center transition-colors"
              >
                Ask Grounded AI
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
