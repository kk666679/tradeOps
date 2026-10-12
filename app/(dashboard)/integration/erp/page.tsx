import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ERPIntegration } from '@/components/integration';
import { ERPIntegration as ERPCore } from '@/components/integration/ERP';

export const metadata: Metadata = { title: 'ERP Integration' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="ERP Integration" description="SAP, Oracle, Microsoft Dynamics integration for orders and financials" />
      <ERPIntegration />
      <ERPCore />
    </div>
  );
}