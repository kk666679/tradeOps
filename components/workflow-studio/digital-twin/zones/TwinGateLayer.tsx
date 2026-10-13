'use client';

import { useMemo } from 'react';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';
import { LayerHeader, StatusPill, EmptyLayer } from './TwinBondedLayer';

export function TwinGateLayer({ zoneId }: { zoneId: string }) {
  const nodes = useDigitalTwinStore((s) => s.nodes);
  const events = useDigitalTwinStore((s) => s.events);
  const selectNode = useDigitalTwinStore((s) => s.selectNode);

  const gates = useMemo(
    () => nodes.filter((n) => n.data.kind === 'gate'),
    [nodes],
  );

  const alerts = useMemo(
    () => events.filter((e) =>
      e.severity !== 'info' && gates.some((g) => g.id === e.nodeId)
    ),
    [events, gates],
  );

  if (gates.length === 0) {
    return <EmptyLayer title="Gate Layer" message="No gates configured." zoneId={zoneId} />;
  }

  return (
    <section className="space-y-2" aria-label="Gate layer">
      <LayerHeader
        title="Gate Layer"
        count={gates.length}
        subtitle={`${alerts.length} active alert(s)`}
      />

      <div className="grid gap-2">
        {gates.map((gate) => {
          const m = (gate.data.metrics ?? {}) as {
            throughput?: number; queue?: number; utilization?: number;
          };
          const queueHigh = (m.queue ?? 0) > 10;

          return (
            <button
              key={gate.id}
              onClick={() => selectNode(gate.id)}
              className={`w-full rounded-lg border bg-slate-900/50 p-3 text-left transition
                ${queueHigh ? 'border-amber-500/50' : 'border-slate-700 hover:border-blue-500/50'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {gate.data.label}
                </span>
                <StatusPill status={gate.data.status} />
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
                <MetricCell label="Queue" value={m.queue ?? 0} danger={queueHigh} />
                <MetricCell label="Rate" value={`${m.throughput ?? 0}/hr`} />
                <MetricCell label="Util" value={`${((m.utilization ?? 0) * 100).toFixed(0)}%`} />
              </div>
            </button>
          );
        })}
      </div>

      {alerts.length > 0 && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/5 p-2">
          <div className="text-[10px] font-semibold text-red-400 uppercase tracking-wide mb-1">
            Active Alerts
          </div>
          <ul className="space-y-1">
            {alerts.slice(0, 3).map((a) => (
              <li key={a.id} className="text-[10px] text-slate-400">
                <span className="text-red-400 mr-1">●</span>{a.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function MetricCell({ label, value, danger }: {
  label: string; value: string | number; danger?: boolean;
}) {
  return (
    <div>
      <div className="text-slate-500">{label}</div>
      <div className={`font-mono font-semibold tabular-nums ${danger ? 'text-red-400' : 'text-slate-200'}`}>
        {value}
      </div>
    </div>
  );
}
