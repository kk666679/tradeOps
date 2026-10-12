import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizFczMovementBridge } from '@/components/integration/fiz-fcz/FizFczMovementBridge';

export const metadata: Metadata = { title: 'Movement' };

export function FizFczMovementPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Movement" description="FIZ/FCZ movement integration status. Live movement data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <FizFczMovementBridge title="Movement bridge" hint="Movement data is not connected to this view." />
      </div>
    </div>
  );
}

export default FizFczMovementPage;
