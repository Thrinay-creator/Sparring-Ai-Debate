import { buildFeedbackPrompt } from '../prompts/feedbackPrompt.js';
import { geminiFeedbackResponseSchema, feedbackOutputSchema } from '../schemas/feedbackSchema.js';
import { generateStructuredContent } from './gemini.js';

export async function processFeedback(feedbackData) {
  const { systemPrompt, userPrompt } = buildFeedbackPrompt(feedbackData);

  const result = await generateStructuredContent({
    systemPrompt,
    userPrompt,
    geminiSchema: geminiFeedbackResponseSchema,
    zodSchema: feedbackOutputSchema,
    temperature: 0.5,
    maxOutputTokens: 2048
  });

  return result;
}
