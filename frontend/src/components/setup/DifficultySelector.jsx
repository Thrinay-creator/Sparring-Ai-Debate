import React from 'react';
import { DIFFICULTIES } from '../../data/topics';
import { Shield, Flame, Skull } from 'lucide-react';

const ICONS = {
  NEWBIE: Shield,
  SHARP: Flame,
  RUTHLESS: Skull
};

export default function DifficultySelector({ difficulty, onSelectDifficulty }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold tracking-wide text-chamber-text flex items-center gap-2">
          <Flame className="w-4 h-4 text-chamber-amber" />
          Opponent Difficulty
        </label>
        <span className="text-xs text-chamber-muted">
          Select opponent rigor & demeanor
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {DIFFICULTIES.map((item) => {
          const isSelected = difficulty === item.id;
          const Icon = ICONS[item.id] || Shield;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectDifficulty(item.id)}
              className={`p-3.5 rounded-md border text-left transition-all relative ${
                isSelected
                  ? 'bg-chamber-surface border-chamber-amber text-chamber-text ring-1 ring-chamber-amber shadow-sm'
                  : 'bg-[#161B22] border-chamber-border text-chamber-muted hover:border-slate-600 hover:text-chamber-text'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-chamber-amber' : 'text-chamber-muted'}`} />
                  <span className={`font-semibold text-sm ${isSelected ? 'text-chamber-text' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                </div>
              </div>
              <p className="text-xs text-chamber-muted leading-relaxed mb-2">
                {item.description}
              </p>
              <div className="text-[11px] font-mono text-chamber-amber/80">
                {item.tone}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
