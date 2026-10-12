import Link from "next/link";
import { BorangCTrace } from "@/components/brokerage/workflow/BorangCTrace";
import {
  SAMPLE_ACCREDITATION,
} from "@/components/brokerage/workflow/brokerageWorkflowGraph";
import type { Declaration } from "@/components/brokerage/types";
import {
  BrokerageHeader,
  BrokerageBreadcrumbs,
  BrokerageEmptyState,
} from "../../_components";

export const dynamic = "force-dynamic";

const DECLARATIONS: Record<string, Declaration> = {
  "K1/PG/2026/00418": {
    id: "d1",
    reference: "K1/PG/2026/00418",
    clientId: "cl-meridian",
    clientName: "Meridian Electronics Sdn Bhd",
    formCode: "K1",
    type: "import",
    status: "classifying",
    jurisdiction: "MY",
    port: "Penang",
    documents: {
      invoiceRef: "INV-2026-04-781",
      blRef: "MAEU-2026-0451",
      packingRef: "PL-2026-04-781",
    },
    lineItems: [
      {
        id: "li1",
        description: "Notebook computers — 14-inch",
        hsCode: "8471.30.10",
        hsConfidence: 0.96,
        quantity: 120,
        unit: "units",
        unitValue: 3_400,
        totalValue: 408_000,
        currency: "MYR",
        dutyRate: 0,
        dutyAmount: 0,
        salesTaxAmount: 0,
        preferenceScheme: "RCEP",
        classifiedBy: "agent",
      },
      {
        id: "li2",
        description: "Portable storage devices — 1TB SSD",
        hsCode: "8471.70.90",
        hsConfidence: 0.92,
        quantity: 400,
        unit: "units",
        unitValue: 850,
        totalValue: 340_000,
        currency: "MYR",
        dutyRate: 0,
        dutyAmount: 0,
        salesTaxAmount: 0,
        preferenceScheme: "RCEP",
        classifiedBy: "agent",
      },
    ],
    totalDeclaredValue: 748_000,
    currency: "MYR",
    totalDuty: 0,
    totalSalesTax: 0,
    totalExcise: 0,
    owningBroker: "aisha.rahman",
    borangCReference: "BORANG-C/AISHA/2026/041",
    draftedBy: "customs.declaration",
    draftConfidence: 0.94,
    approvals: [
      {
        id: "ap1",
        actor: "aisha.rahman",
        role: "broker",
        decision: "approved",
        comment: "Classification confirmed against ruling JKDM/RUL/2024/0842.",
        at: "2026-04-12T09:41:00Z",
        borangCReference: "BORANG-C/AISHA/2026/041",
      },
    ],
    eventIds: ["evt_9a1c2e", "evt_4b8d1f", "evt_7c3e5a"],
    createdAt: "2026-04-12T08:14:00Z",
    updatedAt: "2026-04-12T09:41:00Z",
    flags: [],
  },
};

export default async function DeclarationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reference = decodeURIComponent(id);
  const declaration = DECLARATIONS[reference];

  if (!declaration) {
    return (
      <BrokerageEmptyState
        icon="◇"
        title="Declaration not found"
        description={`No declaration with reference "${reference}" exists, or you do not have access to it.`}
        primaryAction={{ href: "/brokerage/declarations", label: "Back to declarations" }}
      />
    );
  }

  return (
    <>
      <BrokerageBreadcrumbs
        items={[
          { label: "Declarations", href: "/brokerage/declarations" },
          { label: declaration.reference },
        ]}
      />
      <BrokerageHeader
        eyebrow={`${declaration.formCode} · ${declaration.type}`}
        title={declaration.reference}
        description={`${declaration.clientName} · ${declaration.port} · broker ${declaration.owningBroker}`}
        actions={
          <>
            <Link
              href={`/brokerage/audit/${encodeURIComponent(declaration.id)}`}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3.5 py-1.5 font-mono text-[12px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
            >
              Evidence pack
            </Link>
            <button
              type="button"
              className="rounded-md bg-emerald-500 px-3.5 py-1.5 font-mono text-[12px] font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              Amend
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 px-4 pb-6 lg:grid-cols-[1fr_360px]">
        {/* Left — line items + approvals */}
        <div className="flex flex-col gap-4">
          {/* Line items */}
          <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)]">
            <header className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4 py-2.5">
              <h2 className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Line items · {declaration.lineItems.length}
              </h2>
              <span className="font-mono text-[10.5px] text-[var(--text-muted)]">
                total RM {declaration.totalDeclaredValue.toLocaleString()}
              </span>
            </header>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  {["Description", "HS code", "Conf.", "Qty", "Value", "Pref."].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left font-mono text-[9.5px] font-medium uppercase tracking-wider text-[var(--text-muted)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {declaration.lineItems.map((li) => (
                  <tr key={li.id} className="border-b border-[var(--border-subtle)] last:border-b-0">
                    <td className="px-4 py-2.5 text-[12px] text-[var(--text)]">
                      {li.description}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-[var(--text-secondary)]">
                      {li.hsCode}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={[
                          "font-mono text-[11px]",
                          li.hsConfidence >= 0.9
                            ? "text-emerald-400"
                            : li.hsConfidence >= 0.75
                            ? "text-amber-400"
                            : "text-red-400",
                        ].join(" ")}
                      >
                        {(li.hsConfidence * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-[var(--text-secondary)]">
                      {li.quantity} {li.unit}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[11px] text-[var(--text-secondary)]">
                      RM {li.totalValue.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5">
                      {li.preferenceScheme && li.preferenceScheme !== "none" ? (
                        <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-emerald-400">
                          {li.preferenceScheme}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Approvals */}
          <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)]">
            <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4 py-2.5">
              <h2 className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Approvals · {declaration.approvals.length}
              </h2>
            </header>
            <ul className="divide-y divide-[var(--border-subtle)]">
              {declaration.approvals.map((a) => (
                <li key={a.id} className="flex flex-col gap-1 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-emerald-400">
                      {a.decision}
                    </span>
                    <span className="font-mono text-[11.5px] text-[var(--text)]">
                      {a.actor}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      · {a.role}
                    </span>
                    <span className="ml-auto font-mono text-[10px] text-[var(--text-muted)]">
                      {new Date(a.at).toLocaleString()}
                    </span>
                  </div>
                  {a.comment && (
                    <p className="text-[11.5px] leading-relaxed text-[var(--text-secondary)]">
                      {a.comment}
                    </p>
                  )}
                  {a.borangCReference && (
                    <div className="font-mono text-[10px] text-[var(--text-muted)]">
                      Borang C: {a.borangCReference}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right — Borang C trace + meta */}
        <aside className="flex flex-col gap-4">
          <BorangCTrace
            declaration={declaration}
            accreditation={SAMPLE_ACCREDITATION}
          />

          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
            <h2 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Documents
            </h2>
            <ul className="flex flex-col gap-1.5 font-mono text-[11px]">
              {[
                ["Invoice", declaration.documents.invoiceRef],
                ["B/L", declaration.documents.blRef],
                ["Packing", declaration.documents.packingRef],
              ].map(([label, ref]) => (
                <li key={label} className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">{label}</span>
                  <span className="text-[var(--text-secondary)]">{ref ?? "—"}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}
