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

  // Guard routes: Protect /history for unauthenticated users, and redirect authenticated users away from /login
  useEffect(() => {
    if (authLoading) return;

    // 1. Unauthenticated user accessing protected /history route
    if (!isAuthenticated && !isGuest) {
      if (currentPath === '/history') {
        setRedirectTarget('/history');
        navigate('/login');
      }
    }

    // 2. Authenticated user opening /login
    if (isAuthenticated && currentPath === '/login') {
      const destination = redirectTarget || '/';
      setRedirectTarget(null);
      navigate(destination);
    }
  }, [authLoading, isAuthenticated, isGuest, currentPath, navigate, redirectTarget]);

  // Cleanly reset active debate state if user logs out
  useEffect(() => {
    if (!isAuthenticated && !isGuest && stage !== 'SETUP') {
      resetToSetup();
    }
  }, [isAuthenticated, isGuest, stage, resetToSetup]);

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

      {/* Main Debate Stages (Route: /) */}
      {currentPath === '/' && stage === 'SETUP' && (
        <SetupPage
          onStartDebate={startDebate}
          pastSessions={pastSessions}
          onSelectSession={loadPastSession}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAuth={() => navigate('/login')}
          onNavigate={navigate}
        />
      )}

      {currentPath === '/' && (stage === 'DEBATING' || stage === 'WAITING_FOR_AI' || stage === 'FINISHING') && (
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

      {currentPath === '/' && stage === 'SUMMARY' && (
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
