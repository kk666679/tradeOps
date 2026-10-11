"use client";
import { useState } from "react";
import type { AccreditationData, Declaration } from "../types";

export interface EvidencePackBuilderProps {
  declaration: Declaration;
  accreditation: AccreditationData;
  onExport?: (pack: EvidencePack) => void;
  className?: string;
}

export interface EvidencePack {
  reference: string;
  generatedAt: string;
  ruleSetVersion?: string;
  items: Array<{ id: string; label: string; ref: string }>;
}

export function EvidencePackBuilder({ declaration, accreditation, onExport, className }: EvidencePackBuilderProps) {
  const [building, setBuilding] = useState(false);

  const items = [
    { id: "decl",    label: "Declaration record",              ref: declaration.reference },
    { id: "auth",    label: "Client authorization (§90(1)(b))", ref: declaration.clientName },
    { id: "broker",  label: "Signing broker",                  ref: declaration.owningBroker },
    { id: "licence", label: "Agent licence (§90)",             ref: accreditation.licenceNumber },
    { id: "bond",    label: `${accreditation.bond.form}`,      ref: `RM ${accreditation.bond.amount.toLocaleString()}` },
    ...(declaration.gateResult?.evaluations ?? []).map((e) => ({
      id: `ctrl-${e.controlId}`,
      label: `${e.controlName} (v${e.controlVersion})`,
      ref: `${e.outcome} — ${e.reason}`,
    })),
  ];

  const build = () => {
    setBuilding(true);
    setTimeout(() => {
      onExport?.({
        reference: declaration.reference,
        generatedAt: new Date().toISOString(),
        ruleSetVersion: declaration.gateResult?.ruleSetVersion,
        items,
      });
      setBuilding(false);
    }, 300);
  };

  return (
    <section className={["flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4", className ?? ""].join(" ")}
             aria-label="Evidence pack builder">
      <header className="flex items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Evidence pack · {declaration.reference}
          {declaration.gateResult && ` · ${declaration.gateResult.ruleSetVersion}`}
        </div>
        <button type="button" onClick={build} disabled={building}
          className="rounded-md bg-emerald-500 px-3 py-1 font-mono text-[10.5px] font-medium text-emerald-950 transition-colors hover:bg-emerald-400 disabled:opacity-50">
          {building ? "building…" : "Export signed PDF"}
        </button>
      </header>
      <ul className="flex flex-col gap-1.5">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-1.5">
            <span className="font-mono text-[10px] text-emerald-400">✓</span>
            <span className="text-[11px] text-[var(--text-secondary)]">{it.label}</span>
            <span className="ml-auto truncate font-mono text-[10px] text-[var(--text-muted)]">{it.ref}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
