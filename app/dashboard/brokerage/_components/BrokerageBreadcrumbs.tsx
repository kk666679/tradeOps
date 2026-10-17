import Link from "next/link";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface BrokerageBreadcrumbsProps {
  items: Breadcrumb[];
}

export function BrokerageBreadcrumbs({ items }: BrokerageBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 px-4 pt-3 font-mono text-[11px] text-[var(--text-muted)]">
      <Link href="/" className="hover:text-[var(--text)]">
        Home
      </Link>
      <span className="text-[var(--text-muted)] opacity-50">/</span>
      <Link href="/brokerage" className="hover:text-[var(--text)]">
        Brokerage
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="text-[var(--text-muted)] opacity-50">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--text)]">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--text)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
