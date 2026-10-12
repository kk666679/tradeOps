'use client';
/** Placeholder — Brokerage pipeline view. */
import type { Declaration } from '@/components/brokerage/types';
export function BrokeragePipeline(_props: { declarations?: Declaration[] }) {
  return (
    <div role="note" className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/20 p-6 text-sm">
      <p className="font-medium">Brokerage pipeline</p>
      <p className="mt-1 text-xs text-muted-foreground">Not yet implemented.</p>
    </div>
  );
}
export default BrokeragePipeline;
