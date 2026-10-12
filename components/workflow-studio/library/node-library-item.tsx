"use client";

import type { CatalogEntry } from "../lib/node-catalog-helpers";

export interface NodeLibraryItemProps {
  entry: CatalogEntry;
  capabilityUnavailable?: boolean;
  onDragStart: (entry: CatalogEntry) => void;
}

export function NodeLibraryItem({ entry, capabilityUnavailable, onDragStart }: NodeLibraryItemProps) {
  return (
    <button
      type="button"
      draggable={!capabilityUnavailable}
      disabled={capabilityUnavailable}
      onDragStart={(e) => {
        if (capabilityUnavailable) { e.preventDefault(); return; }
        e.dataTransfer.setData("application/x-workflow-node", entry.type);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(entry);
      }}
      aria-label={`Add ${entry.label} node`}
      className={[
        "flex w-full flex-col gap-0.5 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2.5 py-2 text-left transition-colors",
        capabilityUnavailable
          ? "cursor-not-allowed opacity-50"
          : "cursor-grab hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)]",
      ].join(" ")}
    >
      <span className="text-[12px] font-semibold text-[var(--text)]">{entry.label}</span>
      <span className="line-clamp-2 text-[10.5px] leading-snug text-[var(--text-muted)]">{entry.description}</span>
      {capabilityUnavailable && (
        <span className="font-mono text-[9px] text-red-400">JKDM unavailable</span>
      )}
    </button>
  );
}
