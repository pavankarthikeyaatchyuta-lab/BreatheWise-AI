'use client';

import React from 'react';

/**
 * Accessible skip link allowing keyboard and screen-reader users
 * to bypass navigation and jump directly to the primary content area.
 * Meets WCAG 2.4.1 (Bypass Blocks).
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-forest-800 focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium text-sm transition-all"
    >
      Skip to main content
    </a>
  );
}
