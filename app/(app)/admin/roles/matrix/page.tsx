import type { Metadata } from 'next';
import { RoleAssignments } from '../../_components/other-admin';

export const metadata: Metadata = { title: 'Role Assignments' };

export default function Page() {
  return <RoleAssignments matrix />;
}
