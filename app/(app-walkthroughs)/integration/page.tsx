import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { IntegrationShell } from './_components/IntegrationShell';
import { IntegrationCard, type IntegrationStatus } from './_components/IntegrationCard';

export const metadata: Metadata = {
  title: 'Integration · TradeOps',
  description:
    'Connect TradeOps to customs, EDI, ERP, TMS, WMS, and external systems. Monitor health, replay events, and manage credentials.',
};

/* ---------------- data ---------------- */

type Group = {
  id: string;
  title: string;
  items: {
    title: string;
    description: string;
    href: string;
    status: IntegrationStatus;
    statusNote?: string;
    itemCount?: number;
    itemLabel?: string;
  }[];
};

const GROUPS: readonly Group[] = [
  {
    id: 'trade-compliance',
    title: 'Trade & compliance',
    items: [
      {
        title: 'Customs — JKDM',
        description: 'Declaration submission, status polling, and query handling.',
        href: '/integration/customs',
        status: 'degraded',
        statusNote: 'Submission reachable',
        itemCount: 3,
        itemLabel: 'endpoints',
      },
      {
        title: 'EDI',
        description: 'ASYCUDA mappings, segment parsing, and message envelopes.',
        href: '/integration/edi',
        status: 'healthy',
        statusNote: 'Last sync 4 min ago',
        itemCount: 2,
        itemLabel: 'mappings',
      },
      {
        title: 'Permits & tariff',
        description: 'PGA permit validation and tariff rate resolution.',
        href: '/integration/customs/permits',
        status: 'sandbox',
        statusNote: 'Sandbox tier',
      },
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    items: [
      {
        title: 'WMS',
        description: 'Gate, stock, and movement sync with the warehouse system.',
        href: '/integration/wms',
        status: 'healthy',
        statusNote: 'Last sync 2 min ago',
        itemCount: 3,
        itemLabel: 'feeds',
      },
      {
        title: 'TMS',
        description: 'Carriers, routes, and shipment events.',
        href: '/integration/tms',
        status: 'healthy',
        statusNote: 'Last sync 12 min ago',
        itemCount: 3,
        itemLabel: 'feeds',
      },
      {
        title: 'ERP',
        description: 'Customers, inventory, and invoice sync.',
        href: '/integration/erp',
        status: 'degraded',
        statusNote: 'Invoice sync stalled',
        itemCount: 3,
        itemLabel: 'feeds',
      },
      {
        title: 'FIZ / FCZ',
        description: 'Zone movement and exemption events.',
        href: '/integration/fiz-fcz',
        status: 'healthy',
        statusNote: 'Last sync 6 min ago',
        itemCount: 2,
        itemLabel: 'feeds',
      },
    ],
  },
  {
    id: 'platform',
    title: 'Platform',
    items: [
      {
        title: 'Authentication',
        description: 'API keys, OAuth clients, and rotating secrets.',
        href: '/integration/auth',
        status: 'healthy',
        statusNote: 'Keys active',
        itemCount: 4,
        itemLabel: 'credentials',
      },
      {
        title: 'Webhooks',
        description: 'Subscriptions, delivery log, and signature verification.',
        href: '/integration/webhook',
        status: 'degraded',
        statusNote: '2 subscribers backlogged',
        itemCount: 6,
        itemLabel: 'subscriptions',
      },
      {
        title: 'Agent mesh',
        description: 'Agent topology, skills registry, and heartbeat.',
        href: '/integration/agent-mesh',
        status: 'healthy',
        statusNote: '18 agents online',
        itemCount: 3,
        itemLabel: 'views',
      },
      {
        title: 'Health',
        description: 'System-wide integration health and dependency status.',
        href: '/integration/health',
        status: 'healthy',
        statusNote: 'All critical services up',
      },
    ],
  },
];

const SUMMARY = [
  { label: 'Connected systems', value: '11' },
  { label: 'Events (24h)',      value: '48,204' },
  { label: 'Failed (24h)',      value: '37' },
  { label: 'Pending retries',   value: '4' },
];

/* ---------------- page ---------------- */

export default function IntegrationPage() {
  return (
    <IntegrationShell
      breadcrumbs={[{ label: 'Overview' }]}
      title="Integration"
      description="Connect TradeOps to customs, EDI, ERP, TMS, WMS, and external systems. Monitor health, replay events, and manage credentials."
      status="degraded"
      statusNote="Customs submission reachable. 2 subscriber backlogs and stalled ERP invoice sync require attention."
      actions={
        <>
          <Link
            href="/integration/health"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            System health
          </Link>
          <Link
            href="/integration/webhook/subscriptions"
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Manage subscriptions
          </Link>
        </>
      }
    >
      {/* summary strip */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {SUMMARY.map((s) => (
          <div key={s.label} className="rounded-xl border border-border/60 bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* groups */}
      <div className="space-y-10">
        {GROUPS.map((group) => (
          <section key={group.id} aria-labelledby={`${group.id}-heading`}>
            <h2
              id={`${group.id}-heading`}
              className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground"
            >
              {group.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <IntegrationCard
                  key={item.href}
                  title={item.title}
                  description={item.description}
                  href={item.href}
                  status={item.status}
                  statusNote={item.statusNote}
                  itemCount={item.itemCount}
                  itemLabel={item.itemLabel}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </IntegrationShell>
  );
}
