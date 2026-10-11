"use client";
import { useCallback, useMemo, useState } from "react";
import type { BrokerClient, ClientTier } from "../types";

export interface UseClientRegistryOptions {
  initial?: BrokerClient[];
  fetcher?: () => Promise<BrokerClient[]>;
}

export interface UseClientRegistryResult {
  clients: BrokerClient[];
  filtered: BrokerClient[];
  loading: boolean;
  error: Error | null;
  query: string; setQuery: (v: string) => void;
  tierFilter: ClientTier | null; setTierFilter: (v: ClientTier | null) => void;
  reload: () => Promise<void>;
  unauthorizedCount: number;
}

export function useClientRegistry(options: UseClientRegistryOptions = {}): UseClientRegistryResult {
  const { initial = [], fetcher } = options;
  const [clients, setClients] = useState<BrokerClient[]>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [query, setQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<ClientTier | null>(null);

  const reload = useCallback(async () => {
    if (!fetcher) return;
    setLoading(true); setError(null);
    try { setClients(await fetcher()); }
    catch (e) { setError(e instanceof Error ? e : new Error(String(e))); }
    finally { setLoading(false); }
  }, [fetcher]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      if (tierFilter && c.tier !== tierFilter) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.registrationNumber.toLowerCase().includes(q);
    });
  }, [clients, query, tierFilter]);

  const unauthorizedCount = useMemo(
    () => clients.filter((c) => !c.authorization.written).length, [clients]
  );

  return { clients, filtered, loading, error, query, setQuery, tierFilter, setTierFilter, reload, unauthorizedCount };
}
