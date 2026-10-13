import Link from "next/link";
import type { BrokerClient } from "@/components/workflow-studio/brokerage/types";
import { BrokerageHeader, BrokerageBreadcrumbs } from "../_components";

export const metadata = {
  title: "Clients · Brokerage · TradeOps",
};

const SAMPLE_CLIENTS: BrokerClient[] = [
  {
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
  {
    id: "cl-straits",
    name: "Straits Freight Brokers Sdn Bhd",
    registrationNumber: "201905067890",
    country: "Malaysia",
    tier: "growth",
    status: "active",
    sla: "priority",
    assignedBrokers: ["daniel.okafor"],
    contactEmail: "ops@straitsfb.com.my",
    monthlyVolume: 128,
    onboardedAt: "2025-11-02",
    registeredState: "Selangor",
    authorization: {
      written: true,
      reference: "LOA-2025-0918",
      signedAt: "2025-11-02",
      signedBy: "Tan Mei Ling (Managing Director)",
    },
  },
  {
    id: "cl-pacific",
    name: "Pacific Bonded Sdn Bhd",
    registrationNumber: "201702034512",
    country: "Malaysia",
    tier: "enterprise",
    status: "active",
    sla: "critical",
    assignedBrokers: ["aisha.rahman"],
    contactEmail: "trade@pacificbonded.com.my",
    monthlyVolume: 218,
    onboardedAt: "2024-04-22",
    registeredState: "Penang",
    authorization: {
      written: true,
      reference: "LOA-2024-0418",
      signedAt: "2024-04-22",
      signedBy: "Rajesh Kumar (Director)",
    },
  },
  {
    id: "cl-trident",
    name: "Trident Clearance Sdn Bhd",
    registrationNumber: "202003045671",
    country: "Malaysia",
    tier: "growth",
    status: "onboarding",
    sla: "standard",
    assignedBrokers: ["daniel.okafor"],
    contactEmail: "hello@trident.com.my",
    monthlyVolume: 0,
    registeredState: "Johor",
    authorization: {
      written: false,
    },
  },
];

export default function ClientsPage() {
  return (
    <>
      <BrokerageBreadcrumbs items={[{ label: "Clients" }]} />
      <BrokerageHeader
        eyebrow="Engagement · §90(1)(b)"
        title="Client registry"
        description="Every client must have written authorization on file before any action may be taken on their behalf, per §90(1)(b) of the Customs Act 1967."
      />
      <div className="grid grid-cols-1 gap-3 px-4 pb-6 md:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_CLIENTS.map((c) => (
          <ClientCard key={c.id} client={c} />
        ))}
      </div>
    </>
  );
}

/* Inline client card — replace with ClientRegistry component when ready */
function ClientCard({ client }: { client: BrokerClient }) {
  const tierColor =
    client.tier === "enterprise"
      ? "#8b5cf6"
      : client.tier === "growth"
      ? "#3b82f6"
      : "#71717a";
  const slaColor =
    client.sla === "critical"
      ? "#ef4444"
      : client.sla === "priority"
      ? "#3b82f6"
      : "#71717a";

  return (
    <Link
      href={`/brokerage/clients/${client.id}`}
      className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4 transition-all hover:border-emerald-500/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider"
            style={{ background: `${tierColor}22`, color: tierColor }}
          >
            {client.tier}
          </span>
          <span
            className="rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider"
            style={{ background: `${slaColor}22`, color: slaColor }}
          >
            {client.sla} SLA
          </span>
        </div>
        <span
          className="h-2 w-2 flex-none rounded-full"
          style={{
            background: client.status === "active" ? "#10b981" : "#f59e0b",
          }}
          aria-label={client.status}
        />
      </div>

      <div>
        <div className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-[var(--text)]">
          {client.name}
        </div>
        <div className="mt-0.5 font-mono text-[10.5px] text-[var(--text-muted)]">
          {client.registrationNumber} · {client.registeredState}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] pt-3 font-mono text-[10.5px]">
        <span className="text-[var(--text-muted)]">
          {client.monthlyVolume} decl/mo
        </span>
        <span className="text-[var(--border)]">·</span>
        <span
          className={
            client.authorization.written ? "text-emerald-400" : "text-red-400"
          }
        >
          {client.authorization.written ? "✓ authorized" : "✕ no §90(1)(b)"}
        </span>
      </div>
    </Link>
  );
}
