'use client';

import * as React from 'react';
import Link from 'next/link';
import { WORKFLOW_DIRECTORY, type WorkflowDirectoryEntry } from '../brokerage/data';

export interface WorkflowDirectoryProps {
  entries?: WorkflowDirectoryEntry[];
  className?: string;
}

const DOMAIN_LABEL: Record<WorkflowDirectoryEntry['domain'], string> = {
  brokerage: 'Brokerage',
  fiz: 'FIZ',
  fcz: 'FCZ',
  wms: 'WMS',
  cargo: 'Cargo',
  'order-management': 'Order management',
};

const DOMAIN_COLOR: Record<WorkflowDirectoryEntry['domain'], string> = {
  brokerage: '#3b82f6',
  fiz: '#10b981',
  fcz: '#8b5cf6',
  wms: '#f59e0b',
  cargo: '#06b6d4',
  'order-management': '#ec4899',
};

const STATUS_STYLE: Record<WorkflowDirectoryEntry['status'], { color: string; label: string }> = {
  live: { color: '#10b981', label: 'Live' },
  draft: { color: '#f59e0b', label: 'Draft' },
  deprecated: { color: '#71717a', label: 'Deprecated' },
};

export function WorkflowDirectory({ entries = WORKFLOW_DIRECTORY, className = '' }: WorkflowDirectoryProps) {
  const [domain, setDomain] = React.useState<WorkflowDirectoryEntry['domain'] | 'all'>('all');
  const [query, setQuery] = React.useState('');

  const domains = React.useMemo(
    () => ['all', ...new Set(entries.map((e) => e.domain))] as const,
    [entries],
  );

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (domain !== 'all' && entry.domain !== domain) return false;
      if (!needle) return true;
      return (
        entry.name.toLowerCase().includes(needle) ||
        entry.description.toLowerCase().includes(needle)
      );
    });
  }, [entries, domain, query]);

  return (
    <section className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] p-0.5">
          {domains.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setDomain(value as WorkflowDirectoryEntry['domain'] | 'all')}
              aria-pressed={domain === value}
              className={`rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                domain === value
                  ? 'bg-[var(--bg-subtle)] text-[var(--text)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {value === 'all' ? 'All domains' : DOMAIN_LABEL[value]}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search workflows…"
          aria-label="Search workflows"
          className="h-8 w-full rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3 font-mono text-[11px] text-[var(--text)] outline-none placeholder:text-[var(--text-faint)] focus:border-[hsl(var(--primary))] sm:w-64"
        />
      </div>

      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        {filtered.length} workflow{filtered.length === 1 ? '' : 's'}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-[12px] text-[var(--text-muted)]">
          No workflows match the current filters.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((entry) => {
            const status = STATUS_STYLE[entry.status];
            return (
              <li key={entry.id}>
                <Link
                  href={entry.href}
                  className="flex h-full flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4 transition-colors hover:border-[hsl(var(--primary)/0.5)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[13px] font-semibold text-[var(--text)]">{entry.name}</h3>
                    <span
                      className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider"
                      style={{ background: `${status.color}15`, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>

                  <p className="text-[11.5px] leading-relaxed text-[var(--text-secondary)]">
                    {entry.description}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                    <span
                      className="rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                      style={{
                        background: `${DOMAIN_COLOR[entry.domain]}15`,
                        color: DOMAIN_COLOR[entry.domain],
                      }}
                    >
                      {DOMAIN_LABEL[entry.domain]}
                    </span>
                    <span className="font-mono text-[9.5px] text-[var(--text-muted)]">
                      {entry.stepCount} steps
                    </span>
                    {entry.agentCount > 0 && (
                      <span className="font-mono text-[9.5px] text-[var(--text-muted)]">
                        · {entry.agentCount} agents
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default WorkflowDirectory;