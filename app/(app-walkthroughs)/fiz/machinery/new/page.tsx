import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizCreateForm } from '../../_components/FizRouteViews';

export const metadata: Metadata = { title: 'New Machinery Import' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Machinery Import" description="Register new machinery import" />
      <FizCreateForm kind="machinery" />
    </div>
  );
}