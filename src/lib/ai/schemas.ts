/**
 * Zod Schemas for Grounded Gemini AI Structured Outputs
 */

import { z } from 'zod';

export const ProviderMetaSchema = z.object({
  provider: z.string(),
  model: z.string(),
  fallbackUsed: z.boolean(),
  success: z.boolean(),
  errorCategory: z.string().nullable(),
});

export type ProviderMeta = z.infer<typeof ProviderMetaSchema>;

export const AIAssistantResponseSchema = z.object({
  reply: z.string().min(10, 'Reply must be substantial and helpful'),
  groundedFactors: z.object({
    referencedAqi: z.number().nullable(),
    dominantPollutant: z.string().nullable(),
    activeGrapStage: z.string(),
    keyVulnerabilityAddressed: z.string(),
  }),
  actionChecklist: z.array(
    z.object({
      category: z.enum(['INDOOR', 'COMMUTE', 'SCHEDULE', 'COMMUNITY', 'PROTECTION', 'HEALTH']),
      action: z.string(),
      urgency: z.preprocess(
        (val) => (val === 'HIGH' ? 'IMMEDIATE' : val === 'MEDIUM' ? 'RECOMMENDED' : val === 'LOW' ? 'OPTIONAL' : val),
        z.enum(['IMMEDIATE', 'RECOMMENDED', 'OPTIONAL'])
      ),
      scientificReason: z.string(),
    })
  ).min(1, 'At least one action recommendation must be provided'),
  disclaimer: z.string(),
  providerMeta: ProviderMetaSchema.optional(),
});

export type AIAssistantResponse = z.infer<typeof AIAssistantResponseSchema>;

/**
 * Zod Schema for Incoming Client Chat Requests
 * Validates message length, restricts language codes, clamps AQI values (0-500),
 * and prevents unvalidated or malicious context injection.
 */
export const ChatIncomingRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message cannot exceed 1000 characters'),
  language: z.enum(['en', 'te', 'hi']).optional().default('en'),
  aqiState: z.object({
    city: z.string().max(100).optional(),
    region: z.string().max(100).optional(),
    isNCR: z.boolean().optional(),
    current: z.object({
      aqi: z.number().min(0).max(500).nullable().optional(),
      dominantPollutantName: z.string().max(100).nullable().optional(),
      category: z.string().max(50).nullable().optional(),
    }).optional(),
  }).optional(),
  profile: z.object({
    city: z.string().max(100).optional(),
    isNCR: z.boolean().optional(),
    hasInfantsOrChildren: z.boolean().optional(),
    hasElderly: z.boolean().optional(),
    hasRespiratorySensitivity: z.boolean().optional(),
    hasPregnantMember: z.boolean().optional(),
    primaryCommuteMode: z.enum(['TWO_WHEELER', 'OPEN_AUTO', 'NON_AC_BUS', 'AC_METRO', 'SOLO_CAR', 'CARPOOL']).optional(),
    commuteDistanceKm: z.number().min(0).max(500).optional(),
    commuteDepartureTime: z.string().max(10).optional(),
    hasKitchenPartition: z.boolean().optional(),
    hasKitchenExhaustFan: z.boolean().optional(),
    hasAirPurifier: z.boolean().optional(),
    purifierCount: z.number().min(0).max(50).optional(),
  }).optional(),
});

export type ChatIncomingRequest = z.infer<typeof ChatIncomingRequestSchema>;
