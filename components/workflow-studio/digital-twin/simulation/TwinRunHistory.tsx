'use client';

import { useDigitalTwinStore } from '../store/useDigitalTwinStore';

export function TwinRunHistory() {
  const runs = useDigitalTwinStore((s) => s.runs);

  if (runs.length === 0) {
    return (
      <p className="p-3 text-[11px] text-slate-500">
        No runs recorded yet.
      </p>
    );
  }

  return (
    <ul className="space-y-1 p-2">
      {runs.slice(0, 10).map((r) => (
        <li
          key={r.id}
          className="rounded border border-slate-800 bg-slate-900/40 p-2 text-[11px]"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-slate-300 text-[10px]">
              {r.id.slice(0, 14)}
            </span>
            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
              r.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300'
              : r.status === 'running' ? 'bg-blue-500/20 text-blue-300'
              : r.status === 'failed' ? 'bg-red-500/20 text-red-300'
              : 'bg-slate-700 text-slate-400'
            }`}>
              {r.status}
            </span>
          </div>
          <div className="mt-1 flex gap-3 text-[10px] text-slate-500 tabular-nums">
            <span>step {r.stepIndex}/{r.totalSteps}</span>
            <span>·</span>
            <span>{new Date(r.startedAt).toLocaleTimeString()}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
