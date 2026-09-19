import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { saveCompletedDebate, getUserDebates, deleteDebate, deleteAllDebates } from './historyService';

describe('History Service & Supabase RLS Simulation Tests', () => {
  const userA = { id: 'user_a_123', email: 'userA@example.com' };
  const userB = { id: 'user_b_456', email: 'userB@example.com' };

  beforeAll(() => {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (key) => store.get(key) || null,
      setItem: (key, val) => store.set(key, String(val)),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear()
    };
  });

  beforeEach(() => {
    localStorage.clear();
    // Simulate userA being the currently authenticated session in Supabase client
    localStorage.setItem('sparring_mock_auth_user', JSON.stringify(userA));
  });

  it('saves completed debate for authenticated user', async () => {
    const session = {
      sessionId: 'session-001',
      topic: 'Should AI be regulated?',
      userStance: 'FOR',
      aiStance: 'AGAINST',
      difficulty: 'SHARP',
      round: 3,
      transcript: [{ role: 'user', content: 'Argument 1' }],
      feedback: {
        overallScore: 85,
        logicScore: 80,
        evidenceScore: 90,
        persuasivenessScore: 85
      }
    };

    const res = await saveCompletedDebate(userA, session);
    expect(res.success).toBe(true);

    const historyRes = await getUserDebates(userA);
    expect(historyRes.success).toBe(true);
    expect(historyRes.debates.length).toBe(1);
    expect(historyRes.debates[0].topic).toBe('Should AI be regulated?');
    expect(historyRes.debates[0].overallScore).toBe(85);
  });

  it('prevents duplicate debate insertion with same (user_id, session_id)', async () => {
    const session = {
      sessionId: 'session-dup-1',
      topic: 'Space Exploration Funding',
      userStance: 'AGAINST',
      aiStance: 'FOR',
      difficulty: 'RUTHLESS',
      transcript: [],
      feedback: { overallScore: 78 }
    };

    const res1 = await saveCompletedDebate(userA, session);
    expect(res1.success).toBe(true);

    // Immediate second attempt
    const res2 = await saveCompletedDebate(userA, session);
    expect(res2.success).toBe(true);
    expect(res2.duplicateIgnored).toBe(true);

    const history = await getUserDebates(userA);
    expect(history.debates.length).toBe(1);
  });

  it('enforces user isolation (RLS): User B cannot see User A debates', async () => {
    const sessionA = {
      sessionId: 'session-user-a',
      topic: 'Universal Basic Income',
      userStance: 'FOR',
      aiStance: 'AGAINST',
      difficulty: 'SHARP',
      transcript: [],
      feedback: { overallScore: 92 }
    };

    await saveCompletedDebate(userA, sessionA);

    // Switch active session to User B
    localStorage.setItem('sparring_mock_auth_user', JSON.stringify(userB));
    const historyB = await getUserDebates(userB);
    expect(historyB.success).toBe(true);
    expect(historyB.debates.length).toBe(0);

    // Switch active session back to User A
    localStorage.setItem('sparring_mock_auth_user', JSON.stringify(userA));
    const historyA = await getUserDebates(userA);
    expect(historyA.debates.length).toBe(1);
    expect(historyA.debates[0].topic).toBe('Universal Basic Income');
  });

  it('deletes an individual debate belonging to the user', async () => {
    const session1 = {
      sessionId: 'session-del-1',
      topic: 'Topic 1',
      userStance: 'FOR',
      aiStance: 'AGAINST',
      difficulty: 'NEWBIE',
      feedback: { overallScore: 70 }
    };
    const session2 = {
      sessionId: 'session-del-2',
      topic: 'Topic 2',
      userStance: 'FOR',
      aiStance: 'AGAINST',
      difficulty: 'NEWBIE',
      feedback: { overallScore: 75 }
    };

    await saveCompletedDebate(userA, session1);
    await saveCompletedDebate(userA, session2);

    const initial = await getUserDebates(userA);
    expect(initial.debates.length).toBe(2);

    const targetId = initial.debates[0].id;
    const delRes = await deleteDebate(userA, targetId);
    expect(delRes.success).toBe(true);

    const afterDel = await getUserDebates(userA);
    expect(afterDel.debates.length).toBe(1);
    expect(afterDel.debates.find(d => d.id === targetId)).toBeUndefined();
  });

  it('deletes all debates for user while leaving other users untouched', async () => {
    await saveCompletedDebate(userA, {
      sessionId: 'session-a-all-1',
      topic: 'Topic A1',
      userStance: 'FOR',
      aiStance: 'AGAINST',
      difficulty: 'SHARP'
    });
    await saveCompletedDebate(userA, {
      sessionId: 'session-a-all-2',
      topic: 'Topic A2',
      userStance: 'FOR',
      aiStance: 'AGAINST',
      difficulty: 'SHARP'
    });

    // Save as User B
    localStorage.setItem('sparring_mock_auth_user', JSON.stringify(userB));
    await saveCompletedDebate(userB, {
      sessionId: 'session-b-keep',
      topic: 'Topic B Keep',
      userStance: 'FOR',
      aiStance: 'AGAINST',
      difficulty: 'SHARP'
    });

    // Switch back to User A and Delete All
    localStorage.setItem('sparring_mock_auth_user', JSON.stringify(userA));
    const delAllRes = await deleteAllDebates(userA);
    expect(delAllRes.success).toBe(true);

    const historyA = await getUserDebates(userA);
    expect(historyA.debates.length).toBe(0);

    // User B must still have their debate
    localStorage.setItem('sparring_mock_auth_user', JSON.stringify(userB));
    const historyB = await getUserDebates(userB);
    expect(historyB.debates.length).toBe(1);
    expect(historyB.debates[0].topic).toBe('Topic B Keep');
  });

  it('saves and retrieves guest debates in localStorage without auth', async () => {
    const guestSession = {
      sessionId: 'guest-session-1',
      topic: 'Remote Work vs Office Work',
      userStance: 'FOR',
      aiStance: 'AGAINST',
      difficulty: 'SHARP',
      round: 4,
      transcript: [],
      feedback: { overallScore: 88 }
    };

    const guestRes = await saveCompletedDebate(null, guestSession);
    expect(guestRes.success).toBe(true);
    expect(guestRes.storage).toBe('local');

    const guestHistory = await getUserDebates(null);
    expect(guestHistory.success).toBe(true);
    expect(guestHistory.debates.length).toBe(1);
    expect(guestHistory.debates[0].topic).toBe('Remote Work vs Office Work');
    expect(guestHistory.debates[0].isGuest).toBe(true);
  });
});
