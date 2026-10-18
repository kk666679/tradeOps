// app/layout.tsx
import type { Metadata } from 'next';
import * as React from 'react';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'JKDM Workflow Studio',
    template: '%s | JKDM Workflow Studio',
  },
  description:
    'Customs and brokerage workflow management and automation platform.',
  openGraph: {
    title: 'JKDM Workflow Studio',
    description:
      'Customs and brokerage workflow management and automation platform.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JKDM Workflow Studio',
    description:
      'Customs and brokerage workflow management and automation platform.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
