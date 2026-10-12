import type { Metadata } from 'next';
import { CargoDomainPage } from '../../_components/CargoDomainPage';

export const metadata: Metadata = { title: 'FIZ Finished Goods' };

export default function Page() {
  return <CargoDomainPage page="fiz-finished-goods" />;
}
