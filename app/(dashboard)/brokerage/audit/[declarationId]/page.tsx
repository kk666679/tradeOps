import Link from "next/link";
import { BrokerageHeader, BrokerageBreadcrumbs, BrokerageEmptyState } from "../../_components";

export const dynamic = "force-dynamic";

export default async function EvidencePackPage({
  params,
}: {
  params: Promise<{ declarationId: string }>;
}) {
  const { declarationId } = await params;

  if (!declarationId) {
    return (
      <BrokerageEmptyState
        icon="◇"
        title="Declaration not specified"
        description="No declaration id was provided."
        primaryAction={{ href: "/brokerage/declarations", label: "Back to declarations" }}
      />
    );
  }

  return (
    <>
      <BrokerageBreadcrumbs
        items={[
          { label: "Audit", href: "/brokerage/audit" },
          { label: `Evidence pack · ${declarationId}` },
        ]}
      />
      <BrokerageHeader
        eyebrow="§100 · Customs Act 1967"
        title={`Evidence pack · ${declarationId}`}
        description="Every source document, ruling citation, approval, and ledger movement — assembled into a signed, exportable bundle."
        actions={
          <>
            <button
              type="button"
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3.5 py-1.5 font-mono text-[12px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
            >
              Export JSON
            </button>
            <button
              type="button"
              className="rounded-md bg-emerald-500 px-3.5 py-1.5 font-mono text-[12px] font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              Export signed PDF
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 px-4 pb-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
            <h2 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Bundle contents
            </h2>
            <dl className="grid grid-cols-2 gap-3 text-[11.5px]">
              {[
                ["Source documents", "3 (invoice, B/L, packing)"],
                ["Rulings cited", "2"],
                ["Approvals", "1 (broker)"],
                ["Ledger events", "4"],
                ["Tariff versions", "MY-2026-01, RCEP-v3"],
                ["Declaration events", "9"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    {k}
                  </dt>
                  <dd className="mt-0.5 font-mono text-[var(--text)]">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
            <h2 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Retention
            </h2>
            <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
              Under §100 of the Customs Act 1967, this declaration and all supporting
              records must be retained for six (6) years from the date of filing.
              This pack is sealed with the audit chain and can be re-exported at any
              point without loss of integrity.
            </p>
          </section>
        </div>

        <aside className="flex flex-col gap-3">
          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
            <h2 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Actions
            </h2>
            <Link
              href={`/brokerage/declarations/${encodeURIComponent(declarationId)}`}
              className="block rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2 text-center font-mono text-[11.5px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
            >
              Back to declaration
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
