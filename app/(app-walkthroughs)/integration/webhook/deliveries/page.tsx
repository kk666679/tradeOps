import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { WebhookLogTable } from '@/components/integration/webhook/WebhookLogTable';

export const metadata: Metadata = { title: 'Webhook Deliveries' };

export function WebhookDeliveriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Webhook Deliveries" description="Webhook delivery history is not connected to a live source." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <WebhookLogTable logs={[]} empty="Delivery history is not connected to this view." />
      </div>
    </div>
  );
}

export default WebhookDeliveriesPage;
