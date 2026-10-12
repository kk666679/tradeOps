"use client";
export interface SpendAuthorityCardProps {
  role: string; holder: string;
  tier: "t1" | "t2" | "t3" | "t4";
  threshold: number; escalationTo: string;
  currency?: string; className?: string;
}

const TIER_LABEL: Record<SpendAuthorityCardProps["tier"], string> = {
  t1: "T1 — duty payment authority", t2: "T2 — bonded movement authority",
  t3: "T3 — compound settlement authority", t4: "T4 — firm-wide authority",
};

export function SpendAuthorityCard({ role, holder, tier, threshold, escalationTo, currency = "RM", className }: SpendAuthorityCardProps) {
  return (
    <div className={["flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4", className ?? ""].join(" ")}
         aria-label="Spend authority">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{TIER_LABEL[tier]}</div>
      <div>
        <div className="text-[13px] font-semibold text-[var(--text)]">{holder}</div>
        <div className="font-mono text-[10.5px] text-[var(--text-muted)]">{role}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-2">
          <div className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">Threshold</div>
          <div className="font-mono text-[13px] font-semibold text-[var(--text)]">{currency} {threshold.toLocaleString()}</div>
        </div>
        <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-2">
          <div className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">Escalation</div>
          <div className="truncate font-mono text-[12px] font-semibold text-[var(--text)]">{escalationTo}</div>
        </div>
      </div>
    </div>
  );
}
