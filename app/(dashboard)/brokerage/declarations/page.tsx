import Link from "next/link";
import { BrokerageHeader, BrokerageBreadcrumbs } from "../_components";

export const metadata = {
  title: "Declarations · Brokerage · TradeOps",
};

const ROWS = [
  { ref: "K1/PG/2026/00418", form: "K1", client: "Meridian Electronics Sdn Bhd", status: "classifying", broker: "aisha.rahman", value: 842_000, duty: 0 },
  { ref: "K2/PG/2026/00419", form: "K2", client: "Straits Freight Brokers Sdn Bhd", status: "awaiting-approval", broker: "daniel.okafor", value: 128_400, duty: 0 },
  { ref: "K8/PG/2026/00420", form: "K8", client: "Pacific Bonded Sdn Bhd", status: "filed", broker: "aisha.rahman", value: 2_140_000, duty: 0 },
  { ref: "K1/PG/2026/00421", form: "K1", client: "Trident Clearance Sdn Bhd", status: "channel-yellow", broker: "daniel.okafor", value: 412_000, duty: 12_400 },
  { ref: "K9/PG/2026/00422", form: "K9", client: "SeaGate Logistics Sdn Bhd", status: "cleared", broker: "aisha.rahman", value: 78_200, duty: 0 },
];

export default function DeclarationsPage() {
  return (
    <>
      <BrokerageBreadcrumbs items={[{ label: "Declarations" }]} />
      <BrokerageHeader
        eyebrow="Operational"
        title="Declarations"
        description="All K1, K2, K3, K7, K8, and K9 declarations, with their JKDM channel state and audit trail."
        actions={
          <Link
            href="/brokerage/pipeline"
            className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3.5 py-1.5 font-mono text-[12px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
          >
            Open pipeline view
          </Link>
        }
      />

      <div className="px-4 pb-6">
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
                {["Reference", "Form", "Client", "Status", "Broker", "Value", "Duty"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
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
                  <td className="px-4 py-3">
                    <span className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--text-secondary)]">
                      {row.form}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)]">
                    {row.client}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[var(--text-secondary)]">
                    {row.status}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[var(--text-secondary)]">
                    {row.broker}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[11.5px] text-[var(--text-secondary)]">
                    RM {row.value.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[11.5px] text-emerald-400">
                    {row.duty > 0 ? `RM ${row.duty.toLocaleString()}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
