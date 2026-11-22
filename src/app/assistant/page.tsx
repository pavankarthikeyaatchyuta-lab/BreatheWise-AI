'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Info,
  MapPin,
  Bot,
  User,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { AIAssistantResponse } from '@/lib/ai/schemas';
import { DEFAULT_HOUSEHOLD_PROFILE } from '@/lib/types/user';
import { evaluateGRAPStage } from '@/lib/engine/grap-engine';
import { useCity } from '@/context/CityContext';
import { useScenario } from '@/context/ScenarioContext';

interface ChatMessage {
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

const QUICK_PROMPT_CHIPS = [
  'Plan my day',
  'Improve indoor air',
  'Compare commute options',
  'Learn about GRAP',
  'Is it safe for my child to play outside this evening?',
];

export default function AssistantPage() {
  const { aqiData: aqiState } = useCity();
  const { profile, language, activeScenario } = useScenario();
  const aqi = aqiState.current.aqi ?? 176;
  const grap = evaluateGRAPStage(aqi, aqiState.isNCR);
  const dominant = aqiState.current.dominantPollutantName ?? 'PM2.5';

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-sample-user',
      sender: 'user',
      text: 'Is it safe for my child to play outside this evening?',
      timestamp: '5:15 PM',
    },
    {
      id: 'm-sample-bot',
      sender: 'assistant',
      text: `Based on today's forecast for ${aqiState.city}:`,
      structuredPoints: [
        "Evening AQI is expected to be ~220 (Poor).",
        "It's better to avoid outdoor play today.",
        "Consider indoor activities like yoga, dance or board games.",
        "If outdoor time is essential, limit it to ≤ 15 minutes. Note: Prioritize keeping children indoors in filtered environments during poor conditions, as masks designed for adults do not achieve reliable pediatric seals."
      ],
      caveats: [
        "Medical Disclaimer: BreatheWise AI provides environmental lifestyle guidance, not clinical diagnoses. Follow your pediatrician's personalized guidance."
      ],
      timestamp: '5:16 PM',
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          aqiState,
          profile,
          language,
        }),
      });

      if (res.ok) {
        const payload: AIAssistantResponse = await res.json();
        const botMsg: ChatMessage = {
          id: `b-${Date.now()}`,
          sender: 'assistant',
          text: payload.reply,
          structuredPoints: payload.actionChecklist.map((item) => `${item.action} (${item.scientificReason})`),
          caveats: [payload.disclaimer],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          providerMeta: payload.providerMeta,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Deterministic Offline Grounded Response
      const fallbackMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: `Here is grounded guidance for ${aqiState.city} (AQI ${aqi}, ${dominant}):`,
        structuredPoints: [
          'Keep exterior doors and windows sealed; use kitchen exhaust during cooking.',
          'Shift outdoor cardio workouts to indoor yoga or mobility sessions.',
          'If traveling, prefer electric metro transit or carpooling over two-wheelers in peak traffic.',
          'Monitor elderly members and children for coughing or eye irritation.'
        ],
        caveats: ['Running in resilient offline mode based on CPCB deterministic rules.'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        providerMeta: {
          provider: 'Deterministic Grounded Engine',
          model: 'deterministic-rules-v1',
          fallbackUsed: true,
          success: false,
          errorCategory: 'NETWORK_OR_OFFLINE',
        },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Assistant
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your personal, contextual air quality &amp; lifestyle guide
          </p>
        </div>

        {/* Live Grounding & Scenario Pill */}
        <div className="flex flex-wrap items-center gap-2">
          {activeScenario && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Scenario: {activeScenario.badge}</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700 self-start md:self-auto">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{aqiState.city}: AQI {aqi} • {dominant}</span>
          </div>
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs flex flex-col min-h-[520px] justify-between">
        {/* Messages Stream */}
        <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2" aria-live="polite">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            if (isUser) {
              return (
                <div key={msg.id} className="flex justify-end">
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
              <div key={msg.id} className="flex items-start gap-3.5">
                {/* Green Leaf Avatar */}
                <div className="w-9 h-9 rounded-2xl bg-[#0a3526] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                </div>

                {/* Assistant Message Bubble */}
                <div className="flex-1 bg-slate-50/90 rounded-3xl rounded-tl-xs p-5 sm:p-6 border border-slate-200/70 shadow-xs">
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      {msg.providerMeta && (
                        <div className="flex flex-wrap items-center gap-2 pb-1">
                          {!msg.providerMeta.fallbackUsed ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              Live Gemini Generation ({msg.providerMeta.model})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <ShieldCheck className="w-3 h-3 text-amber-600" />
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
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
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
                    <div className="w-44 h-36 rounded-2xl bg-gradient-to-b from-amber-50/50 to-emerald-50/30 border border-slate-200/50 p-2 shrink-0 hidden sm:flex items-center justify-center overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Floor */}
                        <line x1="10" y1="105" x2="150" y2="105" stroke="#cbd5e1" strokeWidth="2" />
                        
                        {/* Kid Head & Body */}
                        <circle cx="80" cy="45" r="14" fill="#fed7aa" />
                        {/* Kid Hair */}
                        <path d="M68 42 C68 32 92 30 92 42 Z" fill="#78350f" />
                        {/* Friendly Smile */}
                        <path d="M77 48 Q80 52 83 48" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
                        
                        {/* Shirt */}
                        <path d="M68 60 L92 60 L96 90 L64 90 Z" fill="#fbbf24" rx="4" />
                        {/* Hands playing with blocks */}
                        <line x1="68" y1="68" x2="55" y2="85" stroke="#fed7aa" strokeWidth="4" strokeLinecap="round" />
                        <line x1="92" y1="68" x2="105" y2="85" stroke="#fed7aa" strokeWidth="4" strokeLinecap="round" />

                        {/* Building Blocks */}
                        <rect x="42" y="85" width="16" height="16" rx="2" fill="#ef4444" />
                        <rect x="44" y="69" width="12" height="16" rx="2" fill="#3b82f6" />
                        <rect x="102" y="85" width="16" height="16" rx="2" fill="#10b981" />
                        <polygon points="50,60 42,69 58,69" fill="#f59e0b" />

                        {/* Potted Flower in Background */}
                        <path d="M130 92 L142 92 L140 105 L132 105 Z" fill="#d97706" />
                        <circle cx="136" cy="85" r="5" fill="#22c55e" />
                        <circle cx="136" cy="80" r="3" fill="#ec4899" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-slate-500 p-4 bg-slate-50 rounded-2xl w-fit">
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Grounded reasoning over CPCB NAQI &amp; health guidelines...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Prompt Chips & Input Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between gap-4">
            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {QUICK_PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(chip)}
                  className="px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all active:scale-95 text-left"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Friendly Robot Mascot Illustration (matching reference design) */}
            <div className="hidden lg:flex w-24 h-24 shrink-0 relative items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Antenna */}
                <line x1="60" y1="20" x2="60" y2="10" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                <circle cx="60" cy="8" r="4" fill="#10b981" />
                <path d="M60 8 C65 4 70 8 68 12 Z" fill="#22c55e" />

                {/* Robot Head */}
                <rect x="36" y="20" width="48" height="38" rx="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
                {/* Face Visor Screen */}
                <rect x="42" y="26" width="36" height="22" rx="8" fill="#0f172a" />
                {/* Friendly Eyes */}
                <ellipse cx="50" cy="37" rx="3.5" ry="4.5" fill="#38bdf8" />
                <ellipse cx="70" cy="37" rx="3.5" ry="4.5" fill="#38bdf8" />
                {/* Eye glints */}
                <circle cx="49" cy="35" r="1.5" fill="#ffffff" />
                <circle cx="69" cy="35" r="1.5" fill="#ffffff" />

                {/* Ears / Headphone nubs */}
                <rect x="30" y="32" width="6" height="14" rx="3" fill="#10b981" />
                <rect x="84" y="32" width="6" height="14" rx="3" fill="#10b981" />

                {/* Neck */}
                <rect x="54" y="58" width="12" height="6" rx="2" fill="#94a3b8" />

                {/* Robot Body */}
                <rect x="38" y="64" width="44" height="42" rx="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
                {/* Green Leaf Logo on Chest */}
                <ellipse cx="60" cy="84" rx="10" ry="12" fill="#dcfce7" />
                <path d="M60 76 C68 78 68 88 60 92 C52 88 52 78 60 76 Z" fill="#10b981" />

                {/* Left Arm */}
                <path d="M38 72 C30 76 28 88 32 94" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                <path d="M38 72 C30 76 28 88 32 94" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

                {/* Right Arm (Waving!) */}
                <path d="M82 72 C92 68 100 52 98 44" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
                <path d="M82 72 C92 68 100 52 98 44" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                <circle cx="98" cy="44" r="5" fill="#10b981" />

                {/* Bottom Shadow */}
                <ellipse cx="60" cy="112" rx="24" ry="4" fill="#0f172a" opacity="0.1" />
              </svg>
            </div>
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:bg-white transition-all"
          >
            <input
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
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 px-1 text-center">
            Privacy Notice: Non-medical household indicators (presence of infants/seniors, asthma sensitivity, commute mode) are included in the prompt context to tailor environmental guidance. No personal names or exact GPS coordinates are captured. BreatheWise AI provides environmental decision support, not licensed medical treatment.
          </p>
        </div>
      </div>
    </div>
  );
}
