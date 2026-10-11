import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/lib/trpc/router';

/**
 * tRPC React bindings — the frontend's only API client.
 *
 * `AppRouter` is a type-only re-export from the compiled Nest backend
 * (`backend/src/trpc/trpc.router.ts` → `server/trpc/router.ts`), so the router
 * definition lives in exactly one place while the frontend gets end-to-end
 * types for free. Regenerate with `npm run trpc:types`.
 */
export const trpc = createTRPCReact<AppRouter>();

const TOKEN_KEY = 'cfs.access_token';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // private mode / storage disabled
  }
}