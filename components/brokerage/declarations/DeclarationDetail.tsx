"use client";
import type { AccreditationData, Declaration } from "../types";
import { DECLARATION_FORM_META, FLAG_META } from "../constants";
import { BorangCTrace } from "../workflow/BorangCTrace";
import { RegulatoryHealthPanel } from "../workflow/RegulatoryHealthPanel";

export interface DeclarationDetailProps {
  declaration: Declaration;
  accreditation: AccreditationData;
  className?: string;
}

export function DeclarationDetail({ declaration, accreditation, className }: DeclarationDetailProps) {
  const form = DECLARATION_FORM_META[declaration.formCode];
  return (
    <div className={["flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-5", className ?? ""].join(" ")}
         aria-label={`Declaration ${declaration.reference}`}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-violet-500/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-violet-300">
              {declaration.formCode}
            </span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">{form.formName}</span>
            {form.purposeVerificationRequired && (
              <span className="rounded bg-orange-500/15 px-1.5 py-0.5 font-mono text-[9px] text-orange-400">
                purpose must be verified
              </span>
            )}
          </div>
          <h3 className="mt-1 font-mono text-[14px] font-semibold text-[var(--text)]">{declaration.reference}</h3>
          <div className="mt-0.5 text-[11.5px] text-[var(--text-secondary)]">
            {declaration.clientName} · {declaration.jurisdiction} · {declaration.port}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Value" value={`${declaration.currency} ${declaration.totalDeclaredValue.toLocaleString()}`} />
        <Stat label="Duty"  value={`${declaration.currency} ${declaration.totalDuty.toLocaleString()}`} />
        <Stat label="SST"   value={`${declaration.currency} ${declaration.totalSalesTax.toLocaleString()}`} />
        <Stat label="Channel" value={declaration.channel} />
      </div>

      {declaration.flags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {declaration.flags.map((f) => {
            const meta = FLAG_META[f];
            return (
              <span key={f} title={meta.label} className="rounded px-1.5 py-0.5 font-mono text-[9.5px]"
                    style={{ background: meta.bg, color: meta.color }}>{meta.icon} {meta.label}</span>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Approvals</div>
          <ul className="flex flex-col gap-1.5">
            {declaration.approvals.map((a) => (
              <li key={a.id} className="flex items-center gap-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1.5">
                <span className="font-mono text-[10px]" style={{
                  color: a.decision === "approved" ? "#10b981" : a.decision === "rejected" ? "#ef4444" : "#f59e0b",
                }}>{a.decision === "approved" ? "✓" : a.decision === "rejected" ? "✕" : "…"}</span>
                <span className="font-mono text-[10.5px] text-[var(--text-secondary)]">{a.role}</span>
                <span className="min-w-0 flex-1 truncate text-[11px] text-[var(--text)]">{a.actor}</span>
                <span className="whitespace-nowrap font-mono text-[9.5px] text-[var(--text-muted)]">
                  {new Date(a.at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <BorangCTrace declaration={declaration} accreditation={accreditation} />
      </div>

      {declaration.gateResult && (
        <RegulatoryHealthPanel
          gateResult={declaration.gateResult}
          licenceNumber={accreditation.licenceNumber}
          ejenType={accreditation.ejenType}
          expiresAt={accreditation.expiresAt} />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-2">
      <div className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">{label}</div>
      <div className="mt-0.5 truncate font-mono text-[12px] font-semibold text-[var(--text)]">{value}</div>
    </div>
  );
}
