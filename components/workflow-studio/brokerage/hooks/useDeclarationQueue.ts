"use client";
import { useCallback, useMemo, useState } from "react";
import type { Declaration, DeclarationStatus } from "../types";

export interface UseDeclarationQueueOptions {
  initial?: Declaration[];
  fetcher?: () => Promise<Declaration[]>;
}

export interface UseDeclarationQueueResult {
  declarations: Declaration[];
  filtered: Declaration[];
  loading: boolean;
  error: Error | null;
  filter: string;
  setFilter: (v: string) => void;
  reload: () => Promise<void>;
  byStatus: Partial<Record<DeclarationStatus, Declaration[]>>;
}

export function useDeclarationQueue(options: UseDeclarationQueueOptions = {}): UseDeclarationQueueResult {
  const { initial = [], fetcher } = options;
  const [declarations, setDeclarations] = useState<Declaration[]>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState("");

  const reload = useCallback(async () => {
    if (!fetcher) return;
    setLoading(true); setError(null);
    try { setDeclarations(await fetcher()); }
    catch (e) { setError(e instanceof Error ? e : new Error(String(e))); }
    finally { setLoading(false); }
  }, [fetcher]);

  const filtered = useMemo(() => {
    if (!filter.trim()) return declarations;
    const q = filter.toLowerCase();
    return declarations.filter((d) =>
      d.reference.toLowerCase().includes(q) ||
      d.clientName.toLowerCase().includes(q) ||
      d.owningBroker.toLowerCase().includes(q));
  }, [declarations, filter]);

  const byStatus = useMemo(() => {
    const m: Partial<Record<DeclarationStatus, Declaration[]>> = {};
    for (const d of filtered) (m[d.status] ??= []).push(d);
    return m;
  }, [filtered]);

  return { declarations, filtered, loading, error, filter, setFilter, reload, byStatus };
}
