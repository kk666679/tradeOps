import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { WmsStockSync } from '@/components/integration/wms/WmsStockSync';

export const metadata: Metadata = { title: 'Stock' };

export function WmsStockPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Stock" description="WMS stock synchronization status. Live stock data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <WmsStockSync title="Stock synchronization" hint="Stock data is not connected to this view." />
      </div>
    </div>
  );
}

export default WmsStockPage;
