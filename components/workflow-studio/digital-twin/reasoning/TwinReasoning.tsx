'use client';

import { useMemo } from 'react';
import {
  useDigitalTwinStore,
  selectSelectedNode,
} from '../store/useDigitalTwinStore';

export function TwinReasoning() {
  const node = useDigitalTwinStore(selectSelectedNode);
  const events = useDigitalTwinStore((s) => s.events);

  const relatedEvents = useMemo(
    () => node
      ? events.filter((e) => e.nodeId === node.id).slice(0, 10)
      : [],
    [events, node],
  );

  if (!node) {
    return (
      <div className="p-4 text-xs text-slate-500">
        Select a node to inspect its reasoning trace.
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      <header>
        <h3 className="text-sm font-semibold text-slate-100">{node.data.label}</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">
          Reasoning trace · {relatedEvents.length} entr(ies)
        </p>
      </header>

      {relatedEvents.length === 0 ? (
        <p className="text-[11px] text-slate-500">
          No reasoning events recorded for this node.
        </p>
      ) : (
        <ol className="space-y-2 border-l border-slate-800 pl-3 ml-1">
          {relatedEvents.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-blue-500" />
              <div className="text-[11px] text-slate-300">{e.message}</div>
              <div className="text-[9px] text-slate-600 mt-0.5 font-mono tabular-nums">
                {new Date(e.at).toLocaleTimeString()} · {e.kind}
              </div>
              {e.payload && (
                <pre className="mt-1 rounded bg-slate-900/60 border border-slate-800 p-1.5 text-[9px] text-slate-400 overflow-x-auto font-mono">
                  {JSON.stringify(e.payload, null, 2)}
                </pre>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
