import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const API_BASE = process.env.API_BASE ?? 'http://localhost:3002';

const nextConfig: NextConfig = {
  async rewrites() {
    if (isProd && !process.env.API_BASE) {
      throw new Error(
        'Missing API_BASE in production. Set it in Vercel → Project Settings → Environment Variables.'
      );
    }

    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE}/:path*`,
      },
    ];
  },
};

export default nextConfig;
