"use client";
export interface DelegationRow { role: string; actions: string[]; prohibited: string[]; }

export function DelegationLimits({ rows, className }: { rows: DelegationRow[]; className?: string }) {
  return (
    <section className={["flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4", className ?? ""].join(" ")}
             aria-label="Delegation limits">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Delegation limits</div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--border-subtle)]">
            <th className="py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Role</th>
            <th className="py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">May</th>
            <th className="py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">May not</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.role} className="border-b border-[var(--border-subtle)] align-top">
              <td className="py-2 font-mono text-[11px] text-[var(--text)]">{r.role}</td>
              <td className="py-2">
                <div className="flex flex-wrap gap-1">
                  {r.actions.map((a) => <span key={a} className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[9.5px] text-emerald-300">{a}</span>)}
                </div>
              </td>
              <td className="py-2">
                <div className="flex flex-wrap gap-1">
                  {r.prohibited.map((a) => <span key={a} className="rounded bg-red-500/15 px-1.5 py-0.5 font-mono text-[9.5px] text-red-300">{a}</span>)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
