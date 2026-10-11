import * as React from 'react';
import { MarketingNavbar } from '@/components/marketing/shell/Navbar';
import { Footer } from '@/components/marketing/shell/Footer';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
