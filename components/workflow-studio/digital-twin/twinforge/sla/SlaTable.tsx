'use client';

import type { PortfolioAccount, SlaMetric } from '@/lib/twinforge/types';
import { Card } from '../primitives/Card';
import { StatusPill } from '../primitives/StatusPill';

export function SlaTable({
  metrics, accounts,
}: {
  metrics: SlaMetric[];
  accounts: PortfolioAccount[];
}) {
  const byId = new Map(accounts.map((a) => [a.id, a]));

  const met      = metrics.filter((m) => m.status === 'met').length;
  const atRisk   = metrics.filter((m) => m.status === 'at-risk').length;
  const breached = metrics.filter((m) => m.status === 'breached').length;

  return (
    <Card
      title="SLA Attainment"
      subtitle={`${metrics.length} metrics · ${met} met · ${atRisk} at-risk · ${breached} breached`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-slate-800 text-left text-[10px] uppercase tracking-wide text-slate-500">
              <th className="py-2 font-semibold">Tenant</th>
              <th className="py-2 font-semibold">Metric</th>
              <th className="py-2 font-semibold">Window</th>
              <th className="py-2 text-right font-semibold">Target</th>
              <th className="py-2 text-right font-semibold">Actual</th>
              <th className="py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.id} className="border-b border-slate-800/50">
                <td className="py-2 text-slate-300">
                  {byId.get(m.tenantId)?.tenantName ?? '—'}
                </td>
                <td className="py-2 text-slate-300">{m.metric}</td>
                <td className="py-2 font-mono text-[10px] text-slate-500">{m.window}</td>
                <td className="py-2 text-right font-mono tabular-nums text-slate-400">
                  {m.target}{m.unit === 'ratio' ? '' : m.unit}
                </td>
                <td className={`py-2 text-right font-mono tabular-nums ${
                  m.status === 'met' ? 'text-emerald-300'
                  : m.status === 'at-risk' ? 'text-amber-300'
                  : 'text-red-300'
                }`}>
                  {m.actual}{m.unit === 'ratio' ? '' : m.unit}
                </td>
                <td className="py-2">
                  <StatusPill
                    tone={
                      m.status === 'met' ? 'ok'
                      : m.status === 'at-risk' ? 'warn'
                      : 'danger'
                    }
                  >
                    {m.status}
                  </StatusPill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
