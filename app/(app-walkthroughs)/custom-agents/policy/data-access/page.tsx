import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { DataAccessScope } from '@/components/custom-agents/policy';

export const metadata: Metadata = { title: 'Data Access' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Data Access" description="Route: /custom-agents/policy/data-access" />
      <DataAccessScope onSubmit={() => undefined} />
    </div>
  );
}
