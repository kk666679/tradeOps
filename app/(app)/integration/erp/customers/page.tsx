import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ErpCustomerSync } from '@/components/integration/erp/ErpCustomerSync';

export const metadata: Metadata = { title: 'Customers' };

export function ErpCustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="ERP customer synchronization status. Live customer data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <ErpCustomerSync title="Customer synchronization" hint="Customer data is not connected to this view." />
      </div>
    </div>
  );
}

export default ErpCustomersPage;
