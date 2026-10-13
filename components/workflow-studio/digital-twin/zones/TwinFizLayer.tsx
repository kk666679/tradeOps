'use client';

import { useMemo } from 'react';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';
import { LayerHeader, EmptyLayer } from './TwinBondedLayer';

export function TwinFizLayer({ zoneId }: { zoneId: string }) {
  const nodes = useDigitalTwinStore((s) => s.nodes);
  const selectNode = useDigitalTwinStore((s) => s.selectNode);

  const fizNodes = useMemo(
    () => nodes.filter((n) => {
      const t = String(n.data.meta?.semanticType ?? '');
      return t.includes('Fiz') ||
        /production|material|finished|bom|wastage/i.test(n.data.label);
    }),
    [nodes],
  );

  if (fizNodes.length === 0) {
    return <EmptyLayer title="FIZ Production" message="No FIZ nodes mapped." zoneId={zoneId} />;
  }

  const autonomous = fizNodes.filter((n) => n.data.status === 'active');
  const assisted = fizNodes.filter((n) => n.data.status !== 'active');

  return (
    <section className="space-y-3" aria-label="FIZ production layer">
      <LayerHeader title="FIZ Production Layer" count={fizNodes.length} />
      <MaturityGroup
        title="Autonomous (L3)"
        tone="emerald"
        nodes={autonomous}
        onSelect={selectNode}
      />
      <MaturityGroup
        title="Assisted (L2)"
        tone="amber"
        nodes={assisted}
        onSelect={selectNode}
      />
    </section>
  );
}

function MaturityGroup({
  title, tone, nodes, onSelect,
}: {
  title: string;
  tone: 'emerald' | 'amber';
  nodes: Array<{ id: string; data: { label: string; metrics?: Record<string, unknown> } }>;
  onSelect: (id: string) => void;
}) {
  if (nodes.length === 0) return null;
  const text = tone === 'emerald' ? 'text-emerald-400' : 'text-amber-400';
  return (
    <div>
      <div className={`text-[10px] font-bold uppercase tracking-wide mb-1.5 ${text}`}>
        {title} · {nodes.length}
      </div>
      <div className="grid gap-1.5">
        {nodes.map((n) => (
          <button
            key={n.id}
            onClick={() => onSelect(n.id)}
            className="w-full rounded border border-slate-700 bg-slate-900/50 px-2.5 py-2 text-left text-xs hover:border-blue-500/50 transition"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-200 truncate">{n.data.label}</span>
              <span className="text-[9px] text-slate-500 tabular-nums">
                {Object.keys(n.data.metrics ?? {}).length}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
