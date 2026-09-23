import React, { useState } from 'react';
import ScoreCard from '../components/summary/ScoreCard';
import RadarBreakdown from '../components/summary/RadarBreakdown';
import StrengthsSection from '../components/summary/StrengthsSection';
import WeaknessesSection from '../components/summary/WeaknessesSection';
import FallaciesSection from '../components/summary/FallaciesSection';
import SuggestionsSection from '../components/summary/SuggestionsSection';
import ChatMessage from '../components/debate/ChatMessage';
import { ScrollText, ChevronDown, ChevronUp, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useAuth } from '../context/AuthContext';

export default function SummaryPage({ 
  session, 
  onStartNewDebate, 
  onOpenSettings, 
  onNavigate,
  saveError
}) {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showTranscript, setShowTranscript] = useState(false);
  const [dismissGuestPrompt, setDismissGuestPrompt] = useState(false);
  const feedback = session?.feedback || {};

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-message-in">
      {/* Save Error Notice (if Supabase failed) */}
      {saveError && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-amber-950/50 border border-amber-800 text-amber-200 text-xs animate-message-in">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Guest Sign-Up Incentive Prompt */}
      {!isAuthenticated && !dismissGuestPrompt && onNavigate && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-chamber-surface border border-chamber-border text-xs animate-message-in shadow-sm">
          <div className="flex items-center gap-2.5 text-chamber-text">
            <Sparkles className="w-4 h-4 text-chamber-amber shrink-0" />
            <span>{t('summary.guestPrompt')}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="px-3.5 py-1.5 rounded bg-chamber-amber hover:bg-amber-500 text-[#11141A] font-semibold text-xs transition-colors"
            >
              {t('summary.createAccountBtn')}
            </button>
            <button
              type="button"
              onClick={() => setDismissGuestPrompt(true)}
              className="px-3 py-1.5 rounded bg-chamber-surfaceAlt hover:bg-[#202733] border border-chamber-border text-chamber-muted hover:text-chamber-text text-xs transition-colors"
            >
              {t('summary.continueGuestBtn')}
            </button>
          </div>
        </div>
      )}

      {/* Top Score Card */}
      <ScoreCard
        session={session}
        feedback={feedback}
        onNewDebate={onStartNewDebate}
        onOpenSettings={onOpenSettings}
      />

      {/* Radar Chart Dimensional Breakdown */}
      <RadarBreakdown feedback={feedback} />

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StrengthsSection strengths={feedback.strengths} />
        <WeaknessesSection weaknesses={feedback.weaknesses} />
      </div>

      {/* Fallacy Audit & Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FallaciesSection fallacies={feedback.fallaciesCommitted} />
        <SuggestionsSection suggestions={feedback.suggestions} />
      </div>

      {/* Transcript Review Accordion */}
      <div className="bg-chamber-surface border border-chamber-border rounded-lg overflow-hidden shadow-xl">
        <button
          type="button"
          onClick={() => setShowTranscript(!showTranscript)}
          className="w-full p-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-chamber-text hover:bg-[#161B22] transition-colors"
        >
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-chamber-amber" />
            <span>{t('summary.reviewTranscript', { count: session?.transcript?.length || 0 })}</span>
          </div>
          {showTranscript ? (
            <ChevronUp className="w-4 h-4 text-chamber-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-chamber-muted" />
          )}
        </button>

        {showTranscript && (
          <div className="p-4 sm:p-6 border-t border-chamber-border bg-[#11141A] space-y-4 max-h-[500px] overflow-y-auto">
            {session?.transcript?.map((msg, idx) => (
              <ChatMessage
                key={idx}
                message={msg}
                roundNumber={Math.floor(idx / 2) + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="text-center pt-4 pb-10">
        <button
          type="button"
          onClick={onStartNewDebate}
          className="px-6 py-3 rounded-md bg-chamber-amber hover:bg-amber-500 text-[#11141A] font-semibold text-sm transition-all shadow-md"
        >
          {t('summary.startAnother')}
        </button>
      </div>
    </div>
  );
}
