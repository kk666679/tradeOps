'use client';
import * as React from 'react';
import { BomTreeNode } from './BomTreeNode';
import type { BomTreeNodeData } from './BomTreeNode';
export interface BomTreeProps { roots?: BomTreeNodeData[]; onSelect?: (n: BomTreeNodeData) => void; }
export function BomTree({ roots = [], onSelect }: BomTreeProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(roots.map((r) => r.id)));
  const toggle = (id: string) => setExpanded((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  if (!roots.length) return <div className="p-6 text-center text-xs text-slate-500">No tree.</div>;
  return (
    <div className="rounded-lg border bg-white">
      <ul className="p-2">{roots.map((r) => <BomTreeNode key={r.id} node={r} onSelect={onSelect} expanded={expanded} onToggle={toggle} />)}</ul>
    </div>
  );
}
export default BomTree;
