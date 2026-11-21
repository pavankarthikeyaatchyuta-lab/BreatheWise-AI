'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Car, 
  Train, 
  Bike, 
  Bus, 
  Users, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Info,
  Flame,
  Sun,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { TransportMode } from '@/lib/types/alternatives';
import { compareTransportAlternatives, TRANSPORT_FACTORS } from '@/lib/engine/alternatives';
import { useCity } from '@/context/CityContext';
import { useScenario } from '@/context/ScenarioContext';

const CITY_TRANSIT_NAMES: Record<string, string> = {
  'Delhi-NCR': 'Delhi Metro (DMRC Network)',
  'Hyderabad': 'Hyderabad Metro Rail (HMR)',
  'Mumbai': 'Mumbai Metro / Suburban Rail',
  'Bengaluru': 'Namma Metro (BMRCL)',
  'Kolkata': 'Kolkata Metro Network',
  'Pune': 'Pune Metro Rail',
  'Chennai': 'Chennai Metro Rail (CMRL)',
  'Lucknow': 'Lucknow Metro (UPMRC)',
  'Patna': 'Patna Metro Rail (Priority Section: Malahi Pakri – ISBT; Under Construction)',
};

type CategoryTab = 'COMMUTE' | 'HOME_ENERGY' | 'DAILY_HABITS';

export default function AlternativesPage() {
  const { selectedCity } = useCity();
  const { profile } = useScenario();
  const [activeTab, setActiveTab] = useState<CategoryTab>('COMMUTE');
  const [distanceKm, setDistanceKm] = useState<number>(profile.commuteDistanceKm || 14);
  const [passengers, setPassengers] = useState<number>(1);
  const [baselineMode, setBaselineMode] = useState<TransportMode>(
    profile.primaryCommuteMode === 'SOLO_CAR'
      ? 'SOLO_PETROL_CAR'
      : profile.primaryCommuteMode === 'TWO_WHEELER'
      ? 'MOTORCYCLE_125CC'
      : 'SOLO_PETROL_CAR'
  );

  React.useEffect(() => {
    if (profile.commuteDistanceKm) {
      setDistanceKm(profile.commuteDistanceKm);
    }
    if (profile.primaryCommuteMode === 'SOLO_CAR') {
      setBaselineMode('SOLO_PETROL_CAR');
    } else if (profile.primaryCommuteMode === 'TWO_WHEELER') {
      setBaselineMode('MOTORCYCLE_125CC');
    }
  }, [profile]);

  const { baseline, alternatives } = compareTransportAlternatives(distanceKm, baselineMode);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sustainable Alternatives Switcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sustainable Alternatives
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Compare daily choices for cleaner air and lower emissions.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('COMMUTE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'COMMUTE'
                ? 'bg-[#0a3526] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Commute</span>
          </button>

          <button
            onClick={() => setActiveTab('HOME_ENERGY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'HOME_ENERGY'
                ? 'bg-[#0a3526] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Home &amp; Energy</span>
          </button>

          <button
            onClick={() => setActiveTab('DAILY_HABITS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'DAILY_HABITS'
                ? 'bg-[#0a3526] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Daily Habits</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Commute Comparison */}
      {activeTab === 'COMMUTE' && (
        <div className="space-y-6">
          {/* Commute Inputs Bar */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Distance Slider (5 cols) */}
            <div className="md:col-span-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  One-Way Distance
                </span>
                <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {distanceKm} km
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={40}
                step={1}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0a3526]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>2 km</span>
                <span>20 km</span>
                <span>40 km</span>
              </div>
            </div>

            {/* Baseline Mode (4 cols) */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Current Commute Mode
              </label>
              <select
                value={baselineMode}
                onChange={(e) => setBaselineMode(e.target.value as TransportMode)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="SOLO_PETROL_CAR">Private Car (Petrol)</option>
                <option value="SOLO_DIESEL_CAR">Private Car (Diesel)</option>
                <option value="MOTORCYCLE_125CC">Two-Wheeler (Motorcycle 125cc)</option>
              </select>
            </div>

            {/* Passengers Counter (3 cols) */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Passengers
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-1.5 justify-between">
                <button
                  type="button"
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="text-xs font-extrabold text-slate-800">{passengers}</span>
                <button
                  type="button"
                  onClick={() => setPassengers(Math.min(5, passengers + 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Compare Alternatives (per day)
                </h3>
                <span className="text-xs text-slate-400">
                  Calculated for {distanceKm * 2} km total daily commute based on ARAI emission factors &amp; CEA grid factor
                </span>
              </div>
              <Link
                href="/impact"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Full Mathematical Proof</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Mode</th>
                    <th className="py-3 px-3">Travel Time</th>
                    <th className="py-3 px-3">Cost (₹/day)</th>
                    <th className="py-3 px-3">Local PM₂.₅ (g/day)</th>
                    <th className="py-3 px-3">CO₂e (kg/day)</th>
                    <th className="py-3 px-3">Exposure Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Current Mode Row */}
                  <tr className="bg-slate-50/80 font-medium">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-700" />
                        <span className="font-bold text-slate-900">
                          {baseline.name} <span className="text-[10px] text-slate-400 font-normal">(Current)</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700">{baseline.durationMinutes * 2} min</td>
                    <td className="py-3.5 px-3 text-slate-900 font-bold">₹{baseline.totalCostInr * 2}</td>
                    <td className="py-3.5 px-3 text-rose-600 font-bold">{(baseline.tailpipePm25Grams * 2).toFixed(2)}</td>
                    <td className="py-3.5 px-3 text-amber-700 font-bold">{(baseline.co2eKg * 2).toFixed(2)}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 uppercase">
                        High (Cabin Leakage)
                      </span>
                    </td>
                  </tr>

                  {/* Alternative Rows */}
                  {alternatives.map((alt) => {
                    const roundTripCost = alt.totalCostInr * 2;
                    const roundTripPm = (alt.tailpipePm25Grams * 2).toFixed(2);
                    const roundTripCo2 = (alt.co2eKg * 2).toFixed(2);
                    const roundTripTime = alt.durationMinutes * 2;

                    return (
                      <tr key={alt.mode} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            {alt.mode.includes('METRO') ? (
                              <Train className="w-4 h-4 text-emerald-600" />
                            ) : alt.mode.includes('BUS') ? (
                              <Bus className="w-4 h-4 text-blue-600" />
                            ) : alt.mode.includes('CYCLE') ? (
                              <Bike className="w-4 h-4 text-orange-600" />
                            ) : (
                              <Users className="w-4 h-4 text-indigo-600" />
                            )}
                            <span className="font-bold text-slate-800">
                              {alt.mode === 'DELHI_METRO'
                                ? CITY_TRANSIT_NAMES[selectedCity] || 'Electric Rapid Metro'
                                : alt.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">{roundTripTime} min</td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800">₹{roundTripCost}</td>
                        <td className="py-3.5 px-3 font-semibold text-emerald-700">{roundTripPm}</td>
                        <td className="py-3.5 px-3 font-semibold text-emerald-700">{roundTripCo2}</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            alt.exposureRiskLevel === 'LOW'
                              ? 'bg-emerald-100 text-emerald-800'
                              : alt.exposureRiskLevel === 'MODERATE'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {alt.exposureRiskLevel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-400 font-medium mt-2">
              *Lower emissions, but avoid during high-AQI hours and heavy traffic.
            </div>

            {/* Patna Metro Status Advisory */}
            {selectedCity === 'Patna' && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Patna Metro Rail Operational Notice:</strong> Only the designated priority section (Malahi Pakri – New ISBT) is under active phased commissioning. The full city-wide network (Corridors 1 &amp; 2) remains under construction; verify station-level operational status before planning your commute.
                </div>
              </div>
            )}

            {/* Exposure vs Emissions Honesty Notice */}
            <div className="mt-5 p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-xs text-emerald-950 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>*Exposure vs. Emissions Honesty:</strong> While walking and cycling have zero tailpipe emissions, active physical exertion increases your minute ventilation (breathing rate) by 2-4× directly in roadside exhaust plumes. During severe winter smog, taking electrified mass transit (Metro or Electric Bus) is the safest choice to protect both your lungs and urban air.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Home & Energy */}
      {activeTab === 'HOME_ENERGY' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Induction Cooktop vs. LPG Gas
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                LPG combustion releases carbon monoxide and unburnt volatile organic compounds inside closed winter apartments. Induction electric cooking eliminates all indoor combustion byproducts.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 space-y-1">
                <div>• Zero indoor combustion exhaust</div>
                <div>• Up to 84% thermal efficiency (vs ~40% for gas)</div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-700">
              Immediate indoor air quality upgrade
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                BEE 5-Star BLDC Ceiling Fans
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Replacing conventional 75W induction ceiling fans with 28W BLDC fans saves ~150 kWh per fan annually. At India&apos;s CEA Version 22.0 emission factor (0.675 kg CO₂/kWh, FY 2025–26), this prevents 101.3 kg of CO₂e per fan every year.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 space-y-1">
                <div>• 62% reduction in electricity consumption</div>
                <div>• Payback within 14-18 months of daily use</div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-700">
              Low-cost household transition
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-3">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Rooftop Solar (Net Metering)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                A 3 kW rooftop solar array generates ~4,200 units annually in North/Central India, directly displacing grid thermal power and abating over 3.0 metric tonnes of CO₂e every year.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 space-y-1">
                <div>• Generates ~12-14 kWh/day</div>
                <div>• Covered under PM Surya Ghar Muft Bijli Yojana</div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-700">
              High-impact renewable generation
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Daily Habits */}
      {activeTab === 'DAILY_HABITS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Engine Idling Switch-Off
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Idling for over 10 seconds burns more fuel than restarting the engine. Turning off your vehicle at traffic signals with over 15 seconds remaining saves ~15-20% fuel in city commutes and stops toxic hot exhaust plumes at breathing height.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl text-xs font-semibold text-emerald-900">
              Impact: ~45 kg CO₂e saved per car/year
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Consolidated E-Commerce Orders
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Selecting &quot;group my deliveries into one shipment&quot; reduces multiple delivery scooter/van trips into your neighborhood. Last-mile two-wheeler delivery trips emit disproportionate VOCs and PM during cold starts.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl text-xs font-semibold text-emerald-900">
              Impact: ~60% reduction in delivery trip emissions
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Zero Open Waste &amp; Leaves Burning
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Biomass and garden leaf burning creates dense smoldering plumes packed with polycyclic aromatic hydrocarbons (PAHs) and dioxins right near ground level where thermal inversion traps them.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl text-xs font-semibold text-emerald-900">
              Impact: Society composting saves neighborhood lungs
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
