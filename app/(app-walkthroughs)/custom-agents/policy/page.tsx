import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { PolicyEditor } from '@/components/custom-agents/policy';

export const metadata: Metadata = { title: 'Policy' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Policy" description="Route: /custom-agents/policy" />
      <PolicyEditor />
    </div>
  );
}
