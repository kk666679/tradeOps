"use client";
export interface JurisdictionScopeProps {
  jurisdictions: Array<{ code: string; label: string; allowed: boolean }>;
  className?: string;
}

export function JurisdictionScope({ jurisdictions, className }: JurisdictionScopeProps) {
  return (
    <section className={["flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4", className ?? ""].join(" ")}
             aria-label="Jurisdiction scope">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Jurisdiction scope</div>
      <ul className="flex flex-col gap-1.5">
        {jurisdictions.map((j) => (
          <li key={j.code} className="flex items-center gap-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-1.5">
            <span className="font-mono text-[10px]" style={{ color: j.allowed ? "#10b981" : "#ef4444" }}>{j.allowed ? "✓" : "✕"}</span>
            <span className="font-mono text-[10.5px] text-[var(--text-muted)]">{j.code}</span>
            <span className="text-[11.5px] text-[var(--text-secondary)]">{j.label}</span>
            <span className="ml-auto font-mono text-[9.5px] text-[var(--text-muted)]">{j.allowed ? "permitted" : "not permitted"}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
