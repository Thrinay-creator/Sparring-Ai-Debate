import React, { useState } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  RotateCcw, 
  AlertCircle 
} from 'lucide-react';
import { MIN_ARGUMENT_LENGTH, MAX_ARGUMENT_LENGTH } from '../../utils/validation';
import { useLanguage } from '../../i18n';

export default function ArgumentInput({
  onSubmit,
  isThinking,
  isFinishing,
  error,
  lastPendingArgument,
  onRetry,
  voiceState,
  onStartListening,
  onStopListening,
  recognitionSupported,
  speechError
}) {
  const { t } = useLanguage();
  const [argument, setArgument] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmed = argument.trim();
  const charCount = trimmed.length;
  const isTooShort = charCount > 0 && charCount < MIN_ARGUMENT_LENGTH;
  const isTooLong = charCount > MAX_ARGUMENT_LENGTH;
  const isValid = charCount >= MIN_ARGUMENT_LENGTH && charCount <= MAX_ARGUMENT_LENGTH;
  const isDisabled = isThinking || isFinishing || voiceState === 'AI_SPEAKING' || isSubmitting;

  const handleSend = () => {
    if (!isValid || isDisabled || isSubmitting) return;
    setIsSubmitting(true);
    onSubmit(trimmed);
    setArgument('');
    setTimeout(() => {
      setIsSubmitting(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if (voiceState === 'LISTENING') {
      onStopListening();
    } else {
      onStartListening((spokenText) => {
        setArgument((prev) => {
          const base = prev.trim();
          return base ? `${base} ${spokenText}` : spokenText;
        });
      });
    }
  };

  return (
    <div className="border-t border-chamber-border bg-[#161B22]/95 p-3 sm:p-4 sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Turn Error & Retry Banner */}
        {error && (
          <div className="flex items-center justify-between p-3 rounded bg-red-950/50 border border-red-800 text-xs text-red-200 animate-message-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="px-2.5 py-1 rounded bg-red-900/80 hover:bg-red-800 border border-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('debate.retryTurn')}</span>
              </button>
            )}
          </div>
        )}

        {/* Speech Error / Non-blocking compatibility banner */}
        {speechError && (
          <div className="p-2 rounded bg-chamber-surface border border-chamber-border text-[11px] text-chamber-muted flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-chamber-amber shrink-0" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Voice Active Status Pill */}
        {voiceState === 'LISTENING' && (
          <div className="flex items-center gap-2 text-xs text-chamber-user font-medium px-2 py-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-chamber-user"></span>
            <span>{t('debate.listeningMsg')}</span>
          </div>
        )}

        {voiceState === 'PROCESSING' && (
          <div className="flex items-center gap-2 text-xs text-chamber-amber font-medium px-2 py-1">
            <span className="w-2 h-2 rounded-full bg-chamber-amber animate-pulse"></span>
            <span>Processing speech...</span>
          </div>
        )}

        {voiceState === 'AI_SPEAKING' && (
          <div className="flex items-center gap-2 text-xs text-chamber-ai font-medium px-2 py-1">
            <span className="w-2 h-2 rounded-full bg-chamber-ai animate-ping"></span>
            <span>{t('debate.aiSpeakingMsg')}</span>
          </div>
        )}

        {/* Text Input Row */}
        <div className="relative bg-chamber-surface rounded-lg border border-chamber-border focus-within:border-chamber-amber focus-within:ring-1 focus-within:ring-chamber-amber transition-colors">
          <textarea
            value={argument}
            onChange={(e) => setArgument(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            placeholder={
              voiceState === 'AI_SPEAKING'
                ? t('debate.inputSpeaking')
                : isThinking
                ? t('debate.inputThinking')
                : t('debate.inputPlaceholder')
            }
            rows={3}
            className="w-full p-3.5 bg-transparent text-sm text-chamber-text placeholder-chamber-muted resize-none focus:outline-none disabled:opacity-50"
          />

          {/* Bottom Bar: Character count + Mic + Send */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-chamber-border/50 bg-[#14181F] rounded-b-lg text-xs">
            {/* Char Count */}
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-[11px] ${
                  isTooShort
                    ? 'text-chamber-muted'
                    : isTooLong
                    ? 'text-red-400 font-bold'
                    : 'text-chamber-muted'
                }`}
              >
                {charCount} / {MAX_ARGUMENT_LENGTH} chars
              </span>
              {isTooShort && (
                <span className="text-[11px] text-amber-400/80">
                  {t('debate.minChars', { min: MIN_ARGUMENT_LENGTH })}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Mic STT Button */}
              {recognitionSupported ? (
                <button
                  type="button"
                  onClick={toggleMic}
                  disabled={voiceState === 'AI_SPEAKING' || isThinking}
                  className={`p-2 rounded-md transition-all border ${
                    voiceState === 'LISTENING'
                      ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                      : 'bg-chamber-surface border-chamber-border text-chamber-muted hover:text-chamber-text hover:border-slate-500'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                  title={voiceState === 'LISTENING' ? t('debate.stopListening') : t('debate.dictateMic')}
                  aria-label="Dictate argument via microphone"
                >
                  {voiceState === 'LISTENING' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              ) : null}

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!isValid || isDisabled}
                className="px-4 py-2 rounded-md bg-chamber-amber hover:bg-amber-500 text-[#11141A] font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              >
                <span>{t('debate.sendArgument')}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
