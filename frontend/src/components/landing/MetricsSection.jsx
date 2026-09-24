import React from 'react';
import { Activity, ShieldCheck, CheckCircle2, TrendingUp, AlertTriangle, Layers } from 'lucide-react';
import { useLanguage } from '../../i18n';

export default function MetricsSection() {
  const { t } = useLanguage();

  const metrics = [
    {
      label: t('landing.metrics.dim1Label'),
      score: 87,
      desc: t('landing.metrics.dim1Desc'),
      color: "from-[#7C3AED] to-[#8B5CF6]",
      textCol: "text-[#A78BFA]"
    },
    {
      label: t('landing.metrics.dim2Label'),
      score: 82,
      desc: t('landing.metrics.dim2Desc'),
      color: "from-[#6366F1] to-[#7C3AED]",
      textCol: "text-[#818CF8]"
    },
    {
      label: t('landing.metrics.dim3Label'),
      score: 76,
      desc: t('landing.metrics.dim3Desc'),
      color: "from-[#22D3EE] to-[#0284C7]",
      textCol: "text-[#22D3EE]"
    },
    {
      label: t('landing.metrics.dim4Label'),
      score: 91,
      desc: t('landing.metrics.dim4Desc'),
      color: "from-emerald-400 to-teal-500",
      textCol: "text-emerald-400"
    },
    {
      label: t('landing.metrics.dim5Label'),
      score: 84,
      desc: t('landing.metrics.dim5Desc'),
      color: "from-amber-400 to-orange-500",
      textCol: "text-amber-400"
    }
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-white/[0.01] border-y border-white/[0.06]" id="intelligence">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-widest text-[#A1A1AA] mb-4">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('landing.metrics.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F7]">
            {t('landing.metrics.title')}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#A1A1AA]">
            {t('landing.metrics.subtitle')}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#09090D] border border-white/[0.07] hover:border-white/[0.16] transition-all duration-300 hover:-translate-y-1 arena-glass flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] font-bold tracking-wider text-[#A1A1AA]">
                    {item.label}
                  </span>
                  <span className={`font-mono text-2xl font-black ${item.textCol}`}>
                    {item.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                <span>{t('landing.metrics.pass')}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>
          ))}

          {/* 6th Card: Automated Fallacy Radar */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7C3AED]/[0.08] to-transparent border border-[#7C3AED]/30 shadow-xl shadow-purple-950/20 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] font-bold tracking-wider text-[#F5F5F7] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#A78BFA]" />
                  <span>{t('landing.metrics.fallacyRadar')}</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                  REAL-TIME
                </span>
              </div>

              <p className="text-xs text-[#D4D4D8] leading-relaxed mb-4">
                {t('landing.metrics.fallacyDesc')}
              </p>

              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#A1A1AA]">STRAWMAN</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#A1A1AA]">SLIPPERY SLOPE</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#A1A1AA]">FALSE DILEMMA</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#A1A1AA]">RED HERRING</span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-[#A78BFA]">
              <span>ACTIVE GUARDIAN</span>
              <span>10 / 10 PATTERNS</span>
            </div>
          </div>
        </div>

        {/* Disclaimer / Technical Transparency */}
        <p className="mt-8 text-center text-[11px] font-mono text-[#52525B]">
          * Metrics are algorithmic scores computed by the Sparring debate engine to guide rhetorical practice, not clinical diagnostic tests.
        </p>
      </div>
    </section>
  );
}
