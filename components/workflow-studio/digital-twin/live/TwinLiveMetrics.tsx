'use client';

import {
  useDigitalTwinStore,
  selectActiveRun,
} from '../store/useDigitalTwinStore';

export function TwinLiveMetrics() {
  const run = useDigitalTwinStore(selectActiveRun);
  const nodes = useDigitalTwinStore((s) => s.nodes);

  const activeCount = nodes.filter((n) => n.data.status === 'active').length;
  const blockedCount = nodes.filter((n) => n.data.status === 'blocked').length;

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      <Metric label="Active" value={activeCount} tone="emerald" />
      <Metric label="Blocked" value={blockedCount} tone="amber" />
      {run && (
        <>
          <Metric label="Step" value={`${run.stepIndex}/${run.totalSteps}`} tone="blue" />
          <Metric label="Throughput" value={run.metrics.throughput.toFixed(0)} tone="cyan" />
          <Metric label="Dwell" value={`${run.metrics.dwell.toFixed(1)}h`} tone="violet" />
          <Metric label="Utilization" value={`${run.metrics.utilization.toFixed(0)}%`} tone="emerald" />
        </>
      )}
    </div>
  );
}

function Metric({ label, value, tone }: {
  label: string; value: string | number;
  tone: 'emerald' | 'amber' | 'blue' | 'cyan' | 'violet';
}) {
  const color: Record<typeof tone, string> = {
    emerald: 'text-emerald-300',
    amber: 'text-amber-300',
    blue: 'text-blue-300',
    cyan: 'text-cyan-300',
    violet: 'text-violet-300',
  };
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-2">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className={`mt-0.5 text-lg font-semibold tabular-nums ${color[tone]}`}>
        {value}
      </div>
    </div>
  );
}
