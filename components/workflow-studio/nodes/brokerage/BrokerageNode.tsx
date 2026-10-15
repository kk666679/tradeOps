'use client';

import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import type { BrokerageNodeKind } from '../taxonomy';

export interface BrokerageNodeData extends Record<string, unknown> {
  kind: BrokerageNodeKind;
  label: string;
  status?: 'idle' | 'active' | 'blocked' | 'done' | 'error';
}

const KIND_CHROME: Record<
  BrokerageNodeKind,
  { chip: string; border: string; head: string; glyph: string }
> = {
  start:    { chip: 'bg-emerald-500/20 text-emerald-300', border: 'border-emerald-500/60', head: 'bg-emerald-500/10', glyph: '▶' },
  task:     { chip: 'bg-blue-500/20 text-blue-300',       border: 'border-blue-500/60',    head: 'bg-blue-500/10',    glyph: '◆' },
  approval: { chip: 'bg-amber-500/20 text-amber-300',     border: 'border-amber-500/60',   head: 'bg-amber-500/10',   glyph: '✋' },
  decision: { chip: 'bg-violet-500/20 text-violet-300',   border: 'border-violet-500/60',  head: 'bg-violet-500/10',  glyph: '◆' },
  end:      { chip: 'bg-rose-500/20 text-rose-300',       border: 'border-rose-500/60',    head: 'bg-rose-500/10',    glyph: '■' },
};

const STATUS_DOT: Record<string, string> = {
  idle:    'bg-slate-500',
  active:  'bg-emerald-400 animate-pulse',
  blocked: 'bg-amber-400',
  done:    'bg-blue-400',
  error:   'bg-red-500 animate-pulse',
};

export function BrokerageNode({ data, selected }: NodeProps) {
  const d = data as BrokerageNodeData;
  const kind: BrokerageNodeKind = d.kind ?? 'task';
  const chrome = KIND_CHROME[kind] ?? KIND_CHROME.task;

  const hasInput  = kind !== 'start';
  const hasOutput = kind !== 'end';
  const hasBranch = kind === 'decision';

  return (
    <div
      className={cn(
        'relative min-w-[200px] max-w-[280px] rounded-lg border-2 bg-panel backdrop-blur-sm transition-shadow',
        chrome.border,
        selected && 'shadow-[0_0_0_2px_rgb(59_130_246/0.55)]',
      )}
    >
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-2.5 !w-2.5 !rounded-full !border-2 !border-accent !bg-panel-2"
        />
      )}

      <div className={cn('flex items-center gap-2 rounded-t-md border-b border-white/5 px-3 py-1.5', chrome.head)}>
        <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOT[d.status ?? 'idle'])} />
        <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider', chrome.chip)}>
          <span className="mr-1 opacity-70">{chrome.glyph}</span>
          {kind}
        </span>
        <span className="ml-auto text-[10px] uppercase tracking-wide text-txt-3">
          {d.status ?? 'idle'}
        </span>
      </div>

      <div className="px-3 py-2">
        <div className="truncate text-sm font-medium text-txt" title={d.label}>
          {d.label}
        </div>
      </div>

      {hasOutput && !hasBranch && (
        <Handle
          type="source"
          position={Position.Right}
          className="!h-2.5 !w-2.5 !rounded-full !border-2 !border-accent !bg-panel-2"
        />
      )}

      {hasBranch && (
        <>
          <Handle
            type="source"
            id="yes"
            position={Position.Right}
            style={{ top: '35%' }}
            className="!h-2.5 !w-2.5 !rounded-full !border-2 !border-emerald-500 !bg-panel-2"
          />
          <Handle
            type="source"
            id="no"
            position={Position.Right}
            style={{ top: '70%' }}
            className="!h-2.5 !w-2.5 !rounded-full !border-2 !border-rose-500 !bg-panel-2"
          />
          <span className="pointer-events-none absolute right-1 top-[30%] text-[9px] font-bold uppercase text-emerald-400">
            yes
          </span>
          <span className="pointer-events-none absolute right-1 top-[65%] text-[9px] font-bold uppercase text-rose-400">
            no
          </span>
        </>
      )}
    </div>
  );
}

export default BrokerageNode;
