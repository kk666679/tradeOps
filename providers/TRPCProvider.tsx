"use client"
import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTRPCReact } from "@trpc/react-query"
import { httpBatchLink } from "@trpc/client"
import { getAuthToken } from "@/lib/trpc"
import superjson from "superjson"
import type { AppRouter } from "@/lib/trpc/router"

export const trpc = createTRPCReact<AppRouter>()

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())
  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          async headers() {
            const token = getAuthToken()
            return token ? { authorization: `Bearer ${token}` } : {}
          },
        }),
      ],
    })
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
