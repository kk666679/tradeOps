import * as React from 'react';
import type { Metadata } from 'next';
import { TradeOpsDashboard } from '@/components/trade-ops/dashboard/TradeOpsDashboard';
import { TradeOpsKpiStrip } from '@/components/trade-ops/dashboard/TradeOpsKpiStrip';
import { TradeOpsAlertRail } from '@/components/trade-ops/dashboard/TradeOpsAlertRail';
import { TradeOpsTaskBoard } from '@/components/trade-ops/dashboard/TradeOpsTaskBoard';

export const metadata: Metadata = { title: 'Trade Ops' };

export default function Page() {
  return (
    <div className="space-y-6">
      <TradeOpsKpiStrip />
      <TradeOpsDashboard />
      <div className="grid gap-6 lg:grid-cols-2">
        <TradeOpsAlertRail />
        <TradeOpsTaskBoard />
      </div>
    </div>
  );
}