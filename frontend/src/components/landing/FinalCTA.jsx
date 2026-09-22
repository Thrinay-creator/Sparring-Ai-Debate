import React from 'react';
import { ArrowRight, Swords, Sparkles } from 'lucide-react';

export default function FinalCTA({ onStartDebating }) {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      {/* Background radial spotlight glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#7C3AED]/20 via-[#6366F1]/15 to-[#22D3EE]/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle emblem */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#6366F1] p-0.5 mx-auto mb-8 shadow-xl shadow-[#7C3AED]/30">
          <div className="w-full h-full bg-[#08080B] rounded-[14px] flex items-center justify-center">
            <Swords className="w-6 h-6 text-[#A78BFA]" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F5F7] leading-tight">
          "Your next argument starts here."
        </h2>

        <p className="mt-5 text-base sm:text-lg text-[#A1A1AA] max-w-xl mx-auto">
          Choose a motion. Take a side. See how well you can defend it.
        </p>

        <div className="mt-10">
          <button
            type="button"
            onClick={onStartDebating}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white font-medium text-sm shadow-xl shadow-[#7C3AED]/35 transition-all duration-300 hover:shadow-2xl hover:shadow-[#7C3AED]/50 hover:-translate-y-1 active:translate-y-0 group"
          >
            <span>START YOUR FIRST DEBATE</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </div>

        <p className="mt-5 text-xs font-mono text-[#71717A]">
          No setup required. Instant AI sparring in your browser.
        </p>
      </div>
    </section>
  );
}
