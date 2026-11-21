/**
 * Zod Schemas for Grounded Gemini AI Structured Outputs
 */

import { z } from 'zod';

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
});

export type AIAssistantResponse = z.infer<typeof AIAssistantResponseSchema>;
