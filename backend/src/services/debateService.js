import { buildDebatePrompt } from '../prompts/debatePrompt.js';
import { geminiDebateResponseSchema, debateOutputSchema } from '../schemas/debateSchema.js';
import { generateStructuredContent } from './gemini.js';

export async function processDebateTurn(turnData) {
  const { systemPrompt, userPrompt } = buildDebatePrompt(turnData);

  const result = await generateStructuredContent({
    systemPrompt,
    userPrompt,
    geminiSchema: geminiDebateResponseSchema,
    zodSchema: debateOutputSchema,
    temperature: turnData.difficulty === 'RUTHLESS' ? 0.4 : 0.7,
    maxOutputTokens: 800
  });

  return result;
}
