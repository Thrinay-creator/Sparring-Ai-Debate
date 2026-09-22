import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldAlert, Cpu, User, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';

export default function HeroDebateVisual() {
  const [activeTab, setActiveTab] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const debateRounds = [
    {
      motion: "Should artificial intelligence replace traditional education?",
      userStance: "FOR",
      aiStance: "AGAINST",
      userArg: "AI can personalize education at a scale human teachers cannot, adapting to individual pacing and removing socioeconomic barriers.",
      aiCounter: "Personalization alone doesn't guarantee understanding. Human teachers provide contextual empathy, moral reasoning, and collaborative social dynamics that software cannot replicate.",
      metrics: { strength: 86, evidence: 78, rebuttal: 91 },
      status: "AI COUNTER-ARGUMENT VERIFIED"
    },
    {
      motion: "Should companies adopt a mandatory 4-day workweek?",
      userStance: "FOR",
      aiStance: "AGAINST",
      userArg: "Compressed schedules boost focused productivity, reduce chronic burnout, and measurably elevate employee retention rates.",
      aiCounter: "While knowledge sectors benefit, service economies face severe coverage shortfalls. Without matching productivity gains, labor costs rise and service access diminishes.",
      metrics: { strength: 89, evidence: 82, rebuttal: 88 },
      status: "AI REBUTTAL SYNTHESIZED"
    }
  ];

  const currentRound = debateRounds[activeTab];

  // Subtle typing effect for AI counterpoint
  useEffect(() => {
    setTypedChars(0);
    setIsTyping(true);
    const fullText = currentRound.aiCounter;
    let idx = 0;
    const interval = setInterval(() => {
      idx += 2;
      if (idx >= fullText.length) {
        setTypedChars(fullText.length);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setTypedChars(idx);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [activeTab, currentRound.aiCounter]);

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl p-px bg-gradient-to-b from-white/[0.14] via-white/[0.05] to-transparent shadow-2xl shadow-purple-950/20 group">
      {/* Ambient background glow behind card */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-[#7C3AED]/20 to-[#22D3EE]/15 rounded-3xl blur-xl opacity-75 -z-10 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Main Card */}
      <div className="w-full bg-[#09090D] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-xl hero-debate-card">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/[0.07] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
              <span className="text-[#F5F5F7] font-semibold">SPARRING</span>
              <span className="text-[#52525B]">/</span>
              <span>LIVE DEBATE</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[10px] font-mono text-[#22D3EE]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-ping" />
              <span>ROUND 01 / 06</span>
            </div>

            {/* Switch tabs to demo another debate */}
            <div className="hidden sm:flex items-center bg-white/[0.04] p-0.5 rounded-md border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setActiveTab(0)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  activeTab === 0 ? 'bg-[#7C3AED] text-white' : 'text-[#71717A] hover:text-[#A1A1AA]'
                }`}
              >
                M-01
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(1)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  activeTab === 1 ? 'bg-[#7C3AED] text-white' : 'text-[#71717A] hover:text-[#A1A1AA]'
                }`}
              >
                M-02
              </button>
            </div>
          </div>
        </div>

        {/* Motion Banner */}
        <div className="px-5 py-3 bg-gradient-to-r from-white/[0.02] via-[#7C3AED]/[0.04] to-transparent border-b border-white/[0.06]">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#71717A] block mb-1">
            CURRENT MOTION
          </span>
          <h4 className="text-sm sm:text-base font-medium text-[#F5F5F7] tracking-tight">
            "{currentRound.motion}"
          </h4>
        </div>

        {/* Debate Exchange Arena */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* User Argument */}
          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.07] hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#22D3EE]/15 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE]">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-[11px] font-bold text-[#F5F5F7] tracking-wide">
                  YOU
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-400 border border-cyan-800/50">
                  {currentRound.userStance}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#71717A]">OPENING ARGUMENT</span>
            </div>
            <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed pl-8">
              "{currentRound.userArg}"
            </p>
          </div>

          {/* Versus Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
            <div className="relative px-3 py-0.5 rounded-full bg-[#0D0D12] border border-white/[0.12] text-[10px] font-mono font-bold tracking-widest text-[#A1A1AA] shadow-sm">
              VS
            </div>
          </div>

          {/* AI Rebuttal */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#7C3AED]/[0.08] to-transparent border border-[#7C3AED]/30 shadow-lg shadow-purple-950/30 transition-all duration-300 hero-debate-ai-bubble">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#A78BFA]">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-[11px] font-bold text-[#F5F5F7] tracking-wide">
                  SPARRING AI
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/50">
                  {currentRound.aiStance}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#A78BFA] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#A78BFA]" />
                RUTHLESS TIER
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#F5F5F7] leading-relaxed pl-8 font-normal">
              "{currentRound.aiCounter.slice(0, typedChars)}"
              {isTyping && <span className="inline-block w-1.5 h-3.5 bg-[#A78BFA] ml-0.5 animate-pulse" />}
            </p>
          </div>
        </div>

        {/* Real-time Diagnostics Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-black/40 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 sm:gap-6 text-xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-[#71717A]">
                <span>ARGUMENT STRENGTH</span>
                <span className="text-[#22D3EE] font-bold">{currentRound.metrics.strength}%</span>
              </div>
              <div className="w-20 sm:w-28 h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] rounded-full transition-all duration-700"
                  style={{ width: `${currentRound.metrics.strength}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-[#71717A]">
                <span>EVIDENCE</span>
                <span className="text-[#A78BFA] font-bold">{currentRound.metrics.evidence}%</span>
              </div>
              <div className="w-16 sm:w-24 h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] rounded-full transition-all duration-700"
                  style={{ width: `${currentRound.metrics.evidence}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-[#71717A]">
                <span>REBUTTAL</span>
                <span className="text-emerald-400 font-bold">{currentRound.metrics.rebuttal}%</span>
              </div>
              <div className="w-16 sm:w-24 h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${currentRound.metrics.rebuttal}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#22D3EE]">
            <Activity className="w-3.5 h-3.5 text-[#22D3EE] animate-pulse" />
            <span>{currentRound.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
