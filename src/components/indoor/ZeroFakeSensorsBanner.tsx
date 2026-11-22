'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface ZeroFakeSensorsBannerProps {
  disclaimer: string;
}

export function ZeroFakeSensorsBanner({ disclaimer }: ZeroFakeSensorsBannerProps) {
  return (
    <div
      className="p-4 bg-amber-50/90 border border-amber-300/80 rounded-2xl flex items-start gap-3 shadow-xs"
      role="alert"
      aria-live="polite"
    >
      <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="text-xs text-amber-950 leading-relaxed">
        <strong className="block font-bold text-amber-900 mb-0.5">
          Zero Fake Sensors Integrity Policy
        </strong>
        {disclaimer}
      </div>
    </div>
  );
}
