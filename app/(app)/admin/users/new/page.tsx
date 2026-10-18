import type { Metadata } from 'next';
import { UserCreateForm } from '../../_components/users';

export const metadata: Metadata = { title: 'Add User' };

export default function Page() {
  return <UserCreateForm />;
}
