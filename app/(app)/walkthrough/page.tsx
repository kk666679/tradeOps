import type { Metadata } from 'next';
import Link from 'next/link';
import { WALKTHROUGH_DOMAINS, WALKTHROUGH_SPECS } from '../_components/walkthrough-specs';

export const metadata: Metadata = { title: 'Application walkthroughs' };

export default function WalkthroughIndexPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">In-app guides</p>
        <h1 className="text-2xl font-semibold">Application walkthroughs</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Choose a domain to review its routes, common workflows, backend data sources, access requirements and troubleshooting notes.
        </p>
      </header>
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {WALKTHROUGH_DOMAINS.map((domain) => {
          const spec = WALKTHROUGH_SPECS[domain];
          return (
            <li key={domain} className="rounded-lg border bg-card p-4">
              <h2 className="font-semibold">
                <Link className="text-primary underline-offset-4 hover:underline" href={`/${domain}/walkthrough`}>
                  {spec.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{spec.summary}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
