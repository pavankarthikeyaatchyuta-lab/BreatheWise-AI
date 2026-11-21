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
    <aside className="w-64 bg-[#0a3526] text-white flex flex-col justify-between shrink-0 min-h-screen relative overflow-hidden border-r border-[#0d4432] shadow-xl">
      {/* Top Section */}
      <div className="p-6 relative z-10">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 group mb-8">
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
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 relative group',
                  isActive
                    ? 'bg-emerald-600/25 text-white border border-emerald-500/40 shadow-sm shadow-emerald-950/20'
                    : 'text-emerald-100/70 hover:text-white hover:bg-emerald-800/30'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-full" />
                )}
                <Icon
                  className={cn(
                    'w-4 h-4 transition-transform group-hover:scale-110',
                    isActive ? 'text-emerald-400' : 'text-emerald-300/70 group-hover:text-emerald-200'
                  )}
                />
                <span>{t(item.transKey) || item.fallback}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section with Settings & Forest Silhouette Graphic */}
      <div className="relative z-10 p-6 pt-0">
        <Link
          href="/planner"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-emerald-200/70 hover:text-white hover:bg-emerald-800/30 transition-colors mb-4"
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

      {/* Vector Nature Skyline Graphic at bottom of sidebar (SVG) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-20 overflow-hidden h-36">
        <svg
          viewBox="0 0 256 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
        >
          {/* Layered trees and city skyline silhouette */}
          <path
            d="M0 120V95L15 90L25 98L40 85L50 92L65 80L80 95L95 78L110 90L130 75L145 88L160 70L175 85L190 74L205 88L220 72L235 84L256 70V120H0Z"
            fill="#10b981"
          />
          <path
            d="M0 120V105L20 100L35 106L55 96L70 102L90 92L105 102L125 90L145 98L165 88L185 96L205 85L225 95L256 86V120H0Z"
            fill="#059669"
          />
          {/* Soft tree triangles */}
          <polygon points="30,120 45,75 60,120" fill="#34d399" opacity="0.3" />
          <polygon points="90,120 105,65 120,120" fill="#34d399" opacity="0.25" />
          <polygon points="160,120 175,70 190,120" fill="#34d399" opacity="0.3" />
          <polygon points="210,120 225,60 240,120" fill="#34d399" opacity="0.2" />
        </svg>
      </div>
    </aside>
  );
}
