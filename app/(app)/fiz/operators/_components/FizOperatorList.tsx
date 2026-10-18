'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FizOperatorRegistry } from '@/components/fiz-fcz/fiz/FizOperatorRegistry';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

export function FizOperatorList() {
  const router = useRouter();
  const query = trpc.fiz.operators.list.useQuery({ take: 200 }, { retry: false });

  if (query.isLoading) {
    return <p role="status" className="rounded-md border p-4 text-sm text-muted-foreground">Loading FIZ operators…</p>;
  }

  if (query.error) {
    return (
      <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-destructive/40 p-4 text-sm">
        <span>{query.error.message || 'Unable to load FIZ operators.'}</span>
        <Button type="button" variant="outline" onClick={() => { void query.refetch(); }}>Retry</Button>
      </div>
    );
  }

  const operators = (query.data ?? []) as Array<{ id: string; name: string; code: string; status: string }>;
  const items = operators.map((operator) => ({
    id: operator.id,
    label: operator.name,
    meta: [operator.code, operator.status].filter(Boolean).join(' · '),
  }));

  return (
    <FizOperatorRegistry
      items={items}
      empty="No FIZ operators are registered."
      onSelect={(operator) => router.push(`/fiz/operators/${encodeURIComponent(operator.id)}`)}
    />
  );
}
