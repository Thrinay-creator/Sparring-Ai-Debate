import React from 'react';
import DebateHeader from '../components/debate/DebateHeader';
import ChatWindow from '../components/debate/ChatWindow';
import ArgumentInput from '../components/debate/ArgumentInput';

export default function DebatePage({
  session,
  stage,
  error,
  lastPendingArgument,
  onSubmitArgument,
  onRetryTurn,
  onFinishDebate,
  onOpenSettings,
  onNavigateHome,
  onOpenAuth,
  speech
}) {
  const isThinking = stage === 'WAITING_FOR_AI';
  const isFinishing = stage === 'FINISHING';

  return (
    <div className="flex flex-col h-screen bg-chamber-bg text-chamber-text overflow-hidden">
      {/* Header */}
      <DebateHeader
        session={session}
        isMuted={speech.isMuted}
        voiceState={speech.voiceState}
        onToggleMute={speech.toggleMute}
        onStopSpeaking={speech.stopSpeaking}
        onFinishDebate={onFinishDebate}
        onOpenSettings={onOpenSettings}
        onNavigateHome={onNavigateHome}
        onOpenAuth={onOpenAuth}
        isThinking={isThinking}
        isFinishing={isFinishing}
      />

      {/* Main Chat Stream */}
      <ChatWindow
        transcript={session.transcript}
        isThinking={isThinking}
        isFinishing={isFinishing}
        session={session}
      />

      {/* Input Bar */}
      <ArgumentInput
        onSubmit={onSubmitArgument}
        isThinking={isThinking}
        isFinishing={isFinishing}
        error={error}
        lastPendingArgument={lastPendingArgument}
        onRetry={lastPendingArgument ? onRetryTurn : null}
        voiceState={speech.voiceState}
        onStartListening={speech.startListening}
        onStopListening={speech.stopListening}
        recognitionSupported={speech.recognitionSupported}
        speechError={speech.errorMessage}
      />
    </div>
  );
}
