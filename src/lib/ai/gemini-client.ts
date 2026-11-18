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

export async function askGroundedAssistant(
  userQuery: string,
  aqiState: AirQualityState,
  profile: HouseholdProfile
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
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    // Graceful fallback to deterministic assistant
    return generateDeterministicAssistantResponse(sanitization.sanitizedText, aqiState, profile);
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const aqi = aqiState.current.aqi ?? 300;
  const grap = evaluateGRAPStage(aqi, profile.isNCR);
  const dominant = aqiState.current.dominantPollutantName ?? 'PM2.5';

  const systemInstruction = `You are BreatheWise AI, an expert, family-first urban air quality and sustainable living assistant.
You operate under strict scientific and regulatory ground rules:
1. GROUNDED TRUTH ONLY: Never invent or fabricate AQI values, pollutant concentrations, or clinical claims.
2. CURRENT REAL-WORLD CONTEXT:
   - City: ${aqiState.city} (${aqiState.region})
   - CPCB AQI: ${aqi} (${aqiState.current.category})
   - Dominant Pollutant: ${dominant}
   - Data Provenance: ${aqiState.provenance.type} (${aqiState.provenance.sourceName})
   - Active CAQM GRAP Stage: ${grap.stageName} (Statutory NCR: ${grap.isStatutoryNCR})
3. USER HOUSEHOLD CONTEXT:
   - Has infants/children: ${profile.hasInfantsOrChildren}
   - Has elderly: ${profile.hasElderly}
   - Respiratory sensitivity: ${profile.hasRespiratorySensitivity}
   - Primary commute: ${profile.primaryCommuteMode} (${profile.commuteDistanceKm} km at ${profile.commuteDepartureTime})
   - Kitchen partition: ${profile.hasKitchenPartition}, Exhaust fan: ${profile.hasKitchenExhaustFan}
   - Air purifier: ${profile.hasAirPurifier}
4. STRICT GUIDELINES:
   - Indoor guidance: You must NEVER claim to measure indoor air quality. Physical indoor sensors do not exist here. Provide evidence-based procedural guidance (ventilation schedule, cooking exhaust timing, wet mopping instead of dry sweeping, safe DIY Corsi-Rosenthal boxes).
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
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) {
      return generateDeterministicAssistantResponse(sanitization.sanitizedText, aqiState, profile);
    }

    const parsed = JSON.parse(responseText);
    const validated = AIAssistantResponseSchema.safeParse(parsed);

    if (validated.success) {
      return validated.data;
    } else {
      console.warn('Gemini response failed Zod schema validation, falling back:', validated.error);
      return generateDeterministicAssistantResponse(sanitization.sanitizedText, aqiState, profile);
    }
  } catch (err) {
    console.warn('Gemini API call failed, falling back to deterministic response:', err);
    return generateDeterministicAssistantResponse(sanitization.sanitizedText, aqiState, profile);
  }
}
