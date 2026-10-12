import type { Metadata } from 'next';
import { RefundsRouteView } from './RefundsRouteView';

export const metadata: Metadata = { title: 'Refunds' };

export default function Page() {
  return <RefundsRouteView />;
}
