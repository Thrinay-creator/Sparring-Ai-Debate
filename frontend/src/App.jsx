import React, { useState, useEffect } from 'react';
import SetupPage from './pages/SetupPage';
import DebatePage from './pages/DebatePage';
import SummaryPage from './pages/SummaryPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HistoryPage from './pages/HistoryPage';
import SettingsModal from './components/common/SettingsModal';
import { useDebate } from './hooks/useDebate';
import { useSpeech } from './hooks/useSpeech';
import { useTheme } from './hooks/useTheme';
import { useRouter } from './hooks/useRouter';
import { useLanguage } from './i18n';
import { useAuth } from './context/AuthContext';

export default function App() {
  const speech = useSpeech();
  const theme = useTheme();
  const { currentPath, navigate } = useRouter();
  const { language } = useLanguage();
  const { user, isAuthenticated, isGuest, authLoading, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState(null);

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
    // 1. Never redirect while auth is initializing
    if (authLoading) return;

    // 2. Unauthenticated user (neither signed in nor explicit guest)
    if (!isAuthenticated && !isGuest) {
      if (currentPath === '/history') {
        setRedirectTarget('/history');
        navigate('/login');
      } else if (!AUTH_ROUTES.includes(currentPath)) {
        navigate('/login');
      }
      return;
    }

    // 3. Guest user accessing protected /history route
    if (isGuest && currentPath === '/history') {
      setRedirectTarget('/history');
      navigate('/login');
      return;
    }
  }, [authLoading, isAuthenticated, isGuest, currentPath, navigate]);

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
        pathname: currentPath
      });
    }
  }, [authLoading, user, isGuest, currentPath]);

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
    const destination = redirectTarget || '/';
    setRedirectTarget(null);
    navigate(destination);
  };

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

      {/* Fallback to LoginPage for unauthenticated access at root / */}
      {currentPath === '/' && !isAuthenticated && !isGuest && (
        <LoginPage
          onNavigate={navigate}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Main Debate Stages (Route: /) - Accessible to Authenticated or Guest users */}
      {currentPath === '/' && (isAuthenticated || isGuest) && stage === 'SETUP' && (
        <SetupPage
          onStartDebate={startDebate}
          pastSessions={pastSessions}
          onSelectSession={loadPastSession}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAuth={() => navigate('/login')}
          onNavigate={navigate}
        />
      )}

      {currentPath === '/' && (isAuthenticated || isGuest) && (stage === 'DEBATING' || stage === 'WAITING_FOR_AI' || stage === 'FINISHING') && (
        <DebatePage
          session={session}
          stage={stage}
          error={error}
          lastPendingArgument={lastPendingArgument}
          onSubmitArgument={submitArgument}
          onRetryTurn={retryLastTurn}
          onFinishDebate={finishDebate}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onNavigateHome={resetToSetup}
          onOpenAuth={() => navigate('/login')}
          speech={speech}
        />
      )}

      {currentPath === '/' && (isAuthenticated || isGuest) && stage === 'SUMMARY' && (
        <SummaryPage
          session={session}
          onStartNewDebate={resetToSetup}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onNavigate={navigate}
          saveError={saveError}
        />
      )}

      {/* Preferences / Theme Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme.theme}
        onSelectTheme={theme.setTheme}
      />
    </div>
  );
}
