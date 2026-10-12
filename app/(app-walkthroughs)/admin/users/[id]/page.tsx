import type { Metadata } from 'next';
import { UserEditor } from '../../_components/users';

export const metadata: Metadata = { title: 'Manage User' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserEditor id={id} />;
}
