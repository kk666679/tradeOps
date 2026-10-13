'use client';
import { useQuery, useMutation, type UseQueryOptions } from '@tanstack/react-query';

type Method = 'query' | 'mutation';

async function call(path: string, input: unknown, method: Method) {
  const url = `/api/trpc/${path}?batch=1&input=${encodeURIComponent(JSON.stringify({ '0': { json: input } }))}`;
  const res = await fetch(url, { method: method === 'query' ? 'GET' : 'POST' });
  if (!res.ok) throw new Error(`tRPC ${method} ${path} failed: ${res.status} ${res.statusText}`);
  const payload = await res.json();
  const first = Array.isArray(payload) ? payload[0] : payload;
  if (first?.error) throw new Error(first.error?.json?.message ?? first.error?.message ?? 'tRPC error');
  return first?.result?.data?.json ?? first?.result?.data ?? null;
}

interface Procedure {
  useQuery: <T = unknown>(input?: unknown, opts?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>) => ReturnType<typeof useQuery<T>>;
  useMutation: (opts?: { onSuccess?: (d: unknown) => void; onError?: (e: Error) => void }) => ReturnType<typeof useMutation<unknown, Error, unknown>>;
  query: (input?: unknown) => Promise<unknown>;
  mutate: (input?: unknown) => Promise<unknown>;
}

function makeProcedure(path: string): Procedure {
  return {
    useQuery: (input, opts) =>
      useQuery({
        queryKey: [path, input],
        queryFn: () => call(path, input, 'query'),
        ...(opts as object),
      }) as never,
    useMutation: (opts) =>
      useMutation({
        mutationFn: (input: unknown) => call(path, input, 'mutation'),
        onSuccess: opts?.onSuccess,
        onError: opts?.onError,
      }),
    query: (input) => call(path, input, 'query'),
    mutate: (input) => call(path, input, 'mutation'),
  };
}

function proxy(prefix = ''): any {
  return new Proxy({}, {
    get(_t, key: string) {
      const path = prefix ? `${prefix}.${key}` : key;
      const proc = makeProcedure(path);
      return new Proxy(proc, {
        get(target, k) {
          if (k in target) return (target as any)[k];
          return proxy(`${path}.${String(k)}`);
        },
      });
    },
  });
}

export const trpc = proxy();
export default trpc;
