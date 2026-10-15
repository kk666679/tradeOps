'use client';

import * as React from 'react';
import type { Accreditation } from '../types';
import type { AccreditationRecord } from '../data';

export interface RegulatoryCondition {
  id: string;
  label: string;
  severity: 'critical' | 'warning' | 'info';
  detail: string;
}

export interface RegulatoryHealthPanelProps {
  data: Accreditation | AccreditationRecord;
  /** Called when a condition row is activated; consumers can open a detail view. */
  onConditionClick?: (condition: RegulatoryCondition) => void;
  className?: string;
}

const SEVERITY_STYLE: Record<RegulatoryCondition['severity'], { color: string; background: string; label: string }> = {
  critical: { color: '#f87171', background: '#ef444415', label: 'Critical' },
  warning: { color: '#fbbf24', background: '#f59e0b15', label: 'Warning' },
  info: { color: '#60a5fa', background: '#3b82f615', label: 'Info' },
};

const isRecord = (value: Accreditation | AccreditationRecord): value is AccreditationRecord =>
  Array.isArray((value as AccreditationRecord).approvedStaff);

/** Days from now until `date`, negative when already past. */
function daysUntil(date: string | undefined): number | null {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

function fmtDate(date: string | undefined): string {
  return date ? new Date(date).toISOString().slice(0, 10) : '—';
}

export function RegulatoryHealthPanel({
  data,
  onConditionClick,
  className = '',
}: RegulatoryHealthPanelProps) {
  const conditions = React.useMemo<RegulatoryCondition[]>(() => {
    const out: RegulatoryCondition[] = [];
    const record = isRecord(data) ? data : null;

    const expiry = daysUntil(data.expiresAt ?? record?.expiresAt);
    if (expiry !== null && expiry < 0) {
      out.push({
        id: 'licence-expired',
        label: 'Licence expired',
        severity: 'critical',
        detail: `${data.code} expired ${fmtDate(record?.expiresAt)}. Operations must stop until renewed.`,
      });
    } else if (expiry !== null && expiry <= 90) {
      out.push({
        id: 'licence-expiring',
        label: 'Licence expiring soon',
        severity: 'warning',
        detail: `${data.code} expires ${fmtDate(record?.expiresAt)} — in ${expiry} days. File renewal with JKDM.`,
      });
    }

    if (data.status === 'expired') {
      out.push({
        id: 'status-expired',
        label: 'Accreditation not active',
        severity: 'critical',
        detail: `Status is “${data.status}”. Declarations cannot be lodged in this state.`,
      });
    } else if (data.status === 'pending') {
      out.push({
        id: 'status-pending',
        label: 'Accreditation pending',
        severity: 'warning',
        detail: 'Accreditation is pending — confirm approval with JKDM before filing.',
      });
    }

    if (record) {
      if (record.outstandingTax) {
        out.push({
          id: 'outstanding-tax',
          label: 'Outstanding customs tax',
          severity: 'critical',
          detail: 'Settle outstanding tax liability; Section 90(3) requires a clean record.',
        });
      }

      if (record.hangingFormsCount > 0) {
        out.push({
          id: 'hanging-forms',
          label: 'Hanging K-forms',
          severity: 'warning',
          detail: `${record.hangingFormsCount} K-form${record.hangingFormsCount === 1 ? '' : 's'} unresolved. Close them before renewal.`,
        });
      }

      if (record.paidUpCapital < record.capitalRequired) {
        out.push({
          id: 'capital-shortfall',
          label: 'Paid-up capital below minimum',
          severity: 'critical',
          detail: `RM ${record.paidUpCapital.toLocaleString()} vs RM ${record.capitalRequired.toLocaleString()} required.`,
        });
      }

      if (record.bumiputeraRequired) {
        const actual = record.bumiputeraActual ?? 0;
        const required = record.bumiputeraThreshold ?? 0;
        if (actual < required) {
          out.push({
            id: 'bumiputera-equity',
            label: 'Bumiputera equity shortfall',
            severity: 'warning',
            detail: `${actual} of ${required} required Bumiputera shareholders.`,
          });
        }
      }

      const bondDays = daysUntil(record.bondExpiresAt);
      if (bondDays !== null && bondDays < 0) {
        out.push({
          id: 'bond-expired',
          label: 'Security bond expired',
          severity: 'critical',
          detail: `RM ${record.bondAmount.toLocaleString()} bond expired ${fmtDate(record.bondExpiresAt)}.`,
        });
      } else if (bondDays !== null && bondDays <= 60) {
        out.push({
          id: 'bond-expiring',
          label: 'Security bond expiring',
          severity: 'warning',
          detail: `Bond expires in ${bondDays} days (${fmtDate(record.bondExpiresAt)}).`,
        });
      }

      const inactivePasses = record.approvedStaff.filter(
        (s) => s.idPassStatus === 'pending' || s.idPassStatus === 'lost',
      );
      if (inactivePasses.length > 0) {
        out.push({
          id: 'id-passes',
          label: 'Staff ID passes not valid',
          severity: 'warning',
          detail: inactivePasses
            .map((s) => `${s.name} (${s.idPassStatus})`)
            .join(', ') + '.',
        });
      }
    }

    return out;
  }, [data]);

  const severityOrder: Record<RegulatoryCondition['severity'], number> = {
    critical: 0,
    warning: 1,
    info: 2,
  };

  const sorted = [...conditions].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );

  const worst = sorted[0]?.severity ?? 'info';
  const headline =
    sorted.length === 0
      ? 'No open conditions'
      : worst === 'critical'
        ? `${sorted.length} condition${sorted.length === 1 ? '' : 's'} · action required`
        : `${sorted.length} condition${sorted.length === 1 ? '' : 's'} · review`;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] ${className}`}
      data-severity={worst}
    >
      <header
        className="border-b border-[var(--border)] px-4 py-2.5"
        style={{ background: SEVERITY_STYLE[worst].background }}
      >
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Regulatory health
        </h2>
        <p className="mt-0.5 text-[13px] font-semibold text-[var(--text)]">{headline}</p>
      </header>

      {sorted.length === 0 ? (
        <p className="px-4 py-4 text-[11.5px] leading-relaxed text-[var(--text-secondary)]">
          All Section 90 licence conditions are currently satisfied.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border-subtle)]">
          {sorted.map((condition) => {
            const style = SEVERITY_STYLE[condition.severity];
            const interactive = typeof onConditionClick === 'function';
            return (
              <li key={condition.id}>
                <button
                  type="button"
                  disabled={!interactive}
                  onClick={() => onConditionClick?.(condition)}
                  className={`flex w-full items-start gap-2.5 px-4 py-3 text-left ${
                    interactive ? 'transition-colors hover:bg-[var(--bg-subtle)]' : 'cursor-default'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ background: style.color }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-[var(--text)]">
                        {condition.label}
                      </span>
                      <span
                        className="rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider"
                        style={{ background: style.background, color: style.color }}
                      >
                        {style.label}
                      </span>
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-[var(--text-secondary)]">
                      {condition.detail}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default RegulatoryHealthPanel;