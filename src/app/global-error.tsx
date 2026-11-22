'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f5f8f6] flex items-center justify-center p-4 font-sans text-slate-900 antialiased">
        <div className="max-w-md w-full bg-white rounded-2xl border border-rose-100 shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Application Error
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              A critical layout error occurred in BreatheWise. Please refresh or reset the application state.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
