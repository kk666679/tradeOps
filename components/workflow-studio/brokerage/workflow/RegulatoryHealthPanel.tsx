"use client";
import { useMemo } from "react";
import type { RegulatoryGateResult } from "../types";
import { CONTROL_OUTCOME_META, CONTROL_SEVERITY_META } from "../constants";

export interface RegulatoryHealthPanelProps {
  gateResult: RegulatoryGateResult;
  licenceNumber: string;
  ejenType: string;
  expiresAt: string;
  className?: string;
  onControlClick?: (controlId: string) => void;
}

export function RegulatoryHealthPanel({
  gateResult, licenceNumber, ejenType, expiresAt, className, onControlClick,
}: RegulatoryHealthPanelProps) {
  const { okCount, failCount, reviewCount, naCount } = useMemo(() => {
    let ok = 0, fail = 0, review = 0, na = 0;
    for (const e of gateResult.evaluations) {
      if (e.outcome === "PASS") ok++;
      else if (e.outcome === "FAIL") fail++;
      else if (e.outcome === "REVIEW") review++;
      else na++;
    }
    return { okCount: ok, failCount: fail, reviewCount: review, naCount: na };
  }, [gateResult]);

  const total = gateResult.evaluations.length || 1;

  return (
    <div className={["flex flex-col gap-4 rounded-xl border bg-[var(--bg-elev)] p-4", className ?? ""].join(" ")}
         aria-label="Regulatory gate result">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Regulatory gate
          </div>
          <div className="mt-1 truncate font-mono text-[12.5px] text-[var(--text)]">{licenceNumber}</div>
          <div className="mt-0.5 text-[11px] text-[var(--text-muted)]">
            {ejenType} · rule set {gateResult.ruleSetVersion}
          </div>
          <div className="mt-0.5 font-mono text-[10px] text-[var(--text-muted)]">
            evaluated {new Date(gateResult.evaluatedAt).toLocaleString()}
          </div>
        </div>
        <span className={["flex items-center gap-1.5 whitespace-nowrap rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
          gateResult.allowedToProceed
            ? "bg-emerald-500/15 text-emerald-400"
            : "bg-red-500/15 text-red-400"].join(" ")}>
          {gateResult.allowedToProceed ? "Allowed" : "Blocked"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
          <div style={{ width: `${(okCount / total) * 100}%`, background: "#10b981" }} />
          <div style={{ width: `${(reviewCount / total) * 100}%`, background: "#f59e0b" }} />
          <div style={{ width: `${(failCount / total) * 100}%`, background: "#ef4444" }} />
          <div style={{ width: `${(naCount / total) * 100}%`, background: "#52525b" }} />
        </div>
        <span className="font-mono text-[10.5px] text-[var(--text-muted)]">
          {okCount} pass · {reviewCount} review · {failCount} fail · {naCount} n/a
        </span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {gateResult.evaluations.map((e) => {
          const outcome = CONTROL_OUTCOME_META[e.outcome];
          const severity = CONTROL_SEVERITY_META[e.severity];
          return (
            <li key={e.controlId}>
              <button type="button" onClick={() => onControlClick?.(e.controlId)}
                className="flex w-full items-start gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-[var(--bg-subtle)]"
                title={e.reason}>
                <span className="mt-0.5 font-mono text-[11px]" style={{ color: outcome.color }}>{outcome.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate text-[11.5px] text-[var(--text)]">{e.controlName}</span>
                    {e.mandatory && (
                      <span className="rounded px-1 py-0.5 font-mono text-[8.5px]"
                            style={{ background: severity.bg, color: severity.color }}>
                        {severity.label}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 truncate font-mono text-[9.5px] text-[var(--text-muted)]">{e.reason}</div>
                  <div className="mt-0.5 flex items-center gap-2 font-mono text-[8.5px] text-[var(--text-muted)]">
                    <span>v{e.controlVersion}</span>
                    {e.references[0] && (
                      <span>
                        {e.references[0].section ?? e.references[0].title}
                        {e.references[0].verificationStatus !== "VERIFIED" && (
                          <span className="ml-1 text-amber-400">{e.references[0].verificationStatus}</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {gateResult.allowedToProceed ? (
        <div className="rounded-md border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-2 font-mono text-[10.5px] text-emerald-400">
          ✓ All mandatory controls pass. Declaration may proceed.
          {gateResult.requiresHumanReview && " Review required before submission."}
        </div>
      ) : (
        <div className="rounded-md border border-red-500/25 bg-red-500/[0.06] px-3 py-2 font-mono text-[10.5px] text-red-400">
          ✕ {gateResult.blockingControlIds.length} blocking control(s) — declaration cannot proceed.
        </div>
      )}
    </div>
  );
}
