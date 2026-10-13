'use client';

import { useMemo } from 'react';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';
import { LayerHeader, EmptyLayer } from './TwinBondedLayer';

export function TwinMovementLayer({ zoneId }: { zoneId: string }) {
  const nodes = useDigitalTwinStore((s) => s.nodes);
  const edges = useDigitalTwinStore((s) => s.edges);
  const selectNode = useDigitalTwinStore((s) => s.selectNode);

  const movements = useMemo(
    () => nodes.filter((n) => n.data.kind === 'movement'),
    [nodes],
  );

  const flowEdges = useMemo(
    () => edges.filter((e) => e.data?.kind === 'flow'),
    [edges],
  );

  if (movements.length === 0) {
    return <EmptyLayer title="Movement Layer" message="No movements in transit." zoneId={zoneId} />;
  }

  return (
    <section className="space-y-2" aria-label="Movement layer">
      <LayerHeader
        title="Movement Layer"
        count={movements.length}
        subtitle={`${flowEdges.length} active flow(s)`}
      />

      <ol className="space-y-1.5">
        {movements.map((n) => {
          const m = (n.data.metrics ?? {}) as { eta?: number; distance?: number };
          return (
            <li key={n.id}>
              <button
                onClick={() => selectNode(n.id)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 p-2.5 text-left hover:border-blue-500/50 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {n.data.label}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">
                    {n.data.status}
                  </span>
                </div>
                {(m.eta != null || m.distance != null) && (
                  <div className="mt-1.5 flex gap-3 text-[10px] text-slate-500">
                    {m.eta != null && (
                      <span>ETA: <span className="font-mono text-slate-300">{m.eta} min</span></span>
                    )}
                    {m.distance != null && (
                      <span>Dist: <span className="font-mono text-slate-300">{m.distance} km</span></span>
                    )}
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
