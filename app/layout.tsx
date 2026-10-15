import * as React from 'react';
import type { Metadata, Viewport } from 'next';
import { brand } from '@/config/brand';
import './globals.css';
import { TRPCProvider } from '@/providers/TRPCProvider';

export const viewport: Viewport = {
  themeColor: brand.colors.primary,
};

const siteUrl =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: brand.metadata.title,
  description: brand.metadata.description,
  keywords: [...brand.metadata.keywords],
  authors: [...brand.metadata.authors],
  creator: brand.metadata.creator,
  publisher: brand.metadata.publisher,
  robots: brand.metadata.robots,
  openGraph: {
    ...brand.metadata.openGraph,
    images: [
      {
        url: brand.logo.primary,
        width: 1254,
        height: 1254,
        alt: brand.fullName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: brand.metadata.openGraph.title,
    description: brand.metadata.openGraph.description,
    images: [brand.logo.primary],
  },
  icons: {
    icon: [
      { url: brand.logo.favicon, sizes: 'any', type: 'image/x-icon' },
      { url: brand.logo.faviconPng, sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: brand.logo.appleTouchIcon, sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'icon', url: brand.logo.webAppIcon192, sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: brand.logo.webAppIcon512, sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}