import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { aiAgentCritic as AiAgentCritic } from '@/components/custom-agents/ai';

export const metadata: Metadata = { title: 'Critic' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Critic" description="Route: /custom-agents/ai/critic" />
      <AiAgentCritic />
    </div>
  );
}
