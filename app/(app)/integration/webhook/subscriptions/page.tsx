import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { WebhookSubscriptionList } from '@/components/integration/webhook/WebhookSubscriptionList';

export const metadata: Metadata = { title: 'Webhook Subscriptions' };

export function WebhookSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Webhook Subscriptions" description="Webhook subscriptions are not connected to a live source." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <WebhookSubscriptionList rows={[]} empty="Subscription data is not connected to this view." />
      </div>
    </div>
  );
}

export default WebhookSubscriptionsPage;
