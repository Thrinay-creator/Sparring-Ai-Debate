import React, { useState } from 'react';
import { Compass, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '../../i18n';

export default function TopicExplorer({ onStartDebateWithTopic }) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', 'TECHNOLOGY', 'SOCIETY', 'EDUCATION', 'BUSINESS', 'ETHICS'];

  const topics = [
    {
      title: "AI will create more jobs than it displaces.",
      category: "TECHNOLOGY",
      complexity: "HIGH",
      rounds: "6 ROUNDS",
      tag: "AUTOMATION & LABOR"
    },
    {
      title: "Remote work should remain the default model for knowledge workers.",
      category: "BUSINESS",
      complexity: "BALANCED",
      rounds: "6 ROUNDS",
      tag: "FUTURE OF WORK"
    },
    {
      title: "Social media does more psychological harm than social good.",
      category: "SOCIETY",
      complexity: "SHARP",
      rounds: "6 ROUNDS",
      tag: "DIGITAL WELLBEING"
    },
    {
      title: "College degrees are becoming obsolete in the technological era.",
      category: "EDUCATION",
      complexity: "BALANCED",
      rounds: "6 ROUNDS",
      tag: "HIGHER EDUCATION"
    },
    {
      title: "Universal Basic Income is necessary in an automated economy.",
      category: "ETHICS",
      complexity: "HIGH",
      rounds: "6 ROUNDS",
      tag: "ECONOMIC JUSTICE"
    },
    {
      title: "Space exploration deserves greater public funding than climate mitigation.",
      category: "TECHNOLOGY",
      complexity: "SHARP",
      rounds: "6 ROUNDS",
      tag: "AEROSPACE & SCIENCE"
    }
  ];

  const filteredTopics = activeCategory === 'ALL'
    ? topics
    : topics.filter((t) => t.category === activeCategory);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" id="topics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-widest text-[#A1A1AA] mb-4">
            <Compass className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>{t('landing.topics.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F7]">
            {t('landing.topics.title')}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#A1A1AA]">
            {t('landing.topics.subtitle')}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeCategory === cat
                  ? 'bg-white/[0.1] text-white border border-white/[0.2] font-semibold'
                  : 'bg-white/[0.02] text-[#71717A] hover:text-[#A1A1AA] border border-white/[0.05]'
              }`}
            >
              {cat === 'ALL' ? t('landing.topics.all') : cat}
            </button>
          ))}
        </div>

        {/* Topics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic, idx) => (
            <div
              key={idx}
              onClick={() => onStartDebateWithTopic(topic.title)}
              className="p-6 rounded-2xl bg-[#09090D] border border-white/[0.07] hover:border-[#7C3AED]/40 hover:bg-gradient-to-b hover:from-white/[0.03] hover:to-purple-950/10 transition-all duration-300 group cursor-pointer flex flex-col justify-between arena-glass"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#A78BFA] bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                    {topic.category}
                  </span>
                  <span className="font-mono text-[10px] text-[#71717A]">
                    {topic.complexity} INTENSITY
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#F5F5F7] group-hover:text-white transition-colors leading-snug mb-3">
                  "{topic.title}"
                </h3>

                <span className="font-mono text-[11px] text-[#71717A] block mb-6">
                  {topic.tag}
                </span>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#A1A1AA] group-hover:text-[#22D3EE] transition-colors">
                <span>{t('landing.topics.challengeMotion')}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
