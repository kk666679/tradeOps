import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizUnavailable } from '../_components/FizRouteViews';

export const metadata: Metadata = { title: 'Approvals' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Approval Workflows" description="FIZ approval processes and compliance workflows" />
      <FizUnavailable entity="FIZ approvals" />
    </div>
  );
}