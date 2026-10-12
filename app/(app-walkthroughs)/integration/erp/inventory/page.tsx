import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ErpInventorySync } from '@/components/integration/erp/ErpInventorySync';

export const metadata: Metadata = { title: 'Inventory' };

export function ErpInventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="ERP inventory synchronization status. Live inventory data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <ErpInventorySync title="Inventory synchronization" hint="Inventory data is not connected to this view." />
      </div>
    </div>
  );
}

export default ErpInventoryPage;
