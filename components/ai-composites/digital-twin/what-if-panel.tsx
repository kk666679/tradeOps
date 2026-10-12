'use client';

/**
 * Placeholder — WhatIfPanel.
 * Imported by a route under app/(app-walkthroughs)/** but not yet authored.
 * Renders an explicit "not yet implemented" surface so the parent route mounts.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WhatIfPanel(_props: any) {
  return (
    <div
      role="note"
      aria-label="WhatIfPanel placeholder"
      className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/20 p-6 text-sm"
    >
      <p className="font-medium">WhatIfPanel</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Not yet implemented. Placeholder for a component not yet authored.
      </p>
    </div>
  );
}
