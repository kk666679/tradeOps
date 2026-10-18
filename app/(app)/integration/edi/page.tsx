import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { EdiAsycudaMapper } from '@/components/integration/EdiAsycudaMapper';

export const metadata: Metadata = { title: 'EDI/ASYCUDA Integration' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="EDI/ASYCUDA Integration" description="EDI segment mapping and ASYCUDA customs integration" />
      <EdiAsycudaMapper />
    </div>
  );
}