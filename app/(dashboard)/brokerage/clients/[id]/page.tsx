import Link from "next/link";
import { notFound } from "next/navigation";
import type { BrokerClient } from "@/components/workflow-studio/brokerage/types";
import {
  BrokerageHeader,
  BrokerageBreadcrumbs,
  BrokerageEmptyState,
} from "../../_components";

export const dynamic = "force-dynamic";

const CLIENTS: Record<string, BrokerClient> = {
  "cl-meridian": {
    id: "cl-meridian",
    name: "Meridian Electronics Sdn Bhd",
    registrationNumber: "201801023456",
    country: "Malaysia",
    tier: "enterprise",
    status: "active",
    sla: "critical",
    assignedBrokers: ["aisha.rahman", "daniel.okafor"],
    contactEmail: "trade@meridian.com.my",
    monthlyVolume: 412,
    onboardedAt: "2025-08-14",
    registeredState: "Penang",
    authorization: {
      written: true,
      reference: "LOA-2025-0842",
      signedAt: "2025-08-14",
      signedBy: "Lim Wei Ming (Director)",
    },
  },
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = CLIENTS[id];

  if (!client) {
    return (
      <BrokerageEmptyState
        icon="◇"
        title="Client not found"
        description={`No client with id "${id}" exists, or you do not have access to it.`}
        primaryAction={{ href: "/brokerage/clients", label: "Back to clients" }}
      />
    );
  }
  const authorization = client.authorization;

  return (
    <>
      <BrokerageBreadcrumbs
        items={[{ label: "Clients", href: "/brokerage/clients" }, { label: client.name }]}
      />
      <BrokerageHeader
        eyebrow={`${client.tier} · ${client.sla} SLA`}
        title={client.name}
        description={`Registered in ${client.registeredState} · ${client.registrationNumber} · ${client.monthlyVolume} declarations/month`}
        actions={
          <Link
            href="/brokerage/declarations"
            className="rounded-md bg-emerald-500 px-3.5 py-1.5 font-mono text-[12px] font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
          >
            View declarations
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 px-4 pb-6 lg:grid-cols-[1fr_360px]">
        {/* Left — details */}
        <div className="flex flex-col gap-4">
          {/* Authorization status */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
            <h2 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              §90(1)(b) · Written authorization
            </h2>
            {authorization?.written ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-mono text-[11.5px] text-emerald-400">
                  <span>✓</span>
                  <span>On file</span>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-[11.5px]">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Reference
                    </dt>
                    <dd className="mt-0.5 font-mono text-[var(--text)]">
                      {authorization.reference}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Signed
                    </dt>
                    <dd className="mt-0.5 font-mono text-[var(--text)]">
                      {authorization.signedAt}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Signed by
                    </dt>
                    <dd className="mt-0.5 text-[var(--text-secondary)]">
                      {authorization.signedBy}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-mono text-[11.5px] text-red-400">
                  <span>✕</span>
                  <span>Not on file — no action may be taken on their behalf</span>
                </div>
                <p className="text-[11.5px] text-[var(--text-secondary)]">
                  Obtain a signed letter of authorization from the client before
                  proceeding with any declaration.
                </p>
              </div>
            )}
          </section>

          {/* Contact details */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
            <h2 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Contact
            </h2>
            <dl className="grid grid-cols-1 gap-3 text-[12px] md:grid-cols-2">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Email
                </dt>
                <dd className="mt-0.5 text-[var(--text-secondary)]">
                  {client.contactEmail}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Onboarded
                </dt>
                <dd className="mt-0.5 text-[var(--text-secondary)]">
                  {client.onboardedAt ?? "—"}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Assigned brokers
                </dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {client.assignedBrokers?.length ? (
                    client.assignedBrokers.map((b) => (
                      <span
                        key={b}
                        className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[10.5px] text-[var(--text-secondary)]"
                      >
                        {b}
                      </span>
                    ))
                  ) : (
                    <span className="text-[var(--text-muted)]">Not assigned</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Right — compliance snapshot */}
        <aside className="flex flex-col gap-3">
          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
            <h2 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Compliance snapshot
            </h2>
            <ul className="flex flex-col gap-2 font-mono text-[11px]">
              <li className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">§90(1)(b) authorization</span>
                <span className={authorization?.written ? "text-emerald-400" : "text-red-400"}>
                  {authorization?.written ? "✓" : "✕"}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">3-agent limit (§8)</span>
                <span className="text-emerald-400">✓</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Sanctions screening</span>
                <span className="text-emerald-400">✓</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">KYC current</span>
                <span className="text-emerald-400">✓</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}
