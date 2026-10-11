import * as React from 'react';
import type { Metadata } from 'next';
import { TradeOpsDashboard } from '@/components/trade-ops/dashboard/TradeOpsDashboard';

export const metadata: Metadata = { title: 'Trade Ops' };

export default function Page() {
  return (
    <>
      <TradeOpsDashboard />
    </>
  );
}