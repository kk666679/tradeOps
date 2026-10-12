import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { CustomsDataView } from '../_components/DashboardDataViews';

export const metadata: Metadata = { title: 'Customs' };

export function DashboardCustomsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customs" description="Customs clearance and duty suspension context." />
      <CustomsDataView />
    </div>
  );
}

export default DashboardCustomsPage;
