'use client';

import { useMemo, useState } from 'react';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';

const COLUMNS = [
  { id: 'idle',    label: 'Pending' },
  { id: 'active',  label: 'Active' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'done',    label: 'Completed' },
] as const;

type ColumnId = typeof COLUMNS[number]['id'];

export function TwinTaskBoard() {
  const nodes = useDigitalTwinStore((s) => s.nodes);
  const selectNode = useDigitalTwinStore((s) => s.selectNode);
  const [filter, setFilter] = useState<'all' | 'high'>('all');

  const tasks = useMemo(
    () => nodes.filter((n) => n.data.kind === 'task'),
    [nodes],
  );

  const byColumn = useMemo(() => {
    const map: Record<ColumnId, typeof tasks> = {
      idle: [], active: [], blocked: [], done: [],
    };
    tasks.forEach((t) => {
      const s = t.data.status as ColumnId;
      if (map[s]) map[s].push(t);
      else map.idle.push(t);
    });
    return map;
  }, [tasks]);

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Task Board</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {tasks.length} tasks across {COLUMNS.length} states
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'high')}
          className="text-[10px] rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200"
        >
          <option value="all">All priorities</option>
          <option value="high">High only</option>
        </select>
      </header>

      <div className="grid grid-cols-4 gap-2">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={byColumn[col.id]}
            filter={filter}
            onSelect={selectNode}
          />
        ))}
      </div>
    </section>
  );
}

function Column({
  column, tasks, filter, onSelect,
}: {
  column: typeof COLUMNS[number];
  tasks: Array<{ id: string; data: { label: string; metrics?: Record<string, unknown> } }>;
  filter: 'all' | 'high';
  onSelect: (id: string) => void;
}) {
  const filtered = filter === 'high'
    ? tasks.filter((t) => (t.data.metrics as { priority?: string })?.priority === 'high')
    : tasks;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {column.label}
        </span>
        <span className="text-[10px] text-slate-500 tabular-nums">{filtered.length}</span>
      </div>

      <div className="space-y-1.5 min-h-[80px]">
        {filtered.length === 0 ? (
          <div className="text-[10px] text-slate-600 text-center py-4">—</div>
        ) : (
          filtered.map((t) => {
            const m = (t.data.metrics ?? {}) as { priority?: string; dwellHours?: number };
            const high = m.priority === 'high';
            return (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                className={`w-full text-left rounded border p-2 transition ${
                  high
                    ? 'border-red-500/40 bg-red-500/5 hover:border-red-500'
                    : 'border-slate-700 bg-slate-900/60 hover:border-blue-500/50'
                }`}
              >
                <div className="text-[11px] font-medium text-slate-200 leading-tight line-clamp-2">
                  {t.data.label}
                </div>
                {m.dwellHours !== undefined && (
                  <div className={`mt-1 text-[9px] tabular-nums ${
                    m.dwellHours > 72 ? 'text-red-400 font-semibold' : 'text-slate-500'
                  }`}>
                    {m.dwellHours}h dwell
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
