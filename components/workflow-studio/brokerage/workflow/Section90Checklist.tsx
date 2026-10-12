"use client";
import { useMemo, useState } from "react";
import type { AccreditationData, RegulatoryGateResult } from "../types";
import { CONTROL_OUTCOME_META, REGULATORY } from "../constants";

export interface Section90ChecklistProps {
  data: AccreditationData;
  gateResult?: RegulatoryGateResult;
  className?: string;
  onExport?: () => void;
}

export function Section90Checklist({ data, gateResult, className, onExport }: Section90ChecklistProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const items = useMemo(() => {
    if (gateResult) {
      return gateResult.evaluations.map((e) => ({
        id: e.controlId,
        section: e.references[0]?.section ?? "§90",
        label: e.controlName,
        description: e.reason,
        outcome: e.outcome,
        severity: e.severity,
        mandatory: e.mandatory,
        version: e.controlVersion,
        references: e.references,
      }));
    }
    // Fallback when no gate result available — show nothing fabricated.
    return [];
  }, [gateResult]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const failCount = items.filter((i) => i.outcome === "FAIL").length;
  const reviewCount = items.filter((i) => i.outcome === "REVIEW").length;
  const passCount = items.filter((i) => i.outcome === "PASS").length;

  return (
    <div className={["flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-5", className ?? ""].join(" ")}
         aria-labelledby="section90-heading">
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Section 90 · Compliance checklist
          </div>
          <h3 id="section90-heading" className="mt-1 text-[15px] font-semibold text-[var(--text)]">
            Customs Act 1967 §90 — Agent accreditation audit
          </h3>
          <div className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
            {data.licenceNumber} · {data.ejenType} · expires {new Date(data.expiresAt).toLocaleDateString()}
          </div>
          {gateResult && (
            <div className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">
              rule set {gateResult.ruleSetVersion} · evaluated {new Date(gateResult.evaluatedAt).toLocaleString()}
            </div>
          )}
        </div>
        {onExport && (
          <button type="button" onClick={onExport}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-1.5 font-mono text-[11px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--text)]">
            Export PDF
          </button>
        )}
      </header>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-md border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">Pass</div>
          <div className="font-mono text-[18px] font-semibold text-emerald-400">{passCount}</div>
        </div>
        <div className="rounded-md border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">Review</div>
          <div className="font-mono text-[18px] font-semibold text-amber-400">{reviewCount}</div>
        </div>
        <div className="rounded-md border border-red-500/25 bg-red-500/[0.06] px-3 py-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-red-400">Fail</div>
          <div className="font-mono text-[18px] font-semibold text-red-400">{failCount}</div>
        </div>
      </div>

      {items.length === 0 && (
        <div className="rounded border border-dashed border-[var(--border)] px-3 py-6 text-center font-mono text-[10.5px] text-[var(--text-muted)]">
          no gate result yet — evaluate a declaration to populate
        </div>
      )}

      <ul className="divide-y divide-[var(--border-subtle)]">
        {items.map((item) => {
          const meta = CONTROL_OUTCOME_META[item.outcome];
          const isExpanded = expanded.has(item.id);
          return (
            <li key={item.id} className="py-2">
              <button type="button" onClick={() => toggle(item.id)} aria-expanded={isExpanded}
                className="flex w-full items-start gap-3 rounded px-2 py-2 text-left transition-colors hover:bg-[var(--bg-subtle)]">
                <span className="mt-0.5 font-mono text-[12px]" style={{ color: meta.color }} aria-hidden>{meta.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)]">{item.section}</span>
                    <span className="text-[12.5px] font-medium text-[var(--text)]">{item.label}</span>
                    {item.mandatory && (
                      <span className="rounded bg-red-500/15 px-1 py-0.5 font-mono text-[8.5px] text-red-400">mandatory</span>
                    )}
                    <span className="ml-auto whitespace-nowrap font-mono text-[10px] text-[var(--text-muted)]">
                      v{item.version}
                    </span>
                  </div>
                  {isExpanded && (
                    <div className="mt-2 flex flex-col gap-2">
                      <p className="text-[11.5px] leading-relaxed text-[var(--text-secondary)]">{item.description}</p>
                      {item.references.map((r) => (
                        <div key={r.id} className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                          <span className="text-[var(--text-secondary)]">{r.title}{r.section ? ` ${r.section}` : ""}</span>
                          {r.url && (
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">↗</a>
                          )}
                          <span className={r.verificationStatus === "VERIFIED" ? "text-emerald-400" : "text-amber-400"}>
                            {r.verificationStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <footer className="mt-2 border-t border-[var(--border-subtle)] pt-4">
        <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-[var(--text-muted)]">
          <div>
            <div className="mb-1 uppercase tracking-wider">Prepared by</div>
            <div className="border-b border-[var(--border)] pb-1 text-[11px] text-[var(--text-secondary)]">
              {data.approvedStaff[0]?.name ?? "—"}
            </div>
          </div>
          <div>
            <div className="mb-1 uppercase tracking-wider">Reviewed by</div>
            <div className="border-b border-[var(--border)] pb-1 text-[11px] text-[var(--text-secondary)]">&nbsp;</div>
          </div>
          <div className="col-span-2 mt-2">
            <div className="mb-1 uppercase tracking-wider">Section 90 declaration</div>
            <p className="text-[10.5px] leading-relaxed text-[var(--text-secondary)]">
              I confirm that the above information is accurate as of the date of this checklist, and that the brokerage continues to meet all conditions under Section 90 of the Customs Act 1967 and the JKDM guideline dated 22 April 2025.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
