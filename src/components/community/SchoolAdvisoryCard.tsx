'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface SchoolAdvisoryCardProps {
  checkedActions: Record<string, boolean>;
  onToggleCheck: (id: string) => void;
}

export function SchoolAdvisoryCard({
  checkedActions,
  onToggleCheck,
}: SchoolAdvisoryCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between" role="region" aria-label="School and RWA Protocols">
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
          <div
            onClick={() => onToggleCheck('sports')}
            className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors"
            role="checkbox"
            aria-checked={checkedActions.sports}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onToggleCheck('sports');
              }
            }}
          >
            <div
              className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                checkedActions.sports ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
              }`}
            >
              {checkedActions.sports && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Shift outdoor sports to indoor activities
              </span>
              <span className="text-[11px] text-slate-500">
                Avoid PE classes and football/running during morning thermal inversion (&lt;10 AM).
              </span>
            </div>
          </div>

          <div
            onClick={() => onToggleCheck('classrooms')}
            className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors"
            role="checkbox"
            aria-checked={checkedActions.classrooms}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onToggleCheck('classrooms');
              }
            }}
          >
            <div
              className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                checkedActions.classrooms ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
              }`}
            >
              {checkedActions.classrooms && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Use closed classrooms with good ventilation
              </span>
              <span className="text-[11px] text-slate-500">
                Keep street-facing windows shut; run ceiling fans at low speed for air movement.
              </span>
            </div>
          </div>

          <div
            onClick={() => onToggleCheck('dust')}
            className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors"
            role="checkbox"
            aria-checked={checkedActions.dust}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onToggleCheck('dust');
              }
            }}
          >
            <div
              className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                checkedActions.dust ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
              }`}
            >
              {checkedActions.dust && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Reduce dust: regular wet mopping &amp; driveway sprinkling
              </span>
              <span className="text-[11px] text-slate-500">
                Ban dry broom sweeping of school grounds and society internal roads.
              </span>
            </div>
          </div>

          <div
            onClick={() => onToggleCheck('burning')}
            className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors"
            role="checkbox"
            aria-checked={checkedActions.burning}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onToggleCheck('burning');
              }
            }}
          >
            <div
              className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                checkedActions.burning ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
              }`}
            >
              {checkedActions.burning && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Avoid open waste burning
              </span>
              <span className="text-[11px] text-slate-500">
                Prohibit burning of garden trimmings, dried leaves, and plastic packaging.
              </span>
            </div>
          </div>

          <div
            onClick={() => onToggleCheck('heating')}
            className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors"
            role="checkbox"
            aria-checked={checkedActions.heating}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onToggleCheck('heating');
              }
            }}
          >
            <div
              className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                checkedActions.heating ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
              }`}
            >
              {checkedActions.heating && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Use cleaner heating options for security staff
              </span>
              <span className="text-[11px] text-slate-500">
                Distribute electric room heaters to society gates to eliminate night-time bonfires.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* School Building Vector Art */}
      <div className="mt-5 w-full h-24 rounded-2xl bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-slate-50 border border-slate-100 flex items-end justify-center overflow-hidden" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="72" x2="300" y2="72" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="95" y="25" width="110" height="47" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="150,8 115,25 185,25" fill="#f87171" stroke="#ef4444" strokeWidth="1" />
          <circle cx="150" cy="18" r="4.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
          <line x1="150" y1="18" x2="150" y2="15.5" stroke="#0f172a" strokeWidth="0.8" />
          <line x1="150" y1="18" x2="152.5" y2="18" stroke="#0f172a" strokeWidth="0.8" />
          <rect x="140" y="48" width="20" height="24" rx="2" fill="#0284c7" />
          <rect x="105" y="32" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
          <rect x="123" y="32" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
          <rect x="165" y="32" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
          <rect x="183" y="32" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
          <rect x="105" y="52" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
          <rect x="123" y="52" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
          <rect x="165" y="52" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
          <rect x="183" y="52" width="12" height="12" rx="1.5" fill="#bae6fd" stroke="#94a3b8" strokeWidth="1" />
          <g transform="translate(225, 45)">
            <rect x="0" y="0" width="48" height="22" rx="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            <rect x="4" y="4" width="8" height="7" rx="1" fill="#ffffff" />
            <rect x="15" y="4" width="8" height="7" rx="1" fill="#ffffff" />
            <rect x="26" y="4" width="8" height="7" rx="1" fill="#ffffff" />
            <rect x="37" y="4" width="8" height="7" rx="1" fill="#ffffff" />
            <circle cx="10" cy="22" r="4.5" fill="#1e293b" />
            <circle cx="38" cy="22" r="4.5" fill="#1e293b" />
          </g>
          <ellipse cx="45" cy="50" rx="14" ry="18" fill="#22c55e" />
          <ellipse cx="65" cy="54" rx="10" ry="14" fill="#16a34a" />
          <line x1="45" y1="68" x2="45" y2="72" stroke="#78350f" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
