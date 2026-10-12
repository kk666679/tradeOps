import Link from "next/link";
import { BrokerageHeader, BrokerageBreadcrumbs } from "../_components";

export const metadata = {
  title: "Governance · Brokerage · TradeOps",
};

export default function GovernancePage() {
  return (
    <>
      <BrokerageBreadcrumbs items={[{ label: "Governance" }]} />
      <BrokerageHeader
        eyebrow="Firm-wide"
        title="Governance"
        description="Licences, delegation limits, spend authority, and jurisdiction scope."
        actions={
          <Link
            href="/brokerage/governance/section-90"
            className="rounded-md bg-emerald-500 px-3.5 py-1.5 font-mono text-[12px] font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
          >
            §90 checklist
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 px-4 pb-6 lg:grid-cols-2">
        {/* Licence registry */}
        <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)]">
          <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4 py-2.5">
            <h2 className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Licence registry
            </h2>
          </header>
          <ul className="divide-y divide-[var(--border-subtle)]">
            {[
              { num: "EK/PPG/2026/00842", cls: "A", juris: "MY", status: "active", expires: "2026-06-15" },
              { num: "EK/PPG/2025/00119", cls: "B", juris: "SG", status: "expiring", expires: "2026-05-02" },
            ].map((l) => (
              <li key={l.num} className="flex items-center gap-3 px-4 py-3">
                <span
                  className="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold"
                  style={{
                    background: l.cls === "A" ? "rgba(16,185,129,0.15)" : "rgba(59,130,246,0.15)",
                    color: l.cls === "A" ? "#10b981" : "#3b82f6",
                  }}
                >
                  Class {l.cls}
                </span>
                <span className="font-mono text-[11.5px] text-[var(--text)]">{l.num}</span>
                <span className="font-mono text-[10.5px] text-[var(--text-muted)]">
                  {l.juris}
                </span>
                <span className="ml-auto font-mono text-[10.5px] text-[var(--text-muted)]">
                  expires {l.expires}
                </span>
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: l.status === "active" ? "#10b981" : "#f59e0b" }}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* Delegation limits */}
        <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)]">
          <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4 py-2.5">
            <h2 className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Delegation limits
            </h2>
          </header>
          <table className="w-full border-collapse text-[11.5px]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                {["Role", "Draft", "Approve", "File", "Spend"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left font-mono text-[9.5px] font-medium uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { role: "broker", draft: true, approve: false, file: true, spend: "RM 5K" },
                { role: "senior_broker", draft: true, approve: true, file: true, spend: "RM 25K" },
                { role: "compliance", draft: false, approve: true, file: false, spend: "—" },
                { role: "principal", draft: true, approve: true, file: true, spend: "Unlimited" },
              ].map((r) => (
                <tr key={r.role} className="border-b border-[var(--border-subtle)] last:border-b-0">
                  <td className="px-3 py-2 font-mono text-[var(--text)]">{r.role}</td>
                  <td className="px-3 py-2 font-mono text-emerald-400">{r.draft ? "✓" : "—"}</td>
                  <td className="px-3 py-2 font-mono text-emerald-400">{r.approve ? "✓" : "—"}</td>
                  <td className="px-3 py-2 font-mono text-emerald-400">{r.file ? "✓" : "—"}</td>
                  <td className="px-3 py-2 font-mono text-[var(--text-secondary)]">{r.spend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
