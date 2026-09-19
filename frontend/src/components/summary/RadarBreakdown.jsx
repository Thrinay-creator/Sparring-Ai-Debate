import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { Brain, FileText, Target, Activity } from 'lucide-react';

export default function RadarBreakdown({ feedback }) {
  const logic = feedback?.logicScore ?? 70;
  const evidence = feedback?.evidenceScore ?? 70;
  const persuasiveness = feedback?.persuasivenessScore ?? 70;

  const chartData = [
    { metric: 'Logic', score: logic, fullMark: 100 },
    { metric: 'Evidence', score: evidence, fullMark: 100 },
    { metric: 'Persuasiveness', score: persuasiveness, fullMark: 100 },
  ];

  return (
    <div className="bg-chamber-surface border border-chamber-border rounded-lg p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-chamber-text flex items-center gap-2">
          <Activity className="w-4 h-4 text-chamber-amber" />
          Argument Dimensional Breakdown
        </h3>
        <span className="text-xs font-mono text-chamber-muted">
          Scale: 0 – 100
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Recharts Radar Chart */}
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="var(--chamber-border, #28303B)" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="metric"
                stroke="var(--chamber-muted, #94A3B8)"
                tick={{ fill: 'var(--chamber-text, #F3F4F6)', fontSize: 13, fontWeight: 500 }}
              />
              {/* Domain strictly set to [0, 100] as specified */}
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="var(--chamber-border, #28303B)"
                tick={{ fill: 'var(--chamber-muted, #64748B)', fontSize: 10 }}
              />
              <Radar
                name="Performance"
                dataKey="score"
                stroke="var(--chamber-amber, #F59E0B)"
                strokeWidth={2}
                fill="var(--chamber-amber, #F59E0B)"
                fillOpacity={0.28}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Numeric Indicators */}
        <div className="space-y-4">
          {/* Logic */}
          <div className="p-3.5 rounded-md bg-[#14181F] border border-chamber-border space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-chamber-text">
                <Brain className="w-4 h-4 text-chamber-user" />
                <span>Logic & Structural Consistency</span>
              </div>
              <span className="text-sm font-mono font-bold text-chamber-user">
                {logic} / 100
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-chamber-user h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(logic, 100)}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-chamber-muted">
              Validity of causal claims and avoidance of formal non-sequiturs.
            </p>
          </div>

          {/* Evidence */}
          <div className="p-3.5 rounded-md bg-[#14181F] border border-chamber-border space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-chamber-text">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Empirical Evidence & Specificity</span>
              </div>
              <span className="text-sm font-mono font-bold text-amber-400">
                {evidence} / 100
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(evidence, 100)}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-chamber-muted">
              Concrete operational backing vs unverified generalizations.
            </p>
          </div>

          {/* Persuasiveness */}
          <div className="p-3.5 rounded-md bg-[#14181F] border border-chamber-border space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-chamber-text">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Rhetorical Persuasiveness</span>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {persuasiveness} / 100
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(persuasiveness, 100)}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-chamber-muted">
              Force of counterargument handling, clarity, and framing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
