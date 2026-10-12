import type { Metadata } from 'next';
import { ValuationRouteView } from './ValuationRouteView';

export const metadata: Metadata = { title: 'Valuation' };

export default function Page() {
  return <ValuationRouteView />;
}
