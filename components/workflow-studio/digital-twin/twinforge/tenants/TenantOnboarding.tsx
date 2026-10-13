'use client';

import type { TenantOnboardingStage } from '@/lib/twinforge/types';
import { Card } from '../primitives/Card';
import { StatusPill } from '../primitives/StatusPill';

export function TenantOnboarding({
  stages, tenantName,
}: {
  stages: TenantOnboardingStage[];
  tenantName: string;
}) {
  const done = stages.filter((s) => s.status === 'done').length;
  const total = stages.length;
  const overall = done / total;

  return (
    <Card
      title={`Onboarding — ${tenantName}`}
      subtitle={`${done} of ${total} stages complete · ${Math.round(overall * 100)}%`}
    >
      <div className="mb-4 h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all"
          style={{ width: `${overall * 100}%` }}
        />
      </div>

      <ol className="space-y-2">
        {stages.map((s, i) => {
          const pct = s.daysBudget > 0 ? Math.min(1, s.daysElapsed / s.daysBudget) : 0;
          return (
            <li
              key={s.stage}
              className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className={`grid h-6 w-6 flex-none place-items-center rounded-full text-[10px] font-bold ${
                      s.status === 'done' ? 'bg-emerald-500/20 text-emerald-300'
                      : s.status === 'active' ? 'bg-violet-500/20 text-violet-300'
                      : s.status === 'blocked' ? 'bg-red-500/20 text-red-300'
                      : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {s.status === 'done' ? '✓' : i + 1}
                  </span>
                  <div>
                    <div className="text-[12px] font-medium text-slate-100">
                      {s.label}
                    </div>
                    <div className="mt-0.5 text-[10px] text-slate-500 tabular-nums">
                      {s.daysElapsed} / {s.daysBudget} days
                    </div>
                  </div>
                </div>

                <StatusPill
                  tone={
                    s.status === 'done' ? 'ok'
                    : s.status === 'active' ? 'violet'
                    : s.status === 'blocked' ? 'danger'
                    : 'muted'
                  }
                >
                  {s.status}
                </StatusPill>
              </div>

              <div className="mt-2 h-1 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    s.status === 'done' ? 'bg-emerald-500'
                    : s.status === 'active' ? 'bg-violet-500'
                    : s.status === 'blocked' ? 'bg-red-500'
                    : 'bg-slate-700'
                  }`}
                  style={{ width: `${pct * 100}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
