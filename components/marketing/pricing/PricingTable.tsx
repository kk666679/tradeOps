'use client';
import * as React from 'react';
import Link from 'next/link';
import { zoneChip } from '../shared/tone';

export interface Plan {
  id: string; name: string; monthly: number; annual: number;
  highlight?: boolean; fiz: string[]; fcz: string[];
  cta?: string; href?: string;
}

export const PLANS: Plan[] = [
  { id: 'starter', name: 'Starter', monthly: 499, annual: 4990,
    fiz: ['1 FIZ zone', 'Trade OPS declarations', 'Bonded WMS', '5 custom agents', 'Email support'],
    fcz: ['1 FCZ zone', 'Transhipment + re-export', 'Bonded WMS', '5 custom agents', 'Email support'] },
  { id: 'growth', name: 'Growth', monthly: 1499, annual: 14990, highlight: true,
    fiz: ['Up to 3 FIZ zones', 'Manufacturing + BOM + wastage', 'Exemption + movement', '25 custom agents', 'Digital twin (read)'],
    fcz: ['Up to 3 FCZ zones', 'Transhipment + entrepot', 'Break-bulk + repackaging', '25 custom agents', 'Digital twin (read)'] },
  { id: 'operator', name: 'Operator', monthly: 3999, annual: 39990,
    fiz: ['Unlimited FIZ + bonded', 'Agent mesh + supervision', 'SSO · SCIM', 'All integrations', 'SLA 99.95%'],
    fcz: ['Unlimited FCZ + bonded', 'Agent mesh + supervision', 'SSO · SCIM', 'All integrations', 'SLA 99.95%'] },
  { id: 'enterprise', name: 'Enterprise', monthly: 0, annual: 0,
    fiz: ['On-prem / private cloud', 'BYO-LLM', 'Private agent mesh', 'Compliance pack', 'Onsite onboarding'],
    fcz: ['On-prem / private cloud', 'BYO-LLM', 'Private agent mesh', 'Compliance pack', 'Onsite onboarding'],
    cta: 'Contact sales', href: '/contact' },
];

export interface PricingTableProps { defaultZone?: 'FIZ' | 'FCZ'; showToggle?: boolean }

export function PricingTable({ defaultZone = 'FIZ', showToggle = true }: PricingTableProps) {
  const [zone, setZone] = React.useState<'FIZ' | 'FCZ'>(defaultZone);
  const [annual, setAnnual] = React.useState(true);
  return (
    <div>
      {showToggle ? (
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <div className="inline-flex rounded-md border border-border p-1 text-xs">
            {(['FIZ', 'FCZ'] as const).map((z) => (
              <button key={z} onClick={() => setZone(z)} className={'rounded px-3 py-1 ' + (zone === z ? 'bg-card shadow-sm font-medium' : 'text-muted-foreground')}>{z}</button>
            ))}
          </div>
          <div className="inline-flex rounded-md border border-border p-1 text-xs">
            <button onClick={() => setAnnual(false)} className={'rounded px-3 py-1 ' + (!annual ? 'bg-card shadow-sm font-medium' : 'text-muted-foreground')}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={'rounded px-3 py-1 ' + (annual ? 'bg-card shadow-sm font-medium' : 'text-muted-foreground')}>Annual · save 17%</button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p) => {
          const price = annual ? Math.round(p.annual / 12) : p.monthly;
          const features = zone === 'FIZ' ? p.fiz : p.fcz;
          return (
            <div key={p.id} className={'rounded-lg border bg-card p-5 ' + (p.highlight ? 'border-primary shadow-sm' : '')}>
              <div className="flex items-center justify-between">
                <div className="font-medium">{p.name}</div>
                <span className={zoneChip(zone)}>{zone}</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-semibold">{price === 0 ? 'Custom' : '$' + price}</span>
                {price !== 0 ? <span className="ml-1 text-sm text-muted-foreground">{'/mo' + (annual ? ' · billed annually' : '')}</span> : null}
              </div>
              <ul className="mt-4 space-y-1 text-sm">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={p.href ?? '/demo'} className="mt-5 block rounded-md bg-foreground px-4 py-2 text-center text-sm font-medium text-background hover:bg-foreground/80">{p.cta ?? 'Get started'}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default PricingTable;
