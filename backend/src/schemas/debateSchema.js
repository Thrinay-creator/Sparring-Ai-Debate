import { z } from 'zod';

export const ALLOWED_FALLACIES = [
  'strawman',
  'ad hominem',
  'slippery slope',
  'false dilemma',
  'appeal to authority',
  'hasty generalization',
  'appeal to emotion',
  'red herring',
  'circular reasoning',
  'bandwagon'
];

export const debateTurnRequestSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  topic: z.string().trim().min(5, 'Topic must be at least 5 characters'),
  userStance: z.enum(['FOR', 'AGAINST'], {
    errorMap: () => ({ message: 'userStance must be FOR or AGAINST' })
  }),
  aiStance: z.enum(['FOR', 'AGAINST'], {
    errorMap: () => ({ message: 'aiStance must be FOR or AGAINST' })
  }),
  difficulty: z.enum(['NEWBIE', 'SHARP', 'RUTHLESS'], {
    errorMap: () => ({ message: 'difficulty must be NEWBIE, SHARP, or RUTHLESS' })
  }),
  round: z.number().int().min(1).max(6, 'Debate is limited to 6 rounds'),
  transcript: z.array(
    z.object({
      role: z.enum(['user', 'ai']),
      content: z.string().min(1)
    })
  ).max(20, 'Transcript is too long'),
  latestArgument: z.string().trim()
    .min(10, 'Argument must be at least 10 characters')
    .max(1500, 'Argument cannot exceed 1500 characters'),
  language: z.enum(['en', 'te', 'hi', 'English', 'Telugu', 'Hindi']).optional().default('en')
}).refine(
  (data) => data.userStance !== data.aiStance,
  {
    message: 'Opponent stance (aiStance) must be the exact inverse of userStance',
    path: ['aiStance']
  }
);

export const debateOutputSchema = z.object({
  counter: z.string().trim().min(10, 'Counterargument must be at least 10 characters'),
  argumentScore: z.number().int().min(1).max(10, 'Argument score must be between 1 and 10'),
  scoreReason: z.string().trim().min(5, 'Score reason must be at least 5 characters'),
  fallacy: z.enum(ALLOWED_FALLACIES).nullable()
});

// JSON Schema definition for Gemini native structured output
export const geminiDebateResponseSchema = {
  type: "OBJECT",
  properties: {
    counter: {
      type: "STRING",
      description: "Direct opposing rebuttal adhering strictly to assigned AI stance and difficulty demeanor."
    },
    argumentScore: {
      type: "INTEGER",
      description: "Quality score (1 to 10) evaluating the user's latest argument, NOT the AI rebuttal."
    },
    scoreReason: {
      type: "STRING",
      description: "Concise diagnostic explaining why the user's latest argument received this score."
    },
    fallacy: {
      type: "STRING",
      enum: ALLOWED_FALLACIES,
      description: "One fallacy from the allowed list if committed by user's latest argument, or null if none.",
      nullable: true
    }
  },
  required: ["counter", "argumentScore", "scoreReason"]
};
