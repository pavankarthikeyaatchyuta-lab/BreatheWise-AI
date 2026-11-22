'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Wind, 
  CalendarClock, 
  Home, 
  Car, 
  TrendingDown, 
  Users, 
  ArrowRight 
} from 'lucide-react';

const MODULES = [
  {
    title: '1. Air Intelligence Dashboard',
    desc: 'Real-time CPCB NAQI calculation, continuous midpoint breakpoint interpolation, and a 24-hour diurnal forecast chart with inversion threshold gating.',
    href: '/dashboard',
    cta: 'Open Air Dashboard',
    icon: Wind,
    color: 'bg-emerald-100 text-emerald-800',
    linkHover: 'text-forest-700 hover:text-forest-900',
  },
  {
    title: '2. Daily Routine Planner',
    desc: 'Low-exposure routine builder that reschedules outdoor fitness, school drop-offs, and errands based on hourly diurnal dispersion windows.',
    href: '/planner',
    cta: 'Open Routine Planner',
    icon: CalendarClock,
    color: 'bg-teal-100 text-teal-800',
    linkHover: 'text-teal-800 hover:text-teal-950',
  },
  {
    title: '3. Indoor Air Coach',
    desc: 'Strict Zero Fake Sensors policy; procedural cooking exhaust rules, wet mopping protocols, and fire-safe DIY Corsi-Rosenthal MERV-13 filter guides.',
    href: '/indoor-coach',
    cta: 'Consult Indoor Coach',
    icon: Home,
    color: 'bg-amber-100 text-amber-800',
    linkHover: 'text-amber-800 hover:text-amber-950',
  },
  {
    title: '4. Sustainable Alternatives',
    desc: 'Compares 8 transport modes (Metro, Electric Bus, Carpool, etc.) with passenger occupancy scaling and commute distance sliders.',
    href: '/alternatives',
    cta: 'Compare Transit Modes',
    icon: Car,
    color: 'bg-blue-100 text-blue-800',
    linkHover: 'text-blue-800 hover:text-blue-950',
  },
  {
    title: '5. Impact Intelligence',
    desc: 'Decoupled 3-tier metrics: Personal Exposure Shift (hrs), Local Tailpipe PM2.5 (g), and Grid CO2e (kg) citing the Central Electricity Authority (CEA) Version 22.0.',
    href: '/impact',
    cta: 'View Calculation Proofs',
    icon: TrendingDown,
    color: 'bg-rose-100 text-rose-800',
    linkHover: 'text-rose-800 hover:text-rose-950',
  },
  {
    title: '6. Community & School Hub',
    desc: 'Dynamic CAQM GRAP Stage indicator, school outdoor sports curbs, RWA open-burning bans, and one-click WhatsApp advisory bulletins.',
    href: '/community',
    cta: 'Generate Community Bulletin',
    icon: Users,
    color: 'bg-violet-100 text-violet-800',
    linkHover: 'text-violet-800 hover:text-violet-950',
  },
];

export function FeatureHighlightsGrid() {
  return (
    <section className="space-y-6" aria-label="Core Challenge Modules">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          6 Core Challenge Modules
        </h2>
        <p className="text-sm text-slate-500">
          Transforming complex environmental datasets into grounded, daily family decisions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((m) => {
          const IconComponent = m.icon;
          return (
            <div
              key={m.title}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-2xl ${m.color} flex items-center justify-center font-bold`}>
                  <IconComponent className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{m.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
              </div>
              <Link
                href={m.href}
                className={`text-xs font-bold ${m.linkHover} inline-flex items-center gap-1 pt-2`}
              >
                <span>{m.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
