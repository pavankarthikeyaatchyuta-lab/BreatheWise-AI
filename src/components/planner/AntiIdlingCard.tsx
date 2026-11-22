'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export function AntiIdlingCard() {
  return (
    <div className="bg-[#0a3526] text-white rounded-3xl p-6 shadow-xs border border-[#0d4432]">
      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
        <span>Anti-Idling Heuristic (PCRA / SAE)</span>
      </div>
      <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
        Petroleum Conservation Research Association (PCRA, India) demonstrates that restarting a modern vehicle engine consumes less fuel than idling for &gt;10-15 seconds. Cut your ignition at traffic signals where countdown timers exceed 15-20 seconds.
      </p>
      <Link
        href="/alternatives"
        className="inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl transition-colors shadow-xs"
      >
        <span>Explore Metro &amp; Carpool Modes</span>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
