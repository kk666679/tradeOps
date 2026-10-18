import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { CustomsTariffSync } from '@/components/integration/customs/CustomsTariffSync';

export const metadata: Metadata = { title: 'Tariff' };

export function CustomsTariffPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tariff" description="Customs tariff synchronization status. Live tariff data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <CustomsTariffSync title="Tariff synchronization" hint="Tariff data is not connected to this view." />
      </div>
    </div>
  );
}

export default CustomsTariffPage;
