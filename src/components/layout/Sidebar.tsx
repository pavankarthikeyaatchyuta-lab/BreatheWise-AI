'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Wind, 
  ArrowLeftRight, 
  BarChart3, 
  Users, 
  Sparkles, 
  Settings,
  Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useScenario } from '@/context/ScenarioContext';
import { Translations } from '@/lib/i18n/translations';

interface NavItemConfig {
  href: string;
  transKey: keyof Translations;
  fallback: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItemConfig[] = [
  { href: '/', transKey: 'navDashboard', fallback: 'Dashboard', icon: LayoutDashboard },
  { href: '/planner', transKey: 'navPlanner', fallback: 'Daily Planner', icon: CalendarClock },
  { href: '/indoor-coach', transKey: 'navIndoorCoach', fallback: 'Indoor Coach', icon: Wind },
  { href: '/alternatives', transKey: 'navAlternatives', fallback: 'Alternatives', icon: ArrowLeftRight },
  { href: '/impact', transKey: 'navImpact', fallback: 'Impact Intelligence', icon: BarChart3 },
  { href: '/community', transKey: 'navCommunity', fallback: 'Community Hub', icon: Users },
  { href: '/assistant', transKey: 'navAssistant', fallback: 'AI Assistant', icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useScenario();

  return (
    <aside className="w-64 bg-[#0a3526] text-white flex flex-col justify-between shrink-0 h-screen relative overflow-hidden border-r border-[#0d4432] shadow-xl">
      {/* Top Section */}
      <div className="p-5 relative z-10">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 group mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 fill-white/20 text-white" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white block leading-tight group-hover:text-emerald-300 transition-colors">
              BreatheWise <span className="text-emerald-400">AI</span>
            </span>
            <span className="text-[11px] font-medium text-emerald-200/60 tracking-wider">
              Urban Air Quality Assistant
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-150 relative group',
                  isActive
                    ? 'bg-[#188050] text-white font-bold shadow-md shadow-emerald-950/30'
                    : 'text-emerald-100/75 hover:text-white hover:bg-emerald-800/30 font-medium'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 transition-transform group-hover:scale-110 shrink-0',
                    isActive ? 'text-white' : 'text-emerald-300/70 group-hover:text-emerald-200'
                  )}
                />
                <span>{t(item.transKey) || item.fallback}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section with Settings & Forest Silhouette Graphic */}
      <div className="relative z-10 p-5 pt-0">
        <Link
          href="/planner"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-emerald-200/70 hover:text-white hover:bg-emerald-800/30 transition-colors mb-2"
        >
          <Settings className="w-4 h-4 text-emerald-300/70" />
          <span>Settings</span>
        </Link>

        {/* CPCB 8-Pollutant Grounded Status Indicator */}
        <div className="p-3 rounded-xl bg-[#0d402f]/80 border border-emerald-500/20 text-[11px] text-emerald-200/80 leading-normal">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CPCB Verified Engine</span>
          </div>
          <span>8 Criteria Pollutants • Grounded</span>
        </div>
      </div>

      {/* Vector Nature Skyline Graphic at bottom of sidebar (SVG matching reference image) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-45 overflow-hidden h-44">
        <svg
          viewBox="0 0 256 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
        >
          {/* Distant city skyline buildings */}
          <rect x="25" y="65" width="18" height="95" fill="#10b981" opacity="0.35" />
          <rect x="48" y="50" width="22" height="110" fill="#059669" opacity="0.3" />
          <rect x="80" y="70" width="16" height="90" fill="#10b981" opacity="0.25" />
          <rect x="110" y="45" width="24" height="115" fill="#047857" opacity="0.3" />
          <rect x="145" y="60" width="20" height="100" fill="#10b981" opacity="0.3" />
          <rect x="180" y="50" width="22" height="110" fill="#059669" opacity="0.3" />
          <rect x="215" y="68" width="18" height="92" fill="#10b981" opacity="0.25" />

          {/* Layered rounded trees and foliage */}
          <ellipse cx="20" cy="140" rx="35" ry="25" fill="#065f46" />
          <ellipse cx="65" cy="135" rx="30" ry="22" fill="#047857" />
          <ellipse cx="110" cy="130" rx="38" ry="26" fill="#059669" />
          <ellipse cx="160" cy="135" rx="32" ry="24" fill="#047857" />
          <ellipse cx="205" cy="132" rx="36" ry="26" fill="#065f46" />
          <ellipse cx="245" cy="140" rx="30" ry="22" fill="#047857" />

          {/* Stylized tree cones / pines */}
          <polygon points="40,150 55,95 70,150" fill="#34d399" opacity="0.4" />
          <polygon points="95,150 110,85 125,150" fill="#6ee7b7" opacity="0.35" />
          <polygon points="150,150 165,90 180,150" fill="#34d399" opacity="0.4" />
          <polygon points="210,150 225,80 240,150" fill="#6ee7b7" opacity="0.35" />
        </svg>
      </div>
    </aside>
  );
}
