'use client';

/**
 * EvalReport
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface EvalReportMetric { name: string; value: number; threshold?: number; }
export interface EvalReportProps { suite: string; metrics?: EvalReportMetric[]; pass?: boolean; }

export function EvalReport({ suite, metrics = [], pass }: EvalReportProps) {
  return (
    <div className="rounded border p-3 text-sm">
      <div className="flex ItemsCenter JustifyBetween"><span className="FontMedium">{suite}</span><span className={pass ? 'text-emerald-600' : 'text-red-600'}>{pass ? 'pass' : 'fail'}</span></div>
      <table className="Mt2 w-full text-xs"><tbody>{metrics.map((m) => <tr key={m.name}><td>{m.name}</td><td className="text-right">{m.value.toFixed(3)}</td><td className="text-right text-muted-foreground">{m.threshold ?? '—'}</td></tr>)}</tbody></table>
    </div>
  );
}

export default EvalReport;
