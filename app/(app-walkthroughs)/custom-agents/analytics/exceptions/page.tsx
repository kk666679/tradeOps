import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentExceptionPareto } from '@/components/custom-agents/analytics';

export const metadata: Metadata = { title: 'Exceptions' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Exceptions" description="Route: /custom-agents/analytics/exceptions" />
      <AgentExceptionPareto />
    </div>
  );
}
