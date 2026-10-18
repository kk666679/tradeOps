import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { WMSIntegration } from '@/components/integration';
import { WMSIntegration as WMSCore } from '@/components/integration/WMS';

export const metadata: Metadata = { title: 'WMS Integration' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="WMS Integration" description="Warehouse Management System integration for inventory and operations" />
      <WMSIntegration />
      <WMSCore />
    </div>
  );
}