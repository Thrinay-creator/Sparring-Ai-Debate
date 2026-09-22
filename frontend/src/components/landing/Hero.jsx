import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Terminal, Sparkles, Command } from 'lucide-react';
import HeroDebateVisual from './HeroDebateVisual';

export default function Hero({ onStartDebating, onExploreHowItWorks }) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Background ambient radial glow & light beams */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#7C3AED]/20 via-[#6366F1]/15 to-[#22D3EE]/10 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] shadow-sm mb-6 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] shadow-sm shadow-[#7C3AED]" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#A1A1AA]">
            AI-POWERED DEBATE ARENA
          </span>
          <span className="text-[#52525B]">/</span>
          <span className="font-mono text-[10px] uppercase text-[#22D3EE] font-medium">
            GEN 3.5
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F5F5F7] max-w-4xl mx-auto leading-[1.08] sm:leading-[1.05] uppercase">
          THINK SHARPER.
          <br />
          <span className="bg-gradient-to-r from-[#F5F5F7] via-[#A78BFA] to-[#6366F1] bg-clip-text text-transparent">
            DEBATE SMARTER.
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed font-normal">
          Challenge your assumptions, sharpen your arguments, and test your reasoning against an AI that argues back.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <button
            type="button"
            onClick={onStartDebating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white font-medium text-sm shadow-lg shadow-[#7C3AED]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#7C3AED]/40 hover:-translate-y-0.5 active:translate-y-0 group"
          >
            <span>Start a Debate</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={onExploreHowItWorks}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.15] text-[#F5F5F7] font-medium text-sm transition-all duration-300 hover:-translate-y-0.5"
          >
            <Play className="w-3.5 h-3.5 text-[#22D3EE] fill-[#22D3EE]/20" />
            <span>See How It Works</span>
          </button>
        </div>

        {/* Subtle Keyboard Hint */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#71717A] font-mono">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[11px] text-[#A1A1AA] font-mono">
            {isMac ? '⌘' : 'Ctrl'}
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[11px] text-[#A1A1AA] font-mono">
            K
          </kbd>
          <span>to launch arena</span>
        </div>

        {/* Hero Interactive Debate Visual */}
        <div className="mt-14 sm:mt-18">
          <HeroDebateVisual />
        </div>
      </div>
    </section>
  );
}
