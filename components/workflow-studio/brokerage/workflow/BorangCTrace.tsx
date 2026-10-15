'use client';

import * as React from 'react';
import type { Accreditation } from '../types';
import type { AccreditationRecord, Section90Condition } from '../data';
import { buildSection90Conditions } from '../data';

export interface BorangCTraceProps {
  declaration: {
    reference: string;
    formCode: string;
    type: string;
    status: string;
    clientName: string;
    port: string;
    totalDeclaredValue: number;
    currency: string;
    totalDuty?: number;
    totalSalesTax?: number;
    totalExcise?: number;
    borangCReference?: string;
    owningBroker: string;
    draftedBy?: string;
    draftConfidence?: number;
    approvals?: {
      id: string;
      actor?: string;
      role?: string;
      decision?: string;
      comment?: string;
      at?: string;
      borangCReference?: string;
    }[];
    documents?: { invoiceRef?: string; blRef?: string; packingRef?: string };
  };
  accreditation?: Accreditation | AccreditationRecord;
  className?: string;
}

/* ---------------------------------------------------------------- *
 * Borang C declaration-to-clearance chain
 * ---------------------------------------------------------------- */

type TraceStageKey =
  | 'draft'
  | 'classify'
  | 'verify'
  | 'approval'
  | 'file'
  | 'channel'
  | 'clear';

interface TraceStage {
  key: TraceStageKey;
  label: string;
  reference: string;
  at?: string;
  state: 'done' | 'active' | 'pending';
}

/** Map declaration status onto the seven-stage Borang C trace. */
function buildStages(declaration: BorangCTraceProps['declaration']): TraceStage[] {
  const status = declaration.status;
  const requiredFor = (statuses: string[]) => statuses.includes(status);

  return [
    {
      key: 'draft',
      label: 'Draft created',
      reference: declaration.reference,
      state: 'done',
    },
    {
      key: 'classify',
      label: 'HS classification & valuation',
      reference: declaredItemsLabel(declaration),
      state: requiredFor(['classifying', 'awaiting-approval', 'filed', 'channel-yellow', 'channel-green', 'channel-red', 'cleared'])
        ? 'done'
        : 'pending',
    },
    {
      key: 'verify',
      label: 'Agent verification (§90 authority)',
      reference: declaration.borangCReference
        ? `Authority check · ${declaration.owningBroker}`
        : `Pending · ${declaration.owningBroker}`,
      state: declaration.borangCReference ? 'done' : 'pending',
    },
    {
      key: 'approval',
      label: 'Dual approval (senior + operations)',
      reference: approvalLabel(declaration),
      state: approvalState(declaration),
    },
    {
      key: 'file',
      label: 'K-form lodged with JKDM',
      reference: declaration.borangCReference ?? 'Not lodged',
      state: declaration.borangCReference ? 'done' : 'pending',
    },
    {
      key: 'channel',
      label: 'Channel selection',
      reference: channelLabel(status),
      state: requiredFor(['channel-yellow', 'channel-green', 'channel-red', 'cleared']) ? 'done' : 'pending',
    },
    {
      key: 'clear',
      label: 'Declared cleared',
      reference: status === 'cleared' ? 'Released' : 'Awaiting release',
      state: status === 'cleared' ? 'done' : 'pending',
    },
  ];
}

function declaredItemsLabel(declaration: BorangCTraceProps['declaration']): string {
  if (declaration.status === 'draft') return 'Not classified';
  if (declaration.status === 'classifying') return 'In progress';
  if (declaration.draftConfidence != null) {
    return `Confidence ${(declaration.draftConfidence * 100).toFixed(0)}%`;
  }
  return 'Classified';
}

function approvalLabel(declaration: BorangCTraceProps['declaration']): string {
  const approvals = declaration.approvals ?? [];
  if (approvals.length === 0) return declaration.status === 'draft' ? 'Not started' : 'Awaiting approval';
  const last = approvals[approvals.length - 1];
  return `${last.decision ?? 'actioned'} · ${last.actor ?? last.role ?? '—'}`;
}

function approvalState(declaration: BorangCTraceProps['declaration']): TraceStage['state'] {
  const approvals = declaration.approvals ?? [];
  if (approvals.length === 0) return declaration.status === 'draft' ? 'pending' : 'active';
  if (declaration.status === 'awaiting-approval') return 'active';
  if (['filed', 'channel-yellow', 'channel-green', 'channel-red', 'cleared'].includes(declaration.status)) {
    return 'done';
  }
  return 'active';
}

function channelLabel(status: string): string {
  if (status === 'channel-green') return 'Green lane — released';
  if (status === 'channel-yellow') return 'Yellow lane — documents verified';
  if (status === 'channel-red') return 'Red lane — inspection required';
  if (status === 'cleared') return 'Channel cleared';
  return 'Pending';
}

const STAGE_STYLE: Record<TraceStage['state'], { color: string; ring: string; label: string }> = {
  done: { color: '#10b981', ring: '#10b981', label: 'Complete' },
  active: { color: '#3b82f6', ring: '#3b82f6', label: 'In progress' },
  pending: { color: '#71717a', ring: '#3f3f46', label: 'Pending' },
};

function fmtValue(value: number | undefined, currency: string): string {
  return typeof value === 'number' ? `${currency} ${value.toLocaleString()}` : '—';
}

function fmtDate(value?: string): string {
  return value ? new Date(value).toLocaleString() : '—';
}

const isRecord = (value: Accreditation | AccreditationRecord): value is AccreditationRecord =>
  Array.isArray((value as AccreditationRecord).certificateHolders);

export function BorangCTrace({ declaration, accreditation, className = '' }: BorangCTraceProps) {
  const stages = React.useMemo(() => buildStages(declaration), [declaration]);
  const conditions = React.useMemo<Section90Condition[]>(
    () => (accreditation && isRecord(accreditation) ? buildSection90Conditions(accreditation) : []),
    [accreditation],
  );

  const settled = stages.filter((s) => s.state === 'done').length;
  const total = stages.length;

  return (
    <section className={`overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] ${className}`}>
      <header className="border-b border-[var(--border)] px-4 py-2.5">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Borang C trace
        </h2>
        <p className="mt-0.5 text-[12.5px] font-semibold text-[var(--text)]">
          {declaration.reference}
        </p>
        <p className="font-mono text-[10px] text-[var(--text-secondary)]">
          {declaration.formCode} · {declaration.type} · {declaration.clientName}
        </p>
      </header>

      <ol className="flex flex-col gap-0 px-4 py-3">
        {stages.map((stage, index) => {
          const style = STAGE_STYLE[stage.state];
          const isLast = index === stages.length - 1;
          return (
            <li key={stage.key} className="flex gap-3">
              {/* rail */}
              <div className="flex flex-col items-center">
                <span
                  aria-hidden="true"
                  className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 text-[8px] font-bold"
                  style={{
                    borderColor: style.ring,
                    background: stage.state === 'done' ? style.color : 'transparent',
                    color: stage.state === 'done' ? '#fff' : style.color,
                  }}
                >
                  {stage.state === 'done' ? '✓' : ''}
                </span>
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="w-px flex-1"
                    style={{ background: 'var(--border-subtle, #3f3f46)' }}
                  />
                )}
              </div>

              <div className={`min-w-0 flex-1 ${isLast ? '' : 'pb-3'}`}>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <p className="text-[12px] font-medium text-[var(--text)]">{stage.label}</p>
                  <span
                    className="font-mono text-[9px] uppercase tracking-wider"
                    style={{ color: style.color }}
                  >
                    {style.label}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[10.5px] text-[var(--text-secondary)]">
                  {stage.reference}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="border-t border-[var(--border)] px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Trace progress
          </span>
          <span className="font-mono text-[10px] text-[var(--text-secondary)]">
            {settled} / {total} stages
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
          <span
            className="block h-full rounded-full"
            style={{
              width: total > 0 ? `${(settled / total) * 100}%` : '0%',
              background: '#10b981',
            }}
          />
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-y-2 font-mono text-[10.5px]">
          <div>
            <dt className="text-[var(--text-muted)]">Declared value</dt>
            <dd className="text-[var(--text)]">
              {fmtValue(declaration.totalDeclaredValue, declaration.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Duty / S&amp;T / excise</dt>
            <dd className="text-[var(--text)]">
              {[
                fmtValue(declaration.totalDuty, declaration.currency),
                fmtValue(declaration.totalSalesTax, declaration.currency),
                fmtValue(declaration.totalExcise, declaration.currency),
              ].join(' / ')}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Port</dt>
            <dd className="text-[var(--text)]">{declaration.port}</dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Owning broker</dt>
            <dd className="text-[var(--text)]">{declaration.owningBroker}</dd>
          </div>
        </dl>

        {conditions.length > 0 && (
          <div className="mt-3 border-t border-[var(--border-subtle)] pt-3">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              §90 authority conditions
            </p>
            <ul className="flex flex-col gap-1">
              {conditions.map((condition) => (
                <li key={condition.id} className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 text-[10px] font-bold"
                    style={{ color: condition.pass ? '#10b981' : '#f59e0b' }}
                  >
                    {condition.pass ? '✓' : '!'}
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text)]">{condition.label}</span>
                    {' — '}
                    {condition.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </footer>
    </section>
  );
}

export default BorangCTrace;