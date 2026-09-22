import React from 'react';
import { Cpu, Mic, Globe2, BarChart3, CheckCircle } from 'lucide-react';

export default function TrustStrip() {
  const capabilities = [
    {
      label: "REAL-TIME",
      title: "AI Debate Engine",
      desc: "Instant opposing arguments tailored to your stance",
      icon: Cpu,
      accent: "text-[#7C3AED]",
      bg: "bg-[#7C3AED]/10",
      border: "border-[#7C3AED]/20"
    },
    {
      label: "VOICE",
      title: "Live Speech & Audio",
      desc: "Speak naturally and listen to spoken AI rebuttals",
      icon: Mic,
      accent: "text-[#22D3EE]",
      bg: "bg-[#22D3EE]/10",
      border: "border-[#22D3EE]/20"
    },
    {
      label: "MULTILINGUAL",
      title: "English, Telugu, Hindi",
      desc: "Native debate reasoning across multiple languages",
      icon: Globe2,
      accent: "text-[#6366F1]",
      bg: "bg-[#6366F1]/10",
      border: "border-[#6366F1]/20"
    },
    {
      label: "ANALYTICS",
      title: "Fallacy & Logic Radar",
      desc: "Automated scoring across evidence, logic, and persuasion",
      icon: BarChart3,
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    }
  ];

  return (
    <section className="relative py-12 border-y border-white/[0.06] bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#71717A]">
            BUILT FOR PEOPLE WHO WANT TO THINK BETTER
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {capabilities.map((cap, i) => {
            const IconComponent = cap.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 arena-glass"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${cap.bg} ${cap.border} border flex items-center justify-center ${cap.accent}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#71717A] block">
                      {cap.label}
                    </span>
                    <h4 className="text-sm font-semibold text-[#F5F5F7]">
                      {cap.title}
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
