import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { aiAgentPlanner as AiAgentPlanner } from '@/components/custom-agents/ai';

export const metadata: Metadata = { title: 'Planner' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Planner" description="Route: /custom-agents/ai/planner" />
      <AiAgentPlanner />
    </div>
  );
}
