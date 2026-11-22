'use client';

import React, { useState } from 'react';
import { evaluateIndoorGuidance } from '@/lib/engine/indoor-engine';
import { useCity } from '@/context/CityContext';
import { useScenario } from '@/context/ScenarioContext';
import { ZeroFakeSensorsBanner } from '@/components/indoor/ZeroFakeSensorsBanner';
import { RoomSanctuaryCard } from '@/components/indoor/RoomSanctuaryCard';
import { IndoorGuidanceCards, CategoryFilter } from '@/components/indoor/IndoorGuidanceCards';
import { CorsiRosenthalGuideModal } from '@/components/indoor/CorsiRosenthalGuideModal';

export default function IndoorCoachPage() {
  const { aqiData: aqiState } = useCity();
  const { profile } = useScenario();

  const pm25Reading = aqiState.current.pollutants.pm25;
  const currentPm25 = pm25Reading && pm25Reading.value >= 0 ? pm25Reading.value : null;
  const currentAqi = aqiState.current.aqi;

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [hasPartition, setHasPartition] = useState(profile.hasKitchenPartition);
  const [hasExhaust, setHasExhaust] = useState(profile.hasKitchenExhaustFan);
  const [hasPurifier, setHasPurifier] = useState(profile.hasAirPurifier);
  const [showDiyModal, setShowDiyModal] = useState(false);

  React.useEffect(() => {
    setHasPartition(profile.hasKitchenPartition);
    setHasExhaust(profile.hasKitchenExhaustFan);
    setHasPurifier(profile.hasAirPurifier);
  }, [profile]);

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
          <div className="flex items-center gap-2 text-forest-700 font-bold text-xs tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
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
        <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Filter guidance categories">
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
                    ? 'bg-forest-800 text-white shadow-xs' 
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
                aria-pressed={isActive}
              >
                {labels[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mandatory Zero-Sensor Scientific Integrity Banner */}
      <ZeroFakeSensorsBanner disclaimer={guidance.zeroSensorDisclaimer} />

      {/* Main Grid: Living Room Visual Card + Interactive Guidance Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Living Room Illustration & Facility Customizer (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <RoomSanctuaryCard
            hasPartition={hasPartition}
            setHasPartition={setHasPartition}
            hasExhaust={hasExhaust}
            setHasExhaust={setHasExhaust}
            hasPurifier={hasPurifier}
            setHasPurifier={setHasPurifier}
          />
        </div>

        {/* Right Column: The 4 Key Action Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <IndoorGuidanceCards
            activeCategory={activeCategory}
            guidance={guidance}
            currentPm25={currentPm25}
            onOpenDiyModal={() => setShowDiyModal(true)}
          />
        </div>
      </div>

      {/* Corsi-Rosenthal Blueprint Modal */}
      <CorsiRosenthalGuideModal
        isOpen={showDiyModal}
        onClose={() => setShowDiyModal(false)}
        diyGuide={guidance.diyFilterGuide}
      />
    </div>
  );
}
