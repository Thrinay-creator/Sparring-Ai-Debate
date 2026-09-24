import React from 'react';
import { Eye, Shield, Award, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n';

export default function ProductDifferentiation() {
  const { t } = useLanguage();

  const cards = [
    {
      step: "01",
      title: t('landing.differentiation.step1Title'),
      subtitle: t('landing.differentiation.step1Sub'),
      desc: t('landing.differentiation.step1Desc'),
      icon: Eye,
      gradient: "from-[#7C3AED]/20 to-transparent",
      accent: "text-[#A78BFA]",
      border: "hover:border-[#7C3AED]/50"
    },
    {
      step: "02",
      title: t('landing.differentiation.step2Title'),
      subtitle: t('landing.differentiation.step2Sub'),
      desc: t('landing.differentiation.step2Desc'),
      icon: Shield,
      gradient: "from-[#6366F1]/20 to-transparent",
      accent: "text-[#818CF8]",
      border: "hover:border-[#6366F1]/50"
    },
    {
      step: "03",
      title: t('landing.differentiation.step3Title'),
      subtitle: t('landing.differentiation.step3Sub'),
      desc: t('landing.differentiation.step3Desc'),
      icon: Award,
      gradient: "from-[#22D3EE]/20 to-transparent",
      accent: "text-[#22D3EE]",
      border: "hover:border-[#22D3EE]/50"
    }
  ];

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-widest text-[#A1A1AA] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>{t('landing.differentiation.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F5F7] leading-tight">
            {t('landing.differentiation.titleLine1')}
            <br />
            <span className="bg-gradient-to-r from-[#F5F5F7] via-[#A78BFA] to-[#6366F1] bg-clip-text text-transparent">
              {t('landing.differentiation.titleLine2')}
            </span>
          </h2>
        </div>

        {/* 3 Large Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className={`relative p-8 rounded-3xl bg-[#09090D] border border-white/[0.08] ${c.border} transition-all duration-300 group flex flex-col justify-between arena-glass hover:-translate-y-1.5`}
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#71717A]">
                      PHASE {c.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#A1A1AA] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className={`text-2xl font-black font-mono tracking-tight ${c.accent} mb-2`}>
                    {c.title}
                  </h3>

                  <h4 className="text-base font-semibold text-[#F5F5F7] mb-4">
                    {c.subtitle}
                  </h4>

                  <p className="text-sm text-[#A1A1AA] leading-relaxed">
                    {c.desc}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs text-[#71717A] group-hover:text-[#F5F5F7] transition-colors">
                  <span>{t('landing.differentiation.systemCapability')}</span>
                  <span>{t('landing.differentiation.active')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
