/**
 * Grounded Gemini AI Chat Route
 * POST /api/chat
 * Server-side key protection, Zod incoming request validation, in-memory rate limiting, error resilience
 */

import { NextRequest, NextResponse } from 'next/server';
import { askGroundedAssistant } from '@/lib/ai/gemini-client';
import { AirQualityState } from '@/lib/types/aqi';
import { HouseholdProfile, DEFAULT_HOUSEHOLD_PROFILE } from '@/lib/types/user';
import { getDelhiDemoState } from '@/lib/aqi/demo-data';
import { ChatIncomingRequestSchema } from '@/lib/ai/schemas';

// In-memory sliding-window rate limiter: max 20 requests per 60 seconds per IP
interface RateLimitRecord {
  timestamps: number[];
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;

function checkRateLimit(ip: string): { isLimited: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { timestamps: [] };

  // Filter out timestamps older than window
  record.timestamps = record.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (record.timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { isLimited: true, retryAfterSeconds: Math.max(1, retryAfterSeconds) };
  }

  record.timestamps.push(now);
  rateLimitMap.set(ip, record);

  // Periodically cleanup stale entries
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.timestamps.length === 0 || now - val.timestamps[val.timestamps.length - 1] > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  return { isLimited: false, retryAfterSeconds: 0 };
}

export async function POST(request: NextRequest) {
  // 1. IP Rate Limiting Check
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  const rateLimitStatus = checkRateLimit(ip);
  if (rateLimitStatus.isLimited) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please wait a moment before sending another question.',
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimitStatus.retryAfterSeconds) },
      }
    );
  }

  try {
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload in request body' },
        { status: 400 }
      );
    }

    // 2. Strict Zod Validation of Incoming Request Body
    const validation = ChatIncomingRequestSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Request validation failed',
          details: validation.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
        },
        { status: 400 }
      );
    }

    const { message, language, aqiState: incomingAqi, profile: incomingProfile } = validation.data;

    // 3. Safely merge with defaults to guarantee robust context
    const defaultState = getDelhiDemoState();
    const aqiState: AirQualityState = {
      ...defaultState,
      ...(incomingAqi || {}),
      current: {
        ...defaultState.current,
        ...(incomingAqi?.current ? {
          ...defaultState.current,
          aqi: incomingAqi.current.aqi ?? defaultState.current.aqi,
          dominantPollutantName: incomingAqi.current.dominantPollutantName ?? defaultState.current.dominantPollutantName,
        } : {}),
      },
      provenance: defaultState.provenance,
    };

    const profile: HouseholdProfile = {
      ...DEFAULT_HOUSEHOLD_PROFILE,
      ...(incomingProfile || {}),
    };

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
