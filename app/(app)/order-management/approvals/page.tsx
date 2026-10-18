import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { PurchaseApprovalFlow } from '@/components/ai-composites/orders/purchase-approval-flow';

export const metadata: Metadata = { title: 'Approvals' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Approvals" description="Approval workflows, escalations, and queue management" />
      <PurchaseApprovalFlow />
    </div>
  );
}