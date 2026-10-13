'use client';

import type { OutcomeContract, PortfolioAccount } from '@/lib/twinforge/types';
import { Card } from '../primitives/Card';
import { StatusPill } from '../primitives/StatusPill';

export function OutcomesGrid({
  outcomes, accounts,
}: {
  outcomes: OutcomeContract[];
  accounts: PortfolioAccount[];
}) {
  const byId = new Map(accounts.map((a) => [a.id, a]));
  const totalMonthly = outcomes.reduce((acc, o) => acc + o.estimatedMonthlyValue, 0);

  return (
    <Card
      title="Outcome-as-a-Service Contracts"
      subtitle={`${outcomes.length} active · MYR ${totalMonthly.toLocaleString()}/mo estimated value`}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {outcomes.map((o) => {
          const reduction = ((o.baselineValue - o.currentValue) / o.baselineValue) * 100;
          const onTarget = o.currentValue <= o.targetValue;
          return (
            <div
              key={o.id}
              className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[12px] font-semibold text-slate-100">
                    {o.outcome}
                  </div>
                  <div className="mt-0.5 text-[10px] text-slate-500">
                    {byId.get(o.tenantId)?.tenantName ?? '—'}
                  </div>
                </div>
                <StatusPill tone={onTarget ? 'ok' : 'warn'}>
                  {onTarget ? 'on target' : 'tracking'}
                </StatusPill>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                <Metric label="Baseline" value={o.baselineValue} />
                <Metric label="Now" value={o.currentValue} accent />
                <Metric label="Target" value={o.targetValue} />
              </div>

              <div className="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${onTarget ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, reduction)}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <span className="text-emerald-400 font-semibold">
                  {reduction.toFixed(1)}% reduction
                </span>
                <span className="font-mono">
                  share {(o.sharePct * 100).toFixed(0)}% · MYR {o.estimatedMonthlyValue.toLocaleString()}/mo
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Metric({ label, value, accent }: {
  label: string; value: number; accent?: boolean;
}) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`font-mono tabular-nums ${accent ? 'text-violet-300 font-semibold' : 'text-slate-300'}`}>
        {value}
      </div>
    </div>
  );
}
