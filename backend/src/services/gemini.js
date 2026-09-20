import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { ALLOWED_FALLACIES } from '../schemas/debateSchema.js';

dotenv.config();

let genAIClient = null;

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini Service] GEMINI_API_KEY is not defined in environment.');
  }
  if (!genAIClient && apiKey) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

export function getModelName() {
  return process.env.GEMINI_MODEL || 'gemini-3.5-flash';
}


/**
 * Executes a structured content generation with Gemini, validates against a Zod schema,
 * and retries once if parsing or validation fails.
 */
export async function generateStructuredContent({
  systemPrompt,
  userPrompt,
  geminiSchema,
  zodSchema,
  temperature = 0.7,
  maxOutputTokens = 1024
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error('Gemini API key is not configured on the backend.');
    err.code = 'CONFIG_ERROR';
    err.userMessage = 'Backend AI configuration is missing. Please set GEMINI_API_KEY in backend/.env';
    throw err;
  }

  const ai = getGeminiClient();
  const model = getModelName();

  console.log(`[Gemini Service] Runtime model: ${model}`);

  const contents = [
    {
      role: 'user',
      parts: [
        { text: `${systemPrompt}\n\n---\nTASK INPUT:\n${userPrompt}` }
      ]
    }
  ];

  const config = {
    responseMimeType: 'application/json',
    responseSchema: geminiSchema,
    temperature,
    maxOutputTokens: Math.max(maxOutputTokens, 2048)
  };

  const extractAndValidate = (response) => {
    const candidates = response?.candidates;
    const candidateCount = candidates?.length || 0;
    console.log(`[Gemini Service] Candidate count: ${candidateCount}`);

    if (!candidates || candidateCount === 0) {
      console.log('[Gemini Service] Text extracted successfully: no');
      const err = new Error('Gemini returned no candidates');
      err.code = 'GEMINI_EMPTY_RESPONSE';
      err.userMessage = 'Sparring received an empty response. Please retry.';
      throw err;
    }

    const candidate = candidates[0];
    const finishReason = candidate?.finishReason;
    console.log(`[Gemini Service] Finish reason: ${finishReason}`);

    if (finishReason === 'SAFETY' || finishReason === 'BLOCKLIST' || finishReason === 'PROHIBITED_CONTENT') {
      const err = new Error(`Gemini response blocked by safety filter: ${finishReason}`);
      err.code = 'GEMINI_BLOCKED';
      err.userMessage = 'Your debate input triggered content safety filters. Please rephrase your point.';
      throw err;
    }

    // Extract text safely
    let rawText = response.text;
    if (!rawText && candidate?.content?.parts?.[0]?.text) {
      rawText = candidate.content.parts[0].text;
    }

    if (!rawText || !rawText.trim()) {
      console.log('[Gemini Service] Text extracted successfully: no');
      const err = new Error('Gemini returned empty text content');
      err.code = 'GEMINI_EMPTY_RESPONSE';
      err.userMessage = 'Sparring received an empty response. Please retry.';
      throw err;
    }

    console.log('[Gemini Service] Text extracted successfully: yes');
    console.log(`[Gemini Service] Text extraction successful (${rawText.length} characters)`);

    // Clean JSON markdown fences if present
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(clean);
      console.log('[Gemini Service] JSON parse status: success');
    } catch (parseErr) {
      console.error('[Gemini Service] JSON parse status: failed');
      console.error('[Gemini Service] JSON parsing failed:', parseErr.message, 'Raw preview:', clean.slice(0, 150));
      const err = new Error(`Failed to parse Gemini JSON output: ${parseErr.message}`);
      err.code = 'GEMINI_PARSE_ERROR';
      err.userMessage = 'Sparring received an incomplete response. Please retry.';
      err.rawText = clean;
      throw err;
    }

    // Safe deterministic normalization of model quirks before Zod validation
    if (parsedJson && typeof parsedJson === 'object') {
      // Normalize fallacy: "none", "None", "null", "no fallacy", etc. -> null
      if (typeof parsedJson.fallacy === 'string') {
        const norm = parsedJson.fallacy.trim().toLowerCase();
        if (['none', 'null', 'no fallacy', 'n/a', 'no_fallacy', 'nil', '', 'undefined'].includes(norm)) {
          console.log(`[Gemini Service] Normalized fallacy '${parsedJson.fallacy}' to null`);
          parsedJson.fallacy = null;
        } else if (ALLOWED_FALLACIES.includes(norm)) {
          parsedJson.fallacy = norm;
        }
      }

      // Normalize argumentScore if returned as string
      if (typeof parsedJson.argumentScore === 'string') {
        const scoreNum = parseInt(parsedJson.argumentScore, 10);
        if (!isNaN(scoreNum)) {
          parsedJson.argumentScore = scoreNum;
        }
      }

      // For feedback report: normalize dimensional scores if strings
      ['overallScore', 'logicScore', 'evidenceScore', 'persuasivenessScore'].forEach((key) => {
        if (typeof parsedJson[key] === 'string') {
          const num = parseInt(parsedJson[key], 10);
          if (!isNaN(num)) parsedJson[key] = num;
        }
      });
    }

    // Zod validation
    const zodResult = zodSchema.safeParse(parsedJson);
    if (!zodResult.success) {
      console.error('[Gemini Service] Zod validation status: failed');
      console.error('[Gemini Service] Zod schema validation failed:', JSON.stringify(zodResult.error.issues, null, 2));
      const err = new Error(`Gemini response schema mismatch: ${zodResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}`);
      err.code = 'GEMINI_SCHEMA_ERROR';
      err.userMessage = 'Sparring received an incomplete response. Please retry.';
      err.issues = zodResult.error.issues;
      err.parsed = parsedJson;
      throw err;
    }

    console.log('[Gemini Service] Zod validation status: passed');
    return zodResult.data;
  };

  const primaryModel = getModelName();
  const candidateModels = [primaryModel];
  if (primaryModel !== 'gemini-3.5-flash') {
    candidateModels.push('gemini-3.5-flash');
  }

  const executeCallWithModel = async (modelToUse, callContents) => {
    let attempts = 0;
    const maxAttempts = 2;
    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`[Gemini Service] Runtime model: ${modelToUse}`);
        console.log('[Gemini Service] generateContent started');
        const response = await ai.models.generateContent({
          model: modelToUse,
          contents: callContents,
          config
        });
        return response;
      } catch (apiErr) {
        console.error('[Gemini Service] Gemini error status:', apiErr?.status || 'N/A');
        console.error('[Gemini Service] Gemini error code:', apiErr?.code || 'N/A');
        console.error('[Gemini Service] Gemini error message:', apiErr?.message || 'N/A');
        console.error(`[Gemini Service] Gemini API call (${modelToUse}) attempt ${attempts} failed:`, apiErr?.status || apiErr?.message);

        // Quota exceeded: fail fast on this model
        if (apiErr?.status === 429 || apiErr?.message?.includes('429') || apiErr?.message?.includes('RESOURCE_EXHAUSTED')) {
          const quotaErr = new Error('Gemini quota limit exceeded');
          quotaErr.code = 'GEMINI_QUOTA_ERROR';
          quotaErr.userMessage = 'AI rate limit reached (Gemini 429). Please wait a moment before sending your next argument.';
          throw quotaErr;
        }

        // Model high demand / unavailable (503): back off if attempts remaining
        if (apiErr?.status === 503 || apiErr?.message?.includes('503') || apiErr?.message?.includes('UNAVAILABLE')) {
          if (attempts < maxAttempts) {
            console.log(`[Gemini Service] 503 high demand encountered for ${modelToUse}. Backing off 2000ms before attempt ${attempts + 1}...`);
            await new Promise((r) => setTimeout(r, 2000));
            continue;
          }
          const unavailableErr = new Error('Gemini model is currently experiencing high demand');
          unavailableErr.code = 'GEMINI_API_ERROR';
          unavailableErr.userMessage = 'The AI opponent service is temporarily unavailable (Gemini 503). Please retry in a few moments.';
          throw unavailableErr;
        }

        // Generic network error: retry if attempts remaining
        if (attempts < maxAttempts) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }

        const genericErr = new Error(`Gemini API Error: ${apiErr?.message || 'Unknown network error'}`);
        genericErr.code = 'GEMINI_API_ERROR';
        genericErr.userMessage = "Sparring couldn't reach the AI opponent. Check your connection and try again.";
        throw genericErr;
      }
    }
  };

  let lastModelError = null;

  for (let mIdx = 0; mIdx < candidateModels.length; mIdx++) {
    const currentModel = candidateModels[mIdx];
    try {
      // Attempt 1 with currentModel
      try {
        const response = await executeCallWithModel(currentModel, contents);
        return extractAndValidate(response);
      } catch (firstErr) {
        if (firstErr.code === 'GEMINI_QUOTA_ERROR' || firstErr.code === 'GEMINI_BLOCKED') {
          throw firstErr;
        }

        console.warn(`[Gemini Service] First attempt failed with ${firstErr.code || 'error'}: ${firstErr.message}. Retrying once...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let retryContents = contents;
        if (firstErr.code === 'GEMINI_SCHEMA_ERROR' || firstErr.code === 'GEMINI_PARSE_ERROR') {
          retryContents = [
            ...contents,
            {
              role: 'model',
              parts: [{ text: JSON.stringify(firstErr.parsed || { error: 'Schema mismatch' }) }]
            },
            {
              role: 'user',
              parts: [{ text: 'Your previous response did not match the required JSON schema. Return strictly valid JSON conforming exactly to the schema properties and types.' }]
            }
          ];
        }

        const retryResponse = await executeCallWithModel(currentModel, retryContents);
        return extractAndValidate(retryResponse);
      }
    } catch (modelErr) {
      lastModelError = modelErr;
      if (modelErr.code === 'GEMINI_BLOCKED') {
        throw modelErr;
      }

      if (mIdx < candidateModels.length - 1) {
        console.warn(`[Gemini Service] Model ${currentModel} encountered ${modelErr.code}. Engaging fallback model ${candidateModels[mIdx + 1]}...`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        continue;
      }

      throw modelErr;
    }
  }

  throw lastModelError;
}
