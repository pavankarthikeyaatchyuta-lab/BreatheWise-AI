'use client';

import React from 'react';
import { 
  Wrench, 
  X, 
  AlertTriangle, 
  Check, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';
import { IndoorGuidanceResult } from '@/lib/engine/indoor-engine';

interface CorsiRosenthalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  diyGuide: IndoorGuidanceResult['diyFilterGuide'];
}

export function CorsiRosenthalGuideModal({
  isOpen,
  onClose,
  diyGuide,
}: CorsiRosenthalGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="diy-modal-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Wrench className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="diy-modal-title" className="text-lg font-bold text-slate-900">
                {diyGuide.title}
              </h2>
              <span className="text-xs text-slate-500">
                Safety-First Low-Cost Air Purification Blueprint
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-5 text-xs text-slate-700">
          {/* Motor Safety */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <span className="font-bold text-amber-950 flex items-center gap-1.5 mb-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
              Fan Motor Safety Requirements (Mandatory)
            </span>
            <ul className="space-y-1.5 text-amber-900">
              {diyGuide.safetyPrerequisites.map((req: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Filter Media Specifications */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-2 text-sm">
              <Layers className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              Filter Media Specifications
            </span>
            <ul className="space-y-1.5">
              {diyGuide.filterSpecifications.map((spec: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Assembly Checklist */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-2 text-sm">
              <Wrench className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              Airtight Step-by-Step Assembly
            </span>
            <ul className="space-y-1.5">
              {diyGuide.assemblyChecklist.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-emerald-700">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Scientific Limitations */}
          <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">
              Scientific Limitations &amp; Honesty:
            </span>
            <ul className="space-y-1 text-slate-600">
              {diyGuide.limitations.map((lim: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span>•</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-slate-200/80 font-semibold text-slate-800">
              Maintenance Schedule: {diyGuide.maintenanceSchedule}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
