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

export const metadata: Metadata = { title: 'Free Commercial Zone (FCZ)' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Free Commercial Zone (FCZ)" description="Break bulk, transhipment, entrepôt trade, re-export, repackaging, trading houses, and value-added services" />
      <FczDashboard />
      <div className="grid gap-6 lg:grid-cols-2">
        <FczBreakBulkPanel />
        <FczTranshipmentPanel />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <FczEntrepotTradePanel />
        <FczReexportPanel />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <FczRepackagingPanel />
        <FczTradingHouseRegistry />
      </div>
      <FczValueAddTracker />
    </div>
  );
}