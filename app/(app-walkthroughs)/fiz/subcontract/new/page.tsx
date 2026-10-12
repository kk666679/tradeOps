import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizCreateForm } from '../../_components/FizRouteViews';

export const metadata: Metadata = { title: 'New Subcontract' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Subcontract" description="Create new subcontract work order" />
      <FizCreateForm kind="subcontract" />
    </div>
  );
}