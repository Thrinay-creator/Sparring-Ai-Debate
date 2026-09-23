import React from 'react';
import { User, Swords, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n';

export default function ChatMessage({ message, roundNumber }) {
  const { t } = useLanguage();
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex flex-col mb-4 animate-message-in ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      {/* Speaker Label */}
      <div className="flex items-center gap-1.5 mb-1 text-[11px] font-medium tracking-wider uppercase">
        {isUser ? (
          <>
            <span className="text-chamber-user font-semibold">{t('you')}</span>
            <User className="w-3 h-3 text-chamber-user" />
          </>
        ) : (
          <>
            <Swords className="w-3 h-3 text-chamber-ai" />
            <span className="text-chamber-ai font-semibold">{t('aiOpponent')}</span>
          </>
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[78%] rounded-lg p-4 text-sm leading-relaxed ${
          isUser
            ? 'bg-chamber-userBg border border-chamber-userBorder text-slate-100 rounded-tr-none shadow-sm'
            : 'bg-chamber-aiBg border border-chamber-aiBorder text-slate-100 rounded-tl-none shadow-sm'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {/* AI turn diagnostic badges (subtle, non-intrusive) */}
        {!isUser && (message.argumentScore !== undefined || message.fallacy) && (
          <div className="mt-3 pt-2.5 border-t border-chamber-aiBorder/60 flex flex-wrap items-center gap-2 text-[11px]">
            {message.argumentScore !== undefined && (
              <span className="inline-flex items-center gap-1 text-amber-300 font-mono">
                <span>{t('debate.argQuality')}:</span>
                <strong className="text-chamber-amber">{message.argumentScore}/10</strong>
              </span>
            )}

            {message.fallacy && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300 font-mono capitalize">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                <span>{message.fallacy}</span>
              </span>
            )}

            {message.scoreReason && (
              <span className="w-full text-chamber-muted text-[11px] italic mt-0.5">
                "{message.scoreReason}"
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
