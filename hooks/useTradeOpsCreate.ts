'use client'

import { trpc } from '@/lib/trpc'

/**
 * TradeOps create hook.
 *
 * Wraps the tenant-scoped tRPC `create` mutation for a TradeOps resource so
 * create pages get a uniform `{ mutate, isLoading, isError, error, reset }`
 * contract plus an automatic cache invalidation of the matching list query.
 */
export function useTradeOpsCreate(resource: 'declarations' | 'documents' | 'permits' | 'tradeFinance') {
  const utils = trpc.useUtils()

  const listInvalidate = {
    declarations: () => utils.tradeOps.declarations.list.invalidate(),
    documents: () => utils.tradeOps.documents.list.invalidate(),
    permits: () => utils.tradeOps.permits.list.invalidate(),
    tradeFinance: () => utils.tradeOps.tradeFinance.list.invalidate(),
  }[resource]

  const mutation = (
    resource === 'declarations' ? trpc.tradeOps.declarations.create
    : resource === 'documents' ? trpc.tradeOps.documents.create
    : resource === 'permits' ? trpc.tradeOps.permits.create
    : trpc.tradeOps.tradeFinance.create
  ).useMutation({
    onSuccess: async () => {
      await listInvalidate()
    },
  })

  const { mutate, isPending, isError, error, reset } = mutation

  const wrappedMutate = (data: Record<string, unknown>, opts?: Parameters<typeof mutate>[1]) =>
    mutate(data, opts)

  return {
    mutate: wrappedMutate,
    isLoading: isPending,
    isError,
    error,
    reset,
  }
}

export default useTradeOpsCreate