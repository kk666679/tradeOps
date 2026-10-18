import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentPublishPanel } from '@/components/custom-agents/builder';

export const metadata: Metadata = { title: 'Publish' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Publish" description="Route: /custom-agents/builder/publish" />
      <AgentPublishPanel />
    </div>
  );
}
