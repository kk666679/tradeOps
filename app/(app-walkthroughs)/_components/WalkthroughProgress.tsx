'use client';

import Link from 'next/link';
import type { WalkthroughSpec } from './walkthrough-types';
import { useWalkthrough } from './WalkthroughContext';

export function WalkthroughProgress({ spec }: { spec: WalkthroughSpec }) {
  const { visitedRoutes, reset } = useWalkthrough();
  const steps = spec.workflows.flatMap((workflow) => workflow.steps);
  const completed = steps.filter((step) => visitedRoutes.includes(step.href)).length;
  const next = steps.find((step) => !visitedRoutes.includes(step.href));
  const percentage = steps.length ? Math.round((completed / steps.length) * 100) : 0;

  return (
    <section aria-labelledby="walkthrough-progress-heading" className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="walkthrough-progress-heading" className="font-semibold">Live walkthrough progress</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {completed} of {steps.length} route steps visited ({percentage}%).
          </p>
        </div>
        <button type="button" onClick={reset} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Reset progress
        </button>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label="Walkthrough progress">
        <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${percentage}%` }} />
      </div>
      {next ? (
        <p className="mt-3 text-sm">
          Next: <Link className="font-medium text-primary underline-offset-4 hover:underline" href={next.href}>{next.routeLabel}</Link>
        </p>
      ) : (
        <p className="mt-3 text-sm text-emerald-600">All documented route steps have been visited.</p>
      )}
    </section>
  );
}
