'use client';

import { useMemo, useState } from 'react';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';

type SortKey = 'dwell' | 'priority' | 'label';

export function TwinTaskQueue({ maxRows = 20 }: { maxRows?: number }) {
  const nodes = useDigitalTwinStore((s) => s.nodes);
  const selectNode = useDigitalTwinStore((s) => s.selectNode);
  const [sort, setSort] = useState<SortKey>('dwell');

  const queue = useMemo(() => {
    const tasks = nodes.filter((n) =>
      n.data.kind === 'task' &&
      ['idle', 'active', 'blocked'].includes(n.data.status)
    );

    const sorted = [...tasks].sort((a, b) => {
      if (sort === 'dwell') {
        const aD = ((a.data.metrics as { dwellHours?: number })?.dwellHours ?? 0);
        const bD = ((b.data.metrics as { dwellHours?: number })?.dwellHours ?? 0);
        return bD - aD;
      }
      if (sort === 'priority') {
        const pa = (a.data.metrics as { priority?: string })?.priority === 'high' ? 1 : 0;
        const pb = (b.data.metrics as { priority?: string })?.priority === 'high' ? 1 : 0;
        return pb - pa;
      }
      return a.data.label.localeCompare(b.data.label);
    });

    return sorted.slice(0, maxRows);
  }, [nodes, sort, maxRows]);

  return (
    <section className="space-y-2">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Task Queue</h3>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="text-[10px] rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200"
        >
          <option value="dwell">By dwell</option>
          <option value="priority">By priority</option>
          <option value="label">By name</option>
        </select>
      </header>

      {queue.length === 0 ? (
        <p className="rounded border border-dashed border-slate-700 bg-slate-900/30 p-3 text-xs text-slate-500">
          Queue is empty.
        </p>
      ) : (
        <table className="w-full text-[11px]">
          <thead className="text-slate-500 text-[10px] uppercase">
            <tr>
              <th className="text-left py-1.5 font-semibold">Task</th>
              <th className="text-right py-1.5 font-semibold w-16">Status</th>
              <th className="text-right py-1.5 font-semibold w-14">Dwell</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((t) => {
              const m = (t.data.metrics ?? {}) as { dwellHours?: number };
              const breach = (m.dwellHours ?? 0) > 72;
              return (
                <tr
                  key={t.id}
                  onClick={() => selectNode(t.id)}
                  className="border-t border-slate-800 cursor-pointer hover:bg-slate-800/40"
                >
                  <td className="py-1.5 text-slate-300 truncate max-w-0">{t.data.label}</td>
                  <td className="py-1.5 text-right">
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      t.data.status === 'blocked' ? 'bg-red-500/20 text-red-300'
                      : t.data.status === 'active' ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-700 text-slate-400'
                    }`}>
                      {t.data.status}
                    </span>
                  </td>
                  <td className={`py-1.5 text-right font-mono tabular-nums ${
                    breach ? 'text-red-400 font-semibold' : 'text-slate-400'
                  }`}>
                    {m.dwellHours ?? '—'}h
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
