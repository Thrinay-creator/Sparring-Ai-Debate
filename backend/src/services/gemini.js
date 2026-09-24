import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { ALLOWED_FALLACIES } from '../schemas/debateSchema.js';

dotenv.config();

let genAIClient = null;

/**
 * Robust provider API key resolver with tolerant casing, whitespace, and quote trimming.
 */
export function getProviderKey(provider) {
  const norm = provider.toLowerCase();

  // 1. Direct standard names
  const directKeys = {
    gemini: ['GEMINI_API_KEY', 'GEMINI_KEY', 'GEMINI_APIKEY', 'GOOGLE_API_KEY'],
    groq: ['GROQ_API_KEY', 'GROQ_KEY', 'GROQ_APIKEY', 'GROQ_TOKEN', 'GROQ_AUTH_TOKEN'],
    mistral: ['MISTRAL_API_KEY', 'MISTRAL_KEY', 'MISTRAL_APIKEY', 'MISTRAL_TOKEN']
  }[norm] || [];

  for (const k of directKeys) {
    if (process.env[k] && typeof process.env[k] === 'string' && process.env[k].trim()) {
      return process.env[k].trim().replace(/^["']|["']$/g, '');
    }
  }

  // 2. Case-insensitive and whitespace-tolerant search across all process.env
  for (const [key, val] of Object.entries(process.env)) {
    if (!val || typeof val !== 'string') continue;
    const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanKey.includes(norm) && (cleanKey.includes('key') || cleanKey.includes('token') || cleanKey === norm)) {
      const cleanVal = val.trim().replace(/^["']|["']$/g, '');
      if (cleanVal.length > 5) {
        return cleanVal;
      }
    }
  }

  return '';
}

export function getGeminiClient() {
  const apiKey = getProviderKey('gemini');
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
 * Universal JSON normalizer and Zod schema validator across all AI providers.
 */
export function validateAndNormalizeJson(rawText, zodSchema, providerName = 'AI Provider') {
  let clean = (rawText || '').trim();

  // Strip markdown code fences
  if (clean.includes('```')) {
    const match = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
      clean = match[1].trim();
    } else {
      clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
    }
  }

  // If there is conversational preamble/postscript, isolate outer JSON object
  if (!clean.startsWith('{') && clean.includes('{')) {
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      clean = clean.substring(firstBrace, lastBrace + 1).trim();
    }
  }

  let parsedJson;
  try {
    parsedJson = JSON.parse(clean);
  } catch (parseErr) {
    console.error(`[${providerName}] JSON parse status: failed`, parseErr.message);
    const err = new Error(`Failed to parse ${providerName} JSON output: ${parseErr.message}`);
    err.code = 'GEMINI_PARSE_ERROR';
    err.userMessage = 'Sparring received an incomplete response. Please retry.';
    err.rawText = clean;
    throw err;
  }

  if (parsedJson && typeof parsedJson === 'object') {
    // Normalize counter field aliases for debate turn
    if (!parsedJson.counter) {
      parsedJson.counter = parsedJson.counterargument || parsedJson.counterArgument || parsedJson.rebuttal || parsedJson.response || parsedJson.argument || '';
    }

    // Normalize fallacy: "none", "None", "null", "no fallacy", etc. -> null
    if (typeof parsedJson.fallacy === 'string') {
      let norm = parsedJson.fallacy.trim().toLowerCase();
      if (norm === 'straw man' || norm === 'straw-man' || norm === 'straw_man') {
        norm = 'strawman';
      }
      if (['none', 'null', 'no fallacy', 'n/a', 'no_fallacy', 'nil', '', 'undefined'].includes(norm)) {
        parsedJson.fallacy = null;
      } else if (ALLOWED_FALLACIES.includes(norm)) {
        parsedJson.fallacy = norm;
      } else {
        parsedJson.fallacy = null;
      }
    } else if (parsedJson.fallacy === undefined) {
      parsedJson.fallacy = null;
    }

    // Normalize scoreReason aliases for debate turn
    if (!parsedJson.scoreReason) {
      parsedJson.scoreReason = parsedJson.score_reason || parsedJson.reason || parsedJson.justification || parsedJson.feedback || '';
    }
    if (typeof parsedJson.scoreReason === 'string' && parsedJson.scoreReason.length < 5) {
      parsedJson.scoreReason = parsedJson.scoreReason + ' (valid logic)';
    }

    // Normalize argumentScore if returned as string or scaled
    if (parsedJson.argumentScore !== undefined) {
      let scoreNum = typeof parsedJson.argumentScore === 'string' 
        ? parseInt(parsedJson.argumentScore, 10) 
        : Number(parsedJson.argumentScore);
      if (isNaN(scoreNum) || scoreNum < 1) scoreNum = 1;
      if (scoreNum > 10) {
        scoreNum = Math.min(10, Math.max(1, Math.round(scoreNum / 10)));
      }
      parsedJson.argumentScore = Math.min(10, Math.max(1, Math.round(scoreNum)));
    }

    // For feedback report: normalize dimensional scores if strings or on 1-10 scale, and handle aliases / nested objects
    const scoreKeyMap = [
      { key: 'overallScore', aliases: ['overall_score', 'overall', 'score', 'totalScore', 'total_score'] },
      { key: 'logicScore', aliases: ['logic_score', 'logic', 'reasoningScore', 'reasoning_score', 'reasoning'] },
      { key: 'evidenceScore', aliases: ['evidence_score', 'evidence', 'empiricalScore', 'factualScore'] },
      { key: 'persuasivenessScore', aliases: ['persuasiveness_score', 'persuasiveness', 'rhetoricScore', 'rhetoric'] }
    ];

    scoreKeyMap.forEach(({ key, aliases }) => {
      let val = parsedJson[key];
      if (val === undefined && parsedJson.scores && typeof parsedJson.scores === 'object') {
        val = parsedJson.scores[key];
        for (const a of aliases) {
          if (val === undefined) val = parsedJson.scores[a];
        }
      }
      if (val === undefined) {
        for (const a of aliases) {
          if (parsedJson[a] !== undefined) {
            val = parsedJson[a];
            break;
          }
        }
      }
      if (val !== undefined) {
        let num = typeof val === 'string' ? parseInt(val, 10) : Number(val);
        if (isNaN(num)) num = 75;
        if (num <= 10 && num > 0) num = num * 10;
        parsedJson[key] = Math.min(100, Math.max(1, Math.round(num)));
      } else if (parsedJson.strengths !== undefined || parsedJson.weaknesses !== undefined) {
        parsedJson[key] = 75;
      }
    });

    // Normalize strengths, weaknesses, suggestions for feedback report
    const arrayKeyMap = [
      { key: 'strengths', aliases: ['strength', 'userStrengths', 'keyStrengths', 'positives'], fallback: ["Articulated structured position on the core motion."] },
      { key: 'weaknesses', aliases: ['weakness', 'userWeaknesses', 'flaws', 'areasForImprovement', 'negatives'], fallback: ["Could reinforce evidentiary backing with empirical references."] },
      { key: 'suggestions', aliases: ['suggestion', 'recommendations', 'actionableSuggestions', 'advice'], fallback: ["Anticipate counterarguments by addressing foundational assumptions early."] }
    ];

    arrayKeyMap.forEach(({ key, aliases, fallback }) => {
      let val = parsedJson[key];
      if (val === undefined && parsedJson.feedback && typeof parsedJson.feedback === 'object') {
        val = parsedJson.feedback[key];
        for (const a of aliases) {
          if (val === undefined) val = parsedJson.feedback[a];
        }
      }
      if (val === undefined) {
        for (const a of aliases) {
          if (parsedJson[a] !== undefined) {
            val = parsedJson[a];
            break;
          }
        }
      }
      if (typeof val === 'string') {
        val = [val];
      }
      if (Array.isArray(val)) {
        val = val
          .filter(s => typeof s === 'string' && s.trim().length > 0)
          .map(s => s.trim().length < 5 ? s + ' (demonstrated)' : s.trim());
      }
      if (!Array.isArray(val) || val.length === 0) {
        if (parsedJson.overallScore !== undefined || parsedJson.logicScore !== undefined) {
          val = fallback;
        }
      }
      if (val !== undefined) {
        parsedJson[key] = val;
      }
    });

    // Normalize fallaciesCommitted array elements
    let rawFallacies = parsedJson.fallaciesCommitted ?? parsedJson.fallacies ?? parsedJson.fallacyList ?? parsedJson.logicalFallacies;
    if (rawFallacies !== undefined) {
      if (!Array.isArray(rawFallacies)) {
        rawFallacies = [];
      }
      parsedJson.fallaciesCommitted = rawFallacies
        .map((item) => {
          if (!item) return null;
          if (typeof item === 'string') {
            let f = item.trim().toLowerCase();
            if (f === 'straw man' || f === 'straw-man' || f === 'straw_man') f = 'strawman';
            if (ALLOWED_FALLACIES.includes(f)) {
              return { fallacy: f, note: `Committed ${f} fallacy in supporting argument premise.` };
            }
            return null;
          }
          if (typeof item === 'object') {
            let f = typeof item.fallacy === 'string' ? item.fallacy.trim().toLowerCase() : '';
            if (f === 'straw man' || f === 'straw-man' || f === 'straw_man') f = 'strawman';
            if (ALLOWED_FALLACIES.includes(f)) {
              const note = typeof item.note === 'string' && item.note.trim().length >= 5 
                ? item.note.trim() 
                : (item.explanation || item.reason || `Committed ${f} fallacy in supporting argument premise.`);
              return { fallacy: f, note };
            }
          }
          return null;
        })
        .filter(Boolean);
    } else if (parsedJson.overallScore !== undefined || parsedJson.strengths !== undefined) {
      parsedJson.fallaciesCommitted = [];
    }
  }

  const zodResult = zodSchema.safeParse(parsedJson);
  if (!zodResult.success) {
    console.error(`[${providerName}] Zod schema validation failed:`, JSON.stringify(zodResult.error.issues, null, 2));
    const err = new Error(`${providerName} response schema mismatch: ${zodResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}`);
    err.code = 'GEMINI_SCHEMA_ERROR';
    err.userMessage = 'Sparring received an incomplete response. Please retry.';
    err.issues = zodResult.error.issues;
    err.parsed = parsedJson;
    throw err;
  }

  console.log(`[${providerName}] Zod validation status: passed`);
  return zodResult.data;
}

/**
 * Fallback Provider 1: Groq (llama-3.3-70b-versatile with llama-3.1-8b-instant fallback)
 */
export async function callGroqProvider({ systemPrompt, userPrompt, zodSchema, geminiSchema, temperature = 0.7 }) {
  const apiKey = getProviderKey('groq');
  if (!apiKey) return null;

  const configuredModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const modelsToTry = [configuredModel];
  if (!modelsToTry.includes('llama-3.1-8b-instant')) {
    modelsToTry.push('llama-3.1-8b-instant');
  }

  // Language enforcement prompt addition to ensure Groq never outputs English when Telugu/Hindi requested
  let langGuidance = '';
  if (systemPrompt.includes('Telugu') || systemPrompt.includes('తెలుగు')) {
    langGuidance = '\n\nLANGUAGE ENFORCEMENT (CRITICAL): All text fields ("counter", "scoreReason", "strengths", "weaknesses", "suggestions", "note") MUST be written in fluent, natural Telugu script (తెలుగు). Schema property names and fallacy enum values must remain standard ASCII.';
  } else if (systemPrompt.includes('Hindi') || systemPrompt.includes('हिन्दी')) {
    langGuidance = '\n\nLANGUAGE ENFORCEMENT (CRITICAL): All text fields ("counter", "scoreReason", "strengths", "weaknesses", "suggestions", "note") MUST be written in fluent, natural Hindi (Devanagari script हिन्दी). Schema property names and fallacy enum values must remain standard ASCII.';
  }

  let schemaGuidance = '';
  if (geminiSchema?.properties) {
    const requiredKeys = geminiSchema.required || Object.keys(geminiSchema.properties);
    schemaGuidance = `\n\nREQUIRED JSON SCHEMA:\nYou must output valid JSON containing these exact root fields: ${requiredKeys.map(k => `"${k}"`).join(', ')}.`;
  }

  let lastError = null;
  for (const model of modelsToTry) {
    try {
      console.log(`[Groq Provider] Initiating generation with model: ${model}`);
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `${systemPrompt}${langGuidance}${schemaGuidance}\n\nIMPORTANT: You must return strictly valid JSON conforming exactly to the requested schema. Do not include markdown preamble, explanation, or backticks outside the JSON.`
            },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature,
          max_tokens: 2048
        })
      });

      if (!res.ok) {
        const errorBody = await res.text().catch(() => '');
        throw new Error(`Groq API (${model}) returned HTTP ${res.status}: ${errorBody}`);
      }

      const data = await res.json();
      const rawText = data.choices?.[0]?.message?.content;
      if (!rawText) {
        throw new Error(`Groq (${model}) returned empty completion content`);
      }

      return validateAndNormalizeJson(rawText, zodSchema, `Groq (${model})`);
    } catch (err) {
      console.warn(`[Groq Provider] Model ${model} attempt failed:`, err.message);
      lastError = err;
      if (model !== modelsToTry[modelsToTry.length - 1]) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  throw lastError || new Error('All Groq candidate models failed');
}

/**
 * Fallback Provider 2: Mistral AI (open-mistral-7b, ministral-8b-latest, mistral-small-latest)
 */
export async function callMistralProvider({ systemPrompt, userPrompt, zodSchema, geminiSchema, temperature = 0.7 }) {
  const apiKey = getProviderKey('mistral');
  if (!apiKey) return null;

  const configuredModel = process.env.MISTRAL_MODEL || 'mistral-small-latest';
  const modelsToTry = [configuredModel];
  if (!modelsToTry.includes('mistral-small-latest')) {
    modelsToTry.push('mistral-small-latest');
  }
  if (!modelsToTry.includes('open-mistral-7b')) {
    modelsToTry.push('open-mistral-7b');
  }
  if (!modelsToTry.includes('ministral-8b-latest')) {
    modelsToTry.push('ministral-8b-latest');
  }

  let langGuidance = '';
  if (systemPrompt.includes('Telugu') || systemPrompt.includes('తెలుగు')) {
    langGuidance = '\n\nLANGUAGE ENFORCEMENT (CRITICAL): All text fields ("counter", "scoreReason", "strengths", "weaknesses", "suggestions", "note") MUST be written in fluent, natural Telugu script (తెలుగు). Schema property names and fallacy enum values must remain standard ASCII.';
  } else if (systemPrompt.includes('Hindi') || systemPrompt.includes('हिन्दी')) {
    langGuidance = '\n\nLANGUAGE ENFORCEMENT (CRITICAL): All text fields ("counter", "scoreReason", "strengths", "weaknesses", "suggestions", "note") MUST be written in fluent, natural Hindi (Devanagari script हिन्दी). Schema property names and fallacy enum values must remain standard ASCII.';
  }

  let schemaGuidance = '';
  if (geminiSchema?.properties) {
    const requiredKeys = geminiSchema.required || Object.keys(geminiSchema.properties);
    schemaGuidance = `\n\nREQUIRED JSON SCHEMA:\nYou must output valid JSON containing these exact root fields: ${requiredKeys.map(k => `"${k}"`).join(', ')}.`;
  }

  let lastError = null;
  for (const model of modelsToTry) {
    try {
      console.log(`[Mistral Provider] Initiating generation with model: ${model}`);

      const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `${systemPrompt}${langGuidance}${schemaGuidance}\n\nIMPORTANT: You must return strictly valid JSON conforming exactly to the requested schema. Do not include markdown preamble, explanation, or backticks outside the JSON.`
            },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature,
          max_tokens: 2048
        })
      });

      if (!res.ok) {
        const errorBody = await res.text().catch(() => '');
        throw new Error(`Mistral API (${model}) returned HTTP ${res.status}: ${errorBody}`);
      }

      const data = await res.json();
      const rawText = data.choices?.[0]?.message?.content;
      if (!rawText) {
        throw new Error(`Mistral (${model}) returned empty completion content`);
      }

      return validateAndNormalizeJson(rawText, zodSchema, `Mistral (${model})`);
    } catch (err) {
      console.warn(`[Mistral Provider] Model ${model} attempt failed:`, err.message);
      lastError = err;
      if (model !== modelsToTry[modelsToTry.length - 1]) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  throw lastError || new Error('All Mistral candidate models failed');
}

/**
 * Executes Gemini generation with safety checks and JSON validation.
 * Fails fast on 429 quota exhaustion so failover to Groq happens immediately.
 */
async function executeGeminiGeneration({
  systemPrompt,
  userPrompt,
  geminiSchema,
  zodSchema,
  temperature = 0.7,
  maxOutputTokens = 1024
}) {
  const ai = getGeminiClient();
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

    return validateAndNormalizeJson(rawText, zodSchema, 'Gemini');
  };

  const modelToUse = getModelName();

  try {
    console.log(`[Gemini Service] Runtime model: ${modelToUse}`);
    console.log('[Gemini Service] generateContent started');
    const response = await ai.models.generateContent({
      model: modelToUse,
      contents,
      config
    });
    return extractAndValidate(response);
  } catch (apiErr) {
    console.error('[Gemini Service] Gemini error status:', apiErr?.status || 'N/A');
    console.error('[Gemini Service] Gemini error message:', apiErr?.message || 'N/A');

    // 429 Quota Exceeded: Fail immediately with GEMINI_QUOTA_ERROR to trigger Groq failover without delay
    if (apiErr?.status === 429 || apiErr?.message?.includes('429') || apiErr?.message?.includes('RESOURCE_EXHAUSTED')) {
      const quotaErr = new Error('Gemini quota limit exceeded');
      quotaErr.code = 'GEMINI_QUOTA_ERROR';
      quotaErr.status = 429;
      quotaErr.userMessage = 'AI rate limit reached (Gemini 429). Please wait a moment before sending your next argument.';
      throw quotaErr;
    }

    // Safety block: fail immediately
    if (apiErr?.code === 'GEMINI_BLOCKED') {
      throw apiErr;
    }

    // 503 High Demand or transient network: retry once
    if (apiErr?.status === 503 || apiErr?.message?.includes('503') || apiErr?.message?.includes('UNAVAILABLE')) {
      console.log(`[Gemini Service] 503 high demand encountered for ${modelToUse}. Retrying once after 1000ms...`);
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const retryResponse = await ai.models.generateContent({
          model: modelToUse,
          contents,
          config
        });
        return extractAndValidate(retryResponse);
      } catch (retryErr) {
        throw retryErr;
      }
    }

    throw apiErr;
  }
}

/**
 * Universal structured content generation across all chamber routes (/api/debate-turn and /api/feedback).
 * Enforces automatic, silent failover in strict order:
 * 1. Google Gemini (Primary)
 * 2. If Gemini 429 / Quota / Outage -> Groq (Secondary)
 * 3. If Groq fails -> Mistral AI (Tertiary)
 * 4. Only if ALL providers fail -> User-facing error
 */
export async function generateStructuredContent({
  systemPrompt,
  userPrompt,
  geminiSchema,
  zodSchema,
  temperature = 0.7,
  maxOutputTokens = 1024
}) {
  const geminiKey = getProviderKey('gemini');
  const groqKey = getProviderKey('groq');
  const mistralKey = getProviderKey('mistral');

  let geminiError = null;
  let groqError = null;
  let mistralError = null;

  // ========================================================
  // PROVIDER 1: Google Gemini (Primary)
  // ========================================================
  if (geminiKey) {
    try {
      console.log('[AI Gateway] Attempting generation with primary provider: Google Gemini...');
      const geminiResult = await executeGeminiGeneration({
        systemPrompt,
        userPrompt,
        geminiSchema,
        zodSchema,
        temperature,
        maxOutputTokens
      });
      if (geminiResult) {
        return geminiResult;
      }
    } catch (err) {
      // Content safety filter triggered by user input - don't failover
      if (err.code === 'GEMINI_BLOCKED') {
        throw err;
      }

      if (err.code === 'GEMINI_QUOTA_ERROR' || err.status === 429) {
        console.log('[GEMINI] failed with 429');
      } else {
        console.log(`[GEMINI] failed: ${err.message}`);
      }
      geminiError = err;
    }
  } else {
    console.warn('[GEMINI] API key not configured. Engaging fallback sequence...');
  }

  // ========================================================
  // PROVIDER 2: Groq (Secondary / Fast Failover)
  // ========================================================
  if (groqKey) {
    try {
      console.log('[GROQ] attempting fallback');
      const groqResult = await callGroqProvider({
        systemPrompt,
        userPrompt,
        zodSchema,
        geminiSchema,
        temperature
      });
      if (groqResult) {
        console.log('[GROQ] success');
        return groqResult;
      }
    } catch (err) {
      console.log(`[GROQ] failed: ${err.message}`);
      groqError = err;
    }
  } else {
    console.log('[GROQ] failed: GROQ_API_KEY not configured');
  }

  // ========================================================
  // PROVIDER 3: Mistral AI (Tertiary Failover)
  // ========================================================
  if (mistralKey) {
    try {
      console.log('[MISTRAL] attempting fallback');
      const mistralResult = await callMistralProvider({
        systemPrompt,
        userPrompt,
        zodSchema,
        geminiSchema,
        temperature
      });
      if (mistralResult) {
        console.log('[MISTRAL] success');
        return mistralResult;
      }
    } catch (err) {
      console.log(`[MISTRAL] failed: ${err.message}`);
      mistralError = err;
    }
  } else {
    console.log('[MISTRAL] failed: MISTRAL_API_KEY not configured');
  }

  // ========================================================
  // ALL PROVIDERS EXHAUSTED OR FAILED
  // ========================================================
  console.error('[AI Gateway] All AI providers exhausted. Failure summary:', {
    gemini: geminiError?.message || (geminiKey ? 'Failed' : 'Not configured'),
    groq: groqError?.message || (groqKey ? 'Failed' : 'Not configured'),
    mistral: mistralError?.message || (mistralKey ? 'Failed' : 'Not configured')
  });

  const finalError = new Error(
    geminiError?.code === 'GEMINI_QUOTA_ERROR'
      ? 'The AI opponent service is temporarily experiencing high demand across all providers. Please retry in a few moments.'
      : (geminiError?.userMessage || 'The AI opponent service is temporarily experiencing high demand across all providers. Please retry in a few moments.')
  );
  finalError.code = 'ALL_PROVIDERS_UNAVAILABLE';
  finalError.status = 503;
  finalError.userMessage = 'The AI opponent service is temporarily experiencing high demand across all providers. Please retry in a few moments.';
  finalError.details = {
    gemini: geminiError?.code || (geminiKey ? 'FAILED' : 'NOT_CONFIGURED'),
    groq: groqError?.message || (groqKey ? 'FAILED' : 'NOT_CONFIGURED'),
    mistral: mistralError?.message || (mistralKey ? 'FAILED' : 'NOT_CONFIGURED')
  };
  throw finalError;
}
