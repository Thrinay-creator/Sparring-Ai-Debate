import React, { useState } from 'react';
import TopicSelector from '../components/setup/TopicSelector';
import StanceSelector from '../components/setup/StanceSelector';
import DifficultySelector from '../components/setup/DifficultySelector';
import { validateSetup } from '../utils/validation';
import { Swords, History, ChevronRight, AlertCircle, Sparkles, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n';

export default function SetupPage({ onStartDebate, pastSessions = [], onSelectSession, onOpenSettings, onOpenAuth, onNavigate }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [topic, setTopic] = useState('');
  const [userStance, setUserStance] = useState('FOR');
  const [difficulty, setDifficulty] = useState('SHARP');
  const [error, setError] = useState(null);

  const handleStart = (e) => {
    e.preventDefault();
    const validation = validateSetup({ topic, userStance, difficulty });
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setError(null);
    onStartDebate({ topic, userStance, difficulty });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Utility Bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          type="button"
          onClick={() => onNavigate ? onNavigate('/') : null}
          className="font-serif text-lg font-bold text-chamber-text tracking-tight hover:text-chamber-amber transition-colors focus:outline-none"
        >
          {t('brand')}
        </button>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* History Button */}
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('/history')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-chamber-surface border border-chamber-border text-xs text-chamber-text hover:border-chamber-amber transition-colors"
                  title="View Debate History"
                >
                  <History className="w-3.5 h-3.5 text-chamber-amber" />
                  <span>History</span>
                </button>
              )}

              {/* User Account / Email & Logout */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-chamber-surface border border-chamber-border text-xs text-chamber-muted font-mono">
                <span className="text-chamber-text font-sans font-medium max-w-[120px] truncate" title={user?.email}>
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    if (onNavigate) onNavigate('/login');
                  }}
                  className="text-red-400 hover:text-red-300 ml-1.5 font-sans hover:underline flex items-center gap-1"
                  title={t('auth.logout')}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('auth.logout')}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Guest badge */}
              <span className="hidden sm:inline-block px-2 py-1 rounded bg-chamber-surface border border-chamber-border text-[11px] text-chamber-muted font-mono">
                Guest
              </span>

              {/* Sign In Button */}
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-chamber-surface border border-chamber-border text-xs text-chamber-text hover:border-chamber-amber transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-chamber-amber" />
                  <span>{t('auth.signIn')}</span>
                </button>
              )}
            </>
          )}

          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-chamber-surface border border-chamber-border text-xs text-chamber-muted hover:text-chamber-text hover:border-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-chamber-amber"
            title="Theme Preferences"
            aria-label="Open Theme Preferences"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t('settings.title')}</span>
          </button>
        </div>
      </div>

      {/* Chamber Header & Branding */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chamber-surface border border-chamber-border text-xs text-chamber-amber mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('badge')}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-chamber-text tracking-tight mb-3">
          {t('brand')}
        </h1>
        <p className="text-lg text-chamber-amber font-medium mb-2">
          {t('tagline')}
        </p>
        <p className="text-sm text-chamber-muted max-w-xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      {/* Main Chamber Setup Card */}
      <div className="bg-chamber-surface border border-chamber-border rounded-lg p-6 sm:p-8 space-y-6 shadow-xl">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded bg-red-950/40 border border-red-800 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleStart} className="space-y-6">
          <TopicSelector topic={topic} onSelectTopic={(t) => { setTopic(t); setError(null); }} />

          <hr className="border-chamber-border/60" />

          <StanceSelector userStance={userStance} onChangeStance={setUserStance} />

          <hr className="border-chamber-border/60" />

          <DifficultySelector difficulty={difficulty} onSelectDifficulty={setDifficulty} />

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-md bg-chamber-amber hover:bg-amber-500 text-[#11141A] font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <Swords className="w-4 h-4" />
              <span>{t('setup.enterChamber')}</span>
            </button>
            <p className="text-center text-[11px] text-chamber-muted mt-2">
              {t('setup.roundsRule')}
            </p>
          </div>
        </form>
      </div>

      {/* Past Completed Debates (if any stored) */}
      {pastSessions && pastSessions.length > 0 && (
        <div className="mt-10 pt-6 border-t border-chamber-border/60">
          <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-wider font-semibold text-chamber-muted">
            <History className="w-4 h-4 text-chamber-amber" />
            <span>{t('setup.recentReports')}</span>
          </div>
          <div className="space-y-2">
            {pastSessions.slice(0, 3).map((session) => (
              <div
                key={session.sessionId}
                onClick={() => onSelectSession(session)}
                className="flex items-center justify-between p-3 rounded-md bg-chamber-surface border border-chamber-border hover:border-slate-600 transition-all cursor-pointer group"
              >
                <div className="space-y-0.5 truncate pr-4">
                  <div className="text-sm font-medium text-chamber-text truncate group-hover:text-chamber-amber transition-colors">
                    {session.topic}
                  </div>
                  <div className="text-xs text-chamber-muted flex items-center gap-3">
                    <span>{t('setup.stanceLabel')}: <strong className="text-chamber-user">{session.userStance}</strong></span>
                    <span>•</span>
                    <span>{t('setup.score')}: <strong className="text-chamber-amber">{session.feedback?.overallScore || 'N/A'}/100</strong></span>
                    <span>•</span>
                    <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-chamber-muted group-hover:text-chamber-amber">
                  <span>{t('setup.view')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
