import React from 'react';
import { MessageSquare, ArrowRight, ShieldCheck, XCircle, CheckCircle2, Flame } from 'lucide-react';

export default function ProblemSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-widest text-[#A1A1AA] mb-4">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>THE COGNITIVE PROBLEM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F7]">
            "Most AI conversations are too comfortable."
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
            AI usually answers your question. Sparring challenges your answer.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Left Card: Traditional AI */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.015] border border-white/[0.06] flex flex-col justify-between opacity-80 hover:opacity-95 transition-opacity duration-300">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-300">
                      Traditional AI Chat
                    </h3>
                    <span className="font-mono text-[10px] text-zinc-500 uppercase">
                      Passive Echo Chamber
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                  STANDARD
                </span>
              </div>

              {/* Steps */}
              <div className="space-y-4 my-8">
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <span className="w-5 h-5 rounded-full bg-zinc-800/80 border border-zinc-700 text-[10px] font-mono flex items-center justify-center text-zinc-400">
                    1
                  </span>
                  <span>You ask a question.</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <span className="w-5 h-5 rounded-full bg-zinc-800/80 border border-zinc-700 text-[10px] font-mono flex items-center justify-center text-zinc-400">
                    2
                  </span>
                  <span>AI generates an agreeable answer.</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-500 text-sm italic">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono flex items-center justify-center text-zinc-500">
                    3
                  </span>
                  <span>Conversation quietly ends.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <XCircle className="w-4 h-4 text-zinc-500" />
              <span>Result: Unchallenged assumptions & intellectual comfort</span>
            </div>
          </div>

          {/* Right Card: Sparring */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0E0E15] to-[#08080C] border border-[#7C3AED]/30 shadow-xl shadow-purple-950/20 flex flex-col justify-between group hover:border-[#7C3AED]/50 transition-all duration-300">
            {/* Glow accent */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#6366F1] flex items-center justify-center text-white shadow-md shadow-[#7C3AED]/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#F5F5F7]">
                      Sparring Arena
                    </h3>
                    <span className="font-mono text-[10px] text-[#A78BFA] uppercase">
                      Adversarial AI Opponent
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-700/50">
                  DIALECTIC
                </span>
              </div>

              {/* Steps */}
              <div className="space-y-4 my-8">
                <div className="flex items-center gap-3 text-[#F5F5F7] text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/50 text-[10px] font-mono flex items-center justify-center text-[#A78BFA]">
                    1
                  </span>
                  <span>You stake an intellectual claim.</span>
                </div>
                <div className="flex items-center gap-3 text-[#F5F5F7] text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/50 text-[10px] font-mono flex items-center justify-center text-[#A78BFA]">
                    2
                  </span>
                  <span>AI rigorously challenges your premises.</span>
                </div>
                <div className="flex items-center gap-3 text-[#F5F5F7] text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/50 text-[10px] font-mono flex items-center justify-center text-[#A78BFA]">
                    3
                  </span>
                  <span>You defend with evidence & rebuttal.</span>
                </div>
                <div className="flex items-center gap-3 text-[#F5F5F7] text-sm font-medium">
                  <span className="w-5 h-5 rounded-full bg-[#22D3EE]/20 border border-[#22D3EE]/50 text-[10px] font-mono flex items-center justify-center text-[#22D3EE]">
                    4
                  </span>
                  <span>AI counters & exposes logical fallacies.</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-300 text-sm font-semibold">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-[10px] font-mono flex items-center justify-center text-emerald-400">
                    5
                  </span>
                  <span>You improve your reasoning systematically.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Result: Sharp critical thinking, resilience & clarity</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
