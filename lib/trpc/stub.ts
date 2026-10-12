/**
 * STUB tRPC client.
 *
 * This file exists so the app can build while the real tRPC router
 * (`server/routers/_app.ts`) is being implemented.
 *
 * Every query returns `{ data: undefined, isLoading: false }`, so pages
 * fall through to their empty states. Every mutation is a no-op.
 *
 * This is NOT a production transport. Replace with the real
 * `createTRPCReact<AppRouter>()` once the AppRouter type exists.
 *
 * NO 'use client' directive — deliberately server-safe so that files
 * currently classified as Server Components can import it without
 * throwing the client/server boundary error.
 */

const noop = () => {};
const noopAsync = async () => ({});

const QUERY_FN = () => ({
  data: undefined,
  error: null,
  isLoading: false,
  isPending: false,
  isFetching: false,
  isError: false,
  isSuccess: false,
  isIdle: true,
  status: 'idle' as const,
  refetch: noopAsync,
  remove: noop,
});

const MUTATION_FN = () => ({
  mutate: noop,
  mutateAsync: noopAsync,
  reset: noop,
  data: undefined,
  error: null,
  isLoading: false,
  isPending: false,
  isError: false,
  isSuccess: false,
  isIdle: true,
  status: 'idle' as const,
});

const UTILS_FN = () => ({
  invalidate: noopAsync,
  refetch: noopAsync,
  setData: noop,
  getData: () => undefined,
  cancel: noopAsync,
  reset: noop,
});

function makeProxy(cache: Map<string | symbol, unknown> = new Map()): unknown {
  const target = function () {};
  return new Proxy(target, {
    get(_t, prop) {
      if (prop === 'useQuery') return QUERY_FN;
      if (prop === 'useInfiniteQuery') return QUERY_FN;
      if (prop === 'useSuspenseQuery') return QUERY_FN;
      if (prop === 'useMutation') return MUTATION_FN;
      if (prop === 'useUtils') return UTILS_FN;
      if (prop === 'then') return undefined;      // not a promise
      if (typeof prop === 'symbol') return undefined;
      if (!cache.has(prop)) cache.set(prop, makeProxy());
      return cache.get(prop);
    },
    apply() {
      return makeProxy();
    },
  });
}

// Single instance → stable identity across renders.
export const trpc = makeProxy() as Record<string, unknown>;
