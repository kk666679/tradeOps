import * as React from 'react';

const DEFAULT = [
  { id: 'iso',    title: 'ISO 27001 / SOC 2 Type II', body: 'Independently audited controls across the platform.' },
  { id: 'iso2',   title: 'Multi-tenant isolation',    body: 'Every query scoped by tenantId at the data layer.' },
  { id: 'audit',  title: 'Immutable audit trail',     body: 'Every agent and human action is logged with evidence.' },
  { id: 'guard',  title: 'Jurisdiction guardrails',   body: 'Rule packs for MY Customs Act, ATIGA, RCEP, WCO HS.' },
  { id: 'enc',    title: 'Encryption',                body: 'TLS 1.3 in transit, AES-256 at rest, per-tenant keys.' },
  { id: 'dpa',    title: 'DPA and SLA',               body: 'Enterprise DPAs and 99.95% uptime commitments.' },
];

export interface ComplianceGridProps { items?: { id: string; title: string; body: string }[] }

export function ComplianceGrid({ items = DEFAULT }: ComplianceGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((c) => (
        <div key={c.id} className="rounded-lg border bg-white p-5">
          <div className="text-base font-medium">{c.title}</div>
          <p className="mt-1 text-sm text-slate-500">{c.body}</p>
        </div>
      ))}
    </div>
  );
}
export default ComplianceGrid;
