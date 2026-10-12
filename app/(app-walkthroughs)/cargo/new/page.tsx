import type { Metadata } from 'next';
import { CargoDomainPage } from '../_components/CargoDomainPage';

export const metadata: Metadata = { title: 'New Cargo' };

export default function Page() {
  return <CargoDomainPage page="new" />;
}
