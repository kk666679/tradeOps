import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OperationsDataView } from '../_components/DashboardDataViews';

export const metadata: Metadata = { title: 'Operations' };

export function DashboardOperationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Operations" description="Warehouse and cargo operations context." />
      <OperationsDataView />
    </div>
  );
}

export default DashboardOperationsPage;
