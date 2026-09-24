import React, { useState, useEffect } from 'react';
import { Swords, Sparkles, Cpu, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n';

export default function LoadingPage({ message, subtitle, showTips = true }) {
  const { t } = useLanguage();
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    t('loading.tip1'),
    t('loading.tip2'),
    t('loading.tip3')
  ];

  useEffect(() => {
    if (!showTips || tips.length <= 1) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [showTips, tips.length]);

  return (
    <div className="min-h-screen bg-chamber-bg text-chamber-text font-sans antialiased flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[#7C3AED]/20 via-[#6366F1]/15 to-[#22D3EE]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main loading card */}
      <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-chamber-surface/80 border border-chamber-border/80 shadow-2xl backdrop-blur-xl text-center relative arena-glass">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] shadow-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-ping" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-chamber-muted">
            {t('loading.badge')}
          </span>
        </div>

        {/* Pulsing Central Icon */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          {/* Outer rotating pulse ring */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#6366F1] to-[#22D3EE] p-0.5 animate-spin [animation-duration:3s]">
            <div className="w-full h-full bg-chamber-bg rounded-[14px]" />
          </div>

          {/* Inner core */}
          <div className="absolute inset-1.5 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6366F1] flex items-center justify-center text-white shadow-lg shadow-[#7C3AED]/40">
            <Swords className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-chamber-text tracking-tight mb-2">
          {message || t('loading.title')}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-chamber-muted leading-relaxed mb-6">
          {subtitle || t('loading.subtitle')}
        </p>

        {/* Progress Bar Animation */}
        <div className="w-full h-1.5 bg-chamber-surfaceAlt rounded-full overflow-hidden mb-6 border border-chamber-border/50">
          <div className="h-full bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#22D3EE] rounded-full animate-indeterminate-bar" />
        </div>

        {/* Rotating Cognitive Tip */}
        {showTips && (
          <div className="pt-4 border-t border-chamber-border/60 min-h-[50px] flex items-center justify-center">
            <p className="text-[11px] text-chamber-muted/90 italic font-mono transition-opacity duration-300">
              "{tips[tipIndex]}"
            </p>
          </div>
        )}
      </div>

      {/* Brand Watermark */}
      <div className="mt-8 flex items-center gap-2 font-mono text-[11px] text-chamber-muted/60 uppercase tracking-widest">
        <span>SPARRING</span>
        <span>•</span>
        <span>AI DEBATE ARENA</span>
      </div>
    </div>
  );
}
