import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczUnavailable } from '../_components/FczRouteViews';

export const metadata: Metadata = { title: 'Repackaging' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Repackaging Services" description="Value-added repackaging and labeling operations" />
      <FczUnavailable entity="Repackaging" />
    </div>
  );
}