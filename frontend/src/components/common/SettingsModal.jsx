import React, { useEffect, useRef } from 'react';
import { Settings, X, Sun, Moon, Monitor, Check, Globe } from 'lucide-react';
import { useLanguage } from '../../i18n';

export default function SettingsModal({ isOpen, onClose, theme, onSelectTheme }) {
  const modalRef = useRef(null);
  const { language, setLanguage, supportedLanguages, t } = useLanguage();

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

  const options = [
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
        className="w-full max-w-md bg-chamber-surface border border-chamber-border rounded-lg shadow-2xl p-6 space-y-6 text-chamber-text max-h-[90vh] overflow-y-auto"
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

        {/* Theme Section */}
        <div className="space-y-3">
          <div>
            <label className="text-xs uppercase font-semibold tracking-wider text-chamber-muted block">
              {t('settings.appearance')}
            </label>
            <p className="text-xs text-chamber-muted mt-0.5">
              {t('settings.appearanceDesc')}
            </p>
          </div>

          <div className="space-y-2">
            {options.map((opt) => {
              const isSelected = theme === opt.id;
              const Icon = opt.icon;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectTheme(opt.id)}
                  className={`w-full p-3 rounded-lg border text-left flex items-start justify-between gap-3 transition-all ${
                    isSelected
                      ? 'bg-chamber-amber/10 border-chamber-amber text-chamber-text ring-1 ring-chamber-amber shadow-sm'
                      : 'bg-chamber-surfaceAlt border-chamber-border text-chamber-muted hover:border-slate-500 hover:text-chamber-text'
                  }`}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md mt-0.5 ${
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

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-chamber-surfaceAlt border border-chamber-border text-xs font-semibold hover:border-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-chamber-amber"
          >
            {t('settings.done')}
          </button>
        </div>
      </div>
    </div>
  );
}
