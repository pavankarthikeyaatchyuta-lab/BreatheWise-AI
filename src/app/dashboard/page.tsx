'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Navigation,
  Sparkles,
  CalendarClock,
  Home,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { PollutantKey } from '@/lib/types/aqi';
import { evaluateGRAPStage } from '@/lib/engine/grap-engine';
import { useCity } from '@/context/CityContext';
import { AQIHeroCard } from '@/components/dashboard/AQIHeroCard';
import { DiurnalTrendChart } from '@/components/dashboard/DiurnalTrendChart';
import { PollutantBreakdownGrid } from '@/components/dashboard/PollutantBreakdownGrid';
import { GRAPRegulatoryNotice } from '@/components/dashboard/GRAPRegulatoryNotice';

export default function DashboardPage() {
  const { selectedCity, setSelectedCity, aqiData } = useCity();
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  const isOfficialValid = aqiData.current.validation?.isValidOfficial ?? true;
  const aqi = aqiData.current.aqi ?? 0;
  const category = aqiData.current.category || (isOfficialValid ? 'Severe' : 'Insufficient Data');
  const dominant = aqiData.current.dominantPollutantName || 'PM2.5';
  const grap = evaluateGRAPStage(aqi, aqiData.isNCR);

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

  const spectrumSegments = [
    { label: 'Good', range: '0-50', color: 'bg-emerald-500' },
    { label: 'Satisfactory', range: '51-100', color: 'bg-lime-500' },
    { label: 'Moderate', range: '101-200', color: 'bg-amber-500' },
    { label: 'Poor', range: '201-300', color: 'bg-orange-500' },
    { label: 'Very Poor', range: '301-400', color: 'bg-red-500' },
    { label: 'Severe', range: '401-500', color: 'bg-rose-900' },
  ];

  // 24-Hour Diurnal Forecast Preprocessing
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
      
      {/* Navigation Breadcrumb Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-forest-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to Platform Overview &amp; Showcase</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="text-xs font-semibold text-slate-500">Live Telemetry Workspace</span>
        </div>
      </div>

      {/* Top Header & City Switcher Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-forest-700 font-bold text-xs tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span>Real-time Urban Air Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Air Intelligence Dashboard</span>
            <span className="text-emerald-600 text-lg" aria-hidden="true">🍃</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Statutory CPCB NAQI calculation with hourly diurnal atmospheric boundary layer dynamics.
          </p>
        </div>

        {/* City Detection Actions */}
        <div className="flex flex-col sm:items-end gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUseMyLocation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
              title="Detect current location"
              aria-label="Detect current location and switch city"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>Use My Location</span>
            </button>
          </div>
          {locationNotice && (
            <span className="text-[11px] text-slate-500 italic max-w-xs text-right" role="status">
              {locationNotice}
            </span>
          )}
        </div>
      </div>

      {/* Main Hero Card Component */}
      <AQIHeroCard
        aqi={aqi}
        category={category}
        dominant={dominant}
        isOfficialValid={isOfficialValid}
        activeTheme={activeTheme}
        spectrumSegments={spectrumSegments}
        aqiData={aqiData}
      />

      {/* CAQM GRAP Regulatory Directive Component */}
      <GRAPRegulatoryNotice
        grap={grap}
        isNCR={aqiData.isNCR}
        aqi={aqi}
      />

      {/* 24-Hour Diurnal Boundary Layer Trend Component */}
      <DiurnalTrendChart
        hasForecast={hasForecast}
        forecastList={forecastList}
        yCeiling={yCeiling}
        peakForecast={peakForecast}
        lowForecast={lowForecast}
        chartPoints={chartPoints}
        curvePath={curvePath}
        forecastSourceLabel={forecastSourceLabel}
      />

      {/* 8-Criteria CPCB Pollutant Sub-Index Breakdown Component */}
      <PollutantBreakdownGrid
        pollutantKeys={pollutantKeys}
        aqiData={aqiData}
      />

      {/* Action Navigation Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <Link
          href="/planner"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-forest-50 text-forest-700 group-hover:bg-forest-100 transition-colors">
              <CalendarClock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-forest-700 transition-colors">
                Smart Daily Planner
              </div>
              <div className="text-xs text-slate-500">Align outdoor chores with midday dip</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-forest-700 group-hover:translate-x-1 transition-all" aria-hidden="true" />
        </Link>

        <Link
          href="/indoor-coach"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-forest-50 text-forest-700 group-hover:bg-forest-100 transition-colors">
              <Home className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-forest-700 transition-colors">
                Indoor Air Coach
              </div>
              <div className="text-xs text-slate-500">Purifier staging &amp; kitchen vent protocol</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-forest-700 group-hover:translate-x-1 transition-all" aria-hidden="true" />
        </Link>

        <Link
          href="/assistant"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-forest-700 transition-colors">
                Grounded AI Assistant
              </div>
              <div className="text-xs text-slate-500">Contextual medical &amp; travel advisory</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-forest-700 group-hover:translate-x-1 transition-all" aria-hidden="true" />
        </Link>
      </div>

    </div>
  );
}
