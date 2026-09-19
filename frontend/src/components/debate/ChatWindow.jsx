import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import { Swords, Sparkles } from 'lucide-react';

export default function ChatWindow({
  transcript,
  isThinking,
  isFinishing,
  session
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, isThinking, isFinishing]);

  const openingMessage = {
    role: 'ai',
    content: `I will be defending the opposing position (${session.aiStance}). State your opening case with your best rationale and evidence.`
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
      {/* Opening Chamber Banner */}
      <div className="text-center my-4 py-3 px-4 rounded-lg bg-[#161B22]/60 border border-chamber-border/60 text-xs text-chamber-muted max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-1.5 font-medium text-chamber-amber mb-1">
          <Swords className="w-3.5 h-3.5" />
          <span>Debate Chamber Active</span>
        </div>
        <p>
          Opponent stance: <strong className="text-chamber-ai">{session.aiStance}</strong>. 
          Respond directly to challenges. 6 rounds total.
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
          <LoadingIndicator label="Sparring AI is analyzing your logic..." />
        </div>
      )}

      {/* Finishing & Generating Report State */}
      {isFinishing && (
        <div className="flex justify-center my-6">
          <div className="p-4 rounded-lg bg-chamber-surface border border-chamber-amber text-center space-y-2 max-w-md shadow-xl animate-message-in">
            <div className="flex items-center justify-center gap-2 text-chamber-amber font-semibold text-sm">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Six Rounds Complete</span>
            </div>
            <p className="text-xs text-chamber-muted leading-relaxed">
              Adjudicating complete debate transcript... Evaluating logic consistency, evidence rigor, and fallacies.
            </p>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
