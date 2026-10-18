import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentVersionHistory } from '@/components/custom-agents/registry';

export const metadata: Metadata = { title: 'Versions' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Versions" description="Route: /custom-agents/registry/versions" />
      <AgentVersionHistory />
    </div>
  );
}
