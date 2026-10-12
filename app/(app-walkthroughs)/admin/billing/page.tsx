import type { Metadata } from 'next';
import { BillingOverview } from '../_components/other-admin';

export const metadata: Metadata = { title: 'Billing' };

export default function Page() {
  return <BillingOverview />;
}
