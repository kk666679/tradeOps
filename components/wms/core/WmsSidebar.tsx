'use client';
import * as React from 'react';
import Link from 'next/link';

const ITEMS = [
  ['Core', '/wms'],
  ['Inbound', '/wms/inbound'],
  ['Outbound', '/wms/outbound'],
  ['Inventory', '/wms/inventory'],
  ['Slotting', '/wms/slotting'],
  ['Gate', '/wms/gate'],
  ['Bonded', '/wms/bonded'],
  ['Exemption', '/wms/exemption'],
  ['Movement', '/wms/movement'],
  ['Forecasting', '/wms/forecasting'],
  ['Logistics', '/wms/logistics'],
];

export function WmsSidebar() {
  return (
    <aside className="w-56 border-r bg-background">
      <div className="p-3 text-sm font-semibold">WMS · FIZ/FCZ</div>
      <nav className="space-y-0.5 p-2 text-sm">
        {ITEMS.map(([label, href]) => (
          <Link key={href} href={href} className="block rounded px-2 py-1 hover:bg-accent">{label}</Link>
        ))}
      </nav>
    </aside>
  );
}
export default WmsSidebar;
