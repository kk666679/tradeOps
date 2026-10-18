import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BondedLedgerDashboard } from '@/components/wms/bonded/BondedLedgerDashboard';

export const metadata: Metadata = { title: 'Bonded Ledger' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bonded Ledger" description="Bonded ledger entries and movements" />
      <BondedLedgerDashboard />
      <WmsCrudSurface resource="bonded" title="bonded ledger records" />
    </div>
  );
}