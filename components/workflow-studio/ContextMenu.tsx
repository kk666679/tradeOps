'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useStudio } from '@/lib/workflow-studio/store';
import { definitions } from '@/lib/workflow-studio/node-definitions';
import { getSupportedOperations } from '@/lib/workflow-studio/logic';

interface Item {
  type?: 'sep' | 'label';
  text?: string;
  shortcut?: string;
  disabled?: boolean;
  action?: () => void;
}

export function ContextMenu() {
  const ctx = useStudio((s) => s.contextMenu);
  const setContextMenu = useStudio((s) => s.setContextMenu);
  const nodes = useStudio((s) => s.nodes);
  const selNodes = useStudio((s) => s.selNodes);
  const selEdges = useStudio((s) => s.selEdges);
  const clipboard = useStudio((s) => s.clipboard);
  const snapToGrid = useStudio((s) => s.snapToGrid);
  const supported = useStudio((s) =>
    getSupportedOperations(s.mode, s.prodEnabled, s.transport),
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctx) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setContextMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenu(null);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [ctx, setContextMenu]);

  const items = useMemo<Item[]>(() => {
    if (!ctx) return [];
    const s = useStudio.getState();

    if (ctx.kind === 'node') {
      const node = ctx.target ? nodes.find((n) => n.id === ctx.target) : null;
      const hasHs = !!(node && node.hsCode);
      const target = ctx.target ?? [...selNodes][0];
      return [
        { type: 'label', text: `${selNodes.size} node(s) selected` },
        ...(target
          ? [{
              text: hasHs ? 'Change HS code…' : 'Attach HS code…',
              shortcut: 'H',
              action: () => s.openHsPicker(target),
            }]
          : []),
        ...(hasHs && target
          ? [{
              text: 'Remove HS code',
              action: () => { s.openHsPicker(target); s.clearHsCode(); },
            }]
          : []),
        { type: 'sep' },
        {
          text: 'Cut', shortcut: 'Ctrl+X', disabled: !selNodes.size,
          action: () => { s.copySelection(); s.deleteSelected(); },
        },
        {
          text: 'Copy', shortcut: 'Ctrl+C', disabled: !selNodes.size,
          action: () => s.copySelection(),
        },
        {
          text: 'Duplicate', shortcut: 'Ctrl+D', disabled: !selNodes.size,
          action: () => s.duplicateSelection(),
        },
        {
          text: 'Paste', shortcut: 'Ctrl+V',
          disabled: !clipboard?.nodes.length,
          action: () => s.pasteClipboard(),
        },
        { type: 'sep' },
        {
          text: 'Delete', shortcut: 'Del', disabled: !selNodes.size,
          action: () => s.deleteSelected(),
        },
      ];
    }

    if (ctx.kind === 'edge') {
      return [
        { type: 'label', text: 'Edge' },
        {
          text: 'Delete edge', shortcut: 'Del',
          disabled: !selEdges.size,
          action: () => s.deleteSelected(),
        },
        { type: 'sep' },
        { text: 'Select all', shortcut: 'Ctrl+A', action: () => s.selectAll() },
      ];
    }

    return [
      { type: 'label', text: 'Canvas' },
      { text: 'Select all', shortcut: 'Ctrl+A', action: () => s.selectAll() },
      { text: 'Auto-layout', action: () => s.autoLayout() },
      { text: 'Fit to view', shortcut: 'Ctrl+1', action: () => s.fitView() },
      {
        text: (snapToGrid ? 'Disable' : 'Enable') + ' snap to grid',
        shortcut: 'Ctrl+G',
        action: () => s.setSnapToGrid((v) => !v),
      },
      { type: 'sep' },
      {
        text: 'Paste', shortcut: 'Ctrl+V',
        disabled: !clipboard?.nodes.length,
        action: () => s.pasteClipboard(),
      },
      { type: 'sep' },
      { type: 'label', text: 'Add node' },
      ...definitions
        .filter((d) => !d.requires || supported.includes(d.requires))
        .slice(0, 8)
        .map((d) => ({
          text: d.label,
          action: () => s.addNode(d),
        })),
    ];
  }, [ctx, nodes, selNodes, selEdges, clipboard, snapToGrid, supported, setContextMenu]);

  if (!ctx) return null;

  return (
    <div
      ref={ref}
      className="bws-ctx"
      style={{ left: ctx.x, top: ctx.y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((it, i) => {
        if (it.type === 'sep') return <div key={i} className="bws-ctx-sep" />;
        if (it.type === 'label') return <div key={i} className="bws-ctx-label">{it.text}</div>;
        return (
          <button
            key={i}
            className="bws-ctx-item"
            disabled={it.disabled}
            onClick={() => { it.action?.(); setContextMenu(null); }}
          >
            <span>{it.text}</span>
            {it.shortcut && <kbd>{it.shortcut}</kbd>}
          </button>
        );
      })}
    </div>
  );
}
