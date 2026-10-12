import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ZoneGateAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Zone Gate' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Zone Gate" description="Route: /custom-agents/customs-agents/zone-gate" />
      <ZoneGateAgent />
    </div>
  );
}
