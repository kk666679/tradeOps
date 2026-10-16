// Server Component — pure layout, no interactivity
import type { ReactNode } from 'react';

export default function StudioShell({ children }: { children: ReactNode }) {
  return <div className="grid h-screen grid-rows-[28px_38px_1fr_150px] bg-[#0d1117]">{children}</div>;
}