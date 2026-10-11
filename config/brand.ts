export const brand = {
  name: 'TradeOps',
  description: 'Container Freight System (CFS WMS)',
  fullName: 'TradeOps — Container Freight System (CFS WMS)',
  shortName: 'TradeOps',
  url: 'https://tradeops.io',
  logo: {
    primary: '/logo.svg',
    icon: '/apple-touch-icon.png',
    appleTouchIcon: '/apple-touch-icon.png',
    favicon: '/favicon.ico',
    faviconPng: '/favicon-96x96.png',
    webAppIcon192: '/web-app-manifest-192x192.png',
    webAppIcon512: '/web-app-manifest-512x512.png',
  },
  colors: {
    primary: '#0f172a',
    secondary: '#1e293b',
    accent: '#3b82f6',
  },
  metadata: {
    title: {
      default: 'TradeOps — Container Freight System (CFS WMS)',
      template: '%s · TradeOps',
    },
    description: 'AI-native Container Freight System for Free Industrial Zones and Free Commercial Zones.',
    keywords: [
      'CFS',
      'WMS',
      'warehouse management',
      'freight forwarding',
      'container freight station',
      'FIZ',
      'FCZ',
      'customs',
      'logistics',
    ],
    authors: [{ name: 'TradeOps' }],
    creator: 'TradeOps',
    publisher: 'TradeOps',
    robots: 'index, follow',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'TradeOps',
      title: 'TradeOps — Container Freight System (CFS WMS)',
      description: 'AI-native Container Freight System for Free Industrial Zones and Free Commercial Zones.',
    },
  },
} as const;

export type BrandConfig = typeof brand;