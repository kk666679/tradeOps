'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { InstallPrompt, OfflineIndicator, UpdatePrompt } from '@/components/pwa';

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