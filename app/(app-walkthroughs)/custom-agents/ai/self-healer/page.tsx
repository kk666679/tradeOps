import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { aiAgentSelfHealer as AiAgentSelfHealer } from '@/components/custom-agents/ai';

export const metadata: Metadata = { title: 'Self Healer' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Self Healer" description="Route: /custom-agents/ai/self-healer" />
      <AiAgentSelfHealer />
    </div>
  );
}
