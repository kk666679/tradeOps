import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczDashboard } from '@/components/fiz-fcz/fcz/FczDashboard';
import { FczBreakBulkPanel } from '@/components/fiz-fcz/fcz/FczBreakBulkPanel';
import { FczTranshipmentPanel } from '@/components/fiz-fcz/fcz/FczTranshipmentPanel';
import { FczEntrepotTradePanel } from '@/components/fiz-fcz/fcz/FczEntrepotTradePanel';
import { FczReexportPanel } from '@/components/fiz-fcz/fcz/FczReexportPanel';
import { FczRepackagingPanel } from '@/components/fiz-fcz/fcz/FczRepackagingPanel';
import { FczTradingHouseRegistry } from '@/components/fiz-fcz/fcz/FczTradingHouseRegistry';
import { FczValueAddTracker } from '@/components/fiz-fcz/fcz/FczValueAddTracker';

const handleSubmit = async (values: Record<string, unknown>) => {
  'use server';
  console.log('Submit:', values);
};

const handleCancel = async () => {
  'use server';
  console.log('Cancel');
};

export const metadata: Metadata = { title: 'Free Commercial Zone (FCZ)' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Free Commercial Zone (FCZ)" description="Break bulk, transhipment, entrepôt trade, re-export, repackaging, trading houses, and value-added services" />
      <FczDashboard />
      <div className="grid gap-6 lg:grid-cols-2">
        <FczBreakBulkPanel onSubmit={handleSubmit} onCancel={handleCancel} />
        <FczTranshipmentPanel onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <FczEntrepotTradePanel onSubmit={handleSubmit} onCancel={handleCancel} />
        <FczReexportPanel onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <FczRepackagingPanel onSubmit={handleSubmit} onCancel={handleCancel} />
        <FczTradingHouseRegistry />
      </div>
      <FczValueAddTracker />
    </div>
  );
}