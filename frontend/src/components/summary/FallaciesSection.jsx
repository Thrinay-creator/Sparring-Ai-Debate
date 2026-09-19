import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function FallaciesSection({ fallacies = [] }) {
  const hasFallacies = fallacies && fallacies.length > 0;

  return (
    <div className="bg-chamber-surface border border-chamber-border rounded-lg p-6 space-y-4 shadow-xl">
      <div className="flex items-center gap-2 text-red-400">
        <AlertTriangle className="w-5 h-5" />
        <h3 className="text-base font-semibold text-chamber-text">
          Logical Fallacy Audit
        </h3>
      </div>

      {hasFallacies ? (
        <div className="space-y-3">
          {fallacies.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-md bg-[#14181F] border border-red-900/40 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 font-mono text-xs font-bold uppercase tracking-wider">
                  {item.fallacy}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-md bg-[#14181F] border border-chamber-border/80 flex items-center gap-3 text-chamber-muted text-xs sm:text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            No clear logical fallacies detected. Your arguments maintained structural discipline.
          </span>
        </div>
      )}
    </div>
  );
}
