'use client';

import React from 'react';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  structuredPoints?: string[];
  caveats?: string[];
  timestamp: string;
  providerMeta?: {
    provider: string;
    model: string;
    fallbackUsed: boolean;
    success: boolean;
    errorCategory: string | null;
  };
}

interface ChatMessageItemProps {
  msg: ChatMessage;
}

export function ChatMessageItem({ msg }: ChatMessageItemProps) {
  const isUser = msg.sender === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-md sm:max-w-lg bg-[#e0f2fe] text-sky-950 px-4 py-3 rounded-2xl rounded-tr-xs border border-sky-100 shadow-xs text-xs sm:text-sm font-medium leading-relaxed">
          <p>{msg.text}</p>
          <span className="block text-[10px] text-sky-600 font-semibold mt-1 text-right">
            {msg.timestamp}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3.5">
      {/* Green Leaf Avatar */}
      <div className="w-9 h-9 rounded-2xl bg-[#0a3526] text-white flex items-center justify-center shrink-0 shadow-xs">
        <Sparkles className="w-4 h-4 text-emerald-300" aria-hidden="true" />
      </div>

      {/* Assistant Message Bubble */}
      <div className="flex-1 bg-slate-50/90 rounded-3xl rounded-tl-xs p-5 sm:p-6 border border-slate-200/70 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="flex-1 space-y-3">
            {msg.providerMeta && (
              <div className="flex flex-wrap items-center gap-2 pb-1">
                {!msg.providerMeta.fallbackUsed ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                    Live Gemini Generation ({msg.providerMeta.model})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <ShieldCheck className="w-3 h-3 text-amber-600" aria-hidden="true" />
                    Deterministic Grounded Engine ({msg.providerMeta.errorCategory || 'Resilient Fallback'})
                  </span>
                )}
              </div>
            )}

            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
              {msg.text}
            </p>

            {msg.structuredPoints && msg.structuredPoints.length > 0 && (
              <div className="mt-3 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Recommended Actions:
                </span>
                <ul className="space-y-2 text-xs text-slate-700">
                  {msg.structuredPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {msg.caveats && msg.caveats.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 italic space-y-1">
                {msg.caveats.map((c, i) => (
                  <p key={i}>• {c}</p>
                ))}
              </div>
            )}

            <span className="block text-[10px] text-slate-400 font-medium pt-1">
              {msg.timestamp}
            </span>
          </div>

          {/* Child Playing Indoors / Clean Room Vector Art */}
          <div className="w-44 h-36 rounded-2xl bg-gradient-to-b from-amber-50/50 to-emerald-50/30 border border-slate-200/50 p-2 shrink-0 hidden sm:flex items-center justify-center overflow-hidden" aria-hidden="true">
            <svg className="w-full h-full" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="10" y1="105" x2="150" y2="105" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="80" cy="45" r="14" fill="#fed7aa" />
              <path d="M68 42 C68 32 92 30 92 42 Z" fill="#78350f" />
              <path d="M77 48 Q80 52 83 48" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
              <path d="M68 60 L92 60 L96 90 L64 90 Z" fill="#fbbf24" rx="4" />
              <line x1="68" y1="68" x2="55" y2="85" stroke="#fed7aa" strokeWidth="4" strokeLinecap="round" />
              <line x1="92" y1="68" x2="105" y2="85" stroke="#fed7aa" strokeWidth="4" strokeLinecap="round" />
              <rect x="42" y="85" width="16" height="16" rx="2" fill="#ef4444" />
              <rect x="44" y="69" width="12" height="16" rx="2" fill="#3b82f6" />
              <rect x="102" y="85" width="16" height="16" rx="2" fill="#10b981" />
              <polygon points="50,60 42,69 58,69" fill="#f59e0b" />
              <path d="M130 92 L142 92 L140 105 L132 105 Z" fill="#d97706" />
              <circle cx="136" cy="85" r="5" fill="#22c55e" />
              <circle cx="136" cy="80" r="3" fill="#ec4899" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
