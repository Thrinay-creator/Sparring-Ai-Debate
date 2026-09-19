import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function WeaknessesSection({ weaknesses = [] }) {
  return (
    <div className="bg-chamber-surface border border-chamber-border rounded-lg p-6 space-y-4 shadow-xl">
      <div className="flex items-center gap-2 text-chamber-ai">
        <AlertCircle className="w-5 h-5" />
        <h3 className="text-base font-semibold text-chamber-text">
          Vulnerabilities & Logical Gaps
        </h3>
      </div>

      <div className="space-y-3">
        {weaknesses.length > 0 ? (
          weaknesses.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-md bg-[#14181F] border border-orange-900/30 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-3"
            >
              <span className="w-5 h-5 rounded-full bg-orange-950/60 border border-orange-800 text-chamber-ai flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{item}</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-chamber-muted">No significant vulnerabilities detected.</p>
        )}
      </div>
    </div>
  );
}
