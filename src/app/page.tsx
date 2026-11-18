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
  Navigation
} from 'lucide-react';
import { AirQualityState, PollutantKey } from '@/lib/types/aqi';
import { getDelhiDemoState } from '@/lib/aqi/demo-data';
import { POLLUTANT_NAMES } from '@/lib/aqi/cpcb-calc';
import { evaluateGRAPStage } from '@/lib/engine/grap-engine';

const CITIES = [
  'Delhi-NCR',
  'Mumbai',
  'Bengaluru',
  'Kolkata',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Lucknow',
  'Patna',
];

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

  // Browser Geolocation with explicit consent and privacy truncation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice('Geolocation is not supported by your browser.');
      return;
    }

    setLocationNotice('Requesting browser location access...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // Truncate coordinates to 2 decimal places (~1.1 km resolution) for privacy protection
        const truncLat = Number(pos.coords.latitude.toFixed(2));
        const truncLon = Number(pos.coords.longitude.toFixed(2));

        setLocationNotice(`Location detected (~1 km precision: ${truncLat}°N, ${truncLon}°E). Fetching local data...`);
        setLoading(true);
        try {
          const res = await fetch(`/api/aqi?lat=${truncLat}&lon=${truncLon}&city=Nearby%20Station`);
          if (res.ok) {
            const json: AirQualityState = await res.json();
            setAqiData(json);
            setSelectedCity('Nearby Station');
            setLocationNotice(null);
          }
        } catch {
          setLocationNotice('Failed to fetch data for detected coordinates. Falling back to default.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLocationNotice('Location permission denied. You can select your city manually above.');
      }
    );
  };

  const aqi = aqiData.current.aqi ?? 320;
  const category = aqiData.current.category ?? 'Severe';
  const dominant = aqiData.current.dominantPollutantName ?? 'PM2.5 (Fine Particulate Matter)';
  const grap = evaluateGRAPStage(aqi, aqiData.isNCR);

  // Category Color Map
  const categoryStyles: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    'Good': { bg: 'bg-emerald-500', text: 'text-emerald-950', border: 'border-emerald-300', badge: 'bg-emerald-100 text-emerald-800' },
    'Satisfactory': { bg: 'bg-lime-500', text: 'text-lime-950', border: 'border-lime-300', badge: 'bg-lime-100 text-lime-800' },
    'Moderate': { bg: 'bg-amber-500', text: 'text-amber-950', border: 'border-amber-300', badge: 'bg-amber-100 text-amber-800' },
    'Poor': { bg: 'bg-orange-500', text: 'text-orange-950', border: 'border-orange-300', badge: 'bg-orange-100 text-orange-800' },
    'Very Poor': { bg: 'bg-red-500', text: 'text-red-950', border: 'border-red-300', badge: 'bg-red-100 text-red-800' },
    'Severe': { bg: 'bg-rose-900', text: 'text-white', border: 'border-rose-700', badge: 'bg-rose-100 text-rose-900' },
  };

  const activeStyle = categoryStyles[category] || categoryStyles['Severe'];

  const pollutantKeys: PollutantKey[] = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3', 'nh3', 'pb'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & City Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-forest-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <MapPin className="w-4 h-4" />
            <span>Air Intelligence Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {aqiData.city} Air Quality
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Region: {aqiData.region} {aqiData.isNCR ? '• NCR Statutory CAQM Zone' : '• Regional State Framework'}
          </p>
        </div>

        {/* Location Picker & Geolocation */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-forest-500 focus:outline-none font-medium"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={handleUseCurrentLocation}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors border border-slate-200"
            title="Use browser location (truncated to ~1 km for privacy)"
          >
            <Navigation className="w-4 h-4 text-forest-600" />
            <span className="hidden sm:inline">Use Location</span>
          </button>
        </div>
      </div>

      {locationNotice && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{locationNotice}</span>
        </div>
      )}

      {/* Main Grid: AQI Master Card & GRAP Regulation Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Master CPCB NAQI Card (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                Statutory CPCB NAQI (India Standard)
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-6xl sm:text-7xl font-black tracking-tight text-slate-900">
                  {aqi}
                </span>
                <div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase ${activeStyle.badge}`}>
                    {category}
                  </span>
                  <div className="text-xs text-slate-500 font-medium mt-1">
                    Dominant: <strong className="text-slate-800">{dominant}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Advisory Tag */}
            <div className="sm:max-w-xs text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
              <strong className="text-slate-900 block mb-1">CPCB Health Impact:</strong>
              {category === 'Severe' && 'Respiratory effects on healthy people; serious impacts on people with heart/lung disease even during light exertion.'}
              {category === 'Very Poor' && 'Respiratory illness on prolonged exposure. Significant effects on people with asthma or bronchitis.'}
              {category === 'Poor' && 'Breathing discomfort to most people on prolonged exposure.'}
              {category === 'Moderate' && 'Breathing discomfort to people with asthma, heart ailments, and young children.'}
              {category === 'Satisfactory' && 'Minor breathing discomfort to sensitive people.'}
              {category === 'Good' && 'Minimal health impact.'}
            </div>
          </div>

          {/* Data Provenance & Freshness Badge */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-semibold text-[11px] ${
                aqiData.provenance.type === 'MEASURED_STATION'
                  ? 'bg-emerald-100 text-emerald-800'
                  : aqiData.provenance.type === 'ATMOSPHERIC_MODEL_FORECAST'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                {aqiData.provenance.type === 'MEASURED_STATION' ? 'Measured Station Data' : aqiData.provenance.type === 'ATMOSPHERIC_MODEL_FORECAST' ? 'Atmospheric Model (~45km)' : 'Demonstration Smog Profile'}
              </span>
              <span>Source: {aqiData.provenance.sourceName}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Resolution: {aqiData.provenance.spatialResolution}</span>
            </div>
          </div>
        </div>

        {/* Regulatory GRAP / Community Advisory Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between border border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
                {aqiData.isNCR ? 'Statutory CAQM Directive' : 'Regional Advisory Framework'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
                {grap.activeStage}
              </span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-white mb-2">
              {grap.stageName}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {grap.summary}
            </p>

            <div className="text-[11px] text-slate-400 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 leading-normal mb-4">
              <strong>Jurisdiction:</strong> {grap.jurisdictionDisclaimer}
            </div>
          </div>

          <Link
            href="/community"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-white text-xs font-semibold transition-colors"
          >
            <span>View RWA & School Action Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 24-Hour Diurnal Forecast & Inversion Curve */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-forest-600" />
              <span>24-Hour Diurnal Smog Forecast Curve</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies morning/evening temperature inversion spikes vs afternoon boundary-layer dispersion lows.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-rose-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Inversion Smog Spike (6-9 AM & 7-10 PM)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Relative Low Window (1-4 PM)
            </span>
          </div>
        </div>

        {/* Diurnal Bar Visualizer */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-4">
          {aqiData.forecast24h.slice(0, 12).map((h, i) => (
            <div
              key={i}
              className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                h.isRelativeLowWindow
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold shadow-xs'
                  : h.isPeakSmogWindow
                  ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-xs font-bold text-slate-600 mb-1">{h.time}</span>
              <span className="text-sm font-extrabold text-slate-900">
                {h.pm25}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider -mt-0.5">µg/m³</span>
              <span className={`mt-2 text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                h.estimatedCategory === 'Severe'
                  ? 'bg-rose-200 text-rose-900'
                  : h.estimatedCategory === 'Very Poor'
                  ? 'bg-orange-200 text-orange-900'
                  : 'bg-emerald-200 text-emerald-900'
              }`}>
                {h.estimatedCategory}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-forest-600 shrink-0" />
            <span>
              <strong>Scientific Rule:</strong> Never assume any window is universally safe during severe winter episodes. BreatheWise identifies <em>relative diurnal lows</em> to minimize exposure during unavoidable errands.
            </span>
          </div>
          <Link href="/planner" className="text-forest-700 hover:text-forest-800 font-bold shrink-0 text-xs">
            Plan Day Accordingly →
          </Link>
        </div>
      </div>

      {/* 8-Pollutant Breakdown Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Complete 8-Pollutant CPCB Sub-Index Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated per statutory averaging rules: 24h average (≥16h data) for PM2.5, PM10, NO2, SO2, NH3, Pb; 8h for CO, O3.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {pollutantKeys.map((key) => {
            const item = aqiData.current.pollutants[key];
            const isDominant = aqiData.current.dominantPollutant === key;

            return (
              <div
                key={key}
                className={`p-4 rounded-xl border transition-all ${
                  isDominant
                    ? 'border-forest-500 bg-forest-50/40 ring-1 ring-forest-500/20'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {key.toUpperCase()}
                  </span>
                  {isDominant && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-forest-600 text-white uppercase">
                      Dominant
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-900">
                    {item && item.value >= 0 ? item.value : 'N/A'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {item?.unit || 'µg/m³'}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Sub-Index: <strong>{item?.subIndex ?? '—'}</strong></span>
                  <span className="font-semibold text-slate-700">{item?.category ?? 'Validating'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/planner"
          className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-forest-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <CalendarClock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Smart Daily Routine Planner</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Personalized schedule adaptation for children, elderly parents, and commuters. Shifts exercise indoors and guides anti-idling.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-forest-700 group-hover:translate-x-1 transition-transform">
            <span>Configure Family Schedule</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          href="/indoor-coach"
          className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-forest-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Indoor Air Quality Coach</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dynamic window ventilation advisor, tadka/cooking exhaust protocol, wet mopping vs dry sweeping, and safe Corsi-Rosenthal DIY blueprints.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
            <span>Explore Zero-Cost Hacks</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          href="/assistant"
          className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-forest-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Grounded Gemini AI Assistant</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ask natural language questions grounded strictly in real CPCB telemetry and deterministic models. Zero fake data, zero medical claims.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-purple-700 group-hover:translate-x-1 transition-transform">
            <span>Ask Family Advice</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
