import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { SlaDataView } from '../_components/DashboardDataViews';

export const metadata: Metadata = { title: 'SLA' };

export function DashboardSlaPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="SLA" description="Service-level performance and at-risk work." />
      <SlaDataView />
    </div>
  );
}

export default DashboardSlaPage;
