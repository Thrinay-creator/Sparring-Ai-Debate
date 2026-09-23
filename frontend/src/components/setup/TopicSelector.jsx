import React from 'react';
import { MULTILINGUAL_TOPICS } from '../../data/topics';
import { Sparkles, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../i18n';

export default function TopicSelector({ topic, onSelectTopic }) {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold tracking-wide text-chamber-text flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-chamber-amber" />
          {t('setup.topicLabel')}
        </label>
        <span className="text-xs text-chamber-muted">
          {t('setup.topicHint')}
        </span>
      </div>

      {/* Custom Topic Input */}
      <div className="relative">
        <input
          type="text"
          value={topic}
          onChange={(e) => onSelectTopic(e.target.value)}
          placeholder={t('setup.topicPlaceholder')}
          className="w-full px-4 py-3 bg-[#161B22] border border-chamber-border rounded-md text-chamber-text placeholder-chamber-muted focus:border-chamber-amber focus:ring-1 focus:ring-chamber-amber transition-colors text-sm"
        />
      </div>

      {/* Preset Chips */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-chamber-amber" />
          <span className="text-xs uppercase font-medium tracking-wider text-chamber-muted">
            {t('setup.curatedPrompts')}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {MULTILINGUAL_TOPICS.map((preset) => {
            const localizedLabel = preset[language] || preset.en;
            const isSelected = (
              topic === preset.en ||
              topic === preset.te ||
              topic === preset.hi ||
              topic === localizedLabel
            );

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectTopic(localizedLabel)}
                className={`px-3 py-1.5 rounded text-xs font-medium text-left transition-all border ${
                  isSelected
                    ? 'bg-chamber-amber/15 border-chamber-amber text-chamber-amber shadow-sm'
                    : 'bg-[#161B22] border-chamber-border text-chamber-muted hover:border-slate-600 hover:text-chamber-text'
                }`}
              >
                {localizedLabel}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
