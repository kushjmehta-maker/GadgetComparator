/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'rukminim2.flixcart.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  serverExternalPackages: ['@anthropic-ai/sdk'],
};

module.exports = nextConfig;
