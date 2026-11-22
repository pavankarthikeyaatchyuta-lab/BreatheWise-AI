'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Wind, 
  CalendarClock, 
  Home, 
  ArrowLeftRight, 
  BarChart3, 
  Users, 
  Sparkles, 
  Menu, 
  X,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Air Intelligence', icon: Wind },
  { href: '/planner', label: 'Daily Planner', icon: CalendarClock },
  { href: '/indoor-coach', label: 'Indoor Coach', icon: Home },
  { href: '/alternatives', label: 'Alternatives', icon: ArrowLeftRight },
  { href: '/impact', label: 'Explainable Impact', icon: BarChart3 },
  { href: '/community', label: 'Community Hub', icon: Users },
  { href: '/assistant', label: 'Gemini Assistant', icon: Sparkles },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-forest-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-forest-500/20 group-hover:scale-105 transition-transform">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-forest-700 transition-colors">
                  BreatheWise <span className="text-forest-600 font-extrabold">AI</span>
                </span>
                <span className="hidden sm:block text-[10px] font-medium text-slate-500 -mt-1 tracking-wider uppercase">
                  Urban Air & Sustainable Living
                </span>
              </div>
            </Link>

            {/* Scientific Integrity Tag */}
            <div className="hidden lg:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>CPCB NAQI 8-Pollutant Verified</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-forest-50 text-forest-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-forest-600' : 'text-slate-400')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-1.5 px-3 py-1.5 mb-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>CPCB NAQI 8-Pollutant Verified • Zero Fake Sensors</span>
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-forest-50 text-forest-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive ? 'text-forest-600' : 'text-slate-400')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
