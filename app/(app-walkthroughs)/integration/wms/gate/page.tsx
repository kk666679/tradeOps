import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { WmsGateBridge } from '@/components/integration/wms/WmsGateBridge';

export const metadata: Metadata = { title: 'Gate' };

export function WmsGatePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Gate" description="WMS gate integration status. Live gate data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <WmsGateBridge title="Gate bridge" hint="Gate data is not connected to this view." />
      </div>
    </div>
  );
}

export default WmsGatePage;
