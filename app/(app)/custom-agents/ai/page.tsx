import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import {
  aiAgentCritic as AiAgentCritic,
  aiAgentMemorySummarizer as AiAgentMemorySummarizer,
  aiAgentPlanner as AiAgentPlanner,
  aiAgentRouter as AiAgentRouter,
  aiAgentSelfHealer as AiAgentSelfHealer,
} from '@/components/custom-agents/ai';

export const metadata: Metadata = { title: 'Ai' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Ai" description="Route: /custom-agents/ai" />
      <div className="grid gap-6 md:grid-cols-2">
        {[
          <AiAgentCritic key="aiAgentCritic" />,
          <AiAgentMemorySummarizer key="aiAgentMemorySummarizer" />,
          <AiAgentPlanner key="aiAgentPlanner" />,
          <AiAgentRouter key="aiAgentRouter" />,
          <AiAgentSelfHealer key="aiAgentSelfHealer" />,
        ]}
      </div>
    </div>
  );
}
