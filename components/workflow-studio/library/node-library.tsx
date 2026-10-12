"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, catalogByCategory, type CatalogEntry } from "../lib/node-catalog-helpers";
import { NodeLibraryItem } from "./node-library-item";
import type { JkdmCapabilitySnapshot } from "../types/workflow";

export interface NodeLibraryProps {
  onDragStart?: (entry: CatalogEntry) => void;
  jkdmCaps?: JkdmCapabilitySnapshot;
}

export function NodeLibrary({ onDragStart, jkdmCaps }: NodeLibraryProps) {
  const [query, setQuery] = useState("");
  const grouped = useMemo(() => catalogByCategory(), []);

  const isUnavailable = (entry: CatalogEntry): boolean => {
    if (!entry.requiresCapability || !jkdmCaps) return false;
    if (entry.requiresCapability === "submitDeclaration") return !jkdmCaps.submitDeclaration;
    if (entry.requiresCapability === "queryDeclarationStatus") return !jkdmCaps.queryDeclarationStatus;
    return false;
  };

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((cat) => {
      const entries = grouped.get(cat.id) ?? [];
      return cat.label.toLowerCase().includes(q) || entries.some((e) => e.label.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    });
  }, [query, grouped]);

  return (
    <div className="flex h-full flex-col gap-2" aria-label="Node library">
      <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder="Search nodes…" aria-label="Search nodes"
        className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2.5 py-1.5 font-mono text-[11px] outline-none focus:border-emerald-500/50" />
      <div className="flex-1 overflow-y-auto">
        {filteredCategories.length === 0 && (
          <div className="rounded border border-dashed border-[var(--border)] px-3 py-6 text-center font-mono text-[10.5px] text-[var(--text-muted)]">
            no nodes match “{query}”
          </div>
        )}
        {filteredCategories.map((cat) => {
          const entries = (grouped.get(cat.id) ?? []).filter((e) => {
            const q = query.trim().toLowerCase();
            if (!q) return true;
            return e.label.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || cat.label.toLowerCase().includes(q);
          });
          if (entries.length === 0) return null;
          return (
            <section key={cat.id} className="mb-3">
              <h4 className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{cat.label}</h4>
              <div className="flex flex-col gap-1.5">
                {entries.map((entry) => (
                  <NodeLibraryItem key={entry.type} entry={entry}
                    capabilityUnavailable={isUnavailable(entry)}
                    onDragStart={(e) => onDragStart?.(e)} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
