'use client';
import * as React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/branding/BrandLogo';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <Link href="/" className="flex items-center" aria-label="TradeOps Home">
        <BrandLogo size="lg" variant="full" />
      </Link>
      <div className="text-2xl font-semibold">Something went wrong</div>
      <p className="max-w-md text-sm text-muted-foreground">{error.message}</p>
      <button className="rounded border px-3 py-1 text-sm" onClick={() => reset()}>Try again</button>
    </div>
  );
}