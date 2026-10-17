'use client';
import * as React from 'react';
import FeatureGrid from './FeatureGrid';

const FEATURES = [
  { id: 'trade', title: 'Trade OPS', body: 'Declarations, HS classification, duty, permits, clearance, compliance.' },
  { id: 'fiz', title: 'FIZ WMS', body: 'Raw material, machinery, production input, wastage, subcontract.' },
  { id: 'fcz', title: 'FCZ WMS', body: 'Transhipment, re-export, break-bulk, repacking, entrepot.' },
  { id: 'order', title: 'Order Management', body: 'Purchase, manufacturing, trading, transhipment, fulfilment.' },
  { id: 'twin', title: 'Digital Twin', body: 'Zone graph, agent simulation, what-if scenarios, live metrics.' },
  { id: 'agents', title: 'Customs Agents', body: 'Filing, classification, valuation, screening, escalation.' },
];
export function Features() {
  const featureCards = FEATURES.map(({ body, ...feature }) => ({
    ...feature,
    description: body,
  }));

  return (
    <section id="product" className="border-b">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <header className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold">Everything you need to run a CFS in a Free Zone</h2>
          <p className="mt-2 text-muted-foreground">One platform for Trade OPS, bonded warehousing, orders, digital twin, and customs agents — with FIZ and FCZ semantics built in.</p>
        </header>
        <FeatureGrid features={featureCards} />
      </div>
    </section>
  );
}
export default Features;
