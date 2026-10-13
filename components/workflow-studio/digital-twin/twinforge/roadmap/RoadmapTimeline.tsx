'use client';

import type { RoadmapItem } from '@/lib/twinforge/types';
import { Card } from '../primitives/Card';
import { StatusPill } from '../primitives/StatusPill';

const PHASE_ORDER = ['foundation', 'pilot', 'commercial', 'scale'] as const;

export function RoadmapTimeline({ items }: { items: RoadmapItem[] }) {
  const grouped = PHASE_ORDER.map((phase) => ({
    phase,
    items: items.filter((i) => i.phase === phase),
  }));

  return (
    <Card title="Roadmap" subtitle={`${items.length} initiatives across 4 phases`}>
      <div className="space-y-5">
        {grouped.map(({ phase, items: phaseItems }) => {
          if (phaseItems.length === 0) return null;
          const overallProgress = phaseItems.reduce((a, i) => a + i.progress, 0) / phaseItems.length;
          return (
            <div key={phase}>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wide text-violet-300">
                  {phase}
                </h4>
                <span className="text-[10px] text-slate-500 tabular-nums">
                  {Math.round(overallProgress * 100)}% complete
                </span>
              </div>

              <div className="space-y-1.5">
                {phaseItems.map((it) => (
                  <div
                    key={it.id}
                    className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[12px] font-medium text-slate-100">
                          {it.title}
                        </div>
                        <div className="mt-0.5 text-[10px] text-slate-500">
                          Owner: {it.owner} · M{it.startMonth}–M{it.endMonth}
                        </div>
                      </div>
                      <StatusPill
                        tone={
                          it.progress >= 1 ? 'ok'
                          : it.progress >= 0.5 ? 'info'
                          : it.progress > 0 ? 'warn'
                          : 'muted'
                        }
                      >
                        {Math.round(it.progress * 100)}%
                      </StatusPill>
                    </div>

                    <div className="mt-2 h-1 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-500"
                        style={{ width: `${it.progress * 100}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="text-slate-400">
                        <span className="text-violet-400">◆</span> {it.milestone}
                      </span>
                      {it.dependencies.length > 0 && (
                        <span className="font-mono">
                          deps: {it.dependencies.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
