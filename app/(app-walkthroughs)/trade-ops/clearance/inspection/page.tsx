import type { Metadata } from 'next';
import { InspectionRouteView } from './InspectionRouteView';

export const metadata: Metadata = { title: 'Inspection' };

export default function Page() {
  return <InspectionRouteView />;
}
