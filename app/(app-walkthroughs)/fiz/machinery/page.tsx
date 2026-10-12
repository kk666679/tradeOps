import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizEntityList } from '../_components/FizRouteViews';

export const metadata: Metadata = { title: 'Machinery Import' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Machinery Import" description="Machinery import tracking and commissioning" />
      <FizEntityList kind="machinery" />
    </div>
  );
}