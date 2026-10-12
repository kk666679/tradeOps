"use client";

import { NodeLibrary } from "../library";
import type { JkdmCapabilitySnapshot } from "../types/workflow";

export function WorkflowSidebar({ jkdmCaps }: { jkdmCaps?: JkdmCapabilitySnapshot }) {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-subtle)] p-3" aria-label="Workflow sidebar">
      <NodeLibrary jkdmCaps={jkdmCaps} />
    </aside>
  );
}
