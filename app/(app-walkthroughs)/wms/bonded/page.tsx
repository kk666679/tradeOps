import { WmsCrudSurface } from '@/app/(app-walkthroughs)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BondedLedgerDashboard } from '@/components/wms/bonded/BondedLedgerDashboard';
import { BondedStockLedger } from '@/components/wms/bonded/BondedStockLedger';
import { BondedAgingReport } from '@/components/wms/bonded/BondedAgingReport';
import { BondedShortageReport } from '@/components/wms/bonded/BondedShortageReport';
import { BondedGuaranteeCard } from '@/components/wms/bonded/BondedGuaranteeCard';
import { BondedWriteOffPanel } from '@/components/wms/bonded/BondedWriteOffPanel';

export const metadata: Metadata = { title: 'Bonded Warehouse' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bonded Warehouse" description="Bonded ledger, stock, aging, shortages, guarantees, transfers, and write-offs" />
      <BondedLedgerDashboard />
      <div className="grid gap-6 lg:grid-cols-2">
        <BondedStockLedger />
        <BondedAgingReport />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <BondedShortageReport />
        <BondedGuaranteeCard />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <BondedWriteOffPanel />
      </div>
      <WmsCrudSurface resource="bonded" title="bonded records" />
    </div>
  );
}