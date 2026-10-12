import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { IntegrationHealthGrid } from '@/components/integration/core/IntegrationHealthGrid';

export const metadata: Metadata = { title: 'Integration Health' };

export function IntegrationHealthPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Integration Health" description="Integration health checks are not connected to a live source." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <IntegrationHealthGrid entries={[]} empty="Health status data is not connected to this view." />
      </div>
    </div>
  );
}

export default IntegrationHealthPage;
