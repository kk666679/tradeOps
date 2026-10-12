import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { CustomsPermitBridge } from '@/components/integration/customs/CustomsPermitBridge';

export const metadata: Metadata = { title: 'Permits' };

export function CustomsPermitsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Permits" description="Customs permit integration status. Live permit data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <CustomsPermitBridge title="Permit bridge" hint="Permit data is not connected to this view." />
      </div>
    </div>
  );
}

export default CustomsPermitsPage;
