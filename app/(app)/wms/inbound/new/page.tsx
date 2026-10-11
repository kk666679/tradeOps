import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { InboundReceiptExperience } from '@/components/wms/inbound/InboundReceiptExperience';

export const metadata: Metadata = { title: 'New Inbound Receipt' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Inbound Receipt" description="Create a new inbound receipt record" />
      <InboundReceiptExperience />
    </div>
  );
}