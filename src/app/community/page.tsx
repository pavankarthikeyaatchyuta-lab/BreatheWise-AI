'use client';

import React, { useState } from 'react';
import { evaluateGRAPStage } from '@/lib/engine/grap-engine';
import { useCity } from '@/context/CityContext';
import { GRAPCommunityDirective } from '@/components/community/GRAPCommunityDirective';
import { SchoolAdvisoryCard } from '@/components/community/SchoolAdvisoryCard';
import { RWABulletinShareCard } from '@/components/community/RWABulletinShareCard';
import { CAQMOrderModal } from '@/components/community/CAQMOrderModal';

export default function CommunityPage() {
  const { aqiData: aqiState } = useCity();
  const [copied, setCopied] = useState<boolean>(false);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({
    sports: true,
    classrooms: true,
    dust: true,
    burning: true,
    heating: true,
  });

  const aqi = aqiState.current.aqi;
  const grap = evaluateGRAPStage(aqi, aqiState.isNCR);

  const sampleBulletinText = `📢 BREATHEWISE AI COMMUNITY ADVISORY
Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
Location: ${aqiState.city} (${aqiState.isNCR ? 'Delhi-NCR Statutory' : 'Regional Advisory'})
Status: ${aqi !== null ? `AQI ${aqi}` : 'AQI Telemetry Pending'} • ${grap.stageName}

🚨 IMMEDIATE COMMUNITY & SCHOOL ACTIONS:
1. SCHOOLS: Shift morning assemblies and outdoor sports indoors. Keep classroom windows closed with indoor air cleaning.
2. DUST CONTROL: Regular wet mopping of driveways; strictly avoid dry sweeping.
3. RWAs: Provide electric room heaters to security guards at society gates to stop open wood/biomass fires.
4. ANTI-IDLING: Enforce engine switch-off for school buses and cars waiting at society gates (>15s).
5. ZERO BURNING: Strict ban on dry garden leaves and municipal garbage burning.

Generated via BreatheWise AI • Grounded in CAQM Directives & CPCB 8-Pollutant Standards`;

  const handleCopyBulletin = () => {
    navigator.clipboard.writeText(sampleBulletinText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(sampleBulletinText)}`;
    window.open(url, '_blank');
  };

  const toggleCheck = (id: string) => {
    setCheckedActions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Community &amp; School Action Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Community &amp; School Action Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Coordinate collective actions for cleaner, healthier neighborhoods.
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid: GRAP Status Card (Left) & School/RWA Actions Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6">
          <GRAPCommunityDirective
            grap={grap}
            onOpenOrderModal={() => setShowOrderModal(true)}
          />
        </div>
        <div className="lg:col-span-6">
          <SchoolAdvisoryCard
            checkedActions={checkedActions}
            onToggleCheck={toggleCheck}
          />
        </div>
      </div>

      {/* Share Action Bulletin Bottom Card with WhatsApp Button */}
      <RWABulletinShareCard
        copied={copied}
        onCopy={handleCopyBulletin}
        onWhatsAppShare={handleWhatsAppShare}
      />

      {/* CAQM Official Order Modal */}
      <CAQMOrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
      />
    </div>
  );
}
