import React from 'react';
import { Globe, Volume2, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../i18n';

export default function LanguageSection({ speech }) {
  const { language, setLanguage } = useLanguage();

  const languageSamples = {
    en: {
      title: "English",
      native: "English",
      motion: "Should AI regulate financial trading?",
      argument: "Automated systems execute without emotional panic, mitigating flash crashes and human fraud.",
      counter: "Algorithms amplify systemic risks when identical models trigger simultaneous sell cascades without moral judgment.",
      audioSample: "Algorithms amplify systemic risks when identical models trigger simultaneous sell cascades without moral judgment."
    },
    te: {
      title: "Telugu",
      native: "తెలుగు",
      motion: "కృత్రిమ మేధస్సు విద్యారంగాన్ని మార్చగలదా?",
      argument: "AI విద్యార్థుల అవసరాలకు తగినట్లుగా వేగంగా వ్యక్తిగత బోధనను అందించగలదు.",
      counter: "సాంకేతికత ఎంత పెరిగినా, గురువు అందించే మానవీయ విలువలూ సామాజిక పరిజ్ఞానాన్ని AI పూర్తిగా భర్తీ చేయలేదు.",
      audioSample: "సాంకేతికత ఎంత పెరిగినా, గురువు అందించే మానవీయ విలువలూ సామాజిక పరిజ్ఞానాన్ని AI పూర్తిగా భర్తీ చేయలేదు."
    },
    hi: {
      title: "Hindi",
      native: "हिन्दी",
      motion: "क्या कृत्रिम बुद्धिमत्ता पारंपरिक नौकरियों को समाप्त कर देगी?",
      argument: "एआई पुनरावृत्त कार्यों को स्वचालित करके उत्पादकता और नए उद्योगों के निर्माण में मदद करता है।",
      counter: "नए अवसर केवल तकनीकी रूप से दक्ष वर्ग तक सीमित रह सकते हैं, जिससे व्यापक बेरोजगारी और सामाजिक असमानता बढ़ सकती है।",
      audioSample: "नए अवसर केवल तकनीकी रूप से दक्ष वर्ग तक सीमित रह सकते हैं, जिससे व्यापक बेरोजगारी और सामाजिक असमानता बढ़ सकती है।"
    }
  };

  const currentSample = languageSamples[language] || languageSamples.en;

  const handlePlaySample = () => {
    if (speech?.speakAIResponse && currentSample?.audioSample) {
      speech.speakAIResponse(currentSample.audioSample);
    }
  };

  return (
    <section className="relative py-24 sm:py-32 bg-white/[0.01] border-y border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-widest text-[#A1A1AA] mb-4">
            <Globe className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>NATIVE MULTILINGUAL DIALECTIC</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F7]">
            "Your language. Your argument."
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#A1A1AA]">
            Sparring reasons, listens, and articulates rebuttals natively in multiple languages without clumsy literal translation.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs transition-all duration-300 ${
                language === lang.code
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white font-bold shadow-lg shadow-[#7C3AED]/25 scale-105'
                  : 'bg-white/[0.03] text-[#A1A1AA] hover:text-[#F5F5F7] border border-white/[0.08] hover:border-white/[0.15]'
              }`}
            >
              <span>{lang.nativeName}</span>
              <span className="ml-1.5 text-[10px] opacity-75">({lang.label})</span>
            </button>
          ))}
        </div>

        {/* Dynamic Language Preview Card */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-[#09090D] border border-white/[0.1] p-6 sm:p-8 shadow-xl arena-glass">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#71717A] block">
                ACTIVE LANGUAGE ARENA
              </span>
              <h3 className="text-sm font-semibold text-[#F5F5F7]">
                {currentSample.title} ({currentSample.native})
              </h3>
            </div>

            <button
              type="button"
              onClick={handlePlaySample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-[#22D3EE] transition-all"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Hear Spoken Rebuttal</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Motion */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="font-mono text-[10px] uppercase text-[#71717A] block mb-1">
                MOTION
              </span>
              <p className="text-xs sm:text-sm font-medium text-[#F5F5F7]">
                "{currentSample.motion}"
              </p>
            </div>

            {/* Debater Argument */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-cyan-500/20">
              <span className="font-mono text-[10px] uppercase text-[#22D3EE] block mb-1">
                YOU (STANCE)
              </span>
              <p className="text-xs sm:text-sm text-[#D4D4D8]">
                "{currentSample.argument}"
              </p>
            </div>

            {/* AI Opponent Counter */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-transparent border border-[#7C3AED]/30">
              <span className="font-mono text-[10px] uppercase text-[#A78BFA] block mb-1">
                SPARRING AI COUNTER-ARGUMENT
              </span>
              <p className="text-xs sm:text-sm text-[#F5F5F7] leading-relaxed">
                "{currentSample.counter}"
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#71717A] font-mono">
            <span>FULL MULTILINGUAL PIPELINE</span>
            <span className="text-emerald-400">SPEECH RECOGNITION + REASONING + TTS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
