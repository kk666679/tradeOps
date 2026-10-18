import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { WmsMovementSync } from '@/components/integration/wms/WmsMovementSync';

export const metadata: Metadata = { title: 'Movements' };

export function WmsMovementsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Movements" description="WMS movement synchronization status. Live movement data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <WmsMovementSync title="Movement synchronization" hint="Movement data is not connected to this view." />
      </div>
    </div>
  );
}

export default WmsMovementsPage;
