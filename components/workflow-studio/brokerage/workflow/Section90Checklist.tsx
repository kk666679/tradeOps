'use client';

import * as React from 'react';
import type { Accreditation } from '../types';
import { buildSection90Conditions, type AccreditationRecord } from '../data';

export interface Section90ChecklistProps {
  data: Accreditation | AccreditationRecord;
  /** Hide the print header when embedded in another surface. */
  compact?: boolean;
  className?: string;
}

function fmtDate(date: string | undefined): string {
  return date ? new Date(date).toISOString().slice(0, 10) : '—';
}

function fmtMoney(value: number | undefined): string {
  return typeof value === 'number' ? `RM ${value.toLocaleString()}` : '—';
}

const isRecord = (value: Accreditation | AccreditationRecord): value is AccreditationRecord =>
  Array.isArray((value as AccreditationRecord).certificateHolders);

export function Section90Checklist({ data, compact = false, className = '' }: Section90ChecklistProps) {
  const record = isRecord(data) ? data : null;
  const conditions = React.useMemo(
    () => (record ? buildSection90Conditions(record) : []),
    [record],
  );

  const passed = conditions.filter((c) => c.pass).length;
  const total = conditions.length;
  const compliant = total > 0 && passed === total;

  return (
    <section className={`overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] ${className}`}>
      {!compact && (
        <header className="border-b border-[var(--border)] px-4 py-3">
          <h2 className="text-[13px] font-semibold text-[var(--text)]">
            Section 90 compliance checklist
          </h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Customs Act 1967 · licence {data.licenceNumber ?? data.code} ·{' '}
            {data.ejenType ?? 'ejen'}
          </p>
        </header>
      )}

      {/* Licence summary */}
      <dl className="grid grid-cols-1 gap-px border-b border-[var(--border)] bg-[var(--border-subtle)] sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Licence number', data.licenceNumber ?? data.code],
          ['Ejen type', data.ejenType ?? '—'],
          ['Issued', fmtDate(record?.issuedAt)],
          ['Expires', fmtDate(data.expiresAt ?? record?.expiresAt)],
          ['Approval period', record?.approvalPeriod ?? '—'],
          ['Paid-up capital', fmtMoney(record?.paidUpCapital)],
          ['Capital required', fmtMoney(record?.capitalRequired)],
          ['Registration', record?.registrationType
            ? record.registrationType === 'companies-act-2016'
              ? 'Companies Act 2016'
              : 'Business Act 1956'
            : '—'],
        ].map(([label, value]) => (
          <div key={label} className="bg-[var(--bg-elev)] px-4 py-2.5">
            <dt className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">
              {label}
            </dt>
            <dd className="mt-0.5 text-[12px] font-medium text-[var(--text)]">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Conditions */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
            <th className="w-8 px-3 py-2 text-center">
              <span className="sr-only">Result</span>
              <span aria-hidden="true" className="font-mono text-[10px] text-[var(--text-muted)]">✓</span>
            </th>
            <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Clause
            </th>
            <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Requirement
            </th>
            <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Evidence
            </th>
          </tr>
        </thead>
        <tbody>
          {conditions.map((condition) => (
            <tr key={condition.id} className="border-b border-[var(--border-subtle)] last:border-b-0">
              <td className="px-3 py-2.5 text-center">
                <span
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: condition.pass ? '#10b98120' : '#ef444420',
                    color: condition.pass ? '#10b981' : '#ef4444',
                  }}
                  title={condition.pass ? 'Satisfied' : 'Not satisfied'}
                >
                  {condition.pass ? '✓' : '!'}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px] text-[var(--text-secondary)]">
                {condition.clause}
              </td>
              <td className="px-3 py-2.5 text-[12px] font-medium text-[var(--text)]">
                {condition.requirement}
              </td>
              <td className="px-3 py-2.5 text-[11px] leading-relaxed text-[var(--text-secondary)]">
                {condition.detail}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Certificate holders */}
      {record && record.certificateHolders.length > 0 && (
        <div className="border-t border-[var(--border)]">
          <h3 className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Certificate holders · {record.certificateHolders.length}
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
                {['Name', 'IC number', 'Role', 'Course', 'Certificate', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-1.5 text-left font-mono text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {record.certificateHolders.map((holder) => (
                <tr key={holder.id} className="border-b border-[var(--border-subtle)] last:border-b-0">
                  <td className="px-3 py-1.5 text-[11.5px] text-[var(--text)]">{holder.name}</td>
                  <td className="px-3 py-1.5 font-mono text-[10.5px] text-[var(--text-secondary)]">
                    {holder.icNumber}
                  </td>
                  <td className="px-3 py-1.5 text-[11px] capitalize text-[var(--text-secondary)]">
                    {holder.role}
                  </td>
                  <td className="px-3 py-1.5 font-mono text-[10.5px] text-[var(--text-secondary)]">
                    {holder.courseType}
                  </td>
                  <td className="px-3 py-1.5 font-mono text-[10.5px] text-[var(--text-secondary)]">
                    {holder.certificateNum}
                  </td>
                  <td className="px-3 py-1.5 text-[10px] uppercase tracking-wider">
                    <span style={{ color: holder.active ? '#10b981' : '#f59e0b' }}>
                      {holder.active ? 'active' : 'inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Authorised staff */}
      {record && record.approvedStaff.length > 0 && (
        <div className="border-t border-[var(--border)]">
          <h3 className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Authorised staff · {record.approvedStaff.length}
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
                {['Name', 'Position', 'ID pass', 'Status', 'Authorised'].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-1.5 text-left font-mono text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {record.approvedStaff.map((staff) => (
                <tr key={staff.id} className="border-b border-[var(--border-subtle)] last:border-b-0">
                  <td className="px-3 py-1.5 text-[11.5px] text-[var(--text)]">{staff.name}</td>
                  <td className="px-3 py-1.5 text-[11px] text-[var(--text-secondary)]">
                    {staff.position}
                  </td>
                  <td className="px-3 py-1.5 font-mono text-[10.5px] text-[var(--text-secondary)]">
                    {staff.idPassNumber}
                  </td>
                  <td className="px-3 py-1.5 text-[10px] uppercase tracking-wider">
                    <span
                      style={{
                        color: staff.idPassStatus === 'active' ? '#10b981' : '#f59e0b',
                      }}
                    >
                      {staff.idPassStatus}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 font-mono text-[10.5px] text-[var(--text-secondary)]">
                    {fmtDate(staff.authorizedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer className="border-t border-[var(--border)] px-4 py-3">
        <p
          className="font-mono text-[10px] uppercase tracking-wider"
          style={{ color: compliant ? '#10b981' : '#f59e0b' }}
        >
          {compliant
            ? 'All conditions satisfied'
            : `${passed} of ${total} conditions satisfied`}
        </p>
      </footer>
    </section>
  );
}

export default Section90Checklist;