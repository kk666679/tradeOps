import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczValueAddTracker } from '@/components/fiz-fcz/fcz/FczValueAddTracker';

export const metadata: Metadata = { title: 'Value-Added Services' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Value-Added Services" description="Track value-added services and revenue" />
      <FczValueAddTracker />
    </div>
  );
}