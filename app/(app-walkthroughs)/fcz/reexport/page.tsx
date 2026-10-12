import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczEntityList } from '../_components/FczRouteViews';

export const metadata: Metadata = { title: 'Re-export' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Re-export Operations" description="Re-export documentation and compliance" />
      <FczEntityList kind="reexport" />
    </div>
  );
}