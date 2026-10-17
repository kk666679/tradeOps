import Link from 'next/link';

const features = [
  { title: 'Document Intelligence', body: 'OCR, extraction, validation, and human review for trade documents.' },
  { title: 'HS Classification', body: 'Jurisdiction-aware recommendations with confidence and citations.' },
  { title: 'Customs Workflows', body: 'Declarations, permits, valuation, and audit-ready trails.' },
  { title: 'WMS & Zones', body: 'FIZ/FCZ inventory, bonded stock, and zone movements.' },
  { title: 'Agents & Automation', body: 'Bounded AI agents with approvals, memory, and supervision.' },
  { title: 'Analytics', body: 'Operational metrics, forecasting, and compliance visibility.' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">TradeOps</p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">Global trade operations, orchestrated.</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            An intelligence and orchestration layer for customs, classification, documents, and supply chain operations across jurisdictions.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/login" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Get started</Link>
            <Link href="/product/trade-ops" className="rounded-md border px-5 py-2.5 text-sm font-medium">Explore platform</Link>
          </div>
        </div>
      </section>
      <section className="border-t bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border bg-background p-6">
              <h2 className="text-base font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div><div className="text-3xl font-bold">380+</div><div className="text-sm text-muted-foreground">Operational routes</div></div>
          <div><div className="text-3xl font-bold">Multi-tenant</div><div className="text-sm text-muted-foreground">Hard data isolation</div></div>
          <div><div className="text-3xl font-bold">Human-in-loop</div><div className="text-sm text-muted-foreground">Approvals for high-impact actions</div></div>
        </div>
      </section>
    </main>
  );
}
