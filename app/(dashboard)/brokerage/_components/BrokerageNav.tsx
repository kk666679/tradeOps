"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; exact?: boolean };
const NAV_ITEMS: NavItem[] = [
  { href: "/brokerage", label: "Overview", exact: true },
  { href: "/brokerage/workflow", label: "Workflow" },
  { href: "/brokerage/pipeline", label: "Pipeline" },
  { href: "/brokerage/clients", label: "Clients" },
  { href: "/brokerage/declarations", label: "Declarations" },
  { href: "/brokerage/audit", label: "Audit" },
  { href: "/brokerage/governance", label: "Governance" },
  { href: "/brokerage/governance/section-90", label: "Section 90" },
];

export function BrokerageNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Brokerage module navigation"
      className="flex items-center gap-1 overflow-x-auto border-b border-[var(--border-subtle)] bg-[var(--bg-elev)] px-4 py-1.5"
    >
      {NAV_ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "whitespace-nowrap rounded-md px-3 py-1.5 font-mono text-[11.5px] font-medium transition-colors",
              active
                ? "bg-[var(--bg-subtle)] text-[var(--text)] shadow-sm"
                : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
