'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  School, 
  Building2, 
  Share2, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  Check, 
  FileText,
  Flame,
  VolumeX,
  Droplets
} from 'lucide-react';
import { evaluateGRAPStage } from '@/lib/engine/grap-engine';
import { getDelhiDemoState } from '@/lib/aqi/demo-data';

export default function CommunityPage() {
  const [copied, setCopied] = useState<boolean>(false);
  const aqiState = getDelhiDemoState();
  const aqi = aqiState.current.aqi ?? 450;
  const grap = evaluateGRAPStage(aqi, aqiState.isNCR);

  const sampleBulletinText = `📢 BREATHEWISE AI COMMUNITY ADVISORY
Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
Location: ${aqiState.city}
Status: AQI ${aqi} (${grap.stageName})

🚨 KEY RESIDENTIAL & SCHOOL ACTIONS:
1. SCHOOLS: Move morning assemblies and physical education classes indoors. Avoid prolonged early morning outdoor exposure.
2. RWAs: Provide electric heaters to security staff to prevent open biomass/wood burning at society gates.
3. ANTI-IDLING: Enforce engine switch-off for school buses and private vehicles waiting at gates (>15 seconds).
4. DUST CONTROL: Wet water sprinkling on unpaved driveways; prohibit dry broom sweeping of society grounds.

Generated via BreatheWise AI • CPCB 8-Pollutant Grounded Platform`;

  const handleCopyBulletin = () => {
    navigator.clipboard.writeText(sampleBulletinText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-forest-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <Users className="w-4 h-4" />
            <span>Collective Mitigation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Community & School Action Hub
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Practical coordination protocols for schools, Resident Welfare Associations (RWAs), and apartment societies without social media clutter.
          </p>
        </div>

        <button
          onClick={handleCopyBulletin}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs transition-colors shadow-xs shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Bulletin'}</span>
        </button>
      </div>

      {/* Statutory CAQM GRAP Status Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{aqiState.isNCR ? 'Statutory CAQM Directive Status' : 'Regional Advisory Framework'}</span>
            </div>
            <h2 className="text-xl font-black text-white">
              {grap.stageName} (Trigger Range: {grap.aqiTriggerRange})
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-rose-900/80 text-rose-200 border border-rose-700 rounded-full shrink-0">
            Current AQI: {aqi}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {grap.summary}
        </p>

        <div className="p-3 bg-slate-800/80 rounded-xl text-xs text-slate-400 border border-slate-700/60 leading-normal">
          <strong>Jurisdiction Notice:</strong> {grap.jurisdictionDisclaimer}
        </div>
      </div>

      {/* Action Checklists: Schools & RWAs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School Action Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-forest-700 uppercase tracking-wider mb-2">
              <School className="w-4 h-4" />
              <span>School Administration Protocol</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Morning Assembly & Sports Smog Protection
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Children breathe more air per kilogram of body weight. Physical exertion in severe winter inversion pulls heavy particulate mass deep into developing lungs.
            </p>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <Check className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Move Morning Assembly Indoors:</strong>
                  <span>Conduct prayer and announcements inside classrooms or post-10:00 AM once solar heating disperses ground inversions.</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <Check className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Suspend Outdoor Athletics:</strong>
                  <span>Substitute outdoor running and football with indoor light yoga, chess, or table tennis.</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <Check className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Strict Gate Anti-Idling:</strong>
                  <span>Prohibit idling school buses and private vans from keeping engines running while waiting for student dispersal.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* RWA & Apartment Society Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-forest-700 uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>Resident Welfare Association (RWA) Protocol</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Residential Complex Collective Actions
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Community organizers can make immediate impacts by stopping open fires, suppressing dust, and regulating diesel generators.
            </p>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Guard Cabin Heating:</strong>
                  <span>Provide electric radiant heaters to security guards during winter night shifts to eliminate open wood/garbage fires.</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <Droplets className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Driveway Dust Suppression:</strong>
                  <span>Mandate water sprinkling on unpaved internal perimeter roads; prohibit dry broom sweeping of society grounds.</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <VolumeX className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Regulate Diesel Generators:</strong>
                  <span>Under CAQM GRAP Stage II+, diesel generator sets are strictly restricted to essential services (lifts, water pumping).</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Shareable WhatsApp / Noticeboard Bulletin Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              One-Click Shareable WhatsApp / Noticeboard Bulletin
            </h3>
            <p className="text-xs text-slate-500">
              Cleanly formatted text ready for copy-pasting into society WhatsApp groups or printing for physical notice boards.
            </p>
          </div>
          <button
            onClick={handleCopyBulletin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {sampleBulletinText}
        </pre>
      </div>
    </div>
  );
}
