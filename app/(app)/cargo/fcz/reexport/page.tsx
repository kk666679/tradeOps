import type { Metadata } from 'next';
import { CargoDomainPage } from '../../_components/CargoDomainPage';

export const metadata: Metadata = { title: 'FCZ Re-export' };

export default function Page() {
  return <CargoDomainPage page="fcz-reexport" />;
}
