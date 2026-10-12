import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { HsClassificationAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Classification' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Classification" description="Route: /custom-agents/customs-agents/classification" />
      <HsClassificationAgent />
    </div>
  );
}
