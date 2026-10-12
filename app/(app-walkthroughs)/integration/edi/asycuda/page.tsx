import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { IntegrationShell } from '../../_components/IntegrationShell';

export const metadata: Metadata = {
  title: 'ASYCUDA · EDI · Integration · TradeOps',
  description:
    'ASYCUDA message envelope configuration, segment mappings, and recent deliveries.',
};

const RECENT_DELIVERIES = [
  { id: 'msg-8821', at: '09:42', direction: 'outbound' as const, kind: 'DEC', status: 'ok'      as const, ref: 'DECL-2026-10118' },
  { id: 'msg-8820', at: '09:36', direction: 'inbound'  as const, kind: 'QRY', status: 'ok'      as const, ref: 'DECL-2026-10117' },
  { id: 'msg-8819', at: '09:28', direction: 'outbound' as const, kind: 'DEC', status: 'ok'      as const, ref: 'DECL-2026-10116' },
  { id: 'msg-8818', at: '09:14', direction: 'inbound'  as const, kind: 'ACK', status: 'ok'      as const, ref: 'DECL-2026-10115' },
  { id: 'msg-8817', at: '08:55', direction: 'outbound' as const, kind: 'DEC', status: 'failed'  as const, ref: 'DECL-2026-10114', error: 'Envelope schema validation failed at segment SGS.' },
  { id: 'msg-8816', at: '08:40', direction: 'outbound' as const, kind: 'DEC', status: 'ok'      as const, ref: 'DECL-2026-10113' },
];

const SEGMENTS = [
  { code: 'UNB', label: 'Interchange header', status: 'mapped' as const },
  { code: 'UNH', label: 'Message header',     status: 'mapped' as const },
  { code: 'BGM', label: 'Beginning of message', status: 'mapped' as const },
  { code: 'DTM', label: 'Date/time/period',   status: 'mapped' as const },
  { code: 'NAD', label: 'Name and address',   status: 'mapped' as const },
  { code: 'SGS', label: 'Segment grouping',   status: 'custom' as const },
  { code: 'LIN', label: 'Line item',          status: 'mapped' as const },
  { code: 'UNZ', label: 'Interchange trailer', status: 'mapped' as const },
];

function Chip({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'ok' | 'fail' | 'warn' }) {
  const tones = {
    neutral: 'border-border/60 bg-muted/40 text-muted-foreground',
    ok:      'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    fail:    'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400',
    warn:    'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-500',
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}

export default function AsycudaPage() {
  return (
    <IntegrationShell
      breadcrumbs={[
        { label: 'EDI', href: '/integration/edi' },
        { label: 'ASYCUDA' },
      ]}
      title="ASYCUDA"
      description="Message envelope configuration, segment mappings, and recent deliveries to and from the customs EDI gateway."
      status="healthy"
      statusNote="Last successful delivery 09:42. 1 failed message in the last 24h."
      actions={
        <>
          <Link
            href="/integration/edi"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Back to EDI
          </Link>
          <Link
            href="/trade-ops/declarations"
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            View declarations
          </Link>
        </>
      }
    >
      {/* config */}
      <section className="mb-10">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Configuration
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: 'Endpoint',        v: 'https://edi.jkdm.gov.my/asycuda/v3' },
            { k: 'Protocol',        v: 'AS2 · signed' },
            { k: 'Envelope',        v: 'UN/EDIFACT D96A' },
            { k: 'Interchange ID',  v: 'TRADOPSMYKL' },
          ].map((row) => (
            <div key={row.k} className="rounded-xl border border-border/60 bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {row.k}
              </p>
              <p className="mt-1.5 font-mono text-xs break-all">{row.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* segment mappings */}
      <section className="mb-10">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Segment mappings
        </h2>
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <ul className="divide-y divide-border/40">
            {SEGMENTS.map((seg) => (
              <li key={seg.code} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{seg.code}</span>
                  <span className="text-sm">{seg.label}</span>
                </div>
                <Chip tone={seg.status === 'mapped' ? 'ok' : 'warn'}>
                  {seg.status}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* recent deliveries */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Recent deliveries
          </h2>
          <Link
            href="/integration/webhook/deliveries"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Full delivery log →
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Time</th>
                <th className="px-4 py-2 text-left font-medium">Dir</th>
                <th className="px-4 py-2 text-left font-medium">Kind</th>
                <th className="px-4 py-2 text-left font-medium">Reference</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {RECENT_DELIVERIES.map((d) => (
                <tr key={d.id} className="transition-colors hover:bg-muted/20">
                  <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{d.at}</td>
                  <td className="px-4 py-2.5 font-mono text-xs">
                    {d.direction === 'outbound' ? '↑' : '↓'} {d.direction}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs">{d.kind}</td>
                  <td className="px-4 py-2.5">
                    <Link
                      href="/trade-ops/declarations"
                      className="font-mono text-xs underline-offset-2 hover:underline"
                    >
                      {d.ref}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    {d.status === 'ok' ? (
                      <Chip tone="ok">ok</Chip>
                    ) : (
                      <span title={d.error}>
                        <Chip tone="fail">failed</Chip>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {RECENT_DELIVERIES.some((d) => d.status === 'failed') && (
          <p className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/5 px-4 py-2.5 text-xs text-rose-700 dark:text-rose-400">
            <strong className="font-medium">msg-8817 failed:</strong> envelope schema validation
            failed at segment SGS. Check the SGS segment mapping above.
          </p>
        )}
      </section>

      {/* related */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Related
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/integration/edi" className="rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
            EDI overview
          </Link>
          <Link href="/integration/edi/mappings" className="rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
            All mappings
          </Link>
          <Link href="/integration/edi/segments" className="rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
            Segment library
          </Link>
          <Link href="/integration/customs" className="rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
            Customs
          </Link>
          <Link href="/integration/health" className="rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
            System health
          </Link>
        </div>
      </section>
    </IntegrationShell>
  );
}
