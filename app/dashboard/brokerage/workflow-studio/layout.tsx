import type { ReactNode } from 'react';
import './studio.css';

/**
 * Studio layout — the parent (brokerage/layout.tsx) supplies the shell,
 * breadcrumbs, and nav. This file only scopes studio.css and provides a
 * full-bleed container for the interactive canvas.
 */
export default function WorkflowStudioLayout({ children }: { children: ReactNode }) {
  return <div className="bws-layout-root">{children}</div>;
}
