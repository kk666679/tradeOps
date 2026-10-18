import type { Metadata } from 'next';
import { CargoDomainPage } from '../_components/CargoDomainPage';

export const metadata: Metadata = { title: 'Cargo Details' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CargoDomainPage page="detail" id={id} />;
}
