import React from 'react';
import { Award, CheckCircle, RefreshCw, Settings } from 'lucide-react';
import { useLanguage } from '../../i18n';

export default function ScoreCard({ session, feedback, onNewDebate, onOpenSettings }) {
  const { t } = useLanguage();
  const overall = feedback?.overallScore ?? 75;
  const rounds = session?.transcript ? session.transcript.filter(t => t.role === 'user').length : 0;

  return (
    <div className="bg-chamber-surface border border-chamber-border rounded-lg p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chamber-amber/10 border border-chamber-amber/30 text-xs font-semibold text-chamber-amber mb-2">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{t('summary.completeBadge')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-chamber-text font-bold">
            {session?.topic}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-chamber-muted mt-2 font-mono">
            <span>{t('setup.youStance')}: <strong className="text-chamber-user">{session?.userStance}</strong></span>
            <span>•</span>
            <span>{t('setup.opponentStance')}: <strong className="text-chamber-ai">{session?.aiStance}</strong></span>
            <span>•</span>
            <span>{t('round')}: <strong className="text-chamber-text">{rounds} {t('of')} 6</strong></span>
            <span>•</span>
            <span>{t('setup.difficultyLabel')}: <strong className="text-chamber-amber">{session?.difficulty}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="px-3 py-2.5 rounded-md bg-chamber-surface border border-chamber-border text-chamber-muted hover:text-chamber-text hover:border-slate-500 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-chamber-amber"
              title={t('settings.title')}
              aria-label={t('settings.title')}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{t('settings.title')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNewDebate}
            className="px-4 py-2.5 rounded-md bg-chamber-amber hover:bg-amber-500 text-[#11141A] font-semibold text-xs flex items-center gap-2 transition-colors shrink-0 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('summary.startNew')}</span>
          </button>
        </div>
      </div>

      {/* Prominent Overall Score Display */}
      <div className="p-6 rounded-lg bg-[#14181F] border border-chamber-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider font-semibold text-chamber-muted flex items-center gap-1.5">
            <Award className="w-4 h-4 text-chamber-amber" />
            <span>{t('summary.compositeProficiency')}</span>
          </div>
          <p className="text-xs text-chamber-muted max-w-md">
            {t('summary.compositeDesc')}
          </p>
        </div>

        <div className="flex items-baseline gap-2 shrink-0">
          <span className="text-5xl sm:text-6xl font-serif font-bold text-chamber-amber">
            {overall}
          </span>
          <span className="text-xl font-mono text-chamber-muted">
            / 100
          </span>
        </div>
      </div>
    </div>
  );
}
