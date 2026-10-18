import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { CustomsDeclarationBridge } from '@/components/integration/customs/CustomsDeclarationBridge';

export const metadata: Metadata = { title: 'Declarations' };

export function CustomsDeclarationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Declarations" description="Customs declaration integration status. Live declaration data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <CustomsDeclarationBridge title="Declaration bridge" hint="Declaration data is not connected to this view." />
      </div>
    </div>
  );
}

export default CustomsDeclarationsPage;
