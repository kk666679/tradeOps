import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TMSIntegration } from '@/components/integration';
import { TMSIntegration as TMSCore } from '@/components/integration/TMS';

export const metadata: Metadata = { title: 'TMS Integration' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="TMS Integration" description="Transportation Management System integration for shipments and routes" />
      <TMSIntegration />
      <TMSCore />
    </div>
  );
}