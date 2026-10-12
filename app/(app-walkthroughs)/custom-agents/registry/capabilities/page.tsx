import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentCapabilityMatrix } from '@/components/custom-agents/registry';

export const metadata: Metadata = { title: 'Capabilities' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Capabilities" description="Route: /custom-agents/registry/capabilities" />
      <AgentCapabilityMatrix />
    </div>
  );
}
