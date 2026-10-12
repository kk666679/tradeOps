'use client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/lib/trpc/router';
export const trpc = createTRPCReact<AppRouter>();
const TOKEN_KEY = 'cfs.access_token';
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY); } catch {}
}
