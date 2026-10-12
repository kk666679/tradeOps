import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczCreateForm } from '../../_components/FczRouteViews';

export const metadata: Metadata = { title: 'New Re-export' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Re-export" description="Create new re-export record" />
      <FczCreateForm kind="reexport" />
    </div>
  );
}