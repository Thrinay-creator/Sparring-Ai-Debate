import React from 'react';
import { Swords, Github, ExternalLink, Globe2 } from 'lucide-react';

export default function Footer({ onStartDebating, onNavigate }) {
  return (
    <footer className="relative border-t border-white/[0.08] bg-[#050507] py-16 text-xs text-[#71717A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#6366F1] p-0.5 shadow-sm">
                <div className="w-full h-full bg-[#08080B] rounded-[5px] flex items-center justify-center">
                  <Swords className="w-3.5 h-3.5 text-[#A78BFA]" />
                </div>
              </div>
              <span className="font-serif text-lg font-black tracking-tight text-[#F5F5F7]">
                SPARRING
              </span>
            </div>

            <p className="text-sm text-[#A1A1AA] max-w-sm leading-relaxed">
              "Think sharper. Debate smarter." An adversarial AI platform built to stress-test your logic, detect fallacies, and sharpen intellectual clarity.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com/Thrinay-creator/Sparring-Ai-Debate"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-[#A1A1AA] hover:text-[#F5F5F7] transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">GitHub</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#F5F5F7]">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onStartDebating}
                  className="hover:text-[#F5F5F7] transition-colors"
                >
                  Debate Arena
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#F5F5F7] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#intelligence" className="hover:text-[#F5F5F7] transition-colors">
                  Debate Intelligence
                </a>
              </li>
              <li>
                <a href="#voice" className="hover:text-[#F5F5F7] transition-colors">
                  Voice Synthesis
                </a>
              </li>
              <li>
                <a href="#topics" className="hover:text-[#F5F5F7] transition-colors">
                  Curated Motions
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#F5F5F7]">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-[#F5F5F7] transition-colors">
                  Philosophy
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Thrinay-creator/Sparring-Ai-Debate#readme"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#F5F5F7] transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/history')}
                  className="hover:text-[#F5F5F7] transition-colors"
                >
                  Debate Logs
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / System */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#F5F5F7]">
              System
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-[#A1A1AA]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>AI Gateway: Online</span>
              </li>
              <li>
                <span className="text-[#71717A]">Gemini / Groq Failover</span>
              </li>
              <li>
                <span className="text-[#71717A]">Multi-Language Ready</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <span>© 2026 Sparring. Built for intellectual rigor.</span>
          <div className="flex items-center gap-6">
            <span className="text-[#52525B]">Privacy Focused</span>
            <span className="text-[#52525B]">Zero Data Training</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
