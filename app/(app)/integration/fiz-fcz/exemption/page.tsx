import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizFczExemptionBridge } from '@/components/integration/fiz-fcz/FizFczExemptionBridge';

export const metadata: Metadata = { title: 'Exemption' };

export function FizFczExemptionPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Exemption" description="FIZ/FCZ exemption integration status. Live exemption data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <FizFczExemptionBridge title="Exemption bridge" hint="Exemption data is not connected to this view." />
      </div>
    </div>
  );
}

export default FizFczExemptionPage;
