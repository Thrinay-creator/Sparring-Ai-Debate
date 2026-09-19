const SESSIONS_STORAGE_KEY = 'sparring_sessions';
const ACTIVE_SESSION_KEY = 'sparring_session';
const THEME_STORAGE_KEY = 'sparring_theme';

export function getStoredSessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to read past sparring sessions from localStorage', e);
    return [];
  }
}

export function saveCompletedSession(session) {
  try {
    if (!session || !session.sessionId) return;
    const existing = getStoredSessions();
    const updated = [
      {
        sessionId: session.sessionId,
        topic: session.topic,
        userStance: session.userStance,
        aiStance: session.aiStance,
        difficulty: session.difficulty,
        currentRound: session.round || session.currentRound || 1,
        transcript: session.transcript || [],
        feedback: session.feedback,
        createdAt: session.createdAt || new Date().toISOString()
      },
      ...existing.filter(s => s.sessionId !== session.sessionId)
    ].slice(0, 10); // Keep latest 10 sessions

    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save sparring session to localStorage', e);
  }
}

/**
 * Reads and validates the active debate session from localStorage.
 * If data is corrupted or invalid, it safely cleans up and returns null.
 */
export function getActiveSession() {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      clearActiveSession();
      return null;
    }

    const { session, stage, lastPendingArgument } = parsed;
    if (!session || typeof session !== 'object') {
      clearActiveSession();
      return null;
    }

    // Validate essential session fields
    const hasValidId = typeof session.sessionId === 'string' && session.sessionId.length > 0;
    const hasValidTopic = typeof session.topic === 'string' && session.topic.trim().length >= 5;
    const hasValidStances = ['FOR', 'AGAINST'].includes(session.userStance) &&
      ['FOR', 'AGAINST'].includes(session.aiStance) &&
      session.userStance !== session.aiStance;
    const hasValidDifficulty = ['NEWBIE', 'SHARP', 'RUTHLESS'].includes(session.difficulty);
    const hasValidTranscript = Array.isArray(session.transcript);

    if (!hasValidId || !hasValidTopic || !hasValidStances || !hasValidDifficulty || !hasValidTranscript) {
      clearActiveSession();
      return null;
    }

    // Edge case 7: Never restore a fake in-flight loading state; recover safely to DEBATING
    let safeStage = stage;
    if (safeStage === 'WAITING_FOR_AI' || safeStage === 'FINISHING') {
      safeStage = 'DEBATING';
    }
    if (!['DEBATING', 'SUMMARY'].includes(safeStage)) {
      safeStage = 'DEBATING';
    }

    return {
      stage: safeStage,
      session: {
        sessionId: session.sessionId,
        topic: session.topic,
        userStance: session.userStance,
        aiStance: session.aiStance,
        difficulty: session.difficulty,
        round: typeof session.round === 'number' && session.round >= 1 && session.round <= 6 ? session.round : 1,
        transcript: session.transcript,
        feedback: session.feedback || null,
        createdAt: session.createdAt || new Date().toISOString()
      },
      lastPendingArgument: typeof lastPendingArgument === 'string' ? lastPendingArgument : ''
    };
  } catch (e) {
    console.warn('Failed to parse active session from localStorage, clearing safely', e);
    clearActiveSession();
    return null;
  }
}

/**
 * Persists the currently active debate session to localStorage.
 * Only serializes plain JSON data, never functions or transient states.
 */
export function saveActiveSession({ stage, session, lastPendingArgument }) {
  try {
    if (!session || !session.sessionId) {
      clearActiveSession();
      return;
    }

    // Edge case 7: Do NOT persist a fake loading state
    const safeStage = (stage === 'WAITING_FOR_AI' || stage === 'FINISHING') ? 'DEBATING' : stage;

    const payload = {
      stage: safeStage,
      session: {
        sessionId: session.sessionId,
        topic: session.topic,
        userStance: session.userStance,
        aiStance: session.aiStance,
        difficulty: session.difficulty,
        round: session.round || 1,
        transcript: session.transcript || [],
        feedback: session.feedback || null,
        createdAt: session.createdAt || new Date().toISOString()
      },
      lastPendingArgument: lastPendingArgument || ''
    };

    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save active debate session to localStorage', e);
  }
}

/**
 * Safely removes the active debate session from localStorage.
 */
export function clearActiveSession() {
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear active session from localStorage', e);
  }
}

/**
 * Reads the stored theme preference ('light' | 'dark' | 'system').
 */
export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'dark'; // Dark is default chamber theme
  } catch {
    return 'dark';
  }
}

/**
 * Saves the theme preference to localStorage.
 */
export function saveStoredTheme(theme) {
  try {
    if (theme === 'light' || theme === 'dark' || theme === 'system') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch (e) {
    console.error('Failed to save theme preference', e);
  }
}
