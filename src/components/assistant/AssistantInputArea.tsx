'use client';

import React from 'react';
import { Send } from 'lucide-react';

interface AssistantInputAreaProps {
  inputQuery: string;
  setInputQuery: (q: string) => void;
  loading: boolean;
  onSend: (text?: string) => void;
  quickPrompts: string[];
}

export function AssistantInputArea({
  inputQuery,
  setInputQuery,
  loading,
  onSend,
  quickPrompts,
}: AssistantInputAreaProps) {
  return (
    <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
      <div className="flex items-center justify-between gap-4">
        {/* Quick Prompt Chips */}
        <div className="flex flex-wrap items-center gap-2 flex-1" role="group" aria-label="Quick questions">
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSend(chip)}
              className="px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all active:scale-95 text-left"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Friendly Robot Mascot Illustration */}
        <div className="hidden lg:flex w-24 h-24 shrink-0 relative items-center justify-center" aria-hidden="true">
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="60" y1="20" x2="60" y2="10" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="60" cy="8" r="4" fill="#10b981" />
            <path d="M60 8 C65 4 70 8 68 12 Z" fill="#22c55e" />
            <rect x="36" y="20" width="48" height="38" rx="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
            <rect x="42" y="26" width="36" height="22" rx="8" fill="#0f172a" />
            <ellipse cx="50" cy="37" rx="3.5" ry="4.5" fill="#38bdf8" />
            <ellipse cx="70" cy="37" rx="3.5" ry="4.5" fill="#38bdf8" />
            <circle cx="49" cy="35" r="1.5" fill="#ffffff" />
            <circle cx="69" cy="35" r="1.5" fill="#ffffff" />
            <rect x="30" y="32" width="6" height="14" rx="3" fill="#10b981" />
            <rect x="84" y="32" width="6" height="14" rx="3" fill="#10b981" />
            <rect x="54" y="58" width="12" height="6" rx="2" fill="#94a3b8" />
            <rect x="38" y="64" width="44" height="42" rx="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
            <ellipse cx="60" cy="84" rx="10" ry="12" fill="#dcfce7" />
            <path d="M60 76 C68 78 68 88 60 92 C52 88 52 78 60 76 Z" fill="#10b981" />
            <path d="M38 72 C30 76 28 88 32 94" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <path d="M38 72 C30 76 28 88 32 94" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <path d="M82 72 C92 68 100 52 98 44" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
            <path d="M82 72 C92 68 100 52 98 44" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <circle cx="98" cy="44" r="5" fill="#10b981" />
            <ellipse cx="60" cy="112" rx="24" ry="4" fill="#0f172a" opacity="0.1" />
          </svg>
        </div>
      </div>

      {/* Form Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:bg-white transition-all"
        role="search"
      >
        <label htmlFor="assistant-user-input" className="sr-only">
          Ask air quality questions
        </label>
        <input
          id="assistant-user-input"
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask about air quality, health, routines or cleaner living..."
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="w-10 h-10 rounded-xl bg-[#0a3526] hover:bg-[#0d402f] disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow-xs"
          aria-label="Send query to AI Assistant"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
      <p className="text-[10px] text-slate-400 mt-2 px-1 text-center">
        Privacy Notice: Non-medical household indicators (presence of infants/seniors, asthma sensitivity, commute mode) are included in the prompt context to tailor environmental guidance. No personal names or exact GPS coordinates are captured. BreatheWise AI provides environmental decision support, not licensed medical treatment.
      </p>
    </div>
  );
}
