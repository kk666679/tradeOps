// components/marketing/ProductGrid.tsx
import * as React from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Factory,
  Ship,
  ShoppingCart,
  Network,
  Bot,
} from 'lucide-react';

interface Product {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  href: string;
  desc: string;
  accent: string; // tailwind text color for the icon
}

const PRODUCTS: Product[] = [
  {
    icon: FileCheck2,
    title: 'Trade OPS',
    href: '/product/trade-ops',
    desc: 'Declarations, HS, valuation, origin, permits, clearance, compliance, drawback.',
    accent: 'text-sky-400',
  },
  {
    icon: Factory,
    title: 'WMS · FIZ',
    href: '/product/wms-fiz',
    desc: 'Raw material, machinery, production input, BOM, wastage, subcontract, finished goods.',
    accent: 'text-emerald-400',
  },
  {
    icon: Ship,
    title: 'WMS · FCZ',
    href: '/product/wms-fcz',
    desc: 'Transhipment, re-export, break-bulk, repacking, entrepot, value-add, trading houses.',
    accent: 'text-cyan-400',
  },
  {
    icon: ShoppingCart,
    title: 'Order Management',
    href: '/product/order-management',
    desc: 'Purchase, manufacturing, trading, transhipment, fulfilment — with customs attached to every order.',
    accent: 'text-amber-400',
  },
  {
    icon: Network,
    title: 'Digital Twin',
    href: '/product/digital-twin',
    desc: 'Zone graph, scenario builder, what-if analysis, live metrics, bottleneck Pareto.',
    accent: 'text-violet-400',
  },
  {
    icon: Bot,
    title: 'Custom Agents',
    href: '/product/custom-agents',
    desc: '7-agent mesh. Registry, builder, orchestration, supervision, policy, monitoring, audit, memory, evals.',
    accent: 'text-rose-400',
  },
];

export function ProductGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Everything a Free Zone runs on
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Six products, one customs-native platform. Click any card to explore.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.href} product={p} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { icon: Icon, title, desc, href, accent } = product;

  return (
    <Link
      href={href}
      prefetch
      className={[
        'group relative flex flex-col rounded-xl border border-border',
        'bg-card p-5 transition-all duration-200',
        'hover:border-foreground/30 hover:bg-card/80',
        'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      ].join(' ')}
      aria-label={`Learn more about ${title}`}
    >
      {/* Icon */}
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/40">
        <Icon className={`h-5 w-5 ${accent}`} />
      </div>

      {/* Title */}
      <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
        {title}
        <span
          aria-hidden="true"
          className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground"
        >
          →
        </span>
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {desc}
      </p>

      {/* Bottom accent line on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
    </Link>
  );
}

export default ProductGrid;