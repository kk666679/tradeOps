'use client';

import type { MarketplaceApp } from '@/lib/twinforge/types';
import { Card } from '../primitives/Card';
import { StatusPill } from '../primitives/StatusPill';

export function MarketplaceGrid({ apps }: { apps: MarketplaceApp[] }) {
  const certified = apps.filter((a) => a.status === 'certified').length;

  return (
    <Card
      title="Twin Marketplace"
      subtitle={`${apps.length} apps · ${certified} certified`}
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((a) => (
          <div
            key={a.id}
            className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3 transition hover:border-cyan-500/50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[12px] font-medium text-slate-100 truncate">
                  {a.name}
                </div>
                <div className="text-[10px] text-slate-500">by {a.vendor}</div>
              </div>
              <StatusPill
                tone={
                  a.status === 'certified' ? 'ok'
                  : a.status === 'under-review' ? 'info'
                  : 'muted'
                }
              >
                {a.status}
              </StatusPill>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <span className="font-mono text-slate-400">{a.category}</span>
              <span>·</span>
              <span>{a.installs} installs</span>
              <span>·</span>
              <span className="text-amber-300">★ {a.rating.toFixed(1)}</span>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-500">
              <span>Revenue share: {(a.revenueSharePct * 100).toFixed(0)}%</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 uppercase tracking-wide text-slate-400">
                {a.layer}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
