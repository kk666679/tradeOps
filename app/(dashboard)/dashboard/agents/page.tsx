import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentsDataView } from '../_components/DashboardDataViews';

export const metadata: Metadata = { title: 'Agents' };

export function DashboardAgentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Agents" description="Agent activity and work awaiting attention." />
      <AgentsDataView />
    </div>
  );
}

export default DashboardAgentsPage;
