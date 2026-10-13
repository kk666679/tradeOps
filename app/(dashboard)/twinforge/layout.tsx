import type { ReactNode } from 'react';
import { TwinForgeNav } from '@/components/workflow-studio/digital-twin/twinforge';

export const metadata = {
  title: {
    default: 'TwinForge Studio',
    template: '%s · TwinForge',
  },
  description:
    'Digital Twin Studio for Infrastructure Solutions as a Service (DT-ISaaS)',
};

export default function TwinForgeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-950 text-slate-100">
      <TwinForgeNav />
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
