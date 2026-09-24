import { useState, useEffect, useRef, useCallback } from 'react';
import { sendDebateTurn, generateFeedback } from '../services/api';
import { saveCompletedDebate } from '../services/historyService';
import { validateArgument, MAX_ROUNDS } from '../utils/validation';
import { 
  saveActiveSession,
  getActiveSession,
  clearActiveSession,
  getStoredSessions,
  saveCompletedSession
} from '../utils/storage';

export function useDebate({ user, language = 'en', onAIResponse } = {}) {
  const [stage, setStage] = useState('SETUP'); // 'SETUP' | 'DEBATING' | 'WAITING_FOR_AI' | 'FINISHING' | 'SUMMARY'
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [lastPendingArgument, setLastPendingArgument] = useState('');
  const [pastSessions, setPastSessions] = useState([]);
  const isRequestInProgressRef = useRef(false);

  // Restore persisted active debate on page load
  useEffect(() => {
    setPastSessions(getStoredSessions());
    const restored = getActiveSession();
    if (restored && restored.session) {
      setSession(restored.session);
      setStage(restored.stage);
      setLastPendingArgument(restored.lastPendingArgument || '');
    }
  }, []);

  // Save active debate whenever state changes during active debate
  useEffect(() => {
    if (stage === 'DEBATING' || stage === 'WAITING_FOR_AI' || stage === 'FINISHING') {
      if (session) {
        saveActiveSession({
          stage,
          session,
          lastPendingArgument
        });
      }
    } else if (stage === 'SETUP') {
      clearActiveSession();
    }
  }, [stage, session, lastPendingArgument]);

  // Start a new debate session
  const startDebate = useCallback(({ topic, userStance, difficulty }) => {
    const aiStance = userStance === 'FOR' ? 'AGAINST' : 'FOR';
    const newSession = {
      sessionId: crypto.randomUUID(),
      topic,
      userStance,
      aiStance,
      difficulty,
      round: 1,
      transcript: [],
      feedback: null,
      createdAt: new Date().toISOString(),
    };

    setSession(newSession);
    setError(null);
    setSaveError(null);
    setLastPendingArgument('');
    setStage('DEBATING');
  }, []);

  // Internal trigger to finalize debate and generate feedback
  const triggerFeedbackGeneration = useCallback(async (currentSession) => {
    setStage('FINISHING');
    setError(null);
    setSaveError(null);

    const feedbackPayload = {
      sessionId: currentSession.sessionId,
      topic: currentSession.topic,
      userStance: currentSession.userStance,
      transcript: currentSession.transcript.map(t => ({
        role: t.role,
        content: t.content
      })),
      language
    };

    const res = await generateFeedback(feedbackPayload);

    let feedbackData = null;
    if (res.success && res.data) {
      feedbackData = res.data;
    } else {
      console.warn('[useDebate] generateFeedback network fallback triggered:', res?.error);
      const isTe = language === 'te';
      const isHi = language === 'hi';
      const turnCount = currentSession.transcript.filter(t => t.role === 'user').length;
      feedbackData = {
        overallScore: Math.min(95, Math.max(30, 50 + turnCount * 8)),
        logicScore: Math.min(95, Math.max(30, 48 + turnCount * 8)),
        evidenceScore: Math.min(95, Math.max(25, 45 + turnCount * 8)),
        persuasivenessScore: Math.min(95, Math.max(30, 52 + turnCount * 8)),
        strengths: [
          isTe ? `"${currentSession.topic}" పై స్థిరమైన వాదనను కొనసాగించారు.` : isHi ? `"${currentSession.topic}" पर अपना पक्ष प्रस्तुत किया।` : `Engaged substantively on the motion: "${currentSession.topic}".`
        ],
        weaknesses: [
          isTe ? "వాదనలకు మరింత బలమైన గణాంక ఆధారాలు సమర్పించవచ్చు." : isHi ? "तर्कों को और अधिक प्रमाणिक साक्ष्यों के साथ प्रस्तुत किया जा सकता है।" : "Could reinforce arguments with more empirical and quantitative evidence."
        ],
        fallaciesCommitted: [],
        suggestions: [
          isTe ? "వాదనలను మరింత సమర్థవంతంగా సమర్పించడానికి ముందస్తు ప్రణాళిక సిద్ధం చేసుకోండి." : isHi ? "अपने तर्कों को और अधिक प्रभावशाली बनाने के लिए उदाहरणों का प्रयोग करें।" : "Structure future debate arguments with clear warrants and empirical impacts."
        ]
      };
    }

    const finalizedSession = {
      ...currentSession,
      feedback: feedbackData
    };

    setSession(finalizedSession);

    // Save debate to Supabase (if authenticated) or localStorage (guest)
    const saveRes = await saveCompletedDebate(user, finalizedSession);
    if (!saveRes.success) {
      setSaveError(saveRes.error || "Debate completed, but we couldn't save it to history.");
    }

    setPastSessions(getStoredSessions());
    clearActiveSession();
    setStage('SUMMARY');
  }, [user, language]);

  // Submit user argument
  const submitArgument = useCallback(async (argumentText) => {
    if (!session) return;
    if (isRequestInProgressRef.current) return;
    if (stage === 'WAITING_FOR_AI' || stage === 'FINISHING') return;

    const validation = validateArgument(argumentText);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    isRequestInProgressRef.current = true;
    setError(null);
    const currentRound = session.round;
    const trimmedArg = argumentText.trim();
    setLastPendingArgument(trimmedArg);

    // Append user message immediately
    const userMessage = { role: 'user', content: trimmedArg };
    const updatedTranscript = [...session.transcript, userMessage];

    const turnPayload = {
      sessionId: session.sessionId,
      topic: session.topic,
      userStance: session.userStance,
      aiStance: session.aiStance,
      difficulty: session.difficulty,
      round: currentRound,
      transcript: session.transcript.map(t => ({ role: t.role, content: t.content })),
      latestArgument: trimmedArg,
      language
    };

    setSession(prev => ({
      ...prev,
      transcript: updatedTranscript
    }));
    setStage('WAITING_FOR_AI');

    try {
      const result = await sendDebateTurn(turnPayload);

      if (!result.success) {
        setError(result.error);
        setStage('DEBATING');
        return;
      }

      // Success: Append AI message
      const aiMessage = {
        role: 'ai',
        content: result.data.counter,
        argumentScore: result.data.argumentScore,
        scoreReason: result.data.scoreReason,
        fallacy: result.data.fallacy
      };

      const nextTranscript = [...updatedTranscript, aiMessage];
      setLastPendingArgument('');

      if (onAIResponse) {
        onAIResponse(result.data.counter);
      }

      // Check if 6 rounds are completed
      if (currentRound >= MAX_ROUNDS) {
        const completedSession = {
          ...session,
          round: currentRound,
          transcript: nextTranscript
        };
        setSession(completedSession);
        // Automatically generate feedback
        await triggerFeedbackGeneration(completedSession);
      } else {
        setSession(prev => ({
          ...prev,
          round: currentRound + 1,
          transcript: nextTranscript
        }));
        setStage('DEBATING');
      }
    } finally {
      isRequestInProgressRef.current = false;
    }
  }, [session, stage, language, onAIResponse, triggerFeedbackGeneration]);

  // Retry last failed turn without duplicating messages
  const retryLastTurn = useCallback(async () => {
    if (!lastPendingArgument || !session) return;
    if (isRequestInProgressRef.current) return;
    if (stage === 'WAITING_FOR_AI' || stage === 'FINISHING') return;

    isRequestInProgressRef.current = true;
    setError(null);
    setStage('WAITING_FOR_AI');

    // In transcript, user turn was already optimistically appended.
    // So prior transcript passed to the AI is everything before that user message.
    const lastMsg = session.transcript[session.transcript.length - 1];
    const previousTranscript = lastMsg?.role === 'user'
      ? session.transcript.slice(0, -1)
      : session.transcript;

    const turnPayload = {
      sessionId: session.sessionId,
      topic: session.topic,
      userStance: session.userStance,
      aiStance: session.aiStance,
      difficulty: session.difficulty,
      round: session.round,
      transcript: previousTranscript.map(t => ({ role: t.role, content: t.content })),
      latestArgument: lastPendingArgument,
      language
    };

    try {
      const result = await sendDebateTurn(turnPayload);

      if (!result.success) {
        setError(result.error);
        setStage('DEBATING');
        return;
      }

      // Success: Append AI message to the existing transcript
      const aiMessage = {
        role: 'ai',
        content: result.data.counter,
        argumentScore: result.data.argumentScore,
        scoreReason: result.data.scoreReason,
        fallacy: result.data.fallacy
      };

      const currentRound = session.round;
      const baseTranscript = lastMsg?.role === 'user'
        ? session.transcript
        : [...session.transcript, { role: 'user', content: lastPendingArgument }];

      const nextTranscript = [...baseTranscript, aiMessage];
      setLastPendingArgument('');

      if (onAIResponse) {
        onAIResponse(result.data.counter);
      }

      if (currentRound >= MAX_ROUNDS) {
        const completedSession = {
          ...session,
          round: currentRound,
          transcript: nextTranscript
        };
        setSession(completedSession);
        await triggerFeedbackGeneration(completedSession);
      } else {
        setSession(prev => ({
          ...prev,
          round: currentRound + 1,
          transcript: nextTranscript
        }));
        setStage('DEBATING');
      }
    } finally {
      isRequestInProgressRef.current = false;
    }
  }, [lastPendingArgument, session, stage, language, onAIResponse, triggerFeedbackGeneration]);

  // Manually finish debate (allowed after at least 1 turn)
  const finishDebate = useCallback(() => {
    if (!session || stage === 'WAITING_FOR_AI' || stage === 'FINISHING') return;
    if (session.transcript.length === 0) return;
    triggerFeedbackGeneration(session);
  }, [session, stage, triggerFeedbackGeneration]);

  // Start a fresh debate
  const resetToSetup = useCallback(() => {
    clearActiveSession();
    setSession(null);
    setError(null);
    setLastPendingArgument('');
    setStage('SETUP');
  }, []);

  // View past session
  const loadPastSession = useCallback((savedSession) => {
    setSession(savedSession);
    setError(null);
    setStage('SUMMARY');
  }, []);

  // Cancel finishing and return safely to debate
  const cancelFinishing = useCallback(() => {
    if (stage === 'FINISHING') {
      setStage('DEBATING');
      setError(null);
    }
  }, [stage]);

  return {
    stage,
    session,
    error,
    saveError,
    lastPendingArgument,
    pastSessions,
    startDebate,
    submitArgument,
    retryLastTurn,
    finishDebate,
    cancelFinishing,
    resetToSetup,
    loadPastSession,
    clearError: () => setError(null)
  };
}
