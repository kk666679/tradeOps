import * as React from 'react';
import Link from 'next/link';

export type IntegrationStatus = 'healthy' | 'degraded' | 'down' | 'unconfigured' | 'sandbox';

export interface IntegrationShellProps {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  description?: string;
  status?: IntegrationStatus;
  statusNote?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const STATUS_STYLES: Record<IntegrationStatus, { dot: string; badge: string; label: string }> = {
  healthy:      { dot: 'bg-emerald-500', badge: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', label: 'Healthy' },
  degraded:     { dot: 'bg-amber-500',   badge: 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-500',         label: 'Degraded' },
  down:         { dot: 'bg-rose-500',    badge: 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400',             label: 'Down' },
  unconfigured: { dot: 'bg-slate-400',   badge: 'border-border/60 bg-muted/40 text-muted-foreground',                              label: 'Not configured' },
  sandbox:      { dot: 'bg-sky-500',     badge: 'border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400',                 label: 'Sandbox' },
};

export function IntegrationShell({
  breadcrumbs,
  title,
  description,
  status,
  statusNote,
  actions,
  children,
}: IntegrationShellProps) {
  const s = status ? STATUS_STYLES[status] : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs">
        <ol className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <li>
            <Link href="/integration" className="transition-colors hover:text-foreground">
              Integration
            </Link>
          </li>
          {breadcrumbs.map((bc, i) => (
            <React.Fragment key={`${bc.label}-${i}`}>
              <li aria-hidden className="text-muted-foreground/50">/</li>
              <li>
                {bc.href ? (
                  <Link href={bc.href} className="transition-colors hover:text-foreground">
                    {bc.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{bc.label}</span>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>

      <header className="mb-8 flex flex-col gap-4 border-b border-border/60 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {s && (
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${s.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
                {s.label}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</p>
          )}
          {statusNote && (
            <p className="mt-2 text-xs text-muted-foreground">{statusNote}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </header>

      {children}
    </div>
  );
}
