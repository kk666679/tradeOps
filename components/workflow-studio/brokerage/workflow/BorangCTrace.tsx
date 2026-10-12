"use client";
import type { AccreditationData, Declaration } from "../types";

export interface BorangCTraceProps {
  declaration: Declaration;
  accreditation: AccreditationData;
  className?: string;
}

export function BorangCTrace({ declaration, accreditation, className }: BorangCTraceProps) {
  const signingApproval = declaration.approvals.find((a) => a.role === "broker" && a.decision === "approved");
  const signingBroker = accreditation.approvedStaff.find((s) => s.name === declaration.owningBroker);

  return (
    <div className={["flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] p-4", className ?? ""].join(" ")}
         aria-label="Borang C trace">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Borang C trace</div>

      <Field label="Declaration">
        <span className="font-mono text-[12px] text-[var(--text)]">{declaration.reference}</span>
        <span className="block text-[11px] text-[var(--text-secondary)]">
          {declaration.clientName} · {declaration.formCode} · {declaration.jurisdiction}
        </span>
      </Field>
      <Arrow />
      <Field label="Signing broker">
        <span className="font-mono text-[12px] text-[var(--text)]">{declaration.owningBroker}</span>
        {signingBroker && (
          <span className="block text-[11px] text-[var(--text-secondary)]">
            {signingBroker.position} · ID Pass {signingBroker.idPassNumber ?? "—"} ({signingBroker.idPassStatus})
          </span>
        )}
      </Field>
      <Arrow />
      <Field label="Borang C reference">
        <span className="font-mono text-[12px] text-[var(--text)]">
          {declaration.borangCReference ?? signingApproval?.borangCReference ?? "—"}
        </span>
        <span className="block text-[11px] text-[var(--text-secondary)]">
          Approved at {signingApproval?.at ? new Date(signingApproval.at).toLocaleString() : "—"}
        </span>
      </Field>
      <Arrow />
      <Field label="Agent licence (§90)">
        <span className="font-mono text-[12px] text-[var(--text)]">{accreditation.licenceNumber}</span>
        <span className="block text-[11px] text-[var(--text-secondary)]">
          {accreditation.ejenType} · valid to {new Date(accreditation.expiresAt).toLocaleDateString()}
        </span>
      </Field>

      {declaration.gateResult && (
        <>
          <Arrow />
          <Field label="Regulatory gate at signing">
            <span className="font-mono text-[11px] text-[var(--text-secondary)]">
              rule set {declaration.gateResult.ruleSetVersion}
            </span>
            <span className="block font-mono text-[11px]">
              {declaration.gateResult.allowedToProceed
                ? <span className="text-emerald-400">✓ allowed ({declaration.gateResult.evaluations.length} controls)</span>
                : <span className="text-red-400">✕ blocked ({declaration.gateResult.blockingControlIds.length} blocking)</span>}
            </span>
          </Field>
        </>
      )}

      <div className="mt-1 border-t border-[var(--border-subtle)] pt-3">
        {(accreditation.status === "active" || accreditation.status === "renewal-filed") ? (
          <div className="flex items-center gap-2 font-mono text-[10.5px] text-emerald-400">
            <span>✓</span><span>Licence active at time of filing</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 font-mono text-[10.5px] text-red-400">
            <span>✕</span><span>Licence {accreditation.status} — signature may be invalid</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[10px] text-[var(--text-muted)]">{label}</span>
      <div>{children}</div>
    </div>
  );
}

function Arrow() {
  return <div className="flex justify-center"><span className="font-mono text-[12px] text-[var(--text-muted)]">↓</span></div>;
}
