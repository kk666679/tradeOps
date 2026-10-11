'use client';
import * as React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/branding/BrandLogo';

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center" aria-label="TradeOps Home">
            <BrandLogo size="lg" variant="full" />
          </Link>
        </div>
        {children}
      </div>
    </main>
  );
}
export default AuthShell;
