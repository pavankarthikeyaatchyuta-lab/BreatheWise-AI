'use client';

import React, { useState } from 'react';
import { MapPin, Bell, User, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';

interface AppHeaderProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

const CITIES = [
  'Delhi-NCR',
  'Hyderabad',
  'Mumbai',
  'Bengaluru',
  'Kolkata',
  'Pune',
  'Chennai',
  'Lucknow',
  'Patna',
];

export function AppHeader({
  currentCity,
  onCityChange,
  onMobileMenuToggle,
  mobileMenuOpen,
}: AppHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Time-of-day greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-6 py-4">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Greeting & Subtitle */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle mobile navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{timeGreeting}, Pavan!</span>
              <span className="text-emerald-600 text-lg sm:text-xl">🍃</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block mt-0.5">
              Here&apos;s your air quality, forecast and personalized guidance for today.
            </p>
          </div>
        </div>

        {/* Right: Location Selector, Notifications, Avatar */}
        <div className="flex items-center gap-3">
          {/* Location Selector Pill */}
          <div className="relative flex items-center bg-white border border-slate-200 rounded-full px-3.5 py-1.5 shadow-xs hover:border-emerald-400 transition-all">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
            <select
              value={currentCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 pr-2 focus:outline-none cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all shadow-xs relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-900">
                  <span>Advisories & Alerts</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                    1 Active
                  </span>
                </div>
                <div className="py-2.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Diurnal Inversion Peak</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Morning inversion trapped surface PM2.5. Afternoon dispersion expected between 1:00 PM and 4:00 PM.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center shadow-xs border-2 border-white ring-1 ring-slate-200">
            P
          </div>
        </div>
      </div>
    </header>
  );
}
