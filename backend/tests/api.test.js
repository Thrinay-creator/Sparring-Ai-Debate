import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';
import { debateOutputSchema, debateTurnRequestSchema } from '../src/schemas/debateSchema.js';
import { feedbackOutputSchema, feedbackRequestSchema } from '../src/schemas/feedbackSchema.js';

describe('Sparring API & Validation Tests', () => {
  describe('GET /api/health', () => {
    it('returns status: ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('Stance Inversion Validation', () => {
    it('rejects identical stances (userStance === aiStance)', async () => {
      const payload = {
        sessionId: 'test-session-123',
        topic: 'Should social media be banned for under-16s?',
        userStance: 'FOR',
        aiStance: 'FOR', // Invalid: identical!
        difficulty: 'SHARP',
        round: 1,
        transcript: [],
        latestArgument: 'A legitimate argument that satisfies minimum length requirements.'
      };

      const res = await request(app)
        .post('/api/debate-turn')
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Opponent stance (aiStance) must be the exact inverse');
    });

    it('accepts inverted stances (FOR vs AGAINST)', async () => {
      // Inverted stance passes request validation (even if backend Gemini throws due to dummy key)
      const payload = {
        sessionId: 'test-session-123',
        topic: 'Should social media be banned for under-16s?',
        userStance: 'FOR',
        aiStance: 'AGAINST', // Valid inverse
        difficulty: 'SHARP',
        round: 1,
        transcript: [],
        latestArgument: 'A legitimate argument that satisfies minimum length requirements.'
      };

      const res = await request(app)
        .post('/api/debate-turn')
        .send(payload);

      // Should not be 400 Bad Request
      expect(res.status).not.toBe(400);
    }, 60000);
  });

  describe('Argument Length Validation', () => {
    it('rejects argument shorter than 10 characters', async () => {
      const payload = {
        sessionId: 'test-session-123',
        topic: 'Should social media be banned for under-16s?',
        userStance: 'FOR',
        aiStance: 'AGAINST',
        difficulty: 'SHARP',
        round: 1,
        transcript: [],
        latestArgument: 'Too short'
      };

      const res = await request(app)
        .post('/api/debate-turn')
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('at least 10 characters');
    });

    it('rejects argument longer than 1500 characters', async () => {
      const payload = {
        sessionId: 'test-session-123',
        topic: 'Should social media be banned for under-16s?',
        userStance: 'FOR',
        aiStance: 'AGAINST',
        difficulty: 'SHARP',
        round: 1,
        transcript: [],
        latestArgument: 'A'.repeat(1501)
      };

      const res = await request(app)
        .post('/api/debate-turn')
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('cannot exceed 1500 characters');
    });
  });

  describe('Difficulty & Round Constraints', () => {
    it('rejects invalid difficulty values', async () => {
      const payload = {
        sessionId: 'test-session-123',
        topic: 'Should social media be banned for under-16s?',
        userStance: 'FOR',
        aiStance: 'AGAINST',
        difficulty: 'IMPOSSIBLE', // Invalid
        round: 1,
        transcript: [],
        latestArgument: 'Valid argument that is long enough to satisfy constraints.'
      };

      const res = await request(app)
        .post('/api/debate-turn')
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('difficulty must be NEWBIE, SHARP, or RUTHLESS');
    });

    it('rejects round > 6', async () => {
      const payload = {
        sessionId: 'test-session-123',
        topic: 'Should social media be banned for under-16s?',
        userStance: 'FOR',
        aiStance: 'AGAINST',
        difficulty: 'SHARP',
        round: 7, // Over maximum 6
        transcript: [],
        latestArgument: 'Valid argument that is long enough to satisfy constraints.'
      };

      const res = await request(app)
        .post('/api/debate-turn')
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Debate is limited to 6 rounds');
    });
  });

  describe('Zod Schema Verification for Gemini Output', () => {
    it('validates a correct debate turn output object', () => {
      const validTurn = {
        counter: 'Regulating algorithms introduces government censorship into proprietary recommendation code.',
        argumentScore: 7,
        scoreReason: 'Strong distinction between delivery and content, but overlooks practical security vectors.',
        fallacy: null
      };

      const parsed = debateOutputSchema.safeParse(validTurn);
      expect(parsed.success).toBe(true);
    });

    it('rejects out-of-range argumentScore (> 10 or < 1)', () => {
      const invalidTurn = {
        counter: 'Valid counter argument text here.',
        argumentScore: 15, // Out of bounds
        scoreReason: 'Score reason text.',
        fallacy: null
      };

      const parsed = debateOutputSchema.safeParse(invalidTurn);
      expect(parsed.success).toBe(false);
    });

    it('rejects unapproved fallacy name', () => {
      const invalidTurn = {
        counter: 'Valid counter argument text here.',
        argumentScore: 6,
        scoreReason: 'Score reason text.',
        fallacy: 'invented_fallacy_name'
      };

      const parsed = debateOutputSchema.safeParse(invalidTurn);
      expect(parsed.success).toBe(false);
    });

    it('validates a complete feedback output object', () => {
      const validFeedback = {
        overallScore: 82,
        logicScore: 85,
        evidenceScore: 78,
        persuasivenessScore: 84,
        strengths: ['Clear definition of algorithmic transparency'],
        weaknesses: ['Did not cite empirical evidence for youth depression claim'],
        fallaciesCommitted: [
          { fallacy: 'slippery slope', note: 'Claimed unregulated feeds will destroy elections in 10 years' }
        ],
        suggestions: ['Reference independent audit frameworks']
      };

      const parsed = feedbackOutputSchema.safeParse(validFeedback);
      expect(parsed.success).toBe(true);
    });

    it('rejects feedback with score outside 1-100', () => {
      const invalidFeedback = {
        overallScore: 105, // Out of bounds
        logicScore: 85,
        evidenceScore: 78,
        persuasivenessScore: 84,
        strengths: ['Strength 1'],
        weaknesses: ['Weakness 1'],
        fallaciesCommitted: [],
        suggestions: ['Suggestion 1']
      };

      const parsed = feedbackOutputSchema.safeParse(invalidFeedback);
      expect(parsed.success).toBe(false);
    });
  });

  describe('Language Support Validation', () => {
    it('accepts en, te, and hi languages in debateTurnRequestSchema', () => {
      const basePayload = {
        sessionId: 'session-lang-1',
        topic: 'Should AI have constitutional rights?',
        userStance: 'FOR',
        aiStance: 'AGAINST',
        difficulty: 'SHARP',
        round: 1,
        transcript: [],
        latestArgument: 'AI systems possess cognitive capabilities that warrant protection.'
      };

      ['en', 'te', 'hi'].forEach(lang => {
        const parsed = debateTurnRequestSchema.safeParse({ ...basePayload, language: lang });
        expect(parsed.success).toBe(true);
      });
    });

    it('rejects unsupported languages in debateTurnRequestSchema', () => {
      const payload = {
        sessionId: 'session-lang-1',
        topic: 'Should AI have constitutional rights?',
        userStance: 'FOR',
        aiStance: 'AGAINST',
        difficulty: 'SHARP',
        round: 1,
        transcript: [],
        latestArgument: 'AI systems possess cognitive capabilities that warrant protection.',
        language: 'fr' // French is not currently supported
      };

      const parsed = debateTurnRequestSchema.safeParse(payload);
      expect(parsed.success).toBe(false);
    });

    it('accepts en, te, and hi in feedbackRequestSchema', () => {
      const basePayload = {
        sessionId: 'session-lang-2',
        topic: 'Should AI have constitutional rights?',
        userStance: 'FOR',
        transcript: [{ role: 'user', content: 'Here is an argument that is reasonably detailed.' }]
      };

      ['en', 'te', 'hi'].forEach(lang => {
        const parsed = feedbackRequestSchema.safeParse({ ...basePayload, language: lang });
        expect(parsed.success).toBe(true);
      });
    });
  });
});
