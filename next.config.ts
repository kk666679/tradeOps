import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    ppr: true,
    reactCompiler: true,
    serverActions: { bodySizeLimit: '8mb' },
  },
  headers: async () => [
    {
      source: '/sw.js',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        { key: 'Service-Worker-Allowed', value: '/' },
      ],
    },
    {
      source: '/manifest.webmanifest',
      headers: [
        { key: 'Content-Type', value: 'application/manifest+json' },
        { key: 'Cache-Control', value: 'public, max-age=3600' },
      ],
    },
  ],
  transpilePackages: ['@xyflow/react'],
  serverExternalPackages: ['@prisma/client', 'bullmq', 'ioredis'],
};

export default config;