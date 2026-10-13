'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { TwinNodeData } from '@/lib/digital-twin/types';

const KIND_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  zone:     { bg: 'bg-sky-500/10',     border: 'border-sky-500/50',     text: 'text-sky-300' },
  agent:    { bg: 'bg-violet-500/10',  border: 'border-violet-500/50',  text: 'text-violet-300' },
  task:     { bg: 'bg-amber-500/10',   border: 'border-amber-500/50',   text: 'text-amber-300' },
  gate:     { bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', text: 'text-emerald-300' },
  movement: { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/50',    text: 'text-cyan-300' },
  resource: { bg: 'bg-rose-500/10',    border: 'border-rose-500/50',    text: 'text-rose-300' },
  buffer:   { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/50',  text: 'text-indigo-300' },
};

const STATUS_DOT: Record<string, string> = {
  idle:    'bg-slate-400',
  active:  'bg-emerald-400',
  blocked: 'bg-amber-400 animate-pulse',
  done:    'bg-sky-400',
  error:   'bg-red-500 animate-pulse',
};

function TwinNodeInner({ data, selected }: NodeProps) {
  const d = data as TwinNodeData;
  const style = KIND_STYLE[d.kind] ?? KIND_STYLE.task;
  const metrics = d.metrics ?? {};
  const metricKeys = Object.keys(metrics).slice(0, 3);

  return (
    <div
      className={`
        min-w-[200px] max-w-[260px] rounded-lg border-2 ${style.border} ${style.bg}
        ${selected ? 'ring-2 ring-blue-400 shadow-lg' : ''}
        backdrop-blur-sm transition-all
      `}
    >
      <Handle type="target" position={Position.Left} className="!bg-blue-500 !w-2 !h-2" />

      <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
        <span className={`inline-block w-2 h-2 rounded-full ${STATUS_DOT[d.status] ?? STATUS_DOT.idle}`} />
        <span className={`text-[10px] uppercase tracking-wider font-bold ${style.text}`}>
          {d.kind}
        </span>
        <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-500">
          {d.status}
        </span>
      </div>

      <div className="px-3 py-2">
        <div className="text-sm font-medium text-slate-100 truncate" title={d.label}>
          {d.label}
        </div>

        {metricKeys.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-1">
            {metricKeys.map((k) => (
              <div key={k} className="text-[10px] text-slate-400">
                <span className="text-slate-500">{k}:</span>{' '}
                <span className="text-slate-200 font-mono tabular-nums">
                  {typeof metrics[k] === 'number'
                    ? metrics[k]!.toLocaleString()
                    : String(metrics[k])}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="!bg-blue-500 !w-2 !h-2" />
    </div>
  );
}

export const TwinNode = memo(TwinNodeInner);
export default TwinNode;
