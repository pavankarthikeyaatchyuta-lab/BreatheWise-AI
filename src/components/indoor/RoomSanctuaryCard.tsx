'use client';

import React from 'react';
import { DoorClosed, Fan, Wind } from 'lucide-react';

interface RoomSanctuaryCardProps {
  hasPartition: boolean;
  setHasPartition: (val: boolean) => void;
  hasExhaust: boolean;
  setHasExhaust: (val: boolean) => void;
  hasPurifier: boolean;
  setHasPurifier: (val: boolean) => void;
}

export function RoomSanctuaryCard({
  hasPartition,
  setHasPartition,
  hasExhaust,
  setHasExhaust,
  hasPurifier,
  setHasPurifier,
}: RoomSanctuaryCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs overflow-hidden flex flex-col justify-between relative group">
      <div className="relative w-full h-56 rounded-2xl bg-gradient-to-b from-amber-50/60 via-emerald-50/30 to-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
        {/* Cozy Room Vector Illustration */}
        <svg
          className="w-full h-full"
          viewBox="0 0 320 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M40 20 L160 200 L110 200 L20 20 Z" fill="#fef08a" opacity="0.3" />
          <rect x="25" y="25" width="80" height="110" rx="8" fill="#ffffff" stroke="#94a3b8" strokeWidth="3" />
          <rect x="30" y="30" width="32" height="48" rx="4" fill="#bae6fd" opacity="0.6" />
          <rect x="68" y="30" width="32" height="48" rx="4" fill="#bae6fd" opacity="0.6" />
          <rect x="30" y="82" width="32" height="48" rx="4" fill="#bae6fd" opacity="0.6" />
          <rect x="68" y="82" width="32" height="48" rx="4" fill="#bae6fd" opacity="0.6" />
          <line x1="45" y1="50" x2="55" y2="60" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <line x1="0" y1="180" x2="320" y2="180" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="75" y="135" width="36" height="50" rx="6" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
          <line x1="82" y1="145" x2="104" y2="145" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="82" y1="150" x2="104" y2="150" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="82" y1="155" x2="104" y2="155" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="93" cy="168" r="2.5" fill="#10b981" />
          <path d="M85 130 C80 115 88 105 82 95" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
          <path d="M93 128 C90 110 98 100 93 85" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
          <path d="M101 130 C106 115 98 105 104 95" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
          <ellipse cx="145" cy="180" rx="14" ry="4" fill="#94a3b8" opacity="0.3" />
          <path d="M136 155 L154 155 L151 180 L139 180 Z" fill="#d97706" />
          <path d="M145 155 Q135 135 128 120" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
          <path d="M145 155 Q145 130 145 110" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
          <path d="M145 155 Q155 135 162 120" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="126" cy="116" rx="10" ry="14" fill="#22c55e" transform="rotate(-25 126 116)" />
          <ellipse cx="145" cy="106" rx="10" ry="15" fill="#16a34a" />
          <ellipse cx="164" cy="116" rx="10" ry="14" fill="#22c55e" transform="rotate(25 164 116)" />
          <ellipse cx="134" cy="136" rx="8" ry="12" fill="#15803d" transform="rotate(-30 134 136)" />
          <ellipse cx="156" cy="136" rx="8" ry="12" fill="#15803d" transform="rotate(30 156 136)" />
          <rect x="185" y="140" width="115" height="40" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="190" y="125" width="105" height="25" rx="6" fill="#cbd5e1" />
          <rect x="195" y="148" width="22" height="18" rx="4" fill="#10b981" opacity="0.4" />
          <rect x="225" y="148" width="22" height="18" rx="4" fill="#f59e0b" opacity="0.4" />
          <g transform="translate(240, 25)">
            <rect width="65" height="34" rx="17" fill="#ffffff" stroke="#e2e8f0" />
            <circle cx="16" cy="17" r="8" fill="#dcfce7" />
            <path d="M13 17 L15 19 L19 14" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="28" y="17" fill="#0f172a" fontSize="8" fontWeight="bold">CLEAN</text>
            <text x="28" y="25" fill="#16a34a" fontSize="7" fontWeight="bold">SPACE</text>
          </g>
        </svg>
      </div>

      <div className="mt-4">
        <h3 className="text-base font-bold text-slate-900">Home Sanctuary Protection</h3>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
          During severe winter smog, indoor particulate accumulation can equal outdoor levels if procedural ventilation and cooking seals are neglected.
        </p>
      </div>

      {/* Live Facility Toggles */}
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Your Home Facilities
        </span>

        <label
          htmlFor="facility-partition"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <DoorClosed className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Kitchen Door Partition</span>
          </span>
          <input
            id="facility-partition"
            type="checkbox"
            checked={hasPartition}
            onChange={(e) => setHasPartition(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
          />
        </label>

        <label
          htmlFor="facility-exhaust"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Fan className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Kitchen Exhaust Fan Installed</span>
          </span>
          <input
            id="facility-exhaust"
            type="checkbox"
            checked={hasExhaust}
            onChange={(e) => setHasExhaust(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
          />
        </label>

        <label
          htmlFor="facility-purifier"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Commercial HEPA Purifier</span>
          </span>
          <input
            id="facility-purifier"
            type="checkbox"
            checked={hasPurifier}
            onChange={(e) => setHasPurifier(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
          />
        </label>
      </div>
    </div>
  );
}
