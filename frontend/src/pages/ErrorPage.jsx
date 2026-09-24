import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Home, RotateCcw, Copy, Check, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { useLanguage } from '../i18n';

export default function ErrorPage({ error, onReload, onResetSession, onNavigateHome }) {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const errorMessage = error?.message || (typeof error === 'string' ? error : 'An unexpected exception was encountered.');
  const errorStack = error?.stack || '';

  const handleCopy = () => {
    try {
      const textToCopy = `Sparring Error Log:\nTime: ${new Date().toISOString()}\nMessage: ${errorMessage}\nStack: ${errorStack}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleReload = () => {
    if (onReload) {
      onReload();
    } else {
      window.location.reload();
    }
  };

  const handleReset = () => {
    if (onResetSession) {
      onResetSession();
    } else {
      try {
        sessionStorage.clear();
      } catch {}
      window.location.href = '/';
    }
  };

  const handleHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-chamber-bg text-chamber-text font-sans antialiased flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-red-600/15 via-amber-600/10 to-[#7C3AED]/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Main error card */}
      <div className="w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-chamber-surface/85 border border-red-500/20 shadow-2xl backdrop-blur-xl relative arena-glass">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-mono uppercase tracking-wider mb-6">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span>{t('errorPage.badge')}</span>
        </div>

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-800/50 flex items-center justify-center text-red-400 mb-6 mx-auto shadow-lg shadow-red-950/40">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-chamber-text tracking-tight mb-2 text-center">
          {t('errorPage.title')}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-chamber-muted text-center leading-relaxed mb-6">
          {t('errorPage.subtitle')}
        </p>

        {/* Error Message Box */}
        <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-800/40 font-mono text-xs text-red-300 break-words mb-6 text-left">
          {errorMessage}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={handleReload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white font-medium text-xs shadow-md shadow-[#7C3AED]/25 transition-all hover:-translate-y-0.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('errorPage.reloadChamber')}</span>
          </button>

          <button
            type="button"
            onClick={handleHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-chamber-surfaceAlt hover:bg-white/[0.08] border border-chamber-border text-chamber-text font-medium text-xs transition-all hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            <span>{t('errorPage.returnHome')}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-chamber-muted hover:text-chamber-text text-xs transition-colors"
            title="Clear stored debate data and restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('errorPage.resetSession')}</span>
          </button>
        </div>

        {/* Collapsible Technical Details */}
        <div className="pt-4 border-t border-chamber-border/60">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-xs font-mono text-chamber-muted hover:text-chamber-text transition-colors py-1"
          >
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>{t('errorPage.diagnosticDetails')}</span>
            </div>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="mt-3 space-y-2 animate-message-in">
              <div className="p-3 rounded-lg bg-black/60 border border-white/[0.08] font-mono text-[11px] text-zinc-400 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {errorStack || errorMessage}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-mono text-chamber-muted hover:text-chamber-text transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? t('errorPage.copied') : t('errorPage.copyError')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
