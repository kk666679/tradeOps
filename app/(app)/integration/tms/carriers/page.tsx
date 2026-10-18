import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TmsCarrierBridge } from '@/components/integration/tms/TmsCarrierBridge';

export const metadata: Metadata = { title: 'Carriers' };

export function TmsCarriersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Carriers" description="TMS carrier integration status. Live carrier data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <TmsCarrierBridge title="Carrier bridge" hint="Carrier data is not connected to this view." />
      </div>
    </div>
  );
}

export default TmsCarriersPage;
