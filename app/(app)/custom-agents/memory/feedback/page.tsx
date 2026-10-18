import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentFeedbackLoop } from '@/components/custom-agents/memory';

export const metadata: Metadata = { title: 'Feedback' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Feedback" description="Route: /custom-agents/memory/feedback" />
      <AgentFeedbackLoop />
    </div>
  );
}
