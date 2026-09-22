import React, { useState } from 'react';
import { Send, Mic, Sparkles, User, Cpu, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function InteractiveDemo({ onStartDebateWithTopic }) {
  const [stance, setStance] = useState('FOR');
  const [argumentText, setArgumentText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exchangeList, setExchangeList] = useState([
    {
      role: 'user',
      text: "Free education would make higher education accessible to students regardless of socioeconomic background, accelerating social mobility and reducing inequality."
    },
    {
      role: 'ai',
      text: "Access is vital, but eliminating tuition shifts billions in operating expenses onto public tax revenues without guaranteeing completion rates. How would you fund faculty and research without diluting educational quality?",
      score: 84,
      fallacy: null
    }
  ]);

  const presetResponses = {
    FOR: [
      "Targeted progressive taxation on high corporate profits could cover costs while maintaining accreditation standards.",
      "Universal access pays for itself long-term through increased tax revenues from higher-earning graduates."
    ],
    AGAINST: [
      "Subsidizing degrees indiscriminately inflates credential requirements without addressing actual job market demands.",
      "Income-share agreements and vocational apprenticeships offer far better ROI than blanket tuition cancellation."
    ]
  };

  const handleSend = (textToSend) => {
    const text = textToSend || argumentText;
    if (!text.trim()) return;

    const newExchanges = [...exchangeList, { role: 'user', text }];
    setExchangeList(newExchanges);
    setArgumentText('');
    setIsProcessing(true);

    setTimeout(() => {
      let counter = stance === 'FOR'
        ? "While progressive taxation sounds ideal, public funding often leads to strict bureaucratic budget ceilings and freezes faculty hiring. What prevents universities from rationing student admissions?"
        : "Private markets also introduce predatory debt burdens that suppress entrepreneurship. Isn't a state-backed baseline more equitable than private risk?";

      setExchangeList([
        ...newExchanges,
        {
          role: 'ai',
          text: counter,
          score: 88,
          fallacy: null
        }
      ]);
      setIsProcessing(false);
    }, 750);
  };

  const handleStanceChange = (newStance) => {
    if (newStance === stance) return;
    setStance(newStance);
    setExchangeList(
      newStance === 'FOR'
        ? [
            {
              role: 'user',
              text: "Free education would make higher education accessible to students regardless of socioeconomic background."
            },
            {
              role: 'ai',
              text: "Access is important, but removing tuition doesn't remove the cost of delivering education. How would you propose funding that system without reducing quality?",
              score: 84,
              fallacy: null
            }
          ]
        : [
            {
              role: 'user',
              text: "Free college devalues degrees and forces taxpayers who did not attend college to subsidize those who earn more."
            },
            {
              role: 'ai',
              text: "That assumes education only benefits the graduate. A highly educated workforce elevates healthcare, infrastructure, and innovation for all taxpayers. Isn't that a worthwhile public investment?",
              score: 86,
              fallacy: null
            }
          ]
    );
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" id="debate-demo">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-widest text-[#A1A1AA] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>INTERACTIVE SIMULATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F7]">
            "See Sparring in action."
          </h2>

          <p className="mt-3 text-base text-[#A1A1AA]">
            Test your counter-rebuttals in this live interactive demo arena.
          </p>
        </div>

        {/* Demo Arena Frame */}
        <div className="rounded-2xl bg-[#09090D] border border-white/[0.1] shadow-2xl shadow-purple-950/20 overflow-hidden arena-glass">
          {/* Header Bar */}
          <div className="px-5 py-4 border-b border-white/[0.08] bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#71717A] block">
                TRIAL MOTION
              </span>
              <h3 className="text-sm sm:text-base font-semibold text-[#F5F5F7]">
                "Should college education be free?"
              </h3>
            </div>

            {/* Stance Selector */}
            <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.08]">
              <button
                type="button"
                onClick={() => handleStanceChange('FOR')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                  stance === 'FOR'
                    ? 'bg-cyan-500/20 text-[#22D3EE] border border-cyan-500/40 shadow-sm'
                    : 'text-[#71717A] hover:text-[#A1A1AA]'
                }`}
              >
                YOU ARE: FOR
              </button>
              <button
                type="button"
                onClick={() => handleStanceChange('AGAINST')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                  stance === 'AGAINST'
                    ? 'bg-purple-500/20 text-[#A78BFA] border border-purple-500/40 shadow-sm'
                    : 'text-[#71717A] hover:text-[#A1A1AA]'
                }`}
              >
                YOU ARE: AGAINST
              </button>
            </div>
          </div>

          {/* Transcript Scroll Area */}
          <div className="p-4 sm:p-6 space-y-4 max-h-[380px] overflow-y-auto">
            {exchangeList.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  item.role === 'user'
                    ? 'bg-white/[0.03] border border-white/[0.08] text-[#F5F5F7] ml-auto max-w-[90%]'
                    : 'bg-gradient-to-br from-[#7C3AED]/10 to-transparent border border-[#7C3AED]/30 text-[#F5F5F7] mr-auto max-w-[90%]'
                }`}
              >
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    {item.role === 'user' ? (
                      <>
                        <User className="w-3.5 h-3.5 text-[#22D3EE]" />
                        <span className="font-mono text-[11px] font-bold text-[#22D3EE]">YOU ({stance})</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="w-3.5 h-3.5 text-[#A78BFA]" />
                        <span className="font-mono text-[11px] font-bold text-[#A78BFA]">
                          SPARRING AI ({stance === 'FOR' ? 'AGAINST' : 'FOR'})
                        </span>
                      </>
                    )}
                  </div>
                  {item.score && (
                    <span className="font-mono text-[10px] text-emerald-400 font-medium">
                      EVALUATION SCORE: {item.score}%
                    </span>
                  )}
                </div>
                <p>{item.text}</p>
              </div>
            ))}

            {isProcessing && (
              <div className="p-4 rounded-xl bg-purple-950/20 border border-[#7C3AED]/30 text-xs font-mono text-[#A78BFA] flex items-center gap-2 animate-pulse">
                <Cpu className="w-4 h-4 animate-spin text-[#A78BFA]" />
                <span>AI adversary is dissecting your rebuttal and scanning for fallacies...</span>
              </div>
            )}
          </div>

          {/* Input & Quick Responses */}
          <div className="p-4 bg-white/[0.02] border-t border-white/[0.08] space-y-3">
            {/* Quick Argument Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="font-mono text-[10px] text-[#71717A] uppercase shrink-0">Try arguing:</span>
              {presetResponses[stance].map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleSend(preset)}
                  disabled={isProcessing}
                  className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-[#A1A1AA] hover:text-[#F5F5F7] text-[11px] truncate max-w-[260px] text-left transition-colors"
                >
                  "{preset.slice(0, 42)}..."
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={argumentText}
                onChange={(e) => setArgumentText(e.target.value)}
                placeholder="Type your rebuttal to the AI adversary..."
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs sm:text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED] transition-colors"
              />

              <button
                type="submit"
                disabled={!argumentText.trim() || isProcessing}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white font-medium text-xs shadow-md shadow-[#7C3AED]/20 hover:shadow-lg hover:shadow-[#7C3AED]/30 transition-all disabled:opacity-40"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Full Arena Switcher */}
          <div className="px-5 py-3 bg-black/50 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-[#71717A] font-mono text-[11px]">
              Ready for a full 6-round scored debate?
            </span>
            <button
              type="button"
              onClick={() => onStartDebateWithTopic("Should college education be free?")}
              className="inline-flex items-center gap-1 font-mono text-xs text-[#22D3EE] hover:underline"
            >
              <span>Launch Full Debate Chamber</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
