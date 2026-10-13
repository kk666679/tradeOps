'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = { href: string; label: string; exact?: boolean };

const NAV_ITEMS: NavItem[] = [
  { href: '/brokerage', label: 'Overview', exact: true },
  { href: '/brokerage/workflow', label: 'Workflow' },
  { href: '/brokerage/pipeline', label: 'Pipeline' },
  { href: '/brokerage/clients', label: 'Clients' },
  { href: '/brokerage/declarations', label: 'Declarations' },
  { href: '/brokerage/audit', label: 'Audit' },
  { href: '/brokerage/governance', label: 'Governance' },
  { href: '/brokerage/governance/section-90', label: 'Section 90' },
];

export function BrokerageNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Brokerage module navigation"
      className="sticky top-0 z-20 flex min-h-12 items-center gap-1 overflow-x-auto overscroll-x-contain border-b border-[var(--border-subtle)] bg-[var(--bg-elev)]/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg-elev)]/80 sm:px-4"
    >
      {NAV_ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={[
              'whitespace-nowrap rounded-md px-3 py-1.5 font-mono text-[11.5px] font-medium transition-colors',
              active
                ? 'bg-[var(--bg-subtle)] text-[var(--text)] shadow-sm'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]',
            ].join(' ')}
          >
            {item.label}
          </Link>
        );
      })}

      {/* --- Loop link → Workflow Studio -------------------------------- */}
      <span className="ml-auto flex shrink-0 items-center gap-2 pl-3">
        <span className="hidden text-[10px] uppercase tracking-wider text-[var(--text-muted)] sm:inline">
          Tools
        </span>
        <Link
          href="/workflow-studio"
          title="Open the JKDM Workflow Studio"
          className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-1.5 font-mono text-[11.5px] font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 4h6l4 4-4 4H5M15 8v8" />
            <circle cx="5" cy="16" r="2" />
          </svg>
          Workflow Studio
          <svg
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </Link>
      </span>
    </nav>
  );
}
