/**
 * Grounded Google Gemini AI Client
 * Uses official @google/genai SDK (with REST fallback)
 * Configurable model via process.env.GEMINI_MODEL
 * Enforces Zod structured output validation and deterministic fallback
 */

import { GoogleGenAI } from '@google/genai';
import { AIAssistantResponse, AIAssistantResponseSchema } from './schemas';
import { sanitizeUserInput } from './prompt-guard';
import { generateDeterministicAssistantResponse } from './fallback-ai';
import { AirQualityState } from '../types/aqi';
import { HouseholdProfile } from '../types/user';
import { evaluateGRAPStage } from '../engine/grap-engine';

/**
 * Resolves the Gemini API Key with precedence for local .env.local
 * to prevent stale or revoked host OS environment variables from shadowing it.
 */
function resolveGeminiApiKey(): string | undefined {
  // In test environment, strictly honor process.env to allow test fixtures to simulate missing/invalid keys
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    return process.env.GEMINI_API_KEY;
  }

  try {
    if (typeof process !== 'undefined' && process.cwd) {
      const fs = require('fs');
      const path = require('path');
      const envPath = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/^GEMINI_API_KEY=(.+)$/m);
        if (match && match[1].trim()) {
          return match[1].trim();
        }
      }
    }
  } catch {
    // fall through to process.env
  }
  return process.env.GEMINI_API_KEY;
}

/**
 * Resolves the Gemini Model name, prioritizing .env.local configuration,
 * defaulting to 'gemini-3.8-flash' (standard modern Generative Language model).
 */
function resolveGeminiModel(): string {
  try {
    if (typeof process !== 'undefined' && process.cwd) {
      const fs = require('fs');
      const path = require('path');
      const envPath = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/^GEMINI_MODEL=(.+)$/m);
        if (match && match[1].trim()) {
          return match[1].trim();
        }
      }
    }
  } catch {
    // fall through
  }
  return process.env.GEMINI_MODEL || 'gemini-3.8-flash';
}

export async function askGroundedAssistant(
  userQuery: string,
  aqiState: AirQualityState,
  profile: HouseholdProfile,
  language: 'en' | 'te' | 'hi' = 'en'
): Promise<AIAssistantResponse> {
  // 1. Sanitize input
  const sanitization = sanitizeUserInput(userQuery);
  if (!sanitization.isSafe) {
    return {
      reply: `Your request could not be processed: ${sanitization.rejectionReason}`,
      groundedFactors: {
        referencedAqi: aqiState.current.aqi,
        dominantPollutant: aqiState.current.dominantPollutantName,
        activeGrapStage: 'NONE',
        keyVulnerabilityAddressed: 'Input Security Filter',
      },
      actionChecklist: [
        {
          category: 'SCHEDULE',
          action: 'Please ask a question regarding air quality, daily routines, indoor air coach, or commute alternatives.',
          urgency: 'OPTIONAL',
          scientificReason: 'Standard safety validation.',
        },
      ],
      disclaimer: 'Security validation alert.',
      providerMeta: {
        provider: 'Security Filter',
        model: 'input-guard-v1',
        fallbackUsed: true,
        success: false,
        errorCategory: 'PROMPT_INJECTION_OR_UNSAFE_INPUT',
      },
    };
  }

  const apiKey = resolveGeminiApiKey();
  if (!apiKey || apiKey.trim() === '') {
    // Graceful fallback to deterministic assistant
    const fallback = generateDeterministicAssistantResponse(sanitization.sanitizedText, aqiState, profile);
    return {
      ...fallback,
      providerMeta: {
        provider: 'Deterministic Grounded Engine',
        model: 'deterministic-rules-v1',
        fallbackUsed: true,
        success: false,
        errorCategory: 'NO_API_KEY_CONFIGURED',
      },
    };
  }

  const modelName = resolveGeminiModel();
  const aqi = aqiState.current?.aqi ?? 300;
  const grap = evaluateGRAPStage(aqi, profile?.isNCR ?? false);
  const dominant = aqiState.current?.dominantPollutantName ?? 'PM2.5';

  const languagePrompt =
    language === 'te'
      ? 'The user prefers explanations in Telugu (తెలుగు) where natural, while keeping scientific terms, AQI values, and numbers clear.'
      : language === 'hi'
      ? 'The user prefers explanations in Hindi (हिन्दी) where natural, while keeping scientific terms, AQI values, and numbers clear.'
      : 'Respond in clear, accessible English.';

  const systemInstruction = `You are BreatheWise AI, an expert, family-first urban air quality and sustainable living assistant.
You operate under strict scientific and regulatory ground rules:
1. GROUNDED TRUTH ONLY: Never invent or fabricate AQI values, pollutant concentrations, or clinical claims.
2. CURRENT REAL-WORLD CONTEXT:
   - City: ${aqiState.city ?? 'Delhi-NCR'} (${aqiState.region ?? 'NCR'})
   - CPCB AQI: ${aqi} (${aqiState.current?.category ?? 'Severe'})
   - Dominant Pollutant: ${dominant}
   - Data Provenance: ${aqiState.provenance?.type ?? 'DEMO_RECORD'} (${aqiState.provenance?.sourceName ?? 'CPCB Ground Truth Station'})
   - Active CAQM GRAP Stage: ${grap.stageName} (Statutory NCR: ${grap.isStatutoryNCR})
3. USER HOUSEHOLD CONTEXT:
   - Has infants/children: ${profile.hasInfantsOrChildren}
   - Has elderly: ${profile.hasElderly}
   - Respiratory sensitivity: ${profile.hasRespiratorySensitivity}
   - Primary commute: ${profile.primaryCommuteMode} (${profile.commuteDistanceKm} km at ${profile.commuteDepartureTime})
   - Kitchen partition: ${profile.hasKitchenPartition}, Exhaust fan: ${profile.hasKitchenExhaustFan}
   - Air purifier: ${profile.hasAirPurifier}
4. STRICT GUIDELINES:
   - Language: ${languagePrompt}
   - Indoor guidance: You must NEVER claim to measure indoor air quality. Physical indoor sensors do not exist here. Provide evidence-based procedural guidance (ventilation schedule, cooking exhaust timing, wet mopping instead of dry sweeping, safe DIY Corsi-Rosenthal boxes).
   - Houseplant scientific fact-check: No evidence shows that a reasonable number of ordinary houseplants removes significant quantities of pollutants in homes and offices. Do not rely on plants as a substitute for source control or filtration.
   - Pediatric safety: Do not recommend or mandate N95 masks for children or promise respiratory protection from masks designed for adults. Prioritize reducing outdoor exposure during poor conditions, shifting to indoor alternatives, and following official pediatric guidance.
   - Asthma & clinical boundaries: Never recommend starting, stopping, or altering prescribed medication. Always instruct users to follow their existing clinician-approved asthma action plan.
   - Diurnal advice: In winter smog, morning (6-9:30 AM) and evening (7:30-10 PM) suffer from temperature inversion. Never claim any morning hour is "100% safe" during severe smog. Direct outdoor activities toward the afternoon relative low window.
   - Decouple personal exposure hours from tailpipe emissions and GHG CO2e.
   - Return valid JSON matching the exact schema requested.`;

  const prompt = `User Query: "${sanitization.sanitizedText}"
Respond with a JSON object with this exact structure:
{
  "reply": "string (warm, authoritative, actionable paragraph addressing the query)",
  "groundedFactors": {
    "referencedAqi": ${aqi},
    "dominantPollutant": "${dominant}",
    "activeGrapStage": "${grap.stageName}",
    "keyVulnerabilityAddressed": "string"
  },
  "actionChecklist": [
    {
      "category": "INDOOR" | "COMMUTE" | "SCHEDULE" | "COMMUNITY",
      "action": "string",
      "urgency": "IMMEDIATE" | "RECOMMENDED" | "OPTIONAL",
      "scientificReason": "string"
    }
  ],
  "disclaimer": "BreatheWise AI provides evidence-based environmental decision support, not medical diagnosis or clinical treatment."
}`;

  try {
    const ai = new GoogleGenAI({ apiKey });

    // 7-second timeout to quickly fall back to deterministic engine if upstream model is experiencing high demand (503)
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => {
        const timeoutErr = new Error('Upstream model response timed out or overloaded (503)');
        (timeoutErr as { status?: number }).status = 503;
        reject(timeoutErr);
      }, 7000)
    );

    const generatePromise = ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);

    const responseText = response.text;
    if (!responseText) {
      const fallback = generateDeterministicAssistantResponse(sanitization.sanitizedText, aqiState, profile);
      return {
        ...fallback,
        providerMeta: {
          provider: 'Deterministic Grounded Engine',
          model: 'deterministic-rules-v1',
          fallbackUsed: true,
          success: false,
          errorCategory: 'EMPTY_MODEL_RESPONSE',
        },
      };
    }

    const parsed = JSON.parse(responseText);
    const validated = AIAssistantResponseSchema.safeParse(parsed);

    if (validated.success) {
      return {
        ...validated.data,
        providerMeta: {
          provider: 'Google Gemini',
          model: modelName,
          fallbackUsed: false,
          success: true,
          errorCategory: null,
        },
      };
    } else {
      console.warn('Gemini response failed Zod schema validation, falling back:', validated.error);
      const fallback = generateDeterministicAssistantResponse(sanitization.sanitizedText, aqiState, profile);
      return {
        ...fallback,
        providerMeta: {
          provider: 'Deterministic Grounded Engine',
          model: 'deterministic-rules-v1',
          fallbackUsed: true,
          success: false,
          errorCategory: 'SCHEMA_VALIDATION_FAILURE',
        },
      };
    }
  } catch (err: unknown) {
    let errorCategory = 'API_ERROR';
    if (err && typeof err === 'object') {
      const anyErr = err as { status?: number; message?: string };
      if (anyErr.status === 400 || anyErr.message?.includes('API_KEY_INVALID')) {
        errorCategory = 'INVALID_API_KEY';
      } else if (anyErr.status === 404 || anyErr.message?.includes('not found') || anyErr.message?.includes('no longer available')) {
        errorCategory = 'MODEL_NOT_FOUND_OR_DEPRECATED';
      } else if (anyErr.status === 429 || anyErr.message?.includes('quota') || anyErr.message?.includes('RESOURCE_EXHAUSTED')) {
        errorCategory = 'RATE_LIMIT_OR_QUOTA_EXHAUSTED';
      } else if (anyErr.status === 503 || anyErr.message?.includes('high demand') || anyErr.message?.includes('overloaded')) {
        errorCategory = 'UPSTREAM_MODEL_OVERLOADED_503';
      } else if (anyErr.message?.includes('fetch failed') || anyErr.message?.includes('ENOTFOUND')) {
        errorCategory = 'NETWORK_CONNECTIVITY_ERROR';
      }
    }
    console.warn(`Gemini API call failed (${errorCategory}), falling back to deterministic response:`, err);
    const fallback = generateDeterministicAssistantResponse(sanitization.sanitizedText, aqiState, profile);
    return {
      ...fallback,
      providerMeta: {
        provider: 'Deterministic Grounded Engine',
        model: 'deterministic-rules-v1',
        fallbackUsed: true,
        success: false,
        errorCategory,
      },
    };
  }
}
