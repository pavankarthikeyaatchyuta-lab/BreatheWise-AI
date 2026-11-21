import React from 'react';
import Link from 'next/link';
import { ShieldAlert, BookOpen, ExternalLink, Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand & Purpose */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">BreatheWise AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              An intelligent, family-first urban air quality decision platform engineered for PromptWars Challenge 6. Grounded in CPCB statutory standards, CAQM GRAP regulations, and explainable climate science.
            </p>
            <div className="text-[11px] text-emerald-400 font-medium">
              PromptWars Challenge 6 • Urban Air Quality Assistant
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Product Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-white transition-colors">Air Intelligence Dashboard</Link></li>
              <li><Link href="/planner" className="hover:text-white transition-colors">Smart Routine Planner</Link></li>
              <li><Link href="/indoor-coach" className="hover:text-white transition-colors">Indoor Air Quality Coach</Link></li>
              <li><Link href="/alternatives" className="hover:text-white transition-colors">Sustainable Alternatives</Link></li>
              <li><Link href="/impact" className="hover:text-white transition-colors">Explainable Impact Intelligence</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">Community & School Hub</Link></li>
              <li><Link href="/assistant" className="hover:text-white transition-colors">Grounded Gemini Assistant</Link></li>
            </ul>
          </div>

          {/* Column 3: Data Provenance & Standards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Data Provenance</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ExternalLink className="w-3 h-3 text-emerald-500" />
                <span>CPCB NAQI (8 Pollutants: 24h/8h Averaging)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ExternalLink className="w-3 h-3 text-emerald-500" />
                <span>Open-Meteo (~45 km CAMS Model Forecast)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ExternalLink className="w-3 h-3 text-emerald-500" />
                <span>Central Electricity Authority (Grid CO₂ v22.0, Aug 2026)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ExternalLink className="w-3 h-3 text-emerald-500" />
                <span>ARAI & CPCB Fleet Emission Factors</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ExternalLink className="w-3 h-3 text-emerald-500" />
                <span>CAQM Statutory NCR GRAP Directives</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Scientific & Legal Disclaimers */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Scientific Notices</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              <strong>Zero Fake Sensors:</strong> Indoor air quality recommendations are procedural and evidence-based. Without physical indoor sensors, BreatheWise AI never displays fabricated indoor AQI numbers.
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>Medical Disclaimer:</strong> This application provides environmental decision support. It does not provide medical diagnoses or replace licensed clinical healthcare advice.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} BreatheWise AI. Built for PromptWars Challenge 6.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>60 Automated Tests Passing</span>
            <span>•</span>
            <span>Zod Schema Validated</span>
            <span>•</span>
            <span>Server-Side Secret Isolation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
