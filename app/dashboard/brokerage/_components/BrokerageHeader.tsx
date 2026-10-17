import type { ReactNode } from "react";

export interface BrokerageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  meta?: ReactNode;
}

export function BrokerageHeader({
  title,
  description,
  eyebrow,
  actions,
  meta,
}: BrokerageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 px-4 pt-4 pb-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          {eyebrow && (
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-red-400">
              {eyebrow}
            </span>
          )}
          <h1 className="text-[22px] font-semibold leading-tight text-[var(--text)]">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-[13px] leading-relaxed text-[var(--text-secondary)]">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {meta && <div className="flex flex-wrap items-center gap-4">{meta}</div>}
    </header>
  );
}
