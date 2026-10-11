/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    // Next 16 enables Server Actions without needing this flag.
    // Keeping experimental config minimal avoids config validation errors.
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  output: 'standalone', // useful for Docker / production
}

module.exports = nextConfig