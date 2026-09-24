import React from 'react';
import { History, Award, CheckCircle, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../i18n';

export default function DebateHistorySection({ onNavigate, isAuthenticated }) {
  const { t } = useLanguage();

  const sampleDebates = [
    {
      topic: "AI & Higher Education",
      stance: t('debate.against') || "AGAINST",
      rounds: "8 ROUNDS",
      metricName: t('landing.visual.strength'),
      metricValue: "86%",
      timeAgo: t('landing.history.daysAgo', { count: 2 }),
      fallaciesFound: t('landing.history.fallaciesFound'),
      verdict: t('landing.history.strongDefense')
    },
    {
      topic: "Social Media Age Restraints",
      stance: t('debate.for') || "FOR",
      rounds: "6 ROUNDS",
      metricName: t('landing.visual.rebuttal'),
      metricValue: "91%",
      timeAgo: t('landing.history.daysAgo', { count: 5 }),
      fallaciesFound: t('landing.history.fallacyFlagged'),
      verdict: t('landing.history.masterClass')
    },
    {
      topic: "Remote Work & Global Labor",
      stance: t('debate.for') || "FOR",
      rounds: "6 ROUNDS",
      metricName: t('landing.visual.evidence'),
      metricValue: "82%",
      timeAgo: t('landing.history.weekAgo'),
      fallaciesFound: t('landing.history.fallaciesFound'),
      verdict: t('landing.history.resilient')
    }
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-white/[0.01] border-y border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-widest text-[#A1A1AA] mb-4">
              <History className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>{t('landing.history.badge')}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F7]">
              {t('landing.history.title')}
            </h2>

            <p className="mt-3 text-base text-[#A1A1AA]">
              {t('landing.history.subtitle')}
            </p>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => onNavigate('/history')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-[#22D3EE] transition-all hover:-translate-y-0.5"
            >
              <span>{t('landing.history.viewLiveHistory')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="font-mono text-xs text-[#71717A]">
              {t('landing.history.sampleLogs')}
            </span>
          )}
        </div>

        {/* History Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleDebates.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#09090D] border border-white/[0.07] hover:border-white/[0.15] transition-all duration-300 arena-glass flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase text-[#71717A] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.timeAgo}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                    {item.rounds}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#F5F5F7] mb-2">
                  {item.topic}
                </h3>

                <div className="flex items-center gap-2 mb-6">
                  <span className="font-mono text-[11px] text-[#A1A1AA]">STANCE: {item.stance}</span>
                  <span className="text-[#52525B]">·</span>
                  <span className="font-mono text-[11px] text-emerald-400">{item.verdict}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#71717A] block">
                    {item.metricName}
                  </span>
                  <span className="font-mono text-xl font-bold text-[#F5F5F7]">
                    {item.metricValue}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono text-[10px] uppercase text-[#71717A] block">
                    FALLACIES
                  </span>
                  <span className="font-mono text-xs text-[#A1A1AA]">
                    {item.fallaciesFound}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
