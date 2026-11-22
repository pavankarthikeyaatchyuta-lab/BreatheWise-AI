'use client';

import React from 'react';
import { Sparkles, MapPin } from 'lucide-react';
import { EvaluatorScenario } from '@/lib/types/user';

interface AssistantHeaderProps {
  city: string;
  aqi: number;
  dominant: string;
  activeScenario: EvaluatorScenario | null;
}

export function AssistantHeader({
  city,
  aqi,
  dominant,
  activeScenario,
}: AssistantHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs tracking-wider uppercase mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AI Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Assistant
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Your personal, contextual air quality &amp; lifestyle guide
        </p>
      </div>

      {/* Live Grounding & Scenario Pill */}
      <div className="flex flex-wrap items-center gap-2">
        {activeScenario && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            <span>Scenario: {activeScenario.badge}</span>
          </div>
        )}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700 self-start md:self-auto">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
          <span>{city}: AQI {aqi} • {dominant}</span>
        </div>
      </div>
    </div>
  );
}
