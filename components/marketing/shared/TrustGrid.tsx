import * as React from 'react';

export const DEFAULT_TRUST = [
  { k: 'Fail-closed',        v: 'If a guardrail cannot be evaluated, the action is blocked.' },
  { k: 'RBAC + ABAC',        v: 'Role and attribute scopes enforced at the tRPC edge.' },
  { k: 'HITL gates',         v: 'Every high-value write waits for a human decision.' },
  { k: 'Jurisdiction packs', v: 'MY Customs Act, ATIGA, RCEP, WCO HS 2022.' },
  { k: 'Spend authority',    v: 'Per-role tiers. Escalation above threshold.' },
  { k: 'Immutable audit',    v: 'Hash-chained entries with prior-hash verification.' },
] as const;

export interface TrustItem { k: string; v: string }

export function TrustGrid({ items = DEFAULT_TRUST }: { items?: readonly TrustItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((i) => (
        <div key={i.k} className="rounded-lg border bg-card p-4 transition hover:border-primary/40 hover:bg-primary/5">
          <div className="text-sm font-medium">{i.k}</div>
          <p className="mt-1 text-xs text-muted-foreground">{i.v}</p>
        </div>
      ))}
    </div>
  );
}
export default TrustGrid;
