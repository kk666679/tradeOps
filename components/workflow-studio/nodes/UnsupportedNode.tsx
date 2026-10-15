'use client';

import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';

/**
 * Fallback for node types the canvas doesn't have a renderer for.
 * Preserves the original type so save can round-trip it intact.
 */
export function UnsupportedNode({ data, selected }: NodeProps) {
  const d = data as { label?: string; _originalType?: string };

  return (
    <div
      className={[
        'min-w-[200px] max-w-[280px] rounded-lg border-2 border-dashed border-slate-600 bg-panel',
        'backdrop-blur-sm',
        selected ? 'shadow-[0_0_0_2px_rgb(59_130_246/0.55)]' : '',
      ].join(' ')}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !rounded-full !border-2 !border-slate-500 !bg-panel-2"
      />

      <div className="flex items-center gap-2 rounded-t-md border-b border-white/5 bg-slate-800/60 px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-300">
          unsupported
        </span>
      </div>

      <div className="px-3 py-2">
        <div className="truncate text-sm font-medium text-txt" title={d.label}>
          {d.label ?? d._originalType ?? 'Unknown node'}
        </div>
        <div className="mt-1 text-[10px] text-txt-3">
          Preserved on save · blocked at run
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !rounded-full !border-2 !border-slate-500 !bg-panel-2"
      />
    </div>
  );
}

export default UnsupportedNode;
