import React, { useState } from 'react';
import { Mic, Volume2, VolumeX, Sparkles, Activity, Play, Radio } from 'lucide-react';

export default function VoiceSection({ speech }) {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const voiceSpeed = speech?.voiceSpeed || 1.0;

  const handleSpeedChange = (speed) => {
    if (speech?.setVoiceSpeed) {
      speech.setVoiceSpeed(speed);
    }
  };

  const handleTestVoice = () => {
    if (speech?.speakAIResponse) {
      setIsPlayingDemo(true);
      speech.speakAIResponse("Welcome to the Sparring chamber. State your motion and defend your premises.");
      setTimeout(() => setIsPlayingDemo(false), 3800);
    }
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" id="voice">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-widest text-[#A1A1AA] mb-4">
            <Radio className="w-3.5 h-3.5 text-[#22D3EE] animate-pulse" />
            <span>REAL-TIME VOICE ARENA</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F7]">
            "Speak your argument."
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#A1A1AA]">
            Debate naturally with voice input and AI voice responses.
          </p>
        </div>

        {/* Voice Console Card */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-[#09090D] border border-white/[0.1] p-6 sm:p-10 shadow-2xl shadow-purple-950/20 arena-glass">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#F5F5F7] font-semibold">
                VOICE STUDIO / LIVE
              </span>
            </div>

            <div className="font-mono text-xs text-[#22D3EE] bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/50">
              SESSION: 00:24
            </div>
          </div>

          {/* Central Microphone & Waveform Visualizer */}
          <div className="py-10 flex flex-col items-center justify-center text-center">
            {/* Pulsing Mic Ring */}
            <div className="relative mb-6">
              <div className={`absolute -inset-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] opacity-30 blur-lg transition-all ${
                isPlayingDemo ? 'animate-ping' : 'animate-pulse'
              }`} />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#6366F1] flex items-center justify-center text-white shadow-xl shadow-[#7C3AED]/40">
                <Mic className="w-8 h-8 text-white" />
              </div>
            </div>

            <span className="font-mono text-xs text-[#22D3EE] uppercase tracking-wider mb-2">
              {isPlayingDemo ? "AI IS VOCALIZING REBUTTAL..." : "LISTENING TO DEBATER..."}
            </span>

            {/* Audio Waveform Bars */}
            <div className="flex items-center justify-center gap-1.5 h-10 my-4">
              {[40, 75, 55, 90, 65, 80, 50, 95, 70, 85, 45, 60, 90, 75, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-[#7C3AED] to-[#22D3EE] rounded-full transition-all duration-300"
                  style={{
                    height: isPlayingDemo ? `${h}%` : `${Math.max(15, (h * 0.4))}%`,
                    animation: isPlayingDemo ? `pulse 0.8s ease-in-out infinite ${i * 0.05}s` : 'none'
                  }}
                />
              ))}
            </div>

            <p className="text-xs sm:text-sm text-[#A1A1AA] italic max-w-md">
              "Your argument is being analyzed in real-time. The AI opponent evaluates premises before replying with natural voice."
            </p>
          </div>

          {/* Controls Bar */}
          <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            {/* Speed Selector */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#71717A] uppercase">SPEED:</span>
              <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.08]">
                {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                      voiceSpeed === speed
                        ? 'bg-[#7C3AED] text-white font-bold shadow-sm'
                        : 'text-[#A1A1AA] hover:text-[#F5F5F7]'
                    }`}
                  >
                    {speed}×
                  </button>
                ))}
              </div>
            </div>

            {/* Test Voice Audio CTA */}
            <div className="flex items-center gap-3">
              {speech?.toggleMute && (
                <button
                  type="button"
                  onClick={speech.toggleMute}
                  className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#A1A1AA] hover:text-[#F5F5F7] transition-colors"
                  title={speech.isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
                >
                  {speech.isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}

              <button
                type="button"
                onClick={handleTestVoice}
                disabled={isPlayingDemo}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-[#F5F5F7] transition-all hover:-translate-y-0.5"
              >
                <Play className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>{isPlayingDemo ? "Playing Audio..." : "Test AI Voice Audio"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
