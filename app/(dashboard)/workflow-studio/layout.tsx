import type { ReactNode } from 'react';
import './studio.css';

export const metadata = {
  title: 'Brokerage Workflow Studio',
  description: 'JKDM integration workflow designer for Malaysian customs brokerage.',
};

export default function WorkflowStudioLayout({ children }: { children: ReactNode }) {
  return <div className="bws-layout-root">{children}</div>;
}
