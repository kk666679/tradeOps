"use client";
import type { CustomsChannel, CustomsFormCode, DeclarationFlag } from "../types";
import { CHANNEL_META } from "../constants";

export interface PipelineFiltersState {
  search: string;
  forms: Set<CustomsFormCode>;
  flags: Set<DeclarationFlag>;
  channels: Set<CustomsChannel>;
}

const FORMS: CustomsFormCode[] = ["K1", "K2", "K3", "K7", "K8", "K9"];
const FLAGS: DeclarationFlag[] = [
  "hs-conflict", "origin-unclear", "valuation-review", "sanctions-hit", "missing-doc",
  "sla-breach", "post-audit-risk", "permit-required", "permit-missing",
  "form-purpose-unverified", "rule-version-superseded",
];
const CHANNELS: CustomsChannel[] = ["GREEN", "YELLOW", "RED", "UNASSIGNED"];

export function PipelineFilters({ value, onChange }: {
  value: PipelineFiltersState; onChange: (v: PipelineFiltersState) => void;
}) {
  const toggleForm = (f: CustomsFormCode) => {
    const next = new Set(value.forms);
    if (next.has(f)) next.delete(f); else next.add(f);
    onChange({ ...value, forms: next });
  };
  const toggleFlag = (f: DeclarationFlag) => {
    const next = new Set(value.flags);
    if (next.has(f)) next.delete(f); else next.add(f);
    onChange({ ...value, flags: next });
  };
  const toggleChannel = (c: CustomsChannel) => {
    const next = new Set(value.channels);
    if (next.has(c)) next.delete(c); else next.add(c);
    onChange({ ...value, channels: next });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input type="search" value={value.search}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        placeholder="Search reference, client, broker…" aria-label="Search declarations"
        className="w-56 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-emerald-500/50" />

      <div className="flex flex-wrap items-center gap-1">
        {FORMS.map((f) => {
          const on = value.forms.has(f);
          return (
            <button key={f} type="button" aria-pressed={on} onClick={() => toggleForm(f)}
              className={["rounded px-2 py-1 font-mono text-[10px] transition-colors",
                on ? "bg-emerald-500/20 text-emerald-300" : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)]"].join(" ")}>
              {f}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {CHANNELS.map((c) => {
          const on = value.channels.has(c);
          const meta = CHANNEL_META[c];
          return (
            <button key={c} type="button" aria-pressed={on} onClick={() => toggleChannel(c)}
              className="rounded px-2 py-1 font-mono text-[10px] transition-colors"
              style={{
                background: on ? meta.bg : "var(--bg-subtle)",
                color: on ? meta.color : "var(--text-muted)",
              }}>
              {c}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {FLAGS.map((f) => {
          const on = value.flags.has(f);
          return (
            <button key={f} type="button" aria-pressed={on} onClick={() => toggleFlag(f)}
              className={["rounded px-2 py-1 font-mono text-[10px] transition-colors",
                on ? "bg-amber-500/20 text-amber-300" : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)]"].join(" ")}>
              {f}
            </button>
          );
        })}
      </div>
    </div>
  );
}
