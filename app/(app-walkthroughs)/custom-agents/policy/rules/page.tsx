import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { RulePackList } from '@/components/custom-agents/policy';

export const metadata: Metadata = { title: 'Rules' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Rules" description="Route: /custom-agents/policy/rules" />
      <RulePackList />
    </div>
  );
}
