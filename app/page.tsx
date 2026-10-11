import * as React from 'react';
import { MarketingNavbar } from '@/components/marketing/shell/Navbar';
import { MarketingFooter } from '@/components/marketing/layout/MarketingFooter';
import HomePage from './(marketing)/page';

export { metadata } from './(marketing)/page';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1"><HomePage /></main>
      <MarketingFooter />
    </div>
  );
}
