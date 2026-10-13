'use client';

import Link from 'next/link';
import { NewsletterInline } from '@/components/marketing/newsletter/NewsletterInline';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { MARKETING_ROUTES } from '@/config/routes';

const COLUMNS = [
  ['Product', [['Trade OPS', '/product/trade-ops'], ['WMS FIZ', '/product/wms-fiz'], ['WMS FCZ', '/product/wms-fcz'], ['Order Mgmt', '/product/order-management'], ['Digital Twin', '/product/digital-twin'], ['Custom Agents', '/product/custom-agents']]],
  ['Solutions', [['FIZ Operators', '/solutions/fiz'], ['FCZ Operators', '/solutions/fcz'], ['Customs Brokers', '/solutions/brokers'], ['CFS 3PL', '/solutions/cfs-3pl'], ['Freight Forwarders', '/solutions/forwarders']]],
  ['Resources', [['API docs', MARKETING_ROUTES.apiDocs], ['Changelog', MARKETING_ROUTES.changelog], ['Newsletter', MARKETING_ROUTES.newsletter], ['Customers', MARKETING_ROUTES.customers]]],
  ['Company', [['About', MARKETING_ROUTES.about], ['Careers', MARKETING_ROUTES.careers], ['Security', MARKETING_ROUTES.security], ['Contact', MARKETING_ROUTES.contact]]],
  ['Legal', [['Privacy', MARKETING_ROUTES.legalPrivacy], ['Terms', MARKETING_ROUTES.legalTerms], ['DPA', MARKETING_ROUTES.legalDpa], ['SLA', MARKETING_ROUTES.legalSla]]],
] as const;

export function Footer() {
  return <footer className="border-t border-border/70 bg-muted/20">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-6 lg:px-8">
      <div className="md:col-span-2 lg:col-span-2">
        <Link href={MARKETING_ROUTES.home} className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="TradeOps home"><BrandLogo size="md" variant="full" /></Link>
        <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">AI-native Container Freight System for Free Industrial Zones and Free Commercial Zones.</p>
        <div className="mt-6 max-w-sm"><p className="mb-2 text-sm font-medium">Stay informed</p><NewsletterInline /></div>
      </div>
      {COLUMNS.map(([title, links]) => <div key={title}><h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h2><ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">{links.map(([label, href]) => <li key={href}><Link href={href} className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{label}</Link></li>)}</ul></div>)}
    </div>
    <div className="border-t border-border/70 px-4 py-5 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} TradeOps. All rights reserved.</span><nav aria-label="Legal navigation" className="flex flex-wrap gap-x-4 gap-y-2"><Link href={MARKETING_ROUTES.legalPrivacy} className="hover:text-foreground">Privacy</Link><Link href={MARKETING_ROUTES.legalTerms} className="hover:text-foreground">Terms</Link><Link href={MARKETING_ROUTES.security} className="hover:text-foreground">Security</Link></nav></div></div>
  </footer>;
}

export default Footer;

