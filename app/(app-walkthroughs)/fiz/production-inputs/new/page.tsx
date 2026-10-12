import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizCreateForm } from '../../_components/FizRouteViews';

export const metadata: Metadata = { title: 'New Production Input' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Production Input" description="Schedule new production input stream" />
      <FizCreateForm kind="production" />
    </div>
  );
}