import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczEntityList } from '../_components/FczRouteViews';

export const metadata: Metadata = { title: 'Transhipment' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Transhipment" description="Transhipment cargo management and documentation" />
      <FczEntityList kind="transhipment" />
    </div>
  );
}