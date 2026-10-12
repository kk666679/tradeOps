"use client";
import { useMemo, useState } from "react";
import type { BrokerClient, ClientTier } from "../types";
import { ClientCard } from "./ClientCard";

export interface ClientRegistryProps {
  clients: BrokerClient[];
  onClientClick?: (c: BrokerClient) => void;
  className?: string;
}

export function ClientRegistry({ clients, onClientClick, className }: ClientRegistryProps) {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<ClientTier | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      if (tier && c.tier !== tier) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.registrationNumber.toLowerCase().includes(q);
    });
  }, [clients, query, tier]);

  return (
    <section className={["flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4", className ?? ""].join(" ")}
             aria-label="Client registry">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
          Clients · {filtered.length} / {clients.length}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients…" aria-label="Search clients"
            className="w-56 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--text)] outline-none focus:border-emerald-500/50" />
          <div className="flex items-center gap-1">
            {(["enterprise", "growth", "starter"] as const).map((t) => {
              const on = tier === t;
              return (
                <button key={t} type="button" aria-pressed={on} onClick={() => setTier(on ? null : t)}
                  className={["rounded px-2 py-1 font-mono text-[10px] transition-colors",
                    on ? "bg-emerald-500/20 text-emerald-300" : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)]"].join(" ")}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => <ClientCard key={c.id} client={c} onClick={() => onClientClick?.(c)} />)}
      </div>
    </section>
  );
}
