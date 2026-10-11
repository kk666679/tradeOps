'use client';
import Link from 'next/link';
import { BrandLogo } from '@/components/branding/BrandLogo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <Link href="/" className="flex items-center" aria-label="TradeOps Home">
        <BrandLogo size="xl" variant="full" />
      </Link>
      <div className="text-5xl font-semibold">404</div>
      <p className="text-muted-foreground">We could not find that page.</p>
      <Link className="underline" href="/">Back to home</Link>
    </div>
  );
}