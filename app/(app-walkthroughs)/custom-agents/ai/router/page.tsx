import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { aiAgentRouter as AiAgentRouter } from '@/components/custom-agents/ai';

export const metadata: Metadata = { title: 'Router' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Router" description="Route: /custom-agents/ai/router" />
      <AiAgentRouter />
    </div>
  );
}
