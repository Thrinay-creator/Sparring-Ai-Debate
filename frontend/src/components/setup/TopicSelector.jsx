import React from 'react';
import { PRESET_TOPICS } from '../../data/topics';
import { Sparkles, MessageSquare } from 'lucide-react';

export default function TopicSelector({ topic, onSelectTopic }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold tracking-wide text-chamber-text flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-chamber-amber" />
          Debate Topic
        </label>
        <span className="text-xs text-chamber-muted">
          Select a preset or enter your own
        </span>
      </div>

      {/* Custom Topic Input */}
      <div className="relative">
        <input
          type="text"
          value={topic}
          onChange={(e) => onSelectTopic(e.target.value)}
          placeholder="E.g., Should social media algorithms be legally regulated?"
          className="w-full px-4 py-3 bg-[#161B22] border border-chamber-border rounded-md text-chamber-text placeholder-chamber-muted focus:border-chamber-amber focus:ring-1 focus:ring-chamber-amber transition-colors text-sm"
        />
      </div>

      {/* Preset Chips */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-chamber-amber" />
          <span className="text-xs uppercase font-medium tracking-wider text-chamber-muted">
            Curated Debate Prompts
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_TOPICS.map((preset) => {
            const isSelected = topic === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onSelectTopic(preset)}
                className={`px-3 py-1.5 rounded text-xs font-medium text-left transition-all border ${
                  isSelected
                    ? 'bg-chamber-amber/15 border-chamber-amber text-chamber-amber shadow-sm'
                    : 'bg-[#161B22] border-chamber-border text-chamber-muted hover:border-slate-600 hover:text-chamber-text'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
