import Link from 'next/link';
import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const sections = [
  { href: '/console/dashboard', label: 'Overview' },
  { href: '/console/audit', label: 'Audit' },
];

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-56 shrink-0 border-r bg-card p-4 md:block">
        <Link href="/console/dashboard" className="text-lg font-semibold">TradeOps Console</Link>
        <nav className="mt-8 flex flex-col gap-1">
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              {section.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">
        <div className="flex items-center justify-end border-b px-4 py-2">
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}
