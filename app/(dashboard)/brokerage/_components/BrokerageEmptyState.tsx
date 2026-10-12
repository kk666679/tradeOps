import type { ReactNode } from "react";
import Link from "next/link";

export interface BrokerageEmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  primaryAction?: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
  children?: ReactNode;
}

export function BrokerageEmptyState({
  icon = "◇",
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}: BrokerageEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="font-mono text-3xl text-[var(--text-muted)] opacity-30" aria-hidden>
        {icon}
      </div>
      <h2 className="text-[16px] font-semibold text-[var(--text)]">{title}</h2>
      <p className="max-w-md text-[13px] leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>
      {(primaryAction || secondaryAction) && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {primaryAction && (
            <Link
              href={primaryAction.href}
              className="rounded-md bg-emerald-500 px-4 py-2 font-mono text-[12px] font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              {primaryAction.label}
            </Link>
          )}
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-4 py-2 font-mono text-[12px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
