import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BondedWriteOffPanel } from '@/components/wms/bonded/BondedWriteOffPanel';

export const metadata: Metadata = { title: 'Bonded Write-Off' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bonded Write-Off" description="Write-off processing and authorization" />
      <BondedWriteOffPanel />
    </div>
  );
}