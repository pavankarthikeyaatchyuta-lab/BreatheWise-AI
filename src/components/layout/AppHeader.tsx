'use client';

import React, { useState } from 'react';
import { MapPin, Bell, Menu, X, Sparkles, ShieldCheck, CheckCircle2, RotateCcw, Globe, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useScenario } from '@/context/ScenarioContext';
import { EVALUATOR_SCENARIOS, EvaluatorScenarioId } from '@/lib/types/user';
import { SupportedLanguage } from '@/lib/i18n/translations';

interface AppHeaderProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

const CITIES = [
  'Delhi-NCR',
  'Hyderabad',
  'Mumbai',
  'Bengaluru',
  'Kolkata',
  'Pune',
  'Chennai',
  'Lucknow',
  'Patna',
];

export function AppHeader({
  currentCity,
  onCityChange,
  onMobileMenuToggle,
  mobileMenuOpen,
}: AppHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scenarioMenuOpen, setScenarioMenuOpen] = useState(false);
  const {
    activeScenarioId,
    activeScenario,
    selectScenario,
    resetToDefault,
    profile,
    language,
    setLanguage,
    t,
  } = useScenario();

  // Time-of-day greeting
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? t('greetingMorning') : hour < 17 ? t('greetingAfternoon') : t('greetingEvening');

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 transition-all">
      <div className="px-4 sm:px-6 py-3.5 max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Greeting & Subtitle */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle mobile navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{timeGreeting}, Pavan!</span>
              <span className="text-emerald-600 text-base sm:text-lg">🍃</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {t('headerSubtitle')}
            </p>
          </div>
        </div>

        {/* Right: Controls Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Evaluator Demo Scenarios Dropdown */}
          <div className="relative">
            <button
              onClick={() => setScenarioMenuOpen(!scenarioMenuOpen)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs border ${
                activeScenarioId !== 'DEFAULT'
                  ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-200 animate-pulse'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
              title="Select Challenge 6 Evaluator Preconfigured Demo Scenario"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden lg:inline">{t('evaluatorDemoTitle')}:</span>
              <span className="truncate max-w-[120px] sm:max-w-[150px]">
                {activeScenario ? activeScenario.badge : 'Default Profile'}
              </span>
              <ChevronDown className="w-3 h-3 shrink-0 ml-0.5" />
            </button>

            {scenarioMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Challenge 6 Evaluator Scenarios
                  </span>
                  {activeScenarioId !== 'DEFAULT' && (
                    <button
                      onClick={() => {
                        resetToDefault();
                        setScenarioMenuOpen(false);
                      }}
                      className="text-[10px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {t('resetDefault')}
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {(
                    Object.keys(EVALUATOR_SCENARIOS) as EvaluatorScenarioId[]
                  ).map((id) => {
                    const sc = EVALUATOR_SCENARIOS[id];
                    const isSelected = activeScenarioId === id;
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          selectScenario(id);
                          setScenarioMenuOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-0.5">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {sc.title}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                            {sc.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">{sc.summary}</p>
                        <p className="text-[10px] text-emerald-700 font-medium mt-1">
                          Focus: {sc.targetFocus}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Uses deterministic constraint logic</span>
                  <button
                    onClick={() => {
                      resetToDefault();
                      setScenarioMenuOpen(false);
                    }}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Language Selector Pill */}
          <div className="flex items-center bg-white border border-slate-200 rounded-full p-0.5 shadow-xs text-[11px] font-bold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-full transition-all ${
                language === 'en'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2 py-1 rounded-full transition-all ${
                language === 'te'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="తెలుగు"
            >
              తె
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-full transition-all ${
                language === 'hi'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="हिन्दी"
            >
              हि
            </button>
          </div>

          {/* Location Selector Pill */}
          <div className="relative flex items-center bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-xs hover:border-emerald-400 transition-all">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
            <select
              value={currentCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 pr-1 focus:outline-none cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-xs transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
                <div className="font-bold text-slate-900 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span>Environmental Alerts</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Live</span>
                </div>
                <div className="py-2 space-y-2">
                  <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100 text-[11px] text-amber-900">
                    <strong className="block text-amber-950 font-bold">Evening Inversion Watch</strong>
                    Surface PM2.5 expected to rise after 6:30 PM across urban corridors.
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900">
                    <strong className="block text-emerald-950 font-bold">Midday Ventilation Window</strong>
                    Plan outdoor errands and controlled ventilation between 1:00 - 3:30 PM.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar matching Reference Image */}
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-amber-200 to-amber-100 border border-amber-300/60 shadow-xs flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-full h-full text-amber-800" fill="currentColor">
              <path d="M16 16c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0 4c-4.42 0-8 3.58-8 8h16c0-4.42-3.58-8-8-8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Evaluator Scenario Active Loaded Preferences Banner */}
      {activeScenario && (
        <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border-t border-amber-200 px-4 sm:px-6 py-2 text-xs text-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="bg-amber-600 text-white font-black px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase">
              Evaluator Scenario
            </span>
            <span className="font-bold text-slate-900">{activeScenario.title}:</span>
            <span className="text-slate-600 hidden md:inline text-[11px]">
              Commute: <strong>{profile.primaryCommuteMode.replace('_', ' ')} ({profile.commuteDistanceKm} km)</strong> • Children: <strong>{profile.hasInfantsOrChildren ? 'Yes' : 'No'}</strong> • Elderly: <strong>{profile.hasElderly ? 'Yes' : 'No'}</strong> • Purifier: <strong>{profile.hasAirPurifier ? 'Yes' : 'Zero Purifier'}</strong>
            </span>
          </div>
          <button
            onClick={resetToDefault}
            className="text-[11px] font-bold text-amber-900 bg-white/80 hover:bg-white border border-amber-300 rounded-full px-2.5 py-0.5 flex items-center gap-1 transition-colors ml-auto shadow-2xs"
          >
            <RotateCcw className="w-3 h-3 text-amber-700" />
            {t('resetDefault')}
          </button>
        </div>
      )}

      {/* Multilingual Scope Notice */}
      {language !== 'en' && t('languageNotice') && (
        <div className="bg-sky-50/90 border-t border-sky-200 px-4 sm:px-6 py-1.5 text-[11px] text-sky-900 flex items-center justify-between gap-2">
          <span>🌐 {t('languageNotice')}</span>
          <span className="text-[10px] text-sky-600 font-semibold uppercase tracking-wider">Localization Beta</span>
        </div>
      )}
    </header>
  );
}
