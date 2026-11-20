'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  School, 
  Share2, 
  Check, 
  Copy, 
  ExternalLink, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
  X
} from 'lucide-react';
import { evaluateGRAPStage } from '@/lib/engine/grap-engine';
import { useCity } from '@/context/CityContext';

export default function CommunityPage() {
  const { aqiData: aqiState } = useCity();
  const [copied, setCopied] = useState<boolean>(false);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({
    sports: true,
    classrooms: true,
    dust: true,
    burning: true,
    heating: true,
  });

  const aqi = aqiState.current.aqi ?? 176;
  const grap = evaluateGRAPStage(aqi, aqiState.isNCR);

  const sampleBulletinText = `📢 BREATHEWISE AI COMMUNITY ADVISORY
Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
Location: ${aqiState.city} (${aqiState.isNCR ? 'Delhi-NCR Statutory' : 'Regional Advisory'})
Status: AQI ${aqi} • ${grap.stageName}

🚨 IMMEDIATE COMMUNITY & SCHOOL ACTIONS:
1. SCHOOLS: Shift morning assemblies and outdoor sports indoors. Keep classroom windows closed with indoor air cleaning.
2. DUST CONTROL: Regular wet mopping of driveways; strictly avoid dry sweeping.
3. RWAs: Provide electric room heaters to security guards at society gates to stop open wood/biomass fires.
4. ANTI-IDLING: Enforce engine switch-off for school buses and cars waiting at society gates (>15s).
5. ZERO BURNING: Strict ban on dry garden leaves and municipal garbage burning.

Generated via BreatheWise AI • Grounded in CAQM Directives & CPCB 8-Pollutant Standards`;

  const handleCopyBulletin = () => {
    navigator.clipboard.writeText(sampleBulletinText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(sampleBulletinText)}`;
    window.open(url, '_blank');
  };

  const toggleCheck = (id: string) => {
    setCheckedActions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Community &amp; School Action Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Community &amp; School Action Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Coordinate collective actions for cleaner, healthier neighborhoods.
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid: GRAP Status Card (Left) & School/RWA Actions Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: GRAP Status Card with India Gate Art (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  GRAP Status (Delhi-NCR)
                </span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                CAQM Statutory
              </span>
            </div>

            {/* Stage Pill & AQI Range */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-4 py-1.5 rounded-xl bg-orange-100 text-orange-900 font-black text-sm border border-orange-200 tracking-wide uppercase">
                Stage II
              </span>
              <span className="text-sm font-extrabold text-slate-800">
                AQI: 301 – 400 (Very Poor)
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              As per Commission for Air Quality Management (CAQM) order. Mandated for Delhi and NCR districts only.
            </p>

            {/* Key Actions List */}
            <ul className="space-y-2 text-xs text-slate-700 font-medium mb-6">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Enhanced mechanical road sweeping &amp; water sprinkling</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Strict enforcement on construction dust &amp; demolition sites</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Encourage public transport; hike parking fees to disincentivize private cars</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Provide electric heaters to security staff to avert open burning</span>
              </li>
            </ul>
          </div>

          <div>
            {/* Monument Silhouette Vector Art (India Gate & Trees) */}
            <div className="w-full h-32 rounded-2xl bg-gradient-to-t from-amber-50/80 via-orange-50/30 to-transparent border border-amber-100/60 flex items-end justify-center overflow-hidden mb-4 relative">
              <svg className="w-full h-full" viewBox="0 0 360 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Sun in haze */}
                <circle cx="180" cy="30" r="14" fill="#fbbf24" opacity="0.6" />

                {/* Ground */}
                <rect x="0" y="105" width="360" height="15" fill="#84cc16" opacity="0.4" />
                <line x1="0" y1="105" x2="360" y2="105" stroke="#65a30d" strokeWidth="2" />

                {/* Left Trees */}
                <ellipse cx="60" cy="85" rx="16" ry="24" fill="#15803d" opacity="0.7" />
                <ellipse cx="85" cy="90" rx="12" ry="18" fill="#16a34a" opacity="0.6" />
                <ellipse cx="38" cy="92" rx="14" ry="18" fill="#166534" opacity="0.8" />

                {/* Right Trees */}
                <ellipse cx="300" cy="85" rx="16" ry="24" fill="#15803d" opacity="0.7" />
                <ellipse cx="275" cy="90" rx="12" ry="18" fill="#16a34a" opacity="0.6" />
                <ellipse cx="322" cy="92" rx="14" ry="18" fill="#166534" opacity="0.8" />

                {/* India Gate Silhouette */}
                <g transform="translate(135, 25)">
                  {/* Base steps */}
                  <rect x="0" y="75" width="90" height="5" fill="#d97706" />
                  <rect x="5" y="70" width="80" height="5" fill="#d97706" />
                  <rect x="10" y="65" width="70" height="5" fill="#b45309" />
                  
                  {/* Left Pillar */}
                  <rect x="12" y="18" width="22" height="47" fill="#d97706" />
                  {/* Right Pillar */}
                  <rect x="56" y="18" width="22" height="47" fill="#d97706" />
                  {/* Arch curve */}
                  <path d="M34 32 C34 22 56 22 56 32 L56 65 L34 65 Z" fill="#fef3c7" />

                  {/* Top Cornice & Architrave */}
                  <rect x="8" y="10" width="74" height="8" fill="#b45309" />
                  <rect x="5" y="6" width="80" height="4" fill="#d97706" />
                  <rect x="15" y="0" width="60" height="6" fill="#92400e" />
                </g>
              </svg>
            </div>

            <button
              onClick={() => setShowOrderModal(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors border border-emerald-200 flex items-center justify-center gap-1.5"
            >
              <span>View Official Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: School & Community Actions Card with School Graphic (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">
                School &amp; RWA Actions
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                5 Protocols Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Actionable community checklist to prevent children and vulnerable elders from dangerous peak exposures.
            </p>

            {/* Checklist */}
            <div className="space-y-3">
              <label
                onClick={() => toggleCheck('sports')}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors"
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  checkedActions.sports ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                }`}>
                  {checkedActions.sports && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Shift outdoor sports to indoor activities
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Avoid PE classes and football/running during morning thermal inversion (&lt;10 AM).
                  </span>
                </div>
              </label>

              <label
                onClick={() => toggleCheck('classrooms')}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors"
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  checkedActions.classrooms ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                }`}>
                  {checkedActions.classrooms && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Use closed classrooms with good ventilation
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Keep street-facing windows shut; run ceiling fans at low speed for air movement.
                  </span>
                </div>
              </label>

              <label
                onClick={() => toggleCheck('dust')}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors"
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  checkedActions.dust ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                }`}>
                  {checkedActions.dust && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Reduce dust: regular wet mopping &amp; driveway sprinkling
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Ban dry broom sweeping of school grounds and society internal roads.
                  </span>
                </div>
              </label>

              <label
                onClick={() => toggleCheck('burning')}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors"
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  checkedActions.burning ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                }`}>
                  {checkedActions.burning && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Avoid open waste burning
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Prohibit burning of garden trimmings, dried leaves, and plastic packaging.
                  </span>
                </div>
              </label>

              <label
                onClick={() => toggleCheck('heating')}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors"
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  checkedActions.heating ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                }`}>
                  {checkedActions.heating && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Use cleaner heating options for security staff
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Distribute electric room heaters to society gates to eliminate night-time bonfires.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* School Building Vector Art */}
          <div className="mt-5 w-full h-24 rounded-2xl bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-slate-50 border border-slate-100 flex items-end justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Ground */}
              <line x1="0" y1="72" x2="300" y2="72" stroke="#cbd5e1" strokeWidth="2" />
              
              {/* School Building Central Body */}
              <rect x="95" y="25" width="110" height="47" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Triangular Pediment */}
              <polygon points="150,8 115,25 185,25" fill="#f87171" stroke="#ef4444" strokeWidth="1" />
              {/* Clock in Pediment */}
              <circle cx="150" cy="18" r="4.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
              <line x1="150" y1="18" x2="150" y2="15.5" stroke="#0f172a" strokeWidth="0.8" />
              <line x1="150" y1="18" x2="152.5" y2="18" stroke="#0f172a" strokeWidth="0.8" />
              
              {/* Entrance Door */}
              <rect x="140" y="48" width="20" height="24" rx="2" fill="#0284c7" />
              
              {/* Windows */}
              <rect x="105" y="32" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
              <rect x="123" y="32" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
              <rect x="165" y="32" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
              <rect x="183" y="32" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
              
              <rect x="105" y="52" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
              <rect x="123" y="52" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
              <rect x="165" y="52" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
              <rect x="183" y="52" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />

              {/* School Bus at the side */}
              <g transform="translate(225, 45)">
                <rect x="0" y="0" width="48" height="22" rx="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                <rect x="4" y="4" width="8" height="7" rx="1" fill="#ffffff" />
                <rect x="15" y="4" width="8" height="7" rx="1" fill="#ffffff" />
                <rect x="26" y="4" width="8" height="7" rx="1" fill="#ffffff" />
                <rect x="37" y="4" width="8" height="7" rx="1" fill="#ffffff" />
                {/* Wheels */}
                <circle cx="10" cy="22" r="4.5" fill="#1e293b" />
                <circle cx="38" cy="22" r="4.5" fill="#1e293b" />
              </g>

              {/* Playground Trees */}
              <ellipse cx="45" cy="50" rx="14" ry="18" fill="#22c55e" />
              <ellipse cx="65" cy="54" rx="10" ry="14" fill="#16a34a" />
              <line x1="45" y1="68" x2="45" y2="72" stroke="#78350f" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Share Action Bulletin Bottom Card with WhatsApp Button */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Share Action Bulletin
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Send a ready-to-share update to your school, RWA or community WhatsApp group.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            onClick={handleCopyBulletin}
            className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="px-5 py-2.5 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* CAQM Official Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    CAQM GRAP Directive Summary
                  </h2>
                  <span className="text-xs text-slate-500">
                    Statutory Framework for Delhi and NCR Districts
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950">
                <strong>Statutory Jurisdiction:</strong> The Graded Response Action Plan (GRAP) is formulated by the Commission for Air Quality Management in NCR and Adjoining Areas (CAQM). Its provisions are legally binding in Delhi and specified NCR districts, but serve as best-practice advisory guidance for other Indian cities.
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1 text-sm">
                  Mandated GRAP Stages &amp; AQI Triggers:
                </h4>
                <ul className="space-y-2 mt-2">
                  <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong>Stage I (Poor, AQI 201-300):</strong> Mechanized road sweeping, dust control at C&amp;D sites &gt;500 sq.m., anti-idling enforcement, periodic water sprinkling.
                  </li>
                  <li className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-950">
                    <strong>Stage II (Very Poor, AQI 301-400):</strong> Daily water sprinkling on designated roads, uninterrupted power to avoid DG sets, hike in parking fees, electric heaters for security guards.
                  </li>
                  <li className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                    <strong>Stage III (Severe, AQI 401-450):</strong> Strict ban on non-essential C&amp;D activities, restriction on BS-III Petrol and BS-IV Diesel 4-wheelers in Delhi-NCR, potential primary school physical closure orders by local State authorities.
                  </li>
                  <li className="p-2.5 rounded-xl bg-red-100 border border-red-300 text-red-950">
                    <strong>Stage IV (Severe+, AQI &gt;450):</strong> Prohibition on entry of non-Delhi registered commercial trucks (except essential commodities/LNG/CNG/EV), suspension of all construction, 50% work-from-home advisory.
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#0a3526] hover:bg-[#0d402f] text-white text-xs font-bold transition-colors"
              >
                Close Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
