import { supabase } from './supabase';
import { getStoredSessions, saveCompletedSession } from '../utils/storage';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// In-memory guard to prevent duplicate rapid submissions during the same UI session
const savedDebatesMemoryGuard = new Set();

/**
 * Saves a completed debate session.
 * For authenticated users: inserts into Supabase debates table.
 * For guests: preserves in localStorage.
 */
export async function saveCompletedDebate(user, session) {
  if (!session) {
    return { success: false, error: 'Invalid session data' };
  }

  // Ensure sessionId exists and is a valid UUID
  if (!session.sessionId || !UUID_REGEX.test(session.sessionId)) {
    session.sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : '00000000-0000-4000-8000-000000000000';
  }

  // Always save locally so offline/guest access is seamless
  saveCompletedSession(session);

  // If user is explicitly not provided, this is guest mode
  if (!user) {
    const guestGuardKey = `guest_${session.sessionId}`;
    savedDebatesMemoryGuard.add(guestGuardKey);
    return { success: true, storage: 'local' };
  }

  // Verify authenticated user from Supabase session directly
  let verifiedUserId = null;
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authData?.user?.id) {
      verifiedUserId = authData.user.id;
    } else if (authError) {
      console.warn('[History Service] getUser warning:', authError.message);
    }
  } catch (authErr) {
    console.warn('[History Service] Auth check error:', authErr?.message || authErr);
  }

  // Use verified user ID, falling back to passed user object
  const effectiveUserId = verifiedUserId || user?.id || null;

  // Frontend guard against duplicate calls for the same debate
  const guardKey = `${effectiveUserId || 'guest'}_${session.sessionId}`;
  if (savedDebatesMemoryGuard.has(guardKey)) {
    return { success: true, duplicateIgnored: true };
  }

  // If user has no valid ID, local storage is the complete store
  if (!effectiveUserId) {
    savedDebatesMemoryGuard.add(guardKey);
    return { success: true, storage: 'local' };
  }

  // Map session fields strictly to Supabase debates table schema
  const feedback = session.feedback || {};
  const record = {
    user_id: effectiveUserId,
    session_id: session.sessionId,
    topic: session.topic || '',
    user_stance: session.userStance || 'FOR',
    ai_stance: session.aiStance || 'AGAINST',
    difficulty: session.difficulty || 'SHARP',
    transcript: Array.isArray(session.transcript) ? session.transcript : [],
    feedback: feedback,
    overall_score: typeof feedback.overallScore === 'number' ? Math.round(feedback.overallScore) : null,
    logic_score: typeof feedback.logicScore === 'number' ? Math.round(feedback.logicScore) : null,
    evidence_score: typeof feedback.evidenceScore === 'number' ? Math.round(feedback.evidenceScore) : null,
    persuasiveness_score: typeof feedback.persuasivenessScore === 'number' ? Math.round(feedback.persuasivenessScore) : null,
    rounds_completed: typeof session.round === 'number' ? session.round : 1,
    completed_at: new Date().toISOString()
  };

  // Safe Diagnostic Logging (Step 1 & Step 9)
  console.info('[History Service Diagnostic - INSERT]', {
    operation: 'INSERT',
    tableName: 'debates',
    columns: Object.keys(record),
    authenticatedUserExists: Boolean(effectiveUserId),
    userIdPresent: Boolean(effectiveUserId),
    sessionIdExists: Boolean(session?.sessionId),
    sessionIdValidUUID: UUID_REGEX.test(session?.sessionId)
  });

  try {
    const { data, error, status } = await supabase
      .from('debates')
      .insert(record);

    if (error) {
      // Safe Error Logging (Step 1 & Step 11)
      console.warn('[History Service Supabase Error - INSERT]', {
        operation: 'INSERT',
        code: error.code || null,
        message: error.message || null,
        details: error.details || null,
        hint: error.hint || null,
        httpStatus: status || (error.code === 'PGRST205' ? 404 : null),
        authenticatedUserExists: Boolean(effectiveUserId),
        userIdPresent: Boolean(effectiveUserId),
        sessionIdExists: Boolean(session?.sessionId),
        sessionIdValidUUID: UUID_REGEX.test(session?.sessionId)
      });

      // Step 10: Duplicate unique constraint check (23505)
      if (
        error.code === '23505' ||
        error.message?.includes('unique_user_session') ||
        error.message?.includes('duplicate key')
      ) {
        console.info('[History Service] Duplicate constraint 23505 encountered. Querying existing record...');
        try {
          const { data: existingRecord } = await supabase
            .from('debates')
            .select('*')
            .eq('session_id', session.sessionId)
            .maybeSingle();
          savedDebatesMemoryGuard.add(guardKey);
          return { success: true, duplicateIgnored: true, data: existingRecord ? [existingRecord] : null, storage: 'supabase' };
        } catch {
          savedDebatesMemoryGuard.add(guardKey);
          return { success: true, duplicateIgnored: true, storage: 'supabase' };
        }
      }

      return {
        success: false,
        error: "Debate completed, but we couldn't save it to history.",
        code: error.code,
        details: error.message
      };
    }

    savedDebatesMemoryGuard.add(guardKey);
    return { success: true, data, storage: 'supabase' };
  } catch (err) {
    console.error('[History Service] Unexpected error saving debate:', err?.message || err);
    return {
      success: false,
      error: "Debate completed, but we couldn't save it to history."
    };
  }
}

/**
 * Retrieves debate history.
 * Authenticated users: queries Supabase debates table ordered by created_at DESC.
 * Guests: retrieves from localStorage.
 */
export async function getUserDebates(user) {
  if (!user || !user.id) {
    // Guest history from localStorage
    const local = getStoredSessions();
    return {
      success: true,
      debates: local.map((d) => ({
        id: d.sessionId,
        sessionId: d.sessionId,
        topic: d.topic,
        userStance: d.userStance,
        aiStance: d.aiStance,
        difficulty: d.difficulty,
        transcript: d.transcript,
        feedback: d.feedback,
        overallScore: d.feedback?.overallScore || null,
        roundsCompleted: d.currentRound || 1,
        createdAt: d.createdAt,
        isGuest: true
      }))
    };
  }

  // Step 4: Verify authentication with Supabase directly before query
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    console.info('[History Service Diagnostic - SELECT]', {
      operation: 'SELECT',
      authenticated: Boolean(authData?.user),
      userIdPresent: Boolean(authData?.user?.id)
    });
    if (authError) {
      console.warn('[History Service] Auth check warning on history fetch:', authError.message);
    }
  } catch (authCheckErr) {
    console.warn('[History Service] Auth check exception:', authCheckErr?.message || authCheckErr);
  }

  try {
    const { data, error, status } = await supabase
      .from('debates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Safe Error Logging (Step 1 & Step 5)
      console.warn('[History Service Supabase Error - SELECT]', {
        operation: 'SELECT',
        code: error.code || null,
        message: error.message || null,
        details: error.details || null,
        hint: error.hint || null,
        httpStatus: status || (error.code === 'PGRST205' ? 404 : null)
      });
      return { success: false, error: "We couldn't load your debate history.", code: error.code };
    }

    const debates = (data || []).map((row) => ({
      id: row.id,
      sessionId: row.session_id,
      topic: row.topic,
      userStance: row.user_stance,
      aiStance: row.ai_stance,
      difficulty: row.difficulty,
      transcript: row.transcript,
      feedback: row.feedback,
      overallScore: row.overall_score,
      logicScore: row.logic_score,
      evidenceScore: row.evidence_score,
      persuasivenessScore: row.persuasiveness_score,
      roundsCompleted: row.rounds_completed,
      createdAt: row.created_at,
      completedAt: row.completed_at
    }));

    return { success: true, debates };
  } catch (err) {
    console.error('[History Service] Unexpected error fetching debates:', err);
    return { success: false, error: "We couldn't load your debate history." };
  }
}

/**
 * Deletes a single debate entry by ID.
 * Enforced by Supabase RLS (auth.uid() = user_id).
 */
export async function deleteDebate(user, debateId) {
  if (!user || !user.id) {
    // Guest: remove from localStorage
    try {
      const existing = getStoredSessions();
      const updated = existing.filter((d) => d.sessionId !== debateId);
      localStorage.setItem('sparring_sessions', JSON.stringify(updated));
      return { success: true };
    } catch {
      return { success: false, error: "We couldn't delete this debate. Please try again." };
    }
  }

  try {
    const { error, status } = await supabase
      .from('debates')
      .delete()
      .eq('id', debateId);

    if (error) {
      console.warn('[History Service Supabase Error - DELETE]', {
        operation: 'DELETE',
        code: error.code || null,
        message: error.message || null,
        details: error.details || null,
        hint: error.hint || null,
        httpStatus: status || (error.code === 'PGRST205' ? 404 : null)
      });
      return { success: false, error: "We couldn't delete this debate. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error('[History Service] Unexpected delete error:', err);
    return { success: false, error: "We couldn't delete this debate. Please try again." };
  }
}

/**
 * Deletes all debate entries belonging to the authenticated user.
 * Restricted strictly by user_id and Supabase RLS.
 */
export async function deleteAllDebates(user) {
  if (!user || !user.id) {
    try {
      localStorage.removeItem('sparring_sessions');
      return { success: true };
    } catch {
      return { success: false, error: "We couldn't delete debate history. Please try again." };
    }
  }

  try {
    // Delete restricted to current user's records
    const { error } = await supabase
      .from('debates')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('[History Service] Error deleting all debates:', error.message);
      return { success: false, error: "We couldn't delete debate history. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error('[History Service] Unexpected error in deleteAllDebates:', err);
    return { success: false, error: "We couldn't delete debate history. Please try again." };
  }
}
