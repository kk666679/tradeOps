'use client';
import * as React from 'react';
import { UseCaseTabs } from '../shared/UseCaseTabs';

const CASES = [
  { id: 'fiz',        label: 'FIZ operators',      body: 'Manufacturing inputs, machinery, BOM, production yield, wastage, subcontract, all duty-suspended.', href: '/solutions/fiz' },
  { id: 'fcz',        label: 'FCZ operators',      body: 'Transhipment, re-export, break-bulk, repacking, entrepot, with value-add tracking.', href: '/solutions/fcz' },
  { id: 'brokers',    label: 'Customs brokers',    body: 'Declarations, classification, valuation, origin, permits, and FTA preferences.', href: '/solutions/brokers' },
  { id: 'cfs',        label: 'CFS 3PL',            body: 'Bonded warehousing, gate, slotting, inventory, and tenant billing.', href: '/solutions/cfs-3pl' },
  { id: 'forwarders', label: 'Freight forwarders', body: 'Movement manifests, inter-zone transfer, gate passes, and carrier integration.', href: '/solutions/forwarders' },
];

export function UseCases() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <header className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold">Built for every role in the free-zone supply chain</h2>
        </header>
        <UseCaseTabs cases={CASES} />
      </div>
    </section>
  );
}
export default UseCases;
