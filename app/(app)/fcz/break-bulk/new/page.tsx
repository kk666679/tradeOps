import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczCreateForm } from '../../_components/FczRouteViews';

export const metadata: Metadata = { title: 'New Break Bulk' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Break Bulk Operation" description="Create new break bulk operation" />
      <FczCreateForm kind="breakBulk" />
    </div>
  );
}