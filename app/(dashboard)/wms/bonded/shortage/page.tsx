import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BondedShortageReport } from '@/components/wms/bonded/BondedShortageReport';

export const metadata: Metadata = { title: 'Bonded Shortage' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bonded Shortage Report" description="Shortage identification and reporting" />
      <BondedShortageReport />
    </div>
  );
}