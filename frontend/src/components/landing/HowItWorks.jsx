import React from 'react';
import { Target, Scale, Zap, BarChart2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n';

export default function HowItWorks({ onStartDebating }) {
  const { t } = useLanguage();

  const steps = [
    {
      num: "01",
      title: t('landing.howItWorks.step1Title'),
      desc: t('landing.howItWorks.step1Desc'),
      icon: Target,
      tag: t('landing.howItWorks.step1Tag'),
      accent: "from-[#7C3AED] to-[#8B5CF6]"
    },
    {
      num: "02",
      title: t('landing.howItWorks.step2Title'),
      desc: t('landing.howItWorks.step2Desc'),
      icon: Scale,
      tag: t('landing.howItWorks.step2Tag'),
      accent: "from-[#6366F1] to-[#7C3AED]"
    },
    {
      num: "03",
      title: t('landing.howItWorks.step3Title'),
      desc: t('landing.howItWorks.step3Desc'),
      icon: Zap,
      tag: t('landing.howItWorks.step3Tag'),
      accent: "from-[#22D3EE] to-[#0284C7]"
    },
    {
      num: "04",
      title: t('landing.howItWorks.step4Title'),
      desc: t('landing.howItWorks.step4Desc'),
      icon: BarChart2,
      tag: t('landing.howItWorks.step4Tag'),
      accent: "from-emerald-400 to-teal-500"
    }
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-white/[0.01] border-y border-white/[0.06]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-widest text-[#A1A1AA] mb-4">
            <Zap className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>{t('landing.howItWorks.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F7]">
            {t('landing.howItWorks.title')}
          </h2>

          <p className="mt-4 text-base text-[#A1A1AA]">
            {t('landing.howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-[#09090D] border border-white/[0.07] hover:border-white/[0.18] transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 arena-glass"
              >
                {/* Number & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-white/[0.15] group-hover:text-white/[0.3] transition-colors">
                      {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#A1A1AA] group-hover:text-[#F5F5F7] group-hover:border-[#7C3AED]/40 transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#71717A] block mb-1">
                    {step.tag}
                  </span>

                  <h3 className="text-base font-bold text-[#F5F5F7] tracking-tight mb-2.5">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Subtle indicator bar */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-[#52525B]">
                    {t('landing.howItWorks.stepLabel', { num: step.num })}
                  </span>
                  <div className="w-6 h-0.5 bg-gradient-to-r from-transparent to-white/[0.2] group-hover:to-[#7C3AED] transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Launch CTA */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onStartDebating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] text-xs font-mono text-[#F5F5F7] transition-all hover:-translate-y-0.5"
          >
            <span>{t('landing.howItWorks.selectFirstTopic')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#22D3EE]" />
          </button>
        </div>
      </div>
    </section>
  );
}
