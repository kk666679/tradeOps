import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { PostAuditAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Audit' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Audit" description="Route: /custom-agents/customs-agents/audit" />
      <PostAuditAgent />
    </div>
  );
}
