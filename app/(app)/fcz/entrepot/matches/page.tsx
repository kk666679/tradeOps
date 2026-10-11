import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczEntrepotTradePanel } from '@/components/fiz-fcz/fcz/FczEntrepotTradePanel';

export const metadata: Metadata = { title: 'Entrepôt Matches' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Entrepôt Matches" description="Entreprôt trade match identification and pairing" />
      <FczEntrepotTradePanel />
    </div>
  );
}