'use client';

import { useMemo } from 'react';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';
import { LayerHeader, StatusPill, EmptyLayer } from './TwinBondedLayer';

export function TwinFczLayer({ zoneId }: { zoneId: string }) {
  const nodes = useDigitalTwinStore((s) => s.nodes);
  const selectNode = useDigitalTwinStore((s) => s.selectNode);

  const fczNodes = useMemo(
    () => nodes.filter((n) => {
      const t = String(n.data.meta?.semanticType ?? '');
      return t.includes('Fcz') ||
        /transhipment|reexport|re-export|break-bulk|entrepot|value-add/i.test(n.data.label);
    }),
    [nodes],
  );

  if (fczNodes.length === 0) {
    return <EmptyLayer title="FCZ Commercial" message="No commercial flows mapped." zoneId={zoneId} />;
  }

  return (
    <section className="space-y-2" aria-label="FCZ commercial layer">
      <LayerHeader
        title="FCZ Commercial Layer"
        count={fczNodes.length}
        subtitle="Transhipment · re-export · entrepot"
      />

      <div className="grid gap-2">
        {fczNodes.map((n) => {
          const m = (n.data.metrics ?? {}) as Record<string, number>;
          const entries = Object.entries(m).slice(0, 3);
          return (
            <button
              key={n.id}
              onClick={() => selectNode(n.id)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/50 p-2.5 text-left hover:border-blue-500/50 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {n.data.label}
                </span>
                <StatusPill status={n.data.status} />
              </div>
              {entries.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-2.5 text-[10px] text-slate-500">
                  {entries.map(([k, v]) => (
                    <span key={k}>
                      {k}: <span className="font-mono text-slate-300">{v}</span>
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
