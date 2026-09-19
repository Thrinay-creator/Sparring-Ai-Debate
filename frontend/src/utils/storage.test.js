import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import {
  getActiveSession,
  saveActiveSession,
  clearActiveSession,
  getStoredTheme,
  saveStoredTheme
} from './storage';

beforeAll(() => {
  // Polyfill localStorage for node/vitest environment
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
});

describe('Storage Persistence & State Restoration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Active Debate Session Persistence', () => {
    it('returns null when no session is stored', () => {
      expect(getActiveSession()).toBeNull();
    });

    it('successfully restores a valid active debate session', () => {
      const sample = {
        stage: 'DEBATING',
        session: {
          sessionId: 'test-session-uuid-1',
          topic: 'Should remote work be a legal right?',
          userStance: 'FOR',
          aiStance: 'AGAINST',
          difficulty: 'SHARP',
          round: 2,
          transcript: [
            { role: 'user', content: 'First argument' },
            { role: 'ai', content: 'First counter' }
          ],
          feedback: null,
          createdAt: new Date().toISOString()
        },
        lastPendingArgument: ''
      };

      saveActiveSession(sample);
      const restored = getActiveSession();

      expect(restored).not.toBeNull();
      expect(restored.stage).toBe('DEBATING');
      expect(restored.session.sessionId).toBe('test-session-uuid-1');
      expect(restored.session.round).toBe(2);
      expect(restored.session.transcript).toHaveLength(2);
    });

    it('safely recovers to DEBATING if refreshed while WAITING_FOR_AI (Edge Case 7)', () => {
      const inFlightSession = {
        stage: 'WAITING_FOR_AI', // in-flight request state
        session: {
          sessionId: 'test-session-uuid-2',
          topic: 'Should social media be banned for under-16s?',
          userStance: 'AGAINST',
          aiStance: 'FOR',
          difficulty: 'RUTHLESS',
          round: 3,
          transcript: [{ role: 'user', content: 'My latest argument' }],
          feedback: null
        },
        lastPendingArgument: 'My latest argument'
      };

      saveActiveSession(inFlightSession);
      const restored = getActiveSession();

      expect(restored.stage).toBe('DEBATING'); // Never restore fake loading state
      expect(restored.lastPendingArgument).toBe('My latest argument');
    });

    it('gracefully handles corrupted JSON in localStorage without crashing (Edge Case 5)', () => {
      localStorage.setItem('sparring_session', 'MALFORMED_JSON_STRING{{{');
      expect(() => {
        const res = getActiveSession();
        expect(res).toBeNull();
      }).not.toThrow();
    });

    it('gracefully rejects missing or invalid fields in stored session', () => {
      localStorage.setItem('sparring_session', JSON.stringify({
        stage: 'DEBATING',
        session: {
          sessionId: '123'
          // Missing topic, stances, transcript, etc.
        }
      }));

      const res = getActiveSession();
      expect(res).toBeNull();
    });

    it('clears active session cleanly upon clearActiveSession()', () => {
      saveActiveSession({
        stage: 'DEBATING',
        session: {
          sessionId: 'test-session-3',
          topic: 'Should college education be free?',
          userStance: 'FOR',
          aiStance: 'AGAINST',
          difficulty: 'NEWBIE',
          round: 1,
          transcript: []
        }
      });

      expect(getActiveSession()).not.toBeNull();
      clearActiveSession();
      expect(getActiveSession()).toBeNull();
    });
  });

  describe('Theme Storage Persistence', () => {
    it('defaults to dark theme when nothing is stored', () => {
      expect(getStoredTheme()).toBe('dark');
    });

    it('persists and retrieves light, dark, and system theme settings', () => {
      saveStoredTheme('light');
      expect(getStoredTheme()).toBe('light');

      saveStoredTheme('system');
      expect(getStoredTheme()).toBe('system');

      saveStoredTheme('dark');
      expect(getStoredTheme()).toBe('dark');
    });
  });
});
