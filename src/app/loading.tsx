import React from 'react';

export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse" aria-busy="true" aria-label="Loading page content">
      {/* Top Banner Skeleton */}
      <div className="h-14 bg-slate-200/70 rounded-2xl w-full" />

      {/* Hero Card Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-slate-200/70 rounded-3xl" />
        <div className="h-72 bg-slate-200/70 rounded-3xl" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-slate-200/60 rounded-2xl" />
        ))}
      </div>

      {/* Bottom Section Skeleton */}
      <div className="h-64 bg-slate-200/60 rounded-3xl w-full" />
    </div>
  );
}
