'use client';

import React from 'react';
import { FileText, X } from 'lucide-react';

interface CAQMOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CAQMOrderModal({ isOpen, onClose }: CAQMOrderModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="grap-order-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="grap-order-title" className="text-lg font-bold text-slate-900">
                CAQM GRAP Directive Summary
              </h2>
              <span className="text-xs text-slate-500">
                Statutory Framework for Delhi and NCR Districts
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close statutory order modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
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
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0a3526] hover:bg-[#0d402f] text-white text-xs font-bold transition-colors"
          >
            Close Order
          </button>
        </div>
      </div>
    </div>
  );
}
