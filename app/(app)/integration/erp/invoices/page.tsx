import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ErpInvoiceBridge } from '@/components/integration/erp/ErpInvoiceBridge';

export const metadata: Metadata = { title: 'Invoices' };

export function ErpInvoicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" description="ERP invoice integration status. Live invoice data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <ErpInvoiceBridge title="Invoice bridge" hint="Invoice data is not connected to this view." />
      </div>
    </div>
  );
}

export default ErpInvoicesPage;
