'use client';
import * as React from 'react';
import { LogoGrid } from './LogoGrid';

const LOGOS = ['Port of Tanjung Pelepas', 'Johor Port', 'Westports', 'Port Klang Free Zone', 'Pasir Gudang', 'Kuantan Port'];
export function LogoCloud() {
  return (
    <section className="border-b bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-center text-xs uppercase text-muted-foreground">Trusted by operators across FIZ, FCZ, and bonded CFS</p>
        <div className="mt-6"><LogoGrid names={LOGOS} /></div>
      </div>
    </section>
  );
}
export default LogoCloud;
