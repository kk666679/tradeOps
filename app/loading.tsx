'use client';
import Link from 'next/link';
import { BrandLogo } from '@/components/branding/BrandLogo';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      <Link href="/" className="flex items-center" aria-label="TradeOps Home">
        <BrandLogo size="xl" variant="full" />
      </Link>
      <div className="space-y-3 w-full max-w-md">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}