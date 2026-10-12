import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BondedAgingReport } from '@/components/wms/bonded/BondedAgingReport';

export const metadata: Metadata = { title: 'Bonded Aging' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bonded Aging Report" description="Stock aging analysis for bonded inventory" />
      <BondedAgingReport />
    </div>
  );
}