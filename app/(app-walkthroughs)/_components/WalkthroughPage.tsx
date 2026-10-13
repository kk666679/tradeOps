import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import type { WalkthroughSpec } from './walkthrough-types';
import { WalkthroughProgress } from './WalkthroughProgress';

export function WalkthroughPage({ spec }: { spec: WalkthroughSpec }) {
  return (
    <article className="mx-auto max-w-6xl space-y-8">
      <PageHeader title={`${spec.title} walkthrough`} description={spec.summary} />

      <WalkthroughProgress spec={spec} />

      <nav aria-label="Walkthrough contents" className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold">On this page</h2>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {[
            ['routes', 'Key routes'],
            ['prerequisites', 'Prerequisites'],
            ['workflows', 'Workflows'],
            ['concepts', 'Concepts'],
            ['data-sources', 'Data sources'],
            ['permissions', 'Permissions'],
            ['related-domains', 'Related domains'],
            ['troubleshooting', 'Troubleshooting'],
            ['where-things-live', 'Where things live'],
          ].map(([id, label]) => (
            <li key={id}>
              <a className="text-primary underline-offset-4 hover:underline" href={`#${id}`}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="routes" aria-labelledby="routes-heading" className="space-y-3">
        <h2 id="routes-heading" className="text-lg font-semibold">Key routes</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {spec.keyRoutes.map((route) => (
            <li key={route.href} className="rounded-lg border bg-card p-4">
              <Link className="font-medium text-primary underline-offset-4 hover:underline" href={route.href}>
                {route.label}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">{route.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="prerequisites" aria-labelledby="prerequisites-heading" className="space-y-3">
        <h2 id="prerequisites-heading" className="text-lg font-semibold">Prerequisites and seed data</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {spec.prerequisites.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section id="workflows" aria-labelledby="workflows-heading" className="space-y-4">
        <h2 id="workflows-heading" className="text-lg font-semibold">Primary workflows</h2>
        {spec.workflows.map((workflow) => (
          <section key={workflow.title} className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">{workflow.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{workflow.purpose}</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
              {workflow.steps.map((step, index) => (
                <li key={`${step.href}-${index}`} className="text-muted-foreground">
                  {step.instruction}{' '}
                  <Link className="text-primary underline-offset-4 hover:underline" href={step.href}>
                    {step.routeLabel}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </section>

      <section id="concepts" aria-labelledby="concepts-heading" className="space-y-3">
        <h2 id="concepts-heading" className="text-lg font-semibold">Concepts</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          {spec.concepts.map((concept) => (
            <div key={concept.term} className="rounded-lg border bg-card p-4">
              <dt className="font-medium">{concept.term}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{concept.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="data-sources" aria-labelledby="data-sources-heading" className="space-y-3">
        <h2 id="data-sources-heading" className="text-lg font-semibold">Data sources and implementation status</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {spec.dataSources.map((source) => <li key={source}>{source}</li>)}
        </ul>
      </section>

      <section id="permissions" aria-labelledby="permissions-heading" className="space-y-3">
        <h2 id="permissions-heading" className="text-lg font-semibold">Permissions</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {spec.permissions.map((permission) => <li key={permission}>{permission}</li>)}
        </ul>
      </section>

      <section id="related-domains" aria-labelledby="related-heading" className="space-y-3">
        <h2 id="related-heading" className="text-lg font-semibold">Related domains</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {spec.relatedDomains.map((related) => (
            <li key={related.domain} className="rounded-lg border bg-card p-4">
              <Link className="font-medium text-primary underline-offset-4 hover:underline" href={related.href}>
                {related.label}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">{related.relationship}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="troubleshooting" aria-labelledby="troubleshooting-heading" className="space-y-3">
        <h2 id="troubleshooting-heading" className="text-lg font-semibold">Troubleshooting</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="p-3 font-medium">Symptom</th>
                <th scope="col" className="p-3 font-medium">Check</th>
                <th scope="col" className="p-3 font-medium">Where to look</th>
              </tr>
            </thead>
            <tbody>
              {spec.troubleshooting.map((item) => (
                <tr key={item.symptom} className="border-t align-top">
                  <th scope="row" className="p-3 font-medium">{item.symptom}</th>
                  <td className="p-3 text-muted-foreground">{item.check}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="where-things-live" aria-labelledby="where-heading" className="space-y-3">
        <h2 id="where-heading" className="text-lg font-semibold">Where things live</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          {spec.whereThingsLive.map((source) => (
            <div key={`${source.concept}-${source.path}`} className="rounded-lg border bg-card p-4">
              <dt className="text-sm font-medium">{source.concept}</dt>
              <dd className="mt-1 break-all font-mono text-xs text-muted-foreground">{source.path}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="border-t pt-4 text-xs text-muted-foreground">
        Audience: {spec.audience} · Last reviewed: <time dateTime={spec.lastUpdated}>{spec.lastUpdated}</time>
      </p>
    </article>
  );
}
