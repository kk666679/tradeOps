'use client';

/**
 * Placeholder — TwinMiniMap.
 *
 * Imported by a route under app/(app-walkthroughs)/** but not yet authored.
 * Renders an explicit "not yet implemented" surface so the parent route
 * mounts and the gap is visible to developers and QA. Replace with the
 * real implementation.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TwinMiniMap(_props: any) {
  return (
    <div
      role="note"
      aria-label="TwinMiniMap placeholder"
      className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/20 p-6 text-sm"
    >
      <p className="font-medium">TwinMiniMap</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Not yet implemented. This is a placeholder for a component that has not been authored.
      </p>
    </div>
  );
}
