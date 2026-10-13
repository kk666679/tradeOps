'use client';

import type { LabDefinition } from '@/lib/twinforge/types';
import { Card } from '../primitives/Card';
import { StatusPill } from '../primitives/StatusPill';

export function LabGrid({ labs }: { labs: LabDefinition[] }) {
  return (
    <Card
      title="Studio Factory — Labs"
      subtitle={`${labs.length} specialised labs · ${labs.reduce((a, l) => a + l.activeInitiatives, 0)} active initiatives`}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {labs.map((l) => {
          const util = Math.round(l.utilisation * 100);
          const tone = util > 85 ? 'danger' : util > 70 ? 'warn' : 'ok';
          return (
            <div
              key={l.id}
              className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-[12px] font-semibold text-slate-100">
                    {l.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Owner: {l.owner}
                  </p>
                </div>
                <StatusPill tone={tone}>{util}%</StatusPill>
              </div>

              <p className="mt-2 text-[10.5px] leading-relaxed text-slate-400">
                {l.function}
              </p>

              <div className="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    util > 85 ? 'bg-red-500' : util > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${util}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <span>Queue {l.queueDepth}</span>
                <span className="font-mono">{l.slaDays}</span>
                <span>{l.activeInitiatives} active</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
