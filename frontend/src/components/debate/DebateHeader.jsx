import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Square, 
  Flag, 
  Shield, 
  Flame, 
  Skull, 
  AlertCircle,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';

const DIFFICULTY_ICONS = {
  NEWBIE: Shield,
  SHARP: Flame,
  RUTHLESS: Skull,
};

export default function DebateHeader({
  session,
  isMuted,
  voiceState,
  onToggleMute,
  onStopSpeaking,
  onFinishDebate,
  onOpenSettings,
  onNavigateHome,
  onOpenAuth,
  isThinking,
  isFinishing
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const DiffIcon = DIFFICULTY_ICONS[session.difficulty] || Flame;
  const userTurnsCount = session.transcript.filter(t => t.role === 'user').length;
  const canFinish = userTurnsCount > 0 && !isThinking && !isFinishing;

  const handleLogoClick = () => {
    if (!onNavigateHome) return;
    if (userTurnsCount > 0) {
      setShowLeaveModal(true);
    } else {
      onNavigateHome();
    }
  };

  const handleFinishClick = () => {
    if (userTurnsCount <= 2) {
      setShowConfirmModal(true);
    } else {
      onFinishDebate();
    }
  };

  const confirmFinish = () => {
    setShowConfirmModal(false);
    onFinishDebate();
  };

  return (
    <header className="border-b border-chamber-border bg-[#161B22]/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Brand & Topic Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleLogoClick}
              className="font-serif text-xl text-chamber-text font-bold tracking-tight hover:text-chamber-amber transition-colors focus:outline-none flex items-center gap-1.5 text-left"
              title="Return to Home"
            >
              <span>{t('brand')}</span>
            </button>
            <span className="text-xs px-2 py-0.5 rounded bg-chamber-surface border border-chamber-border font-mono text-chamber-amber flex items-center gap-1">
              <DiffIcon className="w-3 h-3" />
              {session.difficulty}
            </span>
            <span className="text-xs font-mono text-chamber-muted px-2 py-0.5 rounded bg-chamber-surface border border-chamber-border">
              {t('round')} {Math.min(session.round || 1, 6)} {t('of')} 6
            </span>
          </div>
          <h2 className="text-xs sm:text-sm font-medium text-chamber-text truncate max-w-xl" title={session.topic}>
            {session.topic}
          </h2>
        </div>

        {/* Right: Stances & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Stance Badges */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="px-2 py-1 rounded bg-chamber-userBg border border-chamber-userBorder text-chamber-user font-semibold">
              {t('setup.youStance')}: {session.userStance}
            </span>
            <span className="text-chamber-muted text-[11px]">{t('vs')}</span>
            <span className="px-2 py-1 rounded bg-chamber-aiBg border border-chamber-aiBorder text-chamber-ai font-semibold">
              {t('setup.opponentStance')}: {session.aiStance}
            </span>
          </div>

          {/* Voice Stop Speaking Button (Visible when AI is speaking) */}
          {voiceState === 'AI_SPEAKING' && (
            <button
              type="button"
              onClick={onStopSpeaking}
              className="px-2.5 py-1 rounded bg-amber-500/20 border border-chamber-amber text-chamber-amber hover:bg-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors animate-pulse"
              title="Stop AI speech audio"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>{t('debate.stopSpeaking')}</span>
            </button>
          )}

          {/* Mute / Unmute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`p-1.5 rounded border transition-colors ${
              isMuted
                ? 'bg-red-950/40 border-red-800/80 text-red-400 hover:bg-red-900/40'
                : 'bg-chamber-surface border-chamber-border text-chamber-muted hover:text-chamber-text hover:border-slate-500'
            }`}
            title={isMuted ? t('debate.unmuteVoice') : t('debate.muteVoice')}
            aria-label={isMuted ? t('debate.unmuteVoice') : t('debate.muteVoice')}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 rounded border transition-colors bg-chamber-surface border-chamber-border text-chamber-muted hover:text-chamber-text hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-chamber-amber"
            title={t('debate.themePreferences')}
            aria-label={t('debate.themePreferences')}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Auth User Pill or Sign In Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-chamber-surface border border-chamber-border text-[11px] text-chamber-muted font-mono">
              <span className="truncate max-w-[90px] text-chamber-text" title={user?.email}>
                {user?.email?.split('@')[0]}
              </span>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  if (onNavigateHome) onNavigateHome();
                  if (onOpenAuth) onOpenAuth();
                }}
                className="text-red-400 hover:text-red-300 ml-0.5 hover:underline"
                title={t('auth.logout')}
              >
                <LogOut className="w-3.5 h-3.5 inline" />
              </button>
            </div>
          ) : onOpenAuth ? (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-2.5 py-1 rounded border border-chamber-border bg-chamber-surface hover:border-chamber-amber text-xs font-medium text-chamber-text transition-colors flex items-center gap-1"
            >
              <User className="w-3 h-3 text-chamber-amber" />
              <span>{t('auth.signIn')}</span>
            </button>
          ) : null}

          {/* Finish Debate Button */}
          <button
            type="button"
            onClick={handleFinishClick}
            disabled={!canFinish}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              canFinish
                ? 'bg-chamber-surface border border-chamber-border hover:border-chamber-amber hover:text-chamber-amber text-chamber-text shadow-sm'
                : 'bg-chamber-surface/50 border border-chamber-border/40 text-chamber-muted/40 cursor-not-allowed'
            }`}
            title={canFinish ? 'Conclude debate and get feedback' : 'Available after submitting your opening argument'}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>{t('debate.finishDebate')}</span>
          </button>
        </div>
      </div>

      {/* Early Finish Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C2129] border border-chamber-border rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl animate-message-in">
            <div className="flex items-center gap-2 text-chamber-amber">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-semibold text-chamber-text">
                {t('debate.finishTitle')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-chamber-muted leading-relaxed">
              {t('debate.finishDesc', { rounds: userTurnsCount })}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded text-xs font-medium bg-chamber-surface border border-chamber-border text-chamber-text hover:border-slate-500 transition-colors"
              >
                {t('debate.keepSparring')}
              </button>
              <button
                type="button"
                onClick={confirmFinish}
                className="px-4 py-2 rounded text-xs font-medium bg-chamber-amber text-[#11141A] font-semibold hover:bg-amber-400 transition-colors"
              >
                {t('debate.concludeReport')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Debate to Home Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-message-in">
          <div className="bg-[#1C2129] border border-chamber-border rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-chamber-amber">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-semibold text-chamber-text">
                {t('debate.leaveTitle')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-chamber-muted leading-relaxed">
              {t('debate.leaveDesc')}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="px-4 py-2 rounded text-xs font-medium bg-chamber-surface border border-chamber-border text-chamber-text hover:border-slate-500 transition-colors"
              >
                {t('debate.keepSparring')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLeaveModal(false);
                  onNavigateHome();
                }}
                className="px-4 py-2 rounded text-xs font-semibold bg-red-900/90 hover:bg-red-800 text-red-100 border border-red-700 transition-colors"
              >
                {t('debate.leaveConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
