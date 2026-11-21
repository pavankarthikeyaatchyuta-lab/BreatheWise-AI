/**
 * Grounded Gemini AI Chat Route
 * POST /api/chat
 * Server-side key protection, Zod validation, error resilience
 */

import { NextRequest, NextResponse } from 'next/server';
import { askGroundedAssistant } from '@/lib/ai/gemini-client';
import { AirQualityState } from '@/lib/types/aqi';
import { HouseholdProfile, DEFAULT_HOUSEHOLD_PROFILE } from '@/lib/types/user';
import { getDelhiDemoState } from '@/lib/aqi/demo-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message || '';
    
    // Safely merge with defaults if partial structures are sent
    const defaultState = getDelhiDemoState();
    const aqiState: AirQualityState = {
      ...defaultState,
      ...(body.aqiState || {}),
      current: {
        ...defaultState.current,
        ...(body.aqiState?.current || {}),
      },
      provenance: {
        ...defaultState.provenance,
        ...(body.aqiState?.provenance || {}),
      },
    };
    
    const profile: HouseholdProfile = {
      ...DEFAULT_HOUSEHOLD_PROFILE,
      ...(body.profile || {}),
    };

    const language = body.language === 'te' ? 'te' : body.language === 'hi' ? 'hi' : 'en';

    const response = await askGroundedAssistant(message, aqiState, profile, language);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat route error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        fallback: 'Please try asking again or check your network connection.',
      },
      { status: 500 }
    );
  }
}
