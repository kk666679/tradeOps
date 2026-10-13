import Link from "next/link";
import {
  SAMPLE_ACCREDITATION,
  SAMPLE_CLIENT,
  SAMPLE_DECLARATION,
} from "@/components/workflow-studio/brokerage/workflow/brokerageWorkflowGraph";
import { RegulatoryHealthPanel } from "@/components/workflow-studio/brokerage/workflow/RegulatoryHealthPanel";
import { BrokerageHeader } from "./_components";

export const dynamic = "force-dynamic";

/* KPI tile — extracted inline for readability */
function KpiTile({
  label,
  value,
  detail,
  accent,
  href,
}: {
  label: string;
  value: string;
  detail?: string;
  accent?: string;
  href?: string;
}) {
  const inner = (
    <div className="flex flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4 transition-all hover:border-emerald-500/30 hover:shadow-md">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </div>
      <div
        className="font-mono text-[24px] font-semibold leading-none"
        style={{ color: accent ?? "var(--text)" }}
      >
        {value}
      </div>
      {detail && (
        <div className="font-mono text-[10.5px] text-[var(--text-muted)]">{detail}</div>
      )}
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default function BrokerageOverviewPage() {
  const accreditation = SAMPLE_ACCREDITATION;

  return (
    <>
      <BrokerageHeader
        eyebrow="Section 90 · Customs Act 1967"
        title="Brokerage operations"
        description={`Licence ${accreditation.licenceNumber} · ${accreditation.ejenType} · expires ${new Date(accreditation.expiresAt).toLocaleDateString()}`}
        actions={
          <>
            <Link
              href="/brokerage/governance/section-90"
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3.5 py-1.5 font-mono text-[12px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
            >
              §90 checklist
            </Link>
            <Link
              href="/brokerage/declarations"
              className="rounded-md bg-emerald-500 px-3.5 py-1.5 font-mono text-[12px] font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              Open queue
            </Link>
          </>
        }
      />

      {/* KPI strip */}
      <section
        aria-label="Key metrics"
        className="grid grid-cols-2 gap-3 px-4 pb-4 lg:grid-cols-4"
      >
        <KpiTile
          label="Declarations this month"
          value="412"
          detail="+18% vs last month"
          href="/brokerage/declarations"
        />
        <KpiTile
          label="Open drafts"
          value="47"
          detail="awaiting sign-off"
          accent="#f59e0b"
          href="/brokerage/pipeline"
        />
        <KpiTile
          label="Duty recovered (FTA)"
          value="RM 812K"
          detail="this quarter"
          accent="#10b981"
          href="/brokerage/audit"
        />
        <KpiTile
          label="Audit trail coverage"
          value="100%"
          detail="last 6 months"
          accent="#3b82f6"
          href="/brokerage/audit"
        />
      </section>

      {/* Two-column: health + activity */}
      <section className="grid grid-cols-1 gap-4 px-4 pb-6 lg:grid-cols-[1fr_360px]">
        {/* Left — recent declarations */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-[var(--text)]">
              Recent declarations
            </h2>
            <Link
              href="/brokerage/declarations"
              className="font-mono text-[11px] text-emerald-400 hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                    Reference
                  </th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                    Client
                  </th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                    Form
                  </th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-right font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ref: "K1/PG/2026/00418", client: SAMPLE_CLIENT.name, form: "K1", status: "classifying", value: "RM 842,000" },
                  { ref: "K2/PG/2026/00419", client: "Straits Freight Brokers Sdn Bhd", form: "K2", status: "awaiting-approval", value: "RM 128,400" },
                  { ref: "K8/PG/2026/00420", client: "Pacific Bonded Sdn Bhd", form: "K8", status: "filed", value: "RM 2,140,000" },
                  { ref: "K1/PG/2026/00421", client: "Trident Clearance Sdn Bhd", form: "K1", status: "channel-yellow", value: "RM 412,000" },
                  { ref: "K9/PG/2026/00422", client: "SeaGate Logistics Sdn Bhd", form: "K9", status: "cleared", value: "RM 78,200" },
                ].map((row) => (
                  <tr
                    key={row.ref}
                    className="border-b border-[var(--border-subtle)] last:border-b-0 hover:bg-[var(--bg-subtle)]"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/brokerage/declarations/${encodeURIComponent(row.ref)}`}
                        className="font-mono text-[11.5px] text-[var(--text)] hover:text-emerald-400"
                      >
                        {row.ref}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)]">
                      {row.client}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--text-secondary)]">
                        {row.form}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[11.5px] text-[var(--text-secondary)]">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right — regulatory health */}
        <aside className="flex flex-col gap-3">
          <h2 className="text-[14px] font-semibold text-[var(--text)]">
            Regulatory health
          </h2>
          <RegulatoryHealthPanel
            data={accreditation}
            onConditionClick={undefined}
          />
        </aside>
      </section>
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { color: string; label: string }> = {
    draft: { color: "#71717a", label: "Draft" },
    classifying: { color: "#8b5cf6", label: "Classifying" },
    "awaiting-approval": { color: "#f59e0b", label: "Awaiting approval" },
    filed: { color: "#3b82f6", label: "Filed" },
    "channel-yellow": { color: "#f59e0b", label: "Yellow Lane" },
    "channel-green": { color: "#10b981", label: "Green Lane" },
    "channel-red": { color: "#ef4444", label: "Red Lane" },
    cleared: { color: "#10b981", label: "Cleared" },
  };
  const meta = map[status] ?? { color: "#71717a", label: status };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px]"
      style={{ background: `${meta.color}15`, color: meta.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}
