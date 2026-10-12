import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AlertsDataView } from '../_components/DashboardDataViews';

export const metadata: Metadata = { title: 'Alerts' };

export function DashboardAlertsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Alerts" description="Operational alerts and exceptions." />
      <AlertsDataView />
    </div>
  );
}

export default DashboardAlertsPage;
