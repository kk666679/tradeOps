import type { Metadata } from 'next';
import { CargoDomainPage } from '../_components/CargoDomainPage';

export const metadata: Metadata = { title: 'Hazmat Cargo' };

export default function Page() {
  return <CargoDomainPage page="hazmat" />;
}
