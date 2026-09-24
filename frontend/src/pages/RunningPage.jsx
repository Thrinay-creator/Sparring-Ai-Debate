import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, CheckCircle2, Cpu, ArrowRight, XCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n';

export default function RunningPage({ session, onCancel }) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    t('running.step1'),
    t('running.step2'),
    t('running.step3'),
    t('running.step4')
  ];

  // Advance steps sequentially to give a clear sense of live computation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [steps.length]);

  const roundsCount = session?.transcript?.length ? Math.ceil(session.transcript.length / 2) : 1;

  return (
    <div className="min-h-screen bg-chamber-bg text-chamber-text font-sans antialiased flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#7C3AED]/20 via-[#6366F1]/15 to-[#22D3EE]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main card */}
      <div className="w-full max-w-xl p-6 sm:p-10 rounded-2xl bg-chamber-surface/85 border border-chamber-border/80 shadow-2xl backdrop-blur-xl relative arena-glass">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-6 border-b border-chamber-border/70 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-[#A78BFA] text-[11px] font-mono uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 animate-pulse text-[#22D3EE]" />
            <span>{t('running.badge')}</span>
          </div>

          <div className="font-mono text-xs text-chamber-muted">
            {t('running.completedTurns', { count: roundsCount })}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#6366F1] p-0.5 mx-auto mb-4 shadow-lg shadow-[#7C3AED]/30">
            <div className="w-full h-full bg-chamber-bg rounded-[14px] flex items-center justify-center">
              <Cpu className="w-7 h-7 text-[#A78BFA] animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-chamber-text tracking-tight mb-2">
            {t('running.title')}
          </h2>
          <p className="text-xs sm:text-sm text-chamber-muted max-w-md mx-auto leading-relaxed">
            {t('running.subtitle')}
          </p>
        </div>

        {/* Motion Banner */}
        {session?.topic && (
          <div className="p-3.5 rounded-xl bg-chamber-surfaceAlt border border-chamber-border/60 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-wider text-chamber-muted block mb-1">
              {t('running.motion')}
            </span>
            <p className="text-xs sm:text-sm font-medium text-chamber-text leading-snug line-clamp-2">
              "{session.topic}"
            </p>
          </div>
        )}

        {/* Steps Progress List */}
        <div className="space-y-3 mb-8">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border transition-all flex items-center gap-3 ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                    : isCurrent
                    ? 'bg-[#7C3AED]/10 border-[#7C3AED]/40 text-chamber-text shadow-sm'
                    : 'bg-chamber-surfaceAlt/40 border-chamber-border/40 text-chamber-muted/60 opacity-60'
                }`}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-3.5 h-3.5 border-2 border-[#22D3EE] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-chamber-border" />
                  )}
                </div>

                <span className="text-xs font-mono flex-1">
                  {step}
                </span>

                {isCurrent && (
                  <span className="text-[10px] font-mono text-[#22D3EE] uppercase tracking-wider animate-pulse">
                    RUNNING
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Status & Optional Cancel */}
        <div className="pt-4 border-t border-chamber-border/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[11px] font-mono text-chamber-muted italic">
            {t('running.pleaseWait')}
          </span>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-[11px] font-mono text-chamber-muted hover:text-red-400 transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>{t('running.cancelDebate')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
