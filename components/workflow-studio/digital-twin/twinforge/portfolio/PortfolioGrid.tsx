'use client';

import { useMemo } from 'react';
import type { PortfolioAccount } from '@/lib/twinforge/types';
import { StatusPill } from '../primitives/StatusPill';
import { Card } from '../primitives/Card';

function tone(status: PortfolioAccount['status']) {
  return status === 'live' ? 'ok'
    : status === 'onboarding' ? 'info'
    : status === 'at-risk' ? 'warn'
    : 'danger';
}

export function PortfolioGrid({
  accounts, onSelect,
}: {
  accounts: PortfolioAccount[];
  onSelect?: (id: string) => void;
}) {
  const kpis = useMemo(() => {
    const mrr = accounts.reduce((acc, a) => acc + a.mrr, 0);
    const assets = accounts.reduce((acc, a) => acc + a.assetsCovered, 0);
    const twins = accounts.reduce((acc, a) => acc + a.twinCount, 0);
    const sla = accounts.length
      ? accounts.reduce((acc, a) => acc + a.slaAttainment, 0) / accounts.length
      : 0;
    return { mrr, assets, twins, sla };
  }, [accounts]);

  return (
    <Card
      title="Customer Portfolio"
      subtitle={`${accounts.length} accounts · MYR ${kpis.mrr.toLocaleString()} MRR`}
    >
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="MRR" value={`MYR ${(kpis.mrr / 1000).toFixed(0)}k`} />
        <Stat label="Active twins" value={String(kpis.twins)} />
        <Stat label="Assets covered" value={kpis.assets.toLocaleString()} />
        <Stat label="SLA attainment" value={`${(kpis.sla * 100).toFixed(2)}%`} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-slate-800 text-left text-[10px] uppercase tracking-wide text-slate-500">
              <th className="py-2 font-semibold">Tenant</th>
              <th className="py-2 font-semibold">Tier</th>
              <th className="py-2 font-semibold">Zone</th>
              <th className="py-2 font-semibold">Status</th>
              <th className="py-2 text-right font-semibold">Twins</th>
              <th className="py-2 text-right font-semibold">Assets</th>
              <th className="py-2 text-right font-semibold">MRR</th>
              <th className="py-2 text-right font-semibold">SLA</th>
              <th className="py-2 text-right font-semibold">NPS</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr
                key={a.id}
                onClick={() => onSelect?.(a.id)}
                className="cursor-pointer border-b border-slate-800/50 transition hover:bg-slate-800/40"
              >
                <td className="py-2 text-slate-200">{a.tenantName}</td>
                <td className="py-2 text-slate-400">{a.tier}</td>
                <td className="py-2 font-mono text-[10px] text-slate-500">{a.zoneKind}</td>
                <td className="py-2">
                  <StatusPill tone={tone(a.status)}>{a.status}</StatusPill>
                </td>
                <td className="py-2 text-right font-mono tabular-nums text-slate-300">
                  {a.twinCount}
                </td>
                <td className="py-2 text-right font-mono tabular-nums text-slate-300">
                  {a.assetsCovered.toLocaleString()}
                </td>
                <td className="py-2 text-right font-mono tabular-nums text-slate-200">
                  {a.mrr.toLocaleString()}
                </td>
                <td className={`py-2 text-right font-mono tabular-nums ${
                  a.slaAttainment >= 0.995 ? 'text-emerald-300' : 'text-amber-300'
                }`}>
                  {(a.slaAttainment * 100).toFixed(2)}%
                </td>
                <td className="py-2 text-right font-mono tabular-nums text-slate-400">
                  {a.nps ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
      <div className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-slate-100">
        {value}
      </div>
    </div>
  );
}
