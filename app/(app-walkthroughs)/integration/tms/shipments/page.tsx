import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TmsShipmentSync } from '@/components/integration/tms/TmsShipmentSync';

export const metadata: Metadata = { title: 'Shipments' };

export function TmsShipmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Shipments" description="TMS shipment synchronization status. Live shipment data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <TmsShipmentSync title="Shipment synchronization" hint="Shipment data is not connected to this view." />
      </div>
    </div>
  );
}

export default TmsShipmentsPage;
