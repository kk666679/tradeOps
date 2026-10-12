import * as React from 'react';
import Link from 'next/link';

export type IntegrationStatus = 'healthy' | 'degraded' | 'down' | 'unconfigured' | 'sandbox';

export interface IntegrationCardProps {
  title: string;
  description: string;
  href: string;
  status: IntegrationStatus;
  statusNote?: string;
  itemCount?: number;
  itemLabel?: string;
  icon?: React.ReactNode;
  accent?: string;
}

const STATUS_DOT: Record<IntegrationStatus, string> = {
  healthy: 'bg-emerald-500',
  degraded: 'bg-amber-500',
  down: 'bg-rose-500',
  unconfigured: 'bg-slate-400',
  sandbox: 'bg-sky-500',
};

export function IntegrationCard({
  title,
  description,
  href,
  status,
  statusNote,
  itemCount,
  itemLabel,
  icon,
  accent = 'text-muted-foreground',
}: IntegrationCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-border/60 bg-card p-5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        {icon && (
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
            <span className={accent}>{icon}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} aria-hidden />
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {status}
          </span>
        </div>
      </div>

      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mt-1.5 flex-1 text-xs text-muted-foreground">{description}</p>

      {(itemCount !== undefined || statusNote) && (
        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs">
          <span className="text-muted-foreground">{statusNote ?? ''}</span>
          {itemCount !== undefined && (
            <span className="tabular-nums text-foreground">
              {itemCount} {itemLabel ?? 'items'}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
