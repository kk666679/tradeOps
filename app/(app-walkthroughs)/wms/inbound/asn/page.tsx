import { WmsCrudSurface } from '@/app/(app-walkthroughs)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { InboundAsnList } from '@/components/wms/inbound/InboundAsnList';

export const metadata: Metadata = { title: 'ASN Management' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Advance Shipping Notices" description="Manage and track inbound ASNs" />
      <InboundAsnList />
      <WmsCrudSurface resource="inbound" title="inbound asn records" />
    </div>
  );
}