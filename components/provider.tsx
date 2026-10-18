'use client';

import { useEffect } from 'react';
import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { InstallPrompt, OfflineIndicator, UpdatePrompt } from '@/components/pwa';
import { getAuthToken } from '@/lib/trpc';

const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password']
const PROTECTED_PREFIXES = ['/dashboard', '/console', '/wms', '/trade-ops']

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(getQueryClient);
  const router = useRouter();
  const pathname = usePathname();
  const token = getAuthToken();

  // Client-side route guarding: JWT lives in localStorage (not cookies),
  // so middleware cannot see it. We guard here instead.
  useEffect(() => {
    const isAuthPage = AUTH_PAGES.includes(pathname)
    const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))

    if (token && isAuthPage) {
      router.replace('/dashboard')
    }
    if (!token && isProtected) {
      router.replace('/login')
    }
  }, [token, pathname, router])

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
          <InstallPrompt />
          <UpdatePrompt />
          <OfflineIndicator />
        </TooltipProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
