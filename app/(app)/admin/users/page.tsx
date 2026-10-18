import type { Metadata } from 'next';
import { UserList } from '../_components/users';

export const metadata: Metadata = { title: 'User Management' };

export default function Page() {
  return <UserList />;
}
