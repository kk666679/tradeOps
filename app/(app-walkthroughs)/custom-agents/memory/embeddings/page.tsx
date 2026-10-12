import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentEmbeddingExplorer } from '@/components/custom-agents/memory';

export const metadata: Metadata = { title: 'Embeddings' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Embeddings" description="Route: /custom-agents/memory/embeddings" />
      <AgentEmbeddingExplorer />
    </div>
  );
}
