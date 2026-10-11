'use client';
import * as React from 'react';
import { HighlightTab } from './HighlightTab';
import { HighlightPreview } from './HighlightPreview';

const TABS = [
  { id: 'trade', label: 'Trade OPS', body: 'File, track, and audit declarations across FIZ and FCZ with an agent-in-the-loop.' },
  { id: 'wms', label: 'WMS', body: 'Bonded ledger, gate, slotting, exemption, movement — all duty-suspension aware.' },
  { id: 'order', label: 'Orders', body: 'Manufacturing, trading, transhipment, fulfilment — with customs attached to every order.' },
  { id: 'twin', label: 'Digital Twin', body: 'Simulate zone flow, gate congestion, and duty impact before you commit.' },
];
export function InteractiveHighlights() {
  const [active, setActive] = React.useState(TABS[0].id);
  const current = TABS.find((t) => t.id === active)!;
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <header className="mb-8 max-w-2xl"><h2 className="text-3xl font-semibold">See it in action</h2></header>
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <ul className="space-y-1">
            {TABS.map((t) => <HighlightTab key={t.id} active={active === t.id} label={t.label} onClick={() => setActive(t.id)} />)}
          </ul>
          <HighlightPreview title={current.label} body={current.body} />
        </div>
      </div>
    </section>
  );
}
export default InteractiveHighlights;
