import * as React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Careers' };

export default function Page() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Careers</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        TradeOps · FIZ/FCZ · Marketing page auto-scaffolded for <code className="rounded bg-muted px-1">/careers</code>.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {['FIZ', 'FCZ', 'Bonded'].map((z) => (
          <div key={z} className="rounded-lg border bg-background p-6">
            <div className="text-sm font-medium">{z} zone</div>
            <p className="mt-1 text-xs text-muted-foreground">Duty-suspension aware · agent-in-the-loop · audit-ready.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
