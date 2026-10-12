import type { Metadata } from 'next';
import { RoleAssignments } from '../_components/other-admin';

export const metadata: Metadata = { title: 'Role Management' };

export default function Page() {
  return <RoleAssignments />;
}
