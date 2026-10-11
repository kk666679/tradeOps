import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { CustomsGateway } from '@/components/integration/CustomsGateway';

export const metadata: Metadata = { title: 'Customs Integration' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customs Integration" description="Customs gateway for declarations, permits, and tariff management" />
      <CustomsGateway />
    </div>
  );
}