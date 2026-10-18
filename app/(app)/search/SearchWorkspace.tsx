'use client';

import * as React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AISearchBar } from '@/components/common/aisearch-bar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc/react';

type SearchResult = {
  id: string;
  title: string;
  category: 'Cargo' | 'Declaration';
  description: string;
  href: string;
  searchableText: string;
};

function text(value: unknown) {
  return value === null || value === undefined ? '' : String(value);
}

function recordsToResults(data: unknown, category: SearchResult['category']): SearchResult[] {
  if (!Array.isArray(data)) return [];

  return data.map((value) => {
    const row = value as Record<string, unknown>;
    const id = text(row.id);
    const title = text(row.ref) || id || category;
    const description = category === 'Cargo'
      ? [row.description, row.kind, row.status, row.containerNo, row.blNo, row.vessel].map(text).filter(Boolean).join(' · ')
      : [row.declarationType, row.regime, row.status, row.declarantName, row.consigneeName].map(text).filter(Boolean).join(' · ');
    const searchableText = Object.entries(row)
      .filter(([, field]) => typeof field === 'string' || typeof field === 'number' || typeof field === 'boolean')
      .map(([key, field]) => `${key} ${String(field)}`)
      .join(' ');

    return {
      id,
      title,
      category,
      description,
      href: category === 'Cargo' ? `/cargo/${encodeURIComponent(id)}` : `/trade-ops/declarations/${encodeURIComponent(id)}`,
      searchableText,
    };
  });
}

export default function SearchWorkspace() {
  const [query, setQuery] = React.useState('');
  const term = query.trim().toLocaleLowerCase();
  const enabled = term.length > 0;
  const cargo = trpc.cargo.main.list.useQuery({ take: 100 }, { enabled });
  const declarations = trpc.tradeOps.declarations.list.useQuery({ take: 100 }, { enabled });

  const results = React.useMemo(() => {
    if (!enabled) return [];
    return [
      ...recordsToResults(cargo.data, 'Cargo'),
      ...recordsToResults(declarations.data, 'Declaration'),
    ].filter((result) => result.searchableText.toLocaleLowerCase().includes(term));
  }, [cargo.data, declarations.data, enabled, term]);

  const loading = enabled && (cargo.isLoading || declarations.isLoading);
  const failedSources = [
    cargo.isError ? 'cargo' : null,
    declarations.isError ? 'declarations' : null,
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Search" description="Find recent cargo and customs declaration records in your tenant." />
      <div className="max-w-2xl space-y-2">
        <AISearchBar
          onSearch={setQuery}
          placeholder="Search references, descriptions, containers, bills of lading…"
        />
        <p className="text-xs text-muted-foreground">
          Searches the 100 most recently returned cargo records and declarations using the existing tRPC list APIs. A global search endpoint is not available.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span>Results</span>
            {enabled && !loading && <Badge variant="secondary">{results.length}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!enabled ? (
            <p className="text-sm text-muted-foreground">Enter a term to search cargo and declaration records.</p>
          ) : loading ? (
            <p role="status" className="text-sm text-muted-foreground">Searching records…</p>
          ) : failedSources.length > 0 && results.length === 0 ? (
            <div role="alert" className="text-sm text-destructive">
              Could not search {failedSources.join(' and ')} records. Check the connection and try again.
            </div>
          ) : results.length === 0 ? (
            <p className="text-sm text-muted-foreground">No matching records were found in the searched data.</p>
          ) : (
            <ul className="divide-y">
              {results.map((result) => (
                <li key={`${result.category}-${result.id}`} className="py-4 first:pt-0 last:pb-0">
                  <Link href={result.href} className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{result.title}</span>
                      <Badge variant="outline">{result.category}</Badge>
                    </div>
                    {result.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{result.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {failedSources.length > 0 && results.length > 0 && (
            <p role="status" className="mt-4 text-xs text-muted-foreground">
              Partial results: {failedSources.join(' and ')} records could not be loaded.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
