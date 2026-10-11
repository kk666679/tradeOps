import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BondedLedgerDashboard } from '@/components/wms/bonded/BondedLedgerDashboard';
import { BondedStockLedger } from '@/components/wms/bonded/BondedStockLedger';
import { BondedAgingReport } from '@/components/wms/bonded/BondedAgingReport';
import { BondedShortageReport } from '@/components/wms/bonded/BondedShortageReport';
import { BondedGuaranteeCard } from '@/components/wms/bonded/BondedGuaranteeCard';
import { BondedTransferForm } from '@/components/wms/bonded/BondedTransferForm';
import { BondedWriteOffPanel } from '@/components/wms/bonded/BondedWriteOffPanel';

const handleSubmit = async (values: Record<string, unknown>) => {
  'use server';
  console.log('Submit:', values);
};

const handleCancel = async () => {
  'use server';
  console.log('Cancel');
};

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
        <BondedTransferForm onSubmit={handleSubmit} onCancel={handleCancel} />
        <BondedWriteOffPanel />
      </div>
    </div>
  );
}