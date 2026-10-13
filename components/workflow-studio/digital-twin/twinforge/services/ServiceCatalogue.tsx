'use client';

import { useMemo } from 'react';
import { useTwinForgeStore } from '../store/useTwinForgeStore';
import { SERVICE_LAYERS } from '@/lib/twinforge/catalog';
import type { ServiceDefinition } from '@/lib/twinforge/types';
import { StatusPill } from '../primitives/StatusPill';
import { Card } from '../primitives/Card';

interface Props {
  services: ServiceDefinition[];
}

export function ServiceCatalogue({ services }: Props) {
  const filters = useTwinForgeStore((s) => s.filters);
  const setFilter = useTwinForgeStore((s) => s.setFilter);
  const selectService = useTwinForgeStore((s) => s.selectService);

  const filtered = useMemo(() => {
    const q = filters.query.toLowerCase().trim();
    return services.filter((s) => {
      if (filters.layer !== 'all' && s.layer !== filters.layer) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.tags.some((t) => t.includes(q))
      );
    });
  }, [services, filters]);

  return (
    <Card
      title="Service Catalogue"
      subtitle={`${filtered.length} of ${services.length} services`}
      action={
        <div className="flex flex-wrap gap-1">
          <LayerChip
            active={filters.layer === 'all'}
            onClick={() => setFilter('layer', 'all')}
            label="All"
          />
          {SERVICE_LAYERS.map((l) => (
            <LayerChip
              key={l.id}
              active={filters.layer === l.id}
              onClick={() => setFilter('layer', l.id)}
              label={l.short}
            />
          ))}
        </div>
      }
    >
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-xs text-slate-500">
          No services match the current filter.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => selectService(s.id)}
              className="group flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-left transition hover:border-violet-500/50 hover:bg-slate-900/60"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-violet-300">{s.code}</span>
                <StatusPill
                  tone={
                    s.maturity === 'ga' ? 'ok'
                    : s.maturity === 'preview' ? 'info'
                    : s.maturity === 'beta' ? 'warn'
                    : 'muted'
                  }
                >
                  {s.maturity}
                </StatusPill>
              </div>

              <div className="text-[13px] font-medium text-slate-100 group-hover:text-violet-200">
                {s.name}
              </div>

              <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-3">
                {s.summary}
              </p>

              <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-500">
                <span className="font-mono">{s.sla}</span>
                <span className="text-violet-400 opacity-0 transition group-hover:opacity-100">
                  View details →
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

function LayerChip({
  active, onClick, label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition ${
        active
          ? 'bg-violet-600 text-white'
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
      }`}
    >
      {label}
    </button>
  );
}
