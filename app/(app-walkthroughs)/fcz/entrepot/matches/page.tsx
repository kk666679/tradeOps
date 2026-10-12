import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczEntityList } from '../../_components/FczRouteViews';

export const metadata: Metadata = { title: 'Entrepôt Matches' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Entrepôt Matches" description="Entreprôt trade match identification and pairing" />
      <FczEntityList kind="entrepot" />
    </div>
  );
}