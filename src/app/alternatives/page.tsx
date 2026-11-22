'use client';

import React, { useState, useEffect } from 'react';
import { Car, Zap, Flame } from 'lucide-react';
import { TransportMode } from '@/lib/types/alternatives';
import { compareTransportAlternatives } from '@/lib/engine/alternatives';
import { useCity } from '@/context/CityContext';
import { useScenario } from '@/context/ScenarioContext';
import { CommuteFilterControls } from '@/components/alternatives/CommuteFilterControls';
import { TransitComparisonTable } from '@/components/alternatives/TransitComparisonTable';
import { HomeEnergyTab, DailyHabitsTab } from '@/components/alternatives/HomeEnergyHabitsTab';

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

  useEffect(() => {
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
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Alternative Categories">
          <button
            role="tab"
            aria-selected={activeTab === 'COMMUTE'}
            onClick={() => setActiveTab('COMMUTE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'COMMUTE'
                ? 'bg-[#0a3526] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <Car className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Commute</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'HOME_ENERGY'}
            onClick={() => setActiveTab('HOME_ENERGY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'HOME_ENERGY'
                ? 'bg-[#0a3526] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Home &amp; Energy</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'DAILY_HABITS'}
            onClick={() => setActiveTab('DAILY_HABITS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'DAILY_HABITS'
                ? 'bg-[#0a3526] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Daily Habits</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Commute Comparison */}
      {activeTab === 'COMMUTE' && (
        <div className="space-y-6">
          <CommuteFilterControls
            distanceKm={distanceKm}
            setDistanceKm={setDistanceKm}
            baselineMode={baselineMode}
            setBaselineMode={setBaselineMode}
            passengers={passengers}
            setPassengers={setPassengers}
          />
          <TransitComparisonTable
            baseline={baseline}
            alternatives={alternatives}
            distanceKm={distanceKm}
            selectedCity={selectedCity}
          />
        </div>
      )}

      {/* Tab 2: Home & Energy */}
      {activeTab === 'HOME_ENERGY' && <HomeEnergyTab />}

      {/* Tab 3: Daily Habits */}
      {activeTab === 'DAILY_HABITS' && <DailyHabitsTab />}
    </div>
  );
}
