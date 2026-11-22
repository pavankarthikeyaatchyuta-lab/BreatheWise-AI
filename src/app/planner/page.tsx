'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CalendarClock, Sparkles } from 'lucide-react';
import { useScenario } from '@/context/ScenarioContext';
import { PlannerFamilyBar } from '@/components/planner/PlannerFamilyBar';
import { PlannedTimelineList } from '@/components/planner/PlannedTimelineList';
import { ExposureReductionCard } from '@/components/planner/ExposureReductionCard';
import { AntiIdlingCard } from '@/components/planner/AntiIdlingCard';

export default function PlannerPage() {
  const { profile, updateProfile } = useScenario();
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const todayDateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Daily Routine Planner</span>
            <span className="text-emerald-600 text-lg" aria-hidden="true">🍃</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            A personalized, low-exposure schedule for your family
          </p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200/80 rounded-full px-3.5 py-1.5 shadow-xs text-xs font-bold text-slate-800">
            <CalendarClock className="w-3.5 h-3.5 text-emerald-600 mr-2" aria-hidden="true" />
            <span>Today, {todayDateStr}</span>
          </div>
          <Link
            href="/assistant"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-forest-700 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            <span className="hidden sm:inline">Ask AI</span>
          </Link>
        </div>
      </div>

      {/* Family Profile Customizer Bar Component */}
      <PlannerFamilyBar
        profile={profile}
        updateProfile={updateProfile}
        showConfig={showConfig}
        setShowConfig={setShowConfig}
      />

      {/* Main Grid: Your Optimized Daily Plan (7 cols) + Exposure Reduction Card (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Your Optimized Daily Plan */}
        <div className="lg:col-span-7">
          <PlannedTimelineList profile={profile} />
        </div>

        {/* Right Column: Exposure Reduction Card + Anti-Idling Protocol */}
        <div className="lg:col-span-5 space-y-6">
          <ExposureReductionCard />
          <AntiIdlingCard />
        </div>
      </div>
    </div>
  );
}
