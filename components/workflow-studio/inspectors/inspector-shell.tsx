"use client";

import type { ReactNode } from "react";

export interface InspectorShellProps {
  title: string;
  description?: string;
  onDelete?: () => void;
  onDuplicate?: () => void;
  children: ReactNode;
}

export function InspectorShell({ title, description, onDelete, onDuplicate, children }: InspectorShellProps) {
  return (
    <div className="flex flex-col gap-4" aria-label={`${title} inspector`}>
      <header>
        <h3 className="text-[13px] font-semibold text-[var(--text)]">{title}</h3>
        {description && <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{description}</p>}
      </header>
      <div className="flex flex-col gap-3">{children}</div>
      <div className="mt-2 flex gap-2 border-t border-[var(--border-subtle)] pt-3">
        {onDuplicate && (
          <button type="button" onClick={onDuplicate}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]">
            Duplicate
          </button>
        )}
        {onDelete && (
          <button type="button" onClick={onDelete}
            className="rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 font-mono text-[11px] text-red-400 hover:bg-red-500/20">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export function InspectorField({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{label}</span>
      {children}
      {hint && !error && <span className="font-mono text-[9.5px] text-[var(--text-muted)]">{hint}</span>}
      {error && <span className="font-mono text-[9.5px] text-red-400">{error}</span>}
    </label>
  );
}
