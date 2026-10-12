'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/marketing/shell/Footer';

export function LandingPageFooter() {
  const pathname = usePathname();

  return pathname === '/' ? <Footer /> : null;
}
