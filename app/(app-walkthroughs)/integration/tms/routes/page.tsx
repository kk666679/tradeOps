import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TmsRouteSync } from '@/components/integration/tms/TmsRouteSync';

export const metadata: Metadata = { title: 'Routes' };

export function TmsRoutesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Routes" description="TMS route synchronization status. Live route data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <TmsRouteSync title="Route synchronization" hint="Route data is not connected to this view." />
      </div>
    </div>
  );
}

export default TmsRoutesPage;
