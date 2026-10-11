'use client';
import { useCallback, useState } from 'react';

/** Auto-scaffolded hook — shared */
export function useTradeOps<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const execute = useCallback(async (fn: () => Promise<T>) => {
    setLoading(true); setError(null);
    try { const d = await fn(); setData(d); return d; }
    catch (e) { setError(e as Error); throw e; }
    finally { setLoading(false); }
  }, []);
  return { data, loading, error, execute };
}

export default useTradeOps;
