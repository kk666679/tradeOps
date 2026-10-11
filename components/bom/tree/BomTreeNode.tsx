'use client';
import * as React from 'react';
export interface BomTreeNodeData { id: string; hsCode: string; description: string; qtyPer: number; uom: string; level: number; children?: BomTreeNodeData[]; }
export interface BomTreeNodeProps { node: BomTreeNodeData; onSelect?: (n: BomTreeNodeData) => void; expanded?: Set<string>; onToggle?: (id: string) => void; }
export function BomTreeNode({ node, onSelect, expanded, onToggle }: BomTreeNodeProps) {
  const isOpen = expanded?.has(node.id) ?? false;
  return (
    <li>
      <div className="flex items-center gap-2 rounded px-2 py-1 text-xs hover:bg-slate-50" style={{ paddingLeft: (node.level * 16 + 8) + 'px' }}>
        {node.children?.length ? (
          <button onClick={() => onToggle?.(node.id)} className="w-3 text-slate-400">{isOpen ? '▾' : '▸'}</button>
        ) : <span className="w-3" />}
        <button onClick={() => onSelect?.(node)} className="flex flex-1 items-center gap-2 text-left">
          <span className="font-mono text-slate-500">{node.hsCode}</span>
          <span className="flex-1 truncate">{node.description}</span>
          <span className="font-mono text-slate-400">{node.qtyPer} {node.uom}</span>
        </button>
      </div>
      {isOpen && node.children?.length ? (
        <ul>{node.children.map((c) => <BomTreeNode key={c.id} node={c} onSelect={onSelect} expanded={expanded} onToggle={onToggle} />)}</ul>
      ) : null}
    </li>
  );
}
export default BomTreeNode;
