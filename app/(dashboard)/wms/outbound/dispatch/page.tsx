import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OutboundDispatchForm } from '@/components/wms/outbound/OutboundDispatchForm';

export const metadata: Metadata = { title: 'Outbound Dispatch' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Outbound Dispatch" description="Dispatch planning and carrier handover" />
      <OutboundDispatchForm />
    </div>
  );
}