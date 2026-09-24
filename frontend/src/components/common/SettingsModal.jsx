import React, { useEffect, useRef } from 'react';
import { Settings, X, Sun, Moon, Monitor, Check, Globe, Gauge, User, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../context/AuthContext';

export default function SettingsModal({
  isOpen,
  onClose,
  theme,
  onSelectTheme,
  voiceSpeed = 1.0,
  onSelectVoiceSpeed
}) {
  const modalRef = useRef(null);
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const { user, isGuest } = useAuth();

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const themeOptions = [
    {
      id: 'light',
      label: t('settings.light'),
      description: t('settings.lightDesc'),
      icon: Sun,
    },
    {
      id: 'dark',
      label: t('settings.dark'),
      description: t('settings.darkDesc'),
      icon: Moon,
    },
    {
      id: 'system',
      label: t('settings.system'),
      description: t('settings.systemDesc'),
      icon: Monitor,
    },
  ];

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Debater';
  const displayEmail = user?.email || 'No email provided';
  const authProvider = user?.app_metadata?.provider
    ? (user.app_metadata.provider === 'google' ? 'Google' : user.app_metadata.provider)
    : 'Email';
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-message-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-chamber-surface border border-chamber-border rounded-lg shadow-2xl p-6 space-y-5 text-chamber-text max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-chamber-border">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-chamber-amber" />
            <h2 id="settings-modal-title" className="text-base font-semibold tracking-wide font-serif">
              {t('settings.title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-chamber-muted hover:text-chamber-text hover:bg-chamber-surfaceAlt transition-colors focus:outline-none focus:ring-2 focus:ring-chamber-amber"
            aria-label={t('settings.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Information Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-chamber-amber" />
            <label className="text-xs uppercase font-semibold tracking-wider text-chamber-muted">
              {t('settings.profileInfo')}
            </label>
          </div>

          {isGuest || !user ? (
            <div className="p-3 rounded-lg bg-chamber-surfaceAlt border border-chamber-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs">
                  GU
                </div>
                <div>
                  <div className="text-sm font-semibold text-chamber-text">{t('settings.guestUser')}</div>
                  <div className="text-xs text-chamber-muted">{t('settings.guestMode')}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {t('auth.guest')}
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-chamber-surfaceAlt border border-chamber-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-10 h-10 rounded-full border border-chamber-amber/30 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-chamber-amber/20 border border-chamber-amber/40 flex items-center justify-center text-chamber-amber font-bold text-sm">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-chamber-text">{displayName}</div>
                    <div className="text-xs text-chamber-muted">{displayEmail}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/60">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{t('settings.active')}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-chamber-border/60 flex items-center justify-between text-xs text-chamber-muted">
                <span>{t('settings.provider')} <strong className="text-chamber-text font-medium">{authProvider}</strong></span>
                <span>{t('settings.status')} <strong className="text-emerald-400 font-medium">{t('settings.authenticated')}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Theme Section */}
        <div className="space-y-3 pt-3 border-t border-chamber-border">
          <div>
            <label className="text-xs uppercase font-semibold tracking-wider text-chamber-muted block">
              {t('settings.appearance')}
            </label>
            <p className="text-xs text-chamber-muted mt-0.5">
              {t('settings.appearanceDesc')}
            </p>
          </div>

          <div className="space-y-2">
            {themeOptions.map((opt) => {
              const isSelected = theme === opt.id;
              const Icon = opt.icon;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectTheme(opt.id)}
                  className={`w-full p-2.5 rounded-lg border text-left flex items-start justify-between gap-3 transition-all ${
                    isSelected
                      ? 'bg-chamber-amber/10 border-chamber-amber text-chamber-text ring-1 ring-chamber-amber shadow-sm'
                      : 'bg-chamber-surfaceAlt border-chamber-border text-chamber-muted hover:border-slate-500 hover:text-chamber-text'
                  }`}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-md mt-0.5 ${
                      isSelected
                        ? 'bg-chamber-amber/20 text-chamber-amber'
                        : 'bg-chamber-surface border border-chamber-border text-chamber-muted'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${isSelected ? 'text-chamber-text' : ''}`}>
                        {opt.label}
                      </div>
                      <div className="text-xs text-chamber-muted mt-0.5">
                        {opt.description}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-1 w-5 h-5 rounded-full bg-chamber-amber text-[#11141A] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Section */}
        <div className="space-y-3 pt-3 border-t border-chamber-border">
          <div>
            <label className="text-xs uppercase font-semibold tracking-wider text-chamber-muted block flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-chamber-amber" />
              <span>{t('settings.language')}</span>
            </label>
            <p className="text-xs text-chamber-muted mt-0.5">
              {t('settings.languageDesc')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {supportedLanguages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    isSelected
                      ? 'bg-chamber-amber/15 border-chamber-amber text-chamber-amber ring-1 ring-chamber-amber font-semibold shadow-sm'
                      : 'bg-chamber-surfaceAlt border-chamber-border text-chamber-muted hover:border-slate-500 hover:text-chamber-text'
                  }`}
                >
                  <div className="text-sm font-medium">{lang.nativeName}</div>
                  <div className="text-[10px] text-chamber-muted opacity-80">{lang.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Voice Speed Section */}
        <div className="space-y-3 pt-3 border-t border-chamber-border">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs uppercase font-semibold tracking-wider text-chamber-muted block flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-chamber-amber" />
                <span>{t('settings.voiceSpeed')}</span>
              </label>
              <p className="text-xs text-chamber-muted mt-0.5">
                {t('settings.voiceSpeedDesc')}
              </p>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-chamber-amber/20 text-chamber-amber border border-chamber-amber/40">
              {Number(voiceSpeed).toFixed(1)}x
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={voiceSpeed}
              onChange={(e) => onSelectVoiceSpeed && onSelectVoiceSpeed(parseFloat(e.target.value))}
              className="w-full accent-chamber-amber cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-chamber-muted font-mono">
              <span>0.5x</span>
              <span className={voiceSpeed === 1.0 ? 'text-chamber-amber font-bold' : ''}>1.0x (Default)</span>
              <span>1.5x</span>
              <span>2.0x</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end border-t border-chamber-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-chamber-amber hover:bg-amber-500 text-[#11141A] text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-chamber-amber"
          >
            {t('settings.done')}
          </button>
        </div>
      </div>
    </div>
  );
}
