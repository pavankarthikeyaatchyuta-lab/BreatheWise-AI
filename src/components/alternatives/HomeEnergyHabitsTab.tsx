'use client';

import React from 'react';
import { Flame, Zap, Sun } from 'lucide-react';

export function HomeEnergyTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="region" aria-label="Home and Energy Alternatives">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center mb-3">
            <Flame className="w-5 h-5" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Induction Cooktop vs. LPG Gas</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            LPG combustion releases carbon monoxide and unburnt volatile organic compounds inside closed winter apartments. Induction electric cooking eliminates all indoor combustion byproducts.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 space-y-1">
            <div>• Zero indoor combustion exhaust</div>
            <div>• Up to 84% thermal efficiency (vs ~40% for gas)</div>
          </div>
        </div>
        <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-bold text-forest-700">
          Immediate indoor air quality upgrade
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">BEE 5-Star BLDC Ceiling Fans</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Replacing conventional 75W induction ceiling fans with 28W BLDC fans saves ~150 kWh per fan annually. At India&apos;s CEA Version 22.0 emission factor (0.675 kg CO₂/kWh, FY 2025–26), this prevents 101.3 kg of CO₂e per fan every year.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 space-y-1">
            <div>• 62% reduction in electricity consumption</div>
            <div>• Payback within 14-18 months of daily use</div>
          </div>
        </div>
        <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-bold text-forest-700">
          Low-cost household transition
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <Sun className="w-5 h-5" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Rooftop Solar (Net Metering)</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            A 3 kW rooftop solar array generates ~4,200 units annually in North/Central India, directly displacing grid thermal power and abating over 3.0 metric tonnes of CO₂e every year.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 space-y-1">
            <div>• Generates ~12-14 kWh/day</div>
            <div>• Covered under PM Surya Ghar Muft Bijli Yojana</div>
          </div>
        </div>
        <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-bold text-forest-700">
          High-impact renewable generation
        </div>
      </div>
    </div>
  );
}

export function DailyHabitsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="region" aria-label="Daily Habits Alternatives">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">Engine Idling Switch-Off</h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Idling for over 10 seconds burns more fuel than restarting the engine. Turning off your vehicle at traffic signals with over 15 seconds remaining saves ~15-20% fuel in city commutes and stops toxic hot exhaust plumes at breathing height.
        </p>
        <div className="p-3 bg-emerald-50 rounded-xl text-xs font-semibold text-emerald-900">
          Impact: ~45 kg CO₂e saved per car/year
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">Consolidated E-Commerce Orders</h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Selecting &quot;group my deliveries into one shipment&quot; reduces multiple delivery scooter/van trips into your neighborhood. Last-mile two-wheeler delivery trips emit disproportionate VOCs and PM during cold starts.
        </p>
        <div className="p-3 bg-emerald-50 rounded-xl text-xs font-semibold text-emerald-900">
          Impact: ~60% reduction in delivery trip emissions
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">Zero Open Waste &amp; Leaves Burning</h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Biomass and garden leaf burning creates dense smoldering plumes packed with polycyclic aromatic hydrocarbons (PAHs) and dioxins right near ground level where thermal inversion traps them.
        </p>
        <div className="p-3 bg-emerald-50 rounded-xl text-xs font-semibold text-emerald-900">
          Impact: Society composting saves neighborhood lungs
        </div>
      </div>
    </div>
  );
}
