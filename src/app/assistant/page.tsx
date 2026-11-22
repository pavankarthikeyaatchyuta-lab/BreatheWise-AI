'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { AIAssistantResponse } from '@/lib/ai/schemas';
import { evaluateGRAPStage } from '@/lib/engine/grap-engine';
import { useCity } from '@/context/CityContext';
import { useScenario } from '@/context/ScenarioContext';
import { AssistantHeader } from '@/components/assistant/AssistantHeader';
import { ChatMessageItem, ChatMessage } from '@/components/assistant/ChatMessageItem';
import { AssistantInputArea } from '@/components/assistant/AssistantInputArea';

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
      <AssistantHeader
        city={aqiState.city}
        aqi={aqi}
        dominant={dominant}
        activeScenario={activeScenario}
      />

      {/* Main Chat Stream Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs flex flex-col min-h-[520px] justify-between">
        {/* Messages Stream */}
        <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2" aria-live="polite">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} msg={msg} />
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-slate-500 p-4 bg-slate-50 rounded-2xl w-fit">
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" aria-hidden="true" />
              <span>Grounded reasoning over CPCB NAQI &amp; health guidelines...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Prompt Chips & Input Bar */}
        <AssistantInputArea
          inputQuery={inputQuery}
          setInputQuery={setInputQuery}
          loading={loading}
          onSend={handleSendMessage}
          quickPrompts={QUICK_PROMPT_CHIPS}
        />
      </div>
    </div>
  );
}
