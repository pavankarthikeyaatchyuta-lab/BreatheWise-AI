import React from 'react';
import Link from 'next/link';
import { Wind, Compass, LayoutDashboard, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-forest-700 flex items-center justify-center">
          <Wind className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            404 — Page Not Found
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
            Lost in the Smog?
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The telemetry route or intelligence module you are looking for does not exist or has been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Air Dashboard</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Landing Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
