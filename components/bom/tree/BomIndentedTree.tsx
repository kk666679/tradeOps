'use client';
import * as React from 'react';
import type { BomTreeNodeData } from './BomTreeNode';
export interface BomIndentedTreeProps { roots?: BomTreeNodeData[]; }
export function BomIndentedTree({ roots = [] }: BomIndentedTreeProps) {
  const flat: BomTreeNodeData[] = [];
  const walk = (nodes: BomTreeNodeData[]) => nodes.forEach((n) => { flat.push(n); if (n.children) walk(n.children); });
  walk(roots);
  return (
    <div className="rounded-lg border bg-white p-2 font-mono text-xs">
      {flat.map((n) => (
        <div key={n.id} className="py-0.5" style={{ paddingLeft: (n.level * 16) + 'px' }}>
          <span className="text-slate-400">{'· '.repeat(n.level)}</span>
          <span>{n.hsCode}</span> <span className="text-slate-500">{n.description}</span> <span className="text-slate-400">{n.qtyPer} {n.uom}</span>
        </div>
      ))}
    </div>
  );
}
export default BomIndentedTree;
