'use client';
import * as React from 'react';
import Link from 'next/link';
import { NewsletterInline } from '@/components/marketing/newsletter/NewsletterInline';
import { BrandLogo } from '@/components/branding/BrandLogo';

const COLUMNS: [string, [string, string][]][] = [
  ['Product', [['Trade OPS', '/product/trade-ops'], ['WMS FIZ', '/product/wms-fiz'], ['WMS FCZ', '/product/wms-fcz'], ['Order Mgmt', '/product/order-management'], ['Digital Twin', '/product/digital-twin'], ['Custom Agents', '/product/custom-agents']]],
  ['Solutions', [['FIZ Operators', '/solutions/fiz'], ['FCZ Operators', '/solutions/fcz'], ['Customs Brokers', '/solutions/brokers'], ['CFS 3PL', '/solutions/cfs-3pl'], ['Freight Forwarders', '/solutions/forwarders']]],
  ['Resources', [['Docs', '/docs'], ['API', '/api-docs'], ['Changelog', '/changelog'], ['Blog', '/blog'], ['Case Studies', '/customers']]],
  ['Company', [['About', '/about'], ['Careers', '/careers'], ['Security', '/security'], ['Contact', '/contact']]],
  ['Legal', [['Privacy', '/legal/privacy'], ['Terms', '/legal/terms'], ['DPA', '/legal/dpa'], ['SLA', '/legal/sla']]],
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-6">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center" aria-label="TradeOps Home">
            <BrandLogo size="md" variant="full" />
          </Link>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">AI-native Container Freight System for Free Industrial Zones and Free Commercial Zones.</p>
          <div className="mt-4 max-w-sm"><NewsletterInline /></div>
        </div>
        {COLUMNS.map(([title, links]) => (
          <div key={title}>
            <div className="text-xs uppercase text-muted-foreground">{title}</div>
            <ul className="mt-2 space-y-1 text-sm">
              {links.map(([label, href]) => <li key={href}><Link href={href} className="hover:text-foreground">{label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t px-4 py-4 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>© {new Date().getFullYear()} TradeOps. All rights reserved.</span>
          <span className="flex gap-3"><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link><Link href="/security">Security</Link></span>
        </div>
      </div>
    </footer>
  );
}
export default Footer;