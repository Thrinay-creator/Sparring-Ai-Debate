import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function StrengthsSection({ strengths = [] }) {
  return (
    <div className="bg-chamber-surface border border-chamber-border rounded-lg p-6 space-y-4 shadow-xl">
      <div className="flex items-center gap-2 text-emerald-400">
        <CheckCircle2 className="w-5 h-5" />
        <h3 className="text-base font-semibold text-chamber-text">
          Demonstrated Strengths
        </h3>
      </div>

      <div className="space-y-3">
        {strengths.length > 0 ? (
          strengths.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-md bg-[#14181F] border border-emerald-900/30 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-3"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{item}</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-chamber-muted">No distinct strengths noted.</p>
        )}
      </div>
    </div>
  );
}
