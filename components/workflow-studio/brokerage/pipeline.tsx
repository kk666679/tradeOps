'use client';

import * as React from 'react';
import type { Declaration } from '../types';

export interface BrokeragePipelineProps {
  declarations?: Declaration[];
  /** Column ordering; defaults to the live declaration statuses. */
  columns?: string[];
  className?: string;
}

/** Canonical declaration pipeline columns, in lifecycle order. */
const DEFAULT_COLUMNS = [
  'draft',
  'classifying',
  'awaiting-approval',
  'filed',
  'channel-yellow',
  'channel-green',
  'cleared',
];

const COLUMN_META: Record<string, { label: string; accent: string }> = {
  draft: { label: 'Draft', accent: '#71717a' },
  classifying: { label: 'Classifying', accent: '#8b5cf6' },
  'awaiting-approval': { label: 'Awaiting approval', accent: '#f59e0b' },
  filed: { label: 'Filed', accent: '#3b82f6' },
  'channel-yellow': { label: 'Yellow lane', accent: '#f59e0b' },
  'channel-green': { label: 'Green lane', accent: '#10b981' },
  'channel-red': { label: 'Red lane', accent: '#ef4444' },
  cleared: { label: 'Cleared', accent: '#10b981' },
};

const FLAG_META: Record<string, { label: string; color: string }> = {
  'low-draft-confidence': { label: 'low confidence', color: '#f59e0b' },
  'rcep-origin-doc-required': { label: 'RCEP origin doc', color: '#3b82f6' },
  'fiz-bonded-intake': { label: 'bonded intake', color: '#8b5cf6' },
  'red-lane-inspection': { label: 'inspection', color: '#ef4444' },
  'no-line-items': { label: 'no line items', color: '#71717a' },
  'authorization-not-signed': { label: 'auth not signed', color: '#ef4444' },
};

const formCodeLabel = (code: string) => {
  const meta: Record<string, string> = {
    K1: 'K1 · Import',
    K2: 'K2 · Export',
    K3: 'K3 · Re-export',
    K7: 'K7 · Transit',
    K8: 'K8 · Entrepôt',
    K9: 'K9 · Transhipment',
  };
  return meta[code] ?? code;
};

function fmtValue(value: number | undefined, currency: string): string {
  if (typeof value !== 'number' || value === 0) return '—';
  if (value >= 1_000_000) {
    return `${currency} ${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${currency} ${(value / 1000).toFixed(0)}K`;
  }
  return `${currency} ${value.toLocaleString()}`;
}

function confidenceLabel(confidence?: number): string {
  return typeof confidence === 'number'
    ? `${Math.round(confidence * 100)}% draft confidence`
    : 'manual draft';
}

function declaredCount(declaration: Declaration): number {
  return declaration.lineItems?.length ?? 0;
}

export function BrokeragePipeline({
  declarations = [],
  columns = DEFAULT_COLUMNS,
  className = '',
}: BrokeragePipelineProps) {
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'flagged' | 'low-confidence'>('all');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const columnsToRender = React.useMemo(() => {
    const seen = new Set(columns);
    const extra = [...new Set(declarations.map((d) => d.status))].filter((s) => !seen.has(s));
    return [...columns, ...extra];
  }, [columns, declarations]);

  const filtered = React.useMemo(() => {
    if (filter === 'flagged') return declarations.filter((d) => (d.flags?.length ?? 0) > 0);
    if (filter === 'low-confidence') {
      return declarations.filter((d) => (d.draftConfidence ?? 1) < 0.8);
    }
    return declarations;
  }, [declarations, filter]);

  const byColumn = React.useMemo(() => {
    const map = new Map<string, Declaration[]>();
    for (const column of columnsToRender) map.set(column, []);
    for (const declaration of filtered) {
      const list = map.get(declaration.status);
      if (list) list.push(declaration);
      else map.set(declaration.status, [declaration]);
    }
    return map;
  }, [columnsToRender, filtered]);

  const handleDragStart = (event: React.DragEvent<HTMLElement>, id: string) => {
    setDraggedId(id);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>, column: string) => {
    event.preventDefault();
    const id = draggedId ?? event.dataTransfer.getData('text/plain');
    setDragOverColumn(null);
    setDraggedId(null);
    if (!id) return;
    // Status transitions are validated server-side by the declaration procedure.
    // eslint-disable-next-line no-console
    console.info('[brokerage.pipeline] transition', id, '→', column);
  };

  return (
    <section className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] p-0.5">
          {(
            [
              ['all', 'All'],
              ['flagged', 'Flagged'],
              ['low-confidence', 'Low confidence'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                filter === key
                  ? 'bg-[var(--bg-subtle)] text-[var(--text)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          {filtered.length} of {declarations.length} declarations
        </span>
      </div>

      {declarations.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-[12px] text-[var(--text-muted)]">
          No declarations in the pipeline.
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {columnsToRender.map((column) => {
            const items = byColumn.get(column) ?? [];
            const meta = COLUMN_META[column] ?? { label: column, accent: '#71717a' };
            const isTarget = dragOverColumn === column;

            return (
              <div
                key={column}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOverColumn(column);
                }}
                onDragLeave={() => setDragOverColumn((prev) => (prev === column ? null : prev))}
                onDrop={(event) => handleDrop(event, column)}
                className="flex w-[268px] shrink-0 flex-col rounded-xl border bg-[var(--bg-elev)] transition-colors"
                style={{
                  borderColor: isTarget ? meta.accent : 'var(--border)',
                  background: isTarget ? `color-mix(in oklab, ${meta.accent} 6%, var(--bg-elev))` : undefined,
                }}
              >
                <header className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2.5">
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{ background: meta.accent }}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text)]">
                      {meta.label}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    {items.length}
                  </span>
                </header>

                <div className="flex min-h-[120px] flex-col gap-2 p-2">
                  {items.length === 0 && (
                    <p className="px-1 py-4 text-center text-[10.5px] text-[var(--text-muted)]">
                      Empty
                    </p>
                  )}

                  {items.map((declaration) => {
                    const isDragging = draggedId === declaration.id;
                    const isSelected = selectedId === declaration.id;
                    const flags = declaration.flags ?? [];

                    return (
                      <article
                        key={declaration.id}
                        draggable
                        onDragStart={(event) => handleDragStart(event, declaration.id)}
                        onDragEnd={() => {
                          setDraggedId(null);
                          setDragOverColumn(null);
                        }}
                        onClick={() => setSelectedId(isSelected ? null : declaration.id)}
                        className="cursor-grab rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2.5 transition-shadow active:cursor-grabbing"
                        style={{
                          opacity: isDragging ? 0.4 : 1,
                          boxShadow: isSelected ? `0 0 0 2px ${meta.accent}` : undefined,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono text-[10.5px] font-semibold text-[var(--text)]">
                            {declaration.reference}
                          </span>
                          <span className="shrink-0 rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-secondary)]">
                            {declaration.formCode}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-[11px] text-[var(--text-secondary)]">
                          {declaration.clientName}
                        </p>

                        <p className="mt-1.5 text-[13px] font-semibold text-[var(--text)]">
                          {fmtValue(declaration.totalDeclaredValue, declaration.currency ?? 'MYR')}
                        </p>

                        <p className="mt-0.5 font-mono text-[9.5px] text-[var(--text-muted)]">
                          {formCodeLabel(declaration.formCode)} · {declaredCount(declaration)} line
                          {declaredCount(declaration) === 1 ? '' : 's'}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-1">
                          <span className="font-mono text-[9px] text-[var(--text-muted)]">
                            {confidenceLabel(declaration.draftConfidence)}
                          </span>
                        </div>

                        {flags.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {flags.map((flag) => {
                              const flagMeta = FLAG_META[flag] ?? { label: flag, color: '#71717a' };
                              return (
                                <span
                                  key={flag}
                                  className="rounded px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider"
                                  style={{ background: `${flagMeta.color}15`, color: flagMeta.color }}
                                >
                                  {flagMeta.label}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {isSelected && (
                          <div className="mt-2 border-t border-[var(--border-subtle)] pt-2 font-mono text-[9.5px] leading-relaxed text-[var(--text-secondary)]">
                            <p>Port: {declaration.port}</p>
                            <p>Broker: {declaration.owningBroker}</p>
                            <p>Jurisdiction: {declaration.jurisdiction ?? 'MY'}</p>
                            {declaration.borangCReference && (
                              <p>Borang C: {declaration.borangCReference}</p>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default BrokeragePipeline;