import * as React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/branding/BrandLogo';

const COLS: { title: string; links: [string, string][] }[] = [
  { title: 'Product', links: [
    ['Trade OPS', '/product/trade-ops'],
    ['WMS · FIZ', '/product/wms-fiz'],
    ['WMS · FCZ', '/product/wms-fcz'],
    ['Order Management', '/product/order-management'],
    ['Digital Twin', '/product/digital-twin'],
    ['Custom Agents', '/product/custom-agents'],
  ]},
  { title: 'Solutions', links: [
    ['FIZ operators', '/solutions/fiz'],
    ['FCZ operators', '/solutions/fcz'],
    ['Customs brokers', '/solutions/brokers'],
    ['CFS 3PL', '/solutions/cfs-3pl'],
    ['Freight forwarders', '/solutions/forwarders'],
  ]},
  { title: 'Resources', links: [
    ['API docs', '/api-docs'],
    ['API', '/api-docs'],
    ['Changelog', '/changelog'],
    ['Newsletter', '/newletters'],
    ['Customers', '/customers'],
  ]},
  { title: 'Company', links: [
    ['About', '/about'],
    ['Careers', '/careers'],
    ['Security', '/security'],
    ['Contact', '/contact'],
  ]},
  { title: 'Legal', links: [
    ['Privacy', '/legal/privacy'],
    ['Terms', '/legal/terms'],
    ['DPA', '/legal/dpa'],
    ['SLA', '/legal/sla'],
  ]},
];

export function MarketingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div>
            <Link href="/" className="flex items-center" aria-label="TradeOps Home">
              <BrandLogo size="md" variant="full" />
            </Link>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              AI-native CFS platform for Free Industrial Zones and Free Commercial Zones.
              Trade OPS · WMS · Orders · Digital twin · Customs agents.
            </p>
            <form className="mt-4 flex gap-2" aria-label="Newsletter">
              <input
                type="email"
                placeholder="Work email"
                className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                aria-label="Work email"
              />
              <button className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background">Join</button>
            </form>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{col.title}</div>
              <ul className="mt-2 space-y-1 text-sm">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link className="text-muted-foreground transition hover:text-foreground" href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t pt-4 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {year} TradeOps. 📧 kk@kurnia-kadir.xyz  All rights reserved.</span>
          <span className="flex gap-4">
            <Link className="hover:text-foreground" href="/legal/privacy">Privacy</Link>
            <Link className="hover:text-foreground" href="/legal/terms">Terms</Link>
            <Link className="hover:text-foreground" href="/security">Security</Link>
            <span>Status: <span className="text-clear-500">● operational</span></span>
          </span>
        </div>
      </div>
    </footer>
  );
}
export default MarketingFooter;
