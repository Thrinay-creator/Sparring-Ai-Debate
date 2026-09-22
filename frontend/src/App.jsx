import React, { useState, useEffect } from 'react';
import SetupPage from './pages/SetupPage';
import DebatePage from './pages/DebatePage';
import SummaryPage from './pages/SummaryPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HistoryPage from './pages/HistoryPage';
import LandingPage from './pages/LandingPage';
import SettingsModal from './components/common/SettingsModal';
import { useDebate } from './hooks/useDebate';
import { useSpeech } from './hooks/useSpeech';
import { useTheme } from './hooks/useTheme';
import { useRouter } from './hooks/useRouter';
import { useLanguage } from './i18n';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { language } = useLanguage();
  const speech = useSpeech({ language });
  const theme = useTheme();
  const { currentPath, navigate } = useRouter();
  const { user, isAuthenticated, isGuest, authLoading, logout, continueAsGuest } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState(null);
  const [initialTopic, setInitialTopic] = useState('');
  const [isSessionUnlocked, setIsSessionUnlocked] = useState(() => {
    try {
      return typeof window !== 'undefined' && sessionStorage.getItem('sparring_session_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const {
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
    resetToSetup,
    loadPastSession,
  } = useDebate({
    user,
    language,
    onAIResponse: (counterText) => {
      speech.speakAIResponse(counterText);
    },
  });

  const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];

  // Guard routes: Protect routes based on initialized authentication status
  useEffect(() => {
    if (authLoading) return;

    // Protected route: /history requires authenticated account
    if (currentPath === '/history' && !isAuthenticated) {
      setRedirectTarget('/history');
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, currentPath, navigate]);

  // Cleanly reset active debate state if user logs out
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated && !isGuest && stage !== 'SETUP') {
      resetToSetup();
    }
  }, [authLoading, isAuthenticated, isGuest, stage, resetToSetup]);

  // Safe console debugging for production diagnostics (no tokens, passwords, or secrets)
  useEffect(() => {
    if (!authLoading) {
      console.log('[Sparring Auth Diagnostic]', {
        authLoading,
        hasSession: !!user,
        guestMode: isGuest,
        sessionUnlocked: isSessionUnlocked,
        pathname: currentPath
      });
    }
  }, [authLoading, user, isGuest, isSessionUnlocked, currentPath]);

  // Prevent flash while verifying auth status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-chamber-bg text-chamber-text font-sans antialiased flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-chamber-amber border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-lg font-bold text-chamber-amber tracking-wider">SPARRING</span>
        </div>
      </div>
    );
  }

  const handleAuthSuccess = () => {
    try {
      sessionStorage.setItem('sparring_session_unlocked', 'true');
    } catch {}
    setIsSessionUnlocked(true);
    const destination = redirectTarget || '/';
    setRedirectTarget(null);
    navigate(destination);
  };

  const handleLaunchDebate = (topicToUse = '') => {
    try {
      sessionStorage.setItem('sparring_session_unlocked', 'true');
    } catch {}
    setIsSessionUnlocked(true);
    if (!isAuthenticated && !isGuest) {
      continueAsGuest();
    }
    if (topicToUse) {
      setInitialTopic(topicToUse);
    }
    navigate('/debate');
  };

  const handleToggleTheme = () => {
    theme.setTheme(theme.resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const isDebatingActive = (stage === 'DEBATING' || stage === 'WAITING_FOR_AI' || stage === 'FINISHING');
  const isSummaryActive = stage === 'SUMMARY';

  return (
    <div className="min-h-screen bg-chamber-bg text-chamber-text font-sans antialiased transition-colors duration-200">
      {/* Route: /login */}
      {currentPath === '/login' && (
        <LoginPage
          onNavigate={navigate}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Route: /signup */}
      {currentPath === '/signup' && (
        <SignupPage
          onNavigate={navigate}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Route: /forgot-password */}
      {currentPath === '/forgot-password' && (
        <ForgotPasswordPage
          onNavigate={navigate}
        />
      )}

      {/* Route: /reset-password */}
      {currentPath === '/reset-password' && (
        <ResetPasswordPage
          onNavigate={navigate}
        />
      )}

      {/* Route: /history */}
      {currentPath === '/history' && (
        <HistoryPage
          onNavigate={navigate}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Active Debate Session View */}
      {isDebatingActive && (
        <DebatePage
          session={session}
          stage={stage}
          error={error}
          lastPendingArgument={lastPendingArgument}
          onSubmitArgument={submitArgument}
          onRetryTurn={retryLastTurn}
          onFinishDebate={finishDebate}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onNavigateHome={() => {
            resetToSetup();
            navigate('/');
          }}
          onOpenAuth={() => navigate('/login')}
          speech={speech}
        />
      )}

      {/* Debate Summary View */}
      {isSummaryActive && (
        <SummaryPage
          session={session}
          onStartNewDebate={() => {
            resetToSetup();
            navigate('/debate');
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onNavigate={navigate}
          saveError={saveError}
        />
      )}

      {/* Route: /debate (Setup Arena) */}
      {currentPath === '/debate' && !isDebatingActive && !isSummaryActive && (
        <SetupPage
          onStartDebate={startDebate}
          pastSessions={pastSessions}
          onSelectSession={loadPastSession}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAuth={() => navigate('/login')}
          onNavigate={navigate}
          initialTopic={initialTopic}
        />
      )}

      {/* Route: / (Default MotionSites-Inspired Landing Page) */}
      {currentPath === '/' && !isDebatingActive && !isSummaryActive && (
        <LandingPage
          onStartDebating={() => handleLaunchDebate()}
          onStartDebateWithTopic={(topic) => handleLaunchDebate(topic)}
          onNavigate={navigate}
          theme={theme.resolvedTheme}
          onToggleTheme={handleToggleTheme}
          user={user}
          isAuthenticated={isAuthenticated}
          speech={speech}
        />
      )}

      {/* Preferences / Theme Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme.theme}
        onSelectTheme={theme.setTheme}
        voiceSpeed={speech.voiceSpeed}
        onSelectVoiceSpeed={speech.setVoiceSpeed}
      />
    </div>
  );
}
