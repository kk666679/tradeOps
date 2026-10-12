import type { Metadata } from 'next';
import { CargoDomainPage } from '../../_components/CargoDomainPage';

export const metadata: Metadata = { title: 'FIZ Machinery' };

export default function Page() {
  return <CargoDomainPage page="fiz-machinery" />;
}
