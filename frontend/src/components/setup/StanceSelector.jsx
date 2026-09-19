import React from 'react';
import { Scale, ArrowRightLeft, ShieldCheck, Swords } from 'lucide-react';

export default function StanceSelector({ userStance, onChangeStance }) {
  const aiStance = userStance === 'FOR' ? 'AGAINST' : 'FOR';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold tracking-wide text-chamber-text flex items-center gap-2">
          <Scale className="w-4 h-4 text-chamber-amber" />
          Your Stance
        </label>
        <span className="text-xs text-chamber-muted flex items-center gap-1">
          <ArrowRightLeft className="w-3 h-3 text-chamber-amber" />
          Opponent stance auto-inverts
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* FOR button */}
        <button
          type="button"
          onClick={() => onChangeStance('FOR')}
          className={`p-3.5 rounded-md border text-left transition-all relative ${
            userStance === 'FOR'
              ? 'bg-chamber-userBg border-chamber-user text-chamber-user ring-1 ring-chamber-user'
              : 'bg-[#161B22] border-chamber-border text-chamber-muted hover:border-slate-600 hover:text-chamber-text'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm">FOR (Affirmative)</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-chamber-user/10 text-chamber-user font-mono">
              PRO
            </span>
          </div>
          <p className="text-xs text-chamber-muted leading-relaxed">
            You defend the premise. The AI will challenge your arguments.
          </p>
        </button>

        {/* AGAINST button */}
        <button
          type="button"
          onClick={() => onChangeStance('AGAINST')}
          className={`p-3.5 rounded-md border text-left transition-all relative ${
            userStance === 'AGAINST'
              ? 'bg-chamber-userBg border-chamber-user text-chamber-user ring-1 ring-chamber-user'
              : 'bg-[#161B22] border-chamber-border text-chamber-muted hover:border-slate-600 hover:text-chamber-text'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm">AGAINST (Negative)</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-chamber-user/10 text-chamber-user font-mono">
              CON
            </span>
          </div>
          <p className="text-xs text-chamber-muted leading-relaxed">
            You reject the premise. The AI will defend the affirmative case.
          </p>
        </button>
      </div>

      {/* Opponent Preview Banner */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded bg-[#161B22] border border-chamber-border text-xs">
        <div className="flex items-center gap-2 text-chamber-user">
          <ShieldCheck className="w-4 h-4 text-chamber-user" />
          <span>You: <strong>{userStance}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-chamber-muted font-mono text-[11px]">
          VS
        </div>
        <div className="flex items-center gap-2 text-chamber-ai">
          <Swords className="w-4 h-4 text-chamber-ai" />
          <span>Sparring AI: <strong>{aiStance}</strong></span>
        </div>
      </div>
    </div>
  );
}
