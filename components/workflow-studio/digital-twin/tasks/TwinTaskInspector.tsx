'use client';

import {
  useDigitalTwinStore,
  selectSelectedNode,
} from '../store/useDigitalTwinStore';

export function TwinTaskInspector() {
  const node = useDigitalTwinStore(selectSelectedNode);
  const edges = useDigitalTwinStore((s) => s.edges);

  if (!node) {
    return (
      <div className="p-4 text-xs text-slate-500">
        Select a node on the canvas.
      </div>
    );
  }

  const metrics = (node.data.metrics ?? {}) as Record<string, unknown>;
  const inbound = edges.filter((e) => e.target === node.id);
  const outbound = edges.filter((e) => e.source === node.id);

  return (
    <div className="space-y-4 p-4">
      <header>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500">
            {node.data.kind}
          </span>
          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
            node.data.status === 'blocked' ? 'bg-red-500/20 text-red-300'
            : node.data.status === 'active' ? 'bg-emerald-500/20 text-emerald-300'
            : 'bg-slate-700 text-slate-400'
          }`}>
            {node.data.status}
          </span>
        </div>
        <h3 className="text-sm font-semibold mt-1 text-slate-100">{node.data.label}</h3>
        {node.data.meta?.semanticType != null && (
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
            {String(node.data.meta.semanticType)}
          </p>
        )}
      </header>

      <Section title="Metrics">
        {Object.keys(metrics).length === 0 ? (
          <p className="text-[11px] text-slate-500">No metrics recorded.</p>
        ) : (
          <dl className="grid grid-cols-2 gap-2 text-[11px]">
            {Object.entries(metrics).map(([k, v]) => (
              <div key={k}>
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-mono font-semibold tabular-nums text-slate-200">
                  {String(v)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Section>

      <Section title="Edges">
        <div className="text-[11px] space-y-2">
          <div>
            <div className="text-slate-500">Inbound ({inbound.length})</div>
            <ul className="mt-1 space-y-0.5">
              {inbound.length === 0
                ? <li className="text-slate-600 text-[10px]">—</li>
                : inbound.map((e) => (
                    <li key={e.id} className="font-mono text-[10px] text-slate-300">
                      ← {e.source}
                      {e.data?.kind && (
                        <span className="ml-2 text-slate-500">{e.data.kind}</span>
                      )}
                    </li>
                  ))}
            </ul>
          </div>
          <div>
            <div className="text-slate-500">Outbound ({outbound.length})</div>
            <ul className="mt-1 space-y-0.5">
              {outbound.length === 0
                ? <li className="text-slate-600 text-[10px]">—</li>
                : outbound.map((e) => (
                    <li key={e.id} className="font-mono text-[10px] text-slate-300">
                      → {e.target}
                      {e.data?.kind && (
                        <span className="ml-2 text-slate-500">{e.data.kind}</span>
                      )}
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Position">
        <div className="text-[11px] font-mono text-slate-300 tabular-nums">
          x: {node.position.x.toFixed(0)} · y: {node.position.y.toFixed(0)}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">
        {title}
      </h4>
      {children}
    </section>
  );
}
