import type { Metadata } from 'next';
import { CargoDomainPage } from '../../_components/CargoDomainPage';

export const metadata: Metadata = { title: 'Break Bulk Cargo' };

export default function Page() {
  return <CargoDomainPage page="bulk-break-bulk" />;
}
