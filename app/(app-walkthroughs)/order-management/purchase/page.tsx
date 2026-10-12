import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { PurchaseApprovalFlow } from '@/components/ai-composites/orders/purchase-approval-flow';

export const metadata: Metadata = { title: 'Purchase Orders' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Orders" description="Purchase requisitions, approvals, and supplier management" />
      <PurchaseApprovalFlow />
    </div>
  );
}