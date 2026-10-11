import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { CustomsLinkPanel } from '@/components/ai-composites/orders/customs-link-panel';

export const metadata: Metadata = { title: 'Customs Integration' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customs Integration" description="Customs permits, origin, FTA, HS classification, duty, and declarations" />
      <CustomsLinkPanel />
    </div>
  );
}