import { ALLOWED_FALLACIES } from '../schemas/debateSchema.js';

export function buildFeedbackPrompt({ topic, userStance, transcript, language = 'en' }) {
  let languageRule = '6. LANGUAGE: Deliver analysis in English.';
  if (language === 'te') {
    languageRule = '6. LANGUAGE REQUIREMENT (CRITICAL): The debate analysis MUST be delivered in TELUGU (తెలుగు). Write all strengths, weaknesses, fallacy notes, and suggestions in fluent Telugu script. Keep numerical scores and fallacy identifier keys standard.';
  } else if (language === 'hi') {
    languageRule = '6. LANGUAGE REQUIREMENT (CRITICAL): The debate analysis MUST be delivered in HINDI (हिन्दी). Write all strengths, weaknesses, fallacy notes, and suggestions in fluent Hindi (Devanagari script). Keep numerical scores and fallacy identifier keys standard.';
  }

  const serializedTranscript = transcript
    .map((t, idx) => `[Turn ${idx + 1}] ${t.role === 'user' ? 'USER' : 'AI OPPONENT'}: ${t.content}`)
    .join('\n\n');

  const systemPrompt = `You are the "Sparring Chief Debate Adjudicator".
Your mission is to perform a rigorous forensic post-debate analysis of the provided debate transcript and produce an argument-strengthener diagnostic report.

MANDATORY RULES:
1. EVIDENCE-BASED ANALYSIS: Every strength, weakness, fallacy, and suggestion MUST directly reference actual statements made by the USER in this specific debate transcript.
2. NO GENERIC ADVICE: Never give boilerplate advice like "Use more facts" or "Speak clearly". Instead, diagnose the precise causal jump, unproven premise, or counterexample that challenged them.
3. ANTI-HALLUCINATION / FIDELITY:
   - Do NOT attribute arguments, statistics, or concessions to the user that they did not actually say.
   - Do NOT invent quotes.
   - If no clear logical fallacies were committed, return an empty array for "fallaciesCommitted". Never invent a fallacy.
4. SCORING SCALE (Integers 1 to 100):
   - overallScore: Holistic argumentative proficiency (1-100).
   - logicScore: Deductive/inductive consistency, causal validity, and absence of non-sequiturs (1-100).
   - evidenceScore: Factual grounding, specificity, operational definitions, and defense against counterarguments (1-100).
   - persuasivenessScore: Rhetorical resilience, strategic concessions, clarity, and force of conclusion (1-100).
5. FALLACIES TAXONOMY:
   Allowed fallacies:
${ALLOWED_FALLACIES.map((f) => `   - "${f}"`).join('\n')}
   Only flag fallacies from this exact list. Include a concise "note" explaining where and how the user committed it.
${languageRule}`;

  const userPrompt = `TOPIC: "${topic}"
USER DEFENDED STANCE: "${userStance}"

COMPLETE DEBATE TRANSCRIPT:
${serializedTranscript}

Analyze the user's performance and output the complete JSON report strictly conforming to the response schema.`;

  return { systemPrompt, userPrompt };
}
