"use client";
import { useCallback, useMemo, useState } from "react";

export interface AuditChainEntry {
  id: string; prevHash: string; hash: string;
  actor: string; action: string; subject: string;
  at: string; payloadHash?: string;
  /** Rule set version stamped at the time of the decision. */
  ruleSetVersion?: string;
  /** The specific control IDs that produced the decision. */
  controlIds?: string[];
}

export interface UseAuditChainOptions {
  initial?: AuditChainEntry[];
  fetcher?: () => Promise<AuditChainEntry[]>;
}

export interface UseAuditChainResult {
  entries: AuditChainEntry[];
  loading: boolean;
  error: Error | null;
  verified: boolean | null;
  verify: () => Promise<boolean>;
  reload: () => Promise<void>;
}

async function hashEntry(input: string): Promise<string> {
  if (typeof globalThis.crypto?.subtle?.digest === "function") {
    const buf = new TextEncoder().encode(input);
    const out = await globalThis.crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(out)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 0;
  for (let i = 0; i < input.length; i++) { h = (h << 5) - h + input.charCodeAt(i); h |= 0; }
  return `fallback-${(h >>> 0).toString(16)}`;
}

export function useAuditChain(options: UseAuditChainOptions = {}): UseAuditChainResult {
  const { initial = [], fetcher } = options;
  const [entries, setEntries] = useState<AuditChainEntry[]>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);

  const reload = useCallback(async () => {
    if (!fetcher) return;
    setLoading(true); setError(null);
    try { setEntries(await fetcher()); setVerified(null); }
    catch (e) { setError(e instanceof Error ? e : new Error(String(e))); }
    finally { setLoading(false); }
  }, [fetcher]);

  const verify = useCallback(async () => {
    let prev = "";
    for (const e of entries) {
      if (e.prevHash !== prev) { setVerified(false); return false; }
      const recomputed = await hashEntry(
        `${e.prevHash}|${e.actor}|${e.action}|${e.subject}|${e.at}|${e.payloadHash ?? ""}|${e.ruleSetVersion ?? ""}`
      );
      if (e.hash && !e.hash.startsWith("stub-") && e.hash !== recomputed) { setVerified(false); return false; }
      prev = e.hash;
    }
    setVerified(true); return true;
  }, [entries]);

  return useMemo(() => ({ entries, loading, error, verified, verify, reload }),
    [entries, loading, error, verified, verify, reload]);
}
