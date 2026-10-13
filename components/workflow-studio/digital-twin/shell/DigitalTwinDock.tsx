'use client';

import {
  useDigitalTwinStore,
  selectActiveRun,
} from '../store/useDigitalTwinStore';
import { TwinRunControls } from '../simulation/TwinRunControls';
import type { TwinSpeed } from '@/lib/digital-twin/types';

const SPEEDS: TwinSpeed[] = [0.25, 0.5, 1, 2, 4, 8];

export function DigitalTwinDock() {
  const open = useDigitalTwinStore((s) => s.dockOpen);
  const speed = useDigitalTwinStore((s) => s.speed);
  const setSpeed = useDigitalTwinStore((s) => s.setSpeed);
  const clock = useDigitalTwinStore((s) => s.clock);
  const run = useDigitalTwinStore(selectActiveRun);
  const runs = useDigitalTwinStore((s) => s.runs);

  if (!open) return null;

  const time = new Date(clock).toISOString().slice(11, 19);

  return (
    <div className="h-14 flex items-center gap-3 px-4 bg-slate-900 border-t border-slate-800 text-slate-200">
      <TwinRunControls />

      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wide text-slate-500">
          Speed
        </span>
        <div className="flex items-center gap-1 rounded-lg bg-slate-950 p-1 border border-slate-800">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 text-[11px] font-semibold rounded transition ${
                speed === s
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wide text-slate-500">
          Clock
        </span>
        <span className="font-mono text-xs text-slate-200 tabular-nums">
          {time}
        </span>
      </div>

      <div className="flex-1" />

      {run && (
        <div className="flex items-center gap-4 text-[11px]">
          <Metric label="Throughput" value={run.metrics.throughput.toFixed(0)} />
          <Metric label="Dwell" value={`${run.metrics.dwell.toFixed(1)}h`} />
          <Metric label="Util" value={`${run.metrics.utilization.toFixed(1)}%`} />
          <Metric label="Cost" value={`$${run.metrics.cost.toFixed(0)}`} />
        </div>
      )}

      <span className="text-[11px] text-slate-500">
        {runs.length} run{runs.length === 1 ? '' : 's'}
      </span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-500">{label}</span>
      <span className="font-mono text-slate-200 tabular-nums">{value}</span>
    </div>
  );
}
