import * as React from 'react';
import { ComparisonRow } from './ComparisonRow';

const DEFAULT_ROWS = [
  { feature: 'FIZ semantics (BOM, wastage, subcontract)',  us: true, them: false },
  { feature: 'FCZ semantics (transhipment, entrepot, repack)', us: true, them: false },
  { feature: 'Bonded ledger with duty suspension',         us: true, them: true },
  { feature: 'Customs declarations + HS classification',   us: true, them: false },
  { feature: 'Automated customs agents (RBAC + HITL)',     us: true, them: false },
  { feature: 'Digital twin + what-if simulation',          us: true, them: false },
  { feature: 'Multi-tenant SaaS with per-tenant isolation', us: true, them: true },
  { feature: 'ASYCUDA / ATIGA / RCEP rule packs',          us: true, them: false },
];

export function ComparisonTable({ rows = DEFAULT_ROWS, title = 'How we compare' }: { rows?: typeof DEFAULT_ROWS; title?: string }) {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <header className="mb-6"><h2 className="text-3xl font-semibold">{title}</h2></header>
        <div className="overflow-hidden rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3 text-left">Capability</th>
                <th className="p-3 text-center">CFS FIZ/FCZ</th>
                <th className="p-3 text-center">Generic WMS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => <ComparisonRow key={r.feature} {...r} />)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
export default ComparisonTable;
