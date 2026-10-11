'use client';
import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroBadge } from './HeroBadge';
import { HeroIllustration } from './HeroIllustration';
import { HeroStats } from './HeroStats';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col justify-center">
          <HeroBadge>Now with Automated Customs Agents · FIZ + FCZ</HeroBadge>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            The AI-native CFS platform for FIZ and FCZ operators.
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Trade OPS, bonded WMS, order management, digital twin, and customs agents in one multi-tenant system — built for Free Industrial Zones, Free Commercial Zones, brokers, and CFS 3PL.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/demo">Book a demo</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/docs">Read the docs</Link></Button>
          </div>
          <HeroStats items={[{ label: 'Zones live', value: '40+' }, { label: 'Declarations/mo', value: '120k' }, { label: 'Agent actions', value: '2.1M' }, { label: 'Uptime', value: '99.98%' }]} />
        </div>
        <div className="flex items-center justify-center"><HeroIllustration /></div>
      </div>
    </section>
  );
}
export default Hero;
