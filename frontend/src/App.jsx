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
import LoadingPage from './pages/LoadingPage';
import RunningPage from './pages/RunningPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';
import SettingsModal from './components/common/SettingsModal';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useDebate } from './hooks/useDebate';
import { useSpeech } from './hooks/useSpeech';
import { useTheme } from './hooks/useTheme';
import { useRouter } from './hooks/useRouter';
import { useLanguage } from './i18n';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { language, t } = useLanguage();
  const speech = useSpeech({ language, t });
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
  const SYSTEM_ROUTES = ['/loading', '/running', '/error', '/404'];
  const KNOWN_ROUTES = ['/', '/debate', '/history', ...AUTH_ROUTES, ...SYSTEM_ROUTES];
  const isLandingRoute = currentPath === '/';
  const isNotFoundRoute = !KNOWN_ROUTES.includes(currentPath) || currentPath === '/404';

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
    return <LoadingPage />;
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

  const isDebatingActive = (stage === 'DEBATING' || stage === 'WAITING_FOR_AI');
  const isFinishingActive = stage === 'FINISHING';
  const isSummaryActive = stage === 'SUMMARY';

  return (
    <ErrorBoundary>
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

        {/* System Diagnostic Route: /loading */}
        {currentPath === '/loading' && (
          <LoadingPage />
        )}

        {/* System Diagnostic Route: /error */}
        {currentPath === '/error' && (
          <ErrorPage
            onNavigateHome={() => navigate('/')}
            onResetSession={() => {
              resetToSetup();
              navigate('/');
            }}
          />
        )}

        {/* Adjudication Running Screen (During debate finalization or explicit /running route) */}
        {((currentPath === '/debate' && isFinishingActive) || currentPath === '/running') && (
          <RunningPage
            session={session}
            onCancel={() => {
              resetToSetup();
              navigate('/debate');
            }}
          />
        )}

        {/* Active Debate Session View (Only when currentPath is /debate) */}
        {currentPath === '/debate' && isDebatingActive && (
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

        {/* Debate Summary View (Only when currentPath is /debate) */}
        {currentPath === '/debate' && isSummaryActive && (
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
        {currentPath === '/debate' && !isDebatingActive && !isFinishingActive && !isSummaryActive && (
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
        {isLandingRoute && !isDebatingActive && !isFinishingActive && !isSummaryActive && (
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

        {/* Route: 404 / Premise Not Found */}
        {isNotFoundRoute && !isDebatingActive && !isFinishingActive && !isSummaryActive && (
          <NotFoundPage
            onNavigate={navigate}
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
    </ErrorBoundary>
  );
}
