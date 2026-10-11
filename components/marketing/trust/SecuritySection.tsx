import * as React from 'react';
import { TrustBadges } from './TrustBadges';
import { ComplianceGrid } from './ComplianceGrid';

export function SecuritySection() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <header className="mb-6 max-w-2xl">
          <h2 className="text-3xl font-semibold">Security and compliance, built for customs</h2>
          <p className="mt-2 text-slate-500">Multi-tenant isolation, RBAC, immutable audit trail, and jurisdiction-aware guardrails.</p>
        </header>
        <TrustBadges />
        <div className="mt-8"><ComplianceGrid /></div>
      </div>
    </section>
  );
}
export default SecuritySection;
