'use client';

import { useMemo } from 'react';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';

export function TwinBondedLayer({ zoneId }: { zoneId: string }) {
  const nodes = useDigitalTwinStore((s) => s.nodes);
  const selectNode = useDigitalTwinStore((s) => s.selectNode);

  const bonded = useMemo(
    () => nodes.filter((n) =>
      n.data.kind === 'buffer' || n.data.meta?.semanticType === 'customs:Buffer'
    ),
    [nodes],
  );

  if (bonded.length === 0) {
    return (
      <EmptyLayer
        title="Bonded Layer"
        message="No bonded storage nodes in this zone."
        zoneId={zoneId}
      />
    );
  }

  return (
    <section className="space-y-2" aria-label="Bonded warehouse layer">
      <LayerHeader title="Bonded Layer" count={bonded.length} />

      <div className="grid gap-2">
        {bonded.map((n) => {
          const m = (n.data.metrics ?? {}) as {
            level?: number; capacity?: number; utilization?: number;
          };
          const level = m.level ?? 0;
          const capacity = m.capacity ?? 1;
          const pct = Math.min(100, (level / capacity) * 100);
          const over = pct > 90;

          return (
            <button
              key={n.id}
              onClick={() => selectNode(n.id)}
              className={`w-full rounded-lg border bg-slate-900/50 p-3 text-left transition
                ${over ? 'border-red-500/50' : 'border-slate-700 hover:border-blue-500/50'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {n.data.label}
                </span>
                <StatusPill status={n.data.status} />
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
                <span className="tabular-nums">
                  {level.toLocaleString()} / {capacity.toLocaleString()}
                </span>
                <span className="tabular-nums">{pct.toFixed(1)}%</span>
              </div>

              {over && (
                <div className="mt-2 text-[10px] text-red-400 font-semibold">
                  ⚠ Guarantee threshold exceeded
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ── shared sub-components ────────────────────────────────── */

export function LayerHeader({ title, count, subtitle }: {
  title: string; count: number; subtitle?: string;
}) {
  return (
    <header className="flex items-start justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        {subtitle && (
          <p className="text-[10px] text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      <span className="text-xs text-slate-400 tabular-nums">{count}</span>
    </header>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === 'error' || status === 'blocked' ? 'bg-red-500/20 text-red-300'
    : status === 'active' ? 'bg-emerald-500/20 text-emerald-300'
    : 'bg-slate-700 text-slate-400';
  return (
    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${tone}`}>
      {status}
    </span>
  );
}

export function EmptyLayer({ title, message, zoneId }: {
  title: string; message: string; zoneId?: string;
}) {
  return (
    <section className="space-y-2">
      <LayerHeader title={title} count={0} />
      <p className="rounded-lg border border-dashed border-slate-700 bg-slate-900/30 p-4 text-xs text-slate-500">
        {message}
        {zoneId && (
          <span className="block mt-1 text-[10px] font-mono text-slate-600">
            zone: {zoneId}
          </span>
        )}
      </p>
    </section>
  );
}
