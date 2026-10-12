import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { aiAgentMemorySummarizer as AiAgentMemorySummarizer } from '@/components/custom-agents/ai';

export const metadata: Metadata = { title: 'Memory' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Memory" description="Route: /custom-agents/ai/memory" />
      <AiAgentMemorySummarizer />
    </div>
  );
}
