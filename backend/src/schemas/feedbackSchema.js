import { z } from 'zod';
import { ALLOWED_FALLACIES } from './debateSchema.js';

export const feedbackRequestSchema = z.object({
  sessionId: z.string().optional(),
  topic: z.string().trim().min(5, 'Topic must be at least 5 characters'),
  userStance: z.enum(['FOR', 'AGAINST']),
  transcript: z.array(
    z.object({
      role: z.enum(['user', 'ai']),
      content: z.string().min(1)
    })
  ).min(1, 'Transcript cannot be empty for feedback analysis'),
  language: z.enum(['en', 'te', 'hi']).optional().default('en')
});

export const feedbackOutputSchema = z.object({
  overallScore: z.number().int().min(1).max(100),
  logicScore: z.number().int().min(1).max(100),
  evidenceScore: z.number().int().min(1).max(100),
  persuasivenessScore: z.number().int().min(1).max(100),
  strengths: z.array(z.string().min(5)).min(1),
  weaknesses: z.array(z.string().min(5)).min(1),
  fallaciesCommitted: z.array(
    z.object({
      fallacy: z.enum(ALLOWED_FALLACIES),
      note: z.string().min(5)
    })
  ),
  suggestions: z.array(z.string().min(5)).min(1)
});

export const geminiFeedbackResponseSchema = {
  type: "OBJECT",
  properties: {
    overallScore: {
      type: "INTEGER",
      description: "Comprehensive argument quality score from 1 to 100."
    },
    logicScore: {
      type: "INTEGER",
      description: "Structural validity, avoidance of fallacies, and reasoning score from 1 to 100."
    },
    evidenceScore: {
      type: "INTEGER",
      description: "Factual backing, specificity, and avoidance of ungrounded assumptions from 1 to 100."
    },
    persuasivenessScore: {
      type: "INTEGER",
      description: "Rhetorical impact, clarity, and rebuttal effectiveness score from 1 to 100."
    },
    strengths: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "Specific strengths demonstrated by the user, grounded strictly in the transcript."
    },
    weaknesses: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "Specific flaws or unaddressed challenges, grounded strictly in the transcript."
    },
    fallaciesCommitted: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          fallacy: {
            type: "STRING",
            enum: ALLOWED_FALLACIES
          },
          note: {
            type: "STRING",
            description: "Contextual explanation of where and how this fallacy occurred in the transcript."
          }
        },
        required: ["fallacy", "note"]
      },
      description: "List of legitimate logical fallacies committed by the user during the debate."
    },
    suggestions: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "Concrete, actionable recommendations for how the user could defend this position better."
    }
  },
  required: [
    "overallScore",
    "logicScore",
    "evidenceScore",
    "persuasivenessScore",
    "strengths",
    "weaknesses",
    "fallaciesCommitted",
    "suggestions"
  ]
};
