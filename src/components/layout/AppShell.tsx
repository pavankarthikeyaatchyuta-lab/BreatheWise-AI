'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { Footer } from './Footer';
import { CityProvider, useCity } from '@/context/CityContext';
import { ScenarioProvider } from '@/context/ScenarioContext';

function AppShellInner({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedCity, setSelectedCity } = useCity();

  return (
    <div className="min-h-screen flex bg-[#f5f8f6] text-slate-900 font-sans antialiased">
      {/* Desktop Left Sidebar (hidden on mobile) */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 bg-[#0a3526] h-full shadow-2xl flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <AppHeader
          currentCity={selectedCity}
          onCityChange={(city) => setSelectedCity(city)}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CityProvider>
      <ScenarioProvider>
        <AppShellInner>{children}</AppShellInner>
      </ScenarioProvider>
    </CityProvider>
  );
}
