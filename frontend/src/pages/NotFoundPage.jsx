import React from 'react';
import { Compass, Home, Swords, History, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n';

export default function NotFoundPage({ onNavigate }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-chamber-bg text-chamber-text font-sans antialiased flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#7C3AED]/15 via-[#6366F1]/10 to-[#22D3EE]/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Main card */}
      <div className="w-full max-w-lg p-8 sm:p-12 rounded-2xl bg-chamber-surface/85 border border-chamber-border/80 shadow-2xl backdrop-blur-xl text-center relative arena-glass">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-chamber-muted">
            {t('notFound.badge')}
          </span>
        </div>

        {/* 404 Visual Icon */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="w-full h-full rounded-2xl bg-chamber-surfaceAlt border border-chamber-border flex items-center justify-center text-chamber-muted">
            <Compass className="w-10 h-10 text-amber-400/90 animate-spin [animation-duration:15s]" />
          </div>
        </div>

        {/* Large 404 Headline */}
        <h1 className="text-4xl sm:text-5xl font-black font-serif text-chamber-text tracking-tight mb-2">
          404
        </h1>

        <h2 className="text-lg sm:text-xl font-semibold text-chamber-text mb-3">
          {t('notFound.title')}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-chamber-muted max-w-sm mx-auto leading-relaxed mb-8">
          {t('notFound.subtitle')}
        </p>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white font-medium text-xs shadow-md shadow-[#7C3AED]/25 transition-all hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            <span>{t('notFound.returnHome')}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/debate')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-chamber-surfaceAlt hover:bg-white/[0.08] border border-chamber-border text-chamber-text font-medium text-xs transition-all hover:-translate-y-0.5"
          >
            <Swords className="w-4 h-4 text-[#22D3EE]" />
            <span>{t('notFound.startDebate')}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/history')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-chamber-muted hover:text-chamber-text text-xs transition-colors"
          >
            <History className="w-4 h-4" />
            <span>{t('notFound.viewHistory')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
