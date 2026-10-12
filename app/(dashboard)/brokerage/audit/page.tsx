import { BrokerageHeader, BrokerageBreadcrumbs } from "../_components";

export const metadata = {
  title: "Audit · Brokerage · TradeOps",
};

const CHAIN = [
  { hash: "0x4f17a2c8", prev: "0x00000000", action: "session.opened", actor: "system", ts: "2026-04-12T08:14:00Z", tag: "system" },
  { hash: "0xa1b2c3d4", prev: "0x4f17a2c8", action: "document.extract", actor: "document.agent", ts: "2026-04-12T08:14:22Z", tag: "agent" },
  { hash: "0xe5f6g7h8", prev: "0xa1b2c3d4", action: "customs.classify-hs", actor: "customs.classifier", ts: "2026-04-12T08:15:04Z", tag: "agent" },
  { hash: "0xi9j0k1l2", prev: "0xe5f6g7h8", action: "customs.estimate-value", actor: "customs.valuation", ts: "2026-04-12T08:15:31Z", tag: "agent" },
  { hash: "0xm3n4o5p6", prev: "0xi9j0k1l2", action: "customs.determine-origin", actor: "customs.origin", ts: "2026-04-12T08:15:58Z", tag: "agent" },
  { hash: "0xq7r8s9t0", prev: "0xm3n4o5p6", action: "customs.screen-party", actor: "customs.screening", ts: "2026-04-12T08:16:12Z", tag: "agent" },
  { hash: "0xu1v2w3x4", prev: "0xq7r8s9t0", action: "hitl.approved", actor: "aisha.rahman", ts: "2026-04-12T09:41:00Z", tag: "human" },
  { hash: "0xy5z6a7b8", prev: "0xu1v2w3x4", action: "customs.file-declaration", actor: "customs.declaration", ts: "2026-04-12T09:42:14Z", tag: "agent" },
  { hash: "0xc9d0e1f2", prev: "0xy5z6a7b8", action: "audit.chain.sealed", actor: "system", ts: "2026-04-12T09:42:18Z", tag: "system" },
];

export default function AuditPage() {
  return (
    <>
      <BrokerageBreadcrumbs items={[{ label: "Audit" }]} />
      <BrokerageHeader
        eyebrow="§100 · 6-year retention"
        title="Immutable audit chain"
        description="Every agent action, human approval, and system event is recorded on a SHA-256 hash chain. Prev-hash is verified on every entry."
      />

      <div className="px-4 pb-6">
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)]">
          <header className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4 py-2.5">
            <h2 className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Chain · {CHAIN.length} entries
            </h2>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              verified
            </span>
          </header>

          <ol className="divide-y divide-[var(--border-subtle)]">
            {CHAIN.map((entry) => (
              <li
                key={entry.hash}
                className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-[var(--bg-subtle)]"
              >
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  {entry.hash}
                </span>
                <span className="font-mono text-[9.5px] text-[var(--text-muted)] opacity-60">
                  ← {entry.prev}
                </span>
                <span
                  className={[
                    "rounded px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider",
                    entry.tag === "human"
                      ? "bg-amber-500/15 text-amber-400"
                      : entry.tag === "system"
                      ? "bg-blue-500/15 text-blue-300"
                      : "bg-purple-500/15 text-purple-300",
                  ].join(" ")}
                >
                  {entry.tag}
                </span>
                <span className="font-mono text-[11.5px] text-[var(--text)]">
                  {entry.action}
                </span>
                <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                  {entry.actor}
                </span>
                <span className="ml-auto font-mono text-[10px] text-[var(--text-muted)]">
                  {new Date(entry.ts).toLocaleString()}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
