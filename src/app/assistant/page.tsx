'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Bot, 
  Info,
  Clock,
  Compass
} from 'lucide-react';
import { AIAssistantResponse } from '@/lib/ai/schemas';
import { getDelhiDemoState } from '@/lib/aqi/demo-data';
import { DEFAULT_HOUSEHOLD_PROFILE } from '@/lib/types/user';
import { evaluateGRAPStage } from '@/lib/engine/grap-engine';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  assistantPayload?: AIAssistantResponse;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'I commute by two-wheeler and have school kids. How should we adapt our morning in Delhi?',
  'How can I clean and ventilate our bedrooms without letting winter smog inside?',
  'What is the real exposure difference between driving my car vs taking the Delhi Metro?',
  'What collective actions should our apartment society take under the current GRAP stage?',
];

export default function AssistantPage() {
  const aqiState = getDelhiDemoState();
  const aqi = aqiState.current.aqi ?? 450;
  const grap = evaluateGRAPStage(aqi, aqiState.isNCR);
  const dominant = aqiState.current.dominantPollutantName ?? 'PM2.5';

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: `Hello, I am BreatheWise AI. I provide grounded decision support for urban air quality, daily routines, indoor air hacks, and sustainable alternatives. My answers are strictly grounded in CPCB NAQI standards (${aqiState.city}: AQI ${aqi}, ${grap.stageName}) and deterministic science without unverified claims. How can I help your family today?`,
      timestamp: 'Just now',
    },
  ]);

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
          profile: DEFAULT_HOUSEHOLD_PROFILE,
        }),
      });

      if (res.ok) {
        const payload: AIAssistantResponse = await res.json();
        const botMsg: ChatMessage = {
          id: `b-${Date.now()}`,
          sender: 'assistant',
          text: payload.reply,
          assistantPayload: payload,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('API failed');
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: 'I am operating in resilient offline mode. For today in Delhi-NCR (AQI 450, Severe), please keep all exterior windows tightly closed, run kitchen exhaust fans during cooking, switch outdoor fitness to indoor yoga, and wear a well-fitted N95 respirator if stepping outside.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-forest-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Grounded GenAI Translation Layer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Intelligent Gemini AI Assistant
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Strictly grounded in CPCB 8-pollutant telemetry, CAQM GRAP regulations, and deterministic impact calculations.
          </p>
        </div>

        {/* Live Grounding Context Badge */}
        <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex items-center gap-3 shrink-0 border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-bold">Grounded Context</span>
            <span className="font-semibold text-white">
              {aqiState.city} (AQI {aqi} • {dominant})
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[650px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                m.sender === 'user'
                  ? 'bg-forest-600 text-white'
                  : 'bg-purple-600 text-white'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-2xl space-y-3 ${
                m.sender === 'user'
                  ? 'bg-forest-700 text-white p-4 rounded-2xl rounded-tr-none text-xs leading-relaxed font-medium shadow-xs'
                  : 'bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-none shadow-xs text-xs text-slate-800 leading-relaxed'
              }`}>
                <p className="whitespace-pre-wrap">{m.text}</p>

                {/* Structured Action Cards if present */}
                {m.assistantPayload?.actionChecklist && m.assistantPayload.actionChecklist.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Grounded Action Checklist:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {m.assistantPayload.actionChecklist.map((act, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs"
                        >
                          <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900">{act.action}</span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                act.urgency === 'IMMEDIATE'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {act.urgency}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal">
                              <em>Reason:</em> {act.scientificReason}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <span className={`block text-[10px] text-right ${
                  m.sender === 'user' ? 'text-forest-200' : 'text-slate-400'
                }`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-4">
              <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
              <span>Gemini is grounding response against CPCB environmental parameters...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-6 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">Quick Queries:</span>
          {QUICK_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p)}
              disabled={loading}
              className="text-[11px] whitespace-nowrap px-3 py-1 bg-white hover:bg-forest-50 text-slate-700 hover:text-forest-800 rounded-lg border border-slate-200 transition-colors font-medium shrink-0 disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a question about daily routine, kitchen exhaust, Corsi-Rosenthal filter, or commute..."
              disabled={loading}
              className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-3 bg-forest-600 hover:bg-forest-500 disabled:bg-slate-300 text-white rounded-xl transition-colors shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Evidence-grounded decision support only • No medical diagnosis or clinical healthcare claims.
          </p>
        </div>
      </div>
    </div>
  );
}
