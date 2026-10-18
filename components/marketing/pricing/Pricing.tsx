'use client';
import * as React from 'react';
import { PricingToggle } from './PricingToggle';
import { PricingTable } from './PricingTable';
import { EnterpriseCTA } from './EnterpriseCTA';

export function Pricing() {
  const [annual, setAnnual] = React.useState(true);
  return (
    <section id="pricing" className="border-b">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <header className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold">Pricing for every FIZ / FCZ footprint</h2>
          <p className="mt-2 text-muted-foreground">Start with a single zone, scale to a multi-tenant operator network.</p>
          <div className="mt-4 flex justify-center"><PricingToggle annual={annual} onChange={setAnnual} /></div>
        </header>
        <PricingTable />
        <div className="mt-10"><EnterpriseCTA /></div>
      </div>
    </section>
  );
}
export default Pricing;
