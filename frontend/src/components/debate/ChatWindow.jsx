import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import { Swords, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n';

export default function ChatWindow({
  transcript,
  isThinking,
  isFinishing,
  session
}) {
  const { t } = useLanguage();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, isThinking, isFinishing]);

  const stanceLabel = session.aiStance === 'FOR' ? t('setup.for') : t('setup.against');

  const openingMessage = {
    role: 'ai',
    content: t('debate.openingPrompt', { stance: stanceLabel })
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
      {/* Opening Chamber Banner */}
      <div className="text-center my-4 py-3 px-4 rounded-lg bg-[#161B22]/60 border border-chamber-border/60 text-xs text-chamber-muted max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-1.5 font-medium text-chamber-amber mb-1">
          <Swords className="w-3.5 h-3.5" />
          <span>{t('debate.chamberActive')}</span>
        </div>
        <p>
          {t('debate.chamberActiveDesc', { stance: stanceLabel })}
        </p>
      </div>

      {/* Opening AI Prompt */}
      <ChatMessage message={openingMessage} roundNumber={1} />

      {/* Actual Exchanges */}
      {transcript.map((msg, index) => (
        <ChatMessage
          key={index}
          message={msg}
          roundNumber={Math.floor(index / 2) + 1}
        />
      ))}

      {/* AI Formulating State */}
      {isThinking && (
        <div className="flex justify-start">
          <LoadingIndicator label={t('debate.thinking')} />
        </div>
      )}

      {/* Finishing & Generating Report State */}
      {isFinishing && (
        <div className="flex justify-center my-6">
          <div className="p-4 rounded-lg bg-chamber-surface border border-chamber-amber text-center space-y-2 max-w-md shadow-xl animate-message-in">
            <div className="flex items-center justify-center gap-2 text-chamber-amber font-semibold text-sm">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{t('debate.finishingTitle')}</span>
            </div>
            <p className="text-xs text-chamber-muted leading-relaxed">
              {t('debate.finishingDesc')}
            </p>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
